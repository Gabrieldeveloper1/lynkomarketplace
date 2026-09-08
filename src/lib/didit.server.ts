import { createHmac, timingSafeEqual } from "crypto";

const BASE = "https://verification.didit.me";

export type DiditSession = { session_id: string; session_token?: string; url: string };

export type DiditStatus =
  | "Not Started"
  | "In Progress"
  | "Awaiting User"
  | "In Review"
  | "Approved"
  | "Declined"
  | "Resubmitted"
  | "Abandoned"
  | "Expired"
  | "Kyc Expired";

function apiKey(): string {
  const key = process.env["DIDIT_API_KEY"];
  if (!key) throw new Error("Verificação de identidade não configurada.");
  return key;
}

export function diditConfigured(): boolean {
  return Boolean(process.env["DIDIT_API_KEY"]);
}

function workflowId(): string {
  return process.env["DIDIT_WORKFLOW_ID"] || "4b50f7e1-8984-4f80-8dee-08a7e012bc3a";
}

export async function createDiditSession(input: {
  vendorData: string;
  callbackUrl: string;
  contactEmail?: string | null;
}): Promise<DiditSession> {
  const res = await fetch(`${BASE}/v3/session/`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": apiKey() },
    body: JSON.stringify({
      workflow_id: workflowId(),
      vendor_data: input.vendorData,
      callback: input.callbackUrl,
      ...(input.contactEmail ? { contact_details: { email: input.contactEmail } } : {}),
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Didit ${res.status}: ${text.slice(0, 300)}`);
  const json = JSON.parse(text) as DiditSession;
  if (!json.session_id || !json.url) throw new Error("Resposta inválida do Didit.");
  return json;
}

export async function getDiditDecision(sessionId: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${BASE}/v3/session/${sessionId}/decision/`, {
    headers: { "x-api-key": apiKey() },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Didit ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text) as Record<string, unknown>;
}

/** Didit canonicalization: floats shortened, keys sorted, unescaped unicode. */
function shortenFloats(value: unknown): unknown {
  if (typeof value === "number" && !Number.isInteger(value)) return Number(value.toFixed(6));
  if (Array.isArray(value)) return value.map(shortenFloats);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = shortenFloats(v);
    return out;
  }
  return value;
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>).sort()) {
      out[k] = sortKeys((value as Record<string, unknown>)[k]);
    }
    return out;
  }
  return value;
}

export function verifyDiditSignature(rawBody: string, signature: string | null, timestamp: string | null): boolean {
  const secret = process.env["DIDIT_WEBHOOK_SECRET"];
  if (!secret || !signature || !timestamp) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;
  let canonical: string;
  try {
    canonical = JSON.stringify(sortKeys(shortenFloats(JSON.parse(rawBody))));
  } catch {
    canonical = rawBody;
  }
  const expected = createHmac("sha256", secret).update(canonical, "utf8").digest("hex");
  const a = Buffer.from(signature.trim().toLowerCase());
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Applies a Didit decision to our database (idempotent by event id). */
export async function applyDiditDecision(payload: {
  session_id: string;
  status: string;
  decision?: unknown;
  event_id?: string;
}): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: row } = await supabaseAdmin
    .from("kyc_sessions")
    .select("id, user_id, last_event_id, status")
    .eq("session_id", payload.session_id)
    .maybeSingle();
  if (!row) return;
  if (payload.event_id && row.last_event_id === payload.event_id) return;

  await supabaseAdmin
    .from("kyc_sessions")
    .update({
      status: payload.status,
      decision: (payload.decision ?? null) as never,
      last_event_id: payload.event_id ?? row.last_event_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id);

  if (payload.status === "Approved") {
    await supabaseAdmin
      .from("profiles")
      .update({ verified: true, verification_level: "completo" })
      .eq("id", row.user_id);
  } else if (payload.status === "Declined") {
    await supabaseAdmin.from("profiles").update({ verified: false }).eq("id", row.user_id);
  }
}
