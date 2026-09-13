import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type KycState = {
  configured: boolean;
  status: string;
  sessionId: string | null;
  url: string | null;
  reason?: string | null;
};

function reasonOf(decision: unknown): string | null {
  const d = decision as {
    reviews?: Array<{ comment?: string }>;
    warnings?: Array<{ short_description?: string }>;
  } | null;
  if (!d) return null;
  const comment = d.reviews?.[0]?.comment;
  if (comment) return comment;
  const warn = d.warnings?.[0]?.short_description;
  return warn ?? null;
}

/** Cria (ou reutiliza) a sessão de verificação de identidade no Didit. */
export const startKyc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { origin: string }) => ({ origin: String(input.origin).slice(0, 200) }))
  .handler(async ({ data, context }): Promise<KycState> => {
    const { diditConfigured, createDiditSession } = await import("@/lib/didit.server");
    if (!diditConfigured())
      return { configured: false, status: "Not Started", sessionId: null, url: null };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("kyc_sessions")
      .select("session_id, status, url")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const reusable = ["Not Started", "In Progress", "Awaiting User"];
    if (existing?.url && reusable.includes(existing.status)) {
      return {
        configured: true,
        status: existing.status,
        sessionId: existing.session_id,
        url: existing.url,
      };
    }

    const callbackUrl = `${data.origin.replace(/\/$/, "")}/verificacao?kyc=1`;
    const session = await createDiditSession({
      vendorData: context.userId,
      callbackUrl,
      contactEmail: (context.claims as { email?: string } | null)?.email ?? null,
    });

    await supabaseAdmin.from("kyc_sessions").insert({
      user_id: context.userId,
      session_id: session.session_id,
      url: session.url,
      status: "Not Started",
    });

    return {
      configured: true,
      status: "Not Started",
      sessionId: session.session_id,
      url: session.url,
    };
  });

/** Lê o estado atual da verificação, consultando o Didit quando há sessão. */
export const getKycState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<KycState> => {
    const { diditConfigured, getDiditDecision, applyDiditDecision } =
      await import("@/lib/didit.server");
    if (!diditConfigured())
      return { configured: false, status: "Not Started", sessionId: null, url: null };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("kyc_sessions")
      .select("session_id, status, url, decision")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!row) return { configured: true, status: "Not Started", sessionId: null, url: null };

    let status = row.status;
    let decision: unknown = row.decision;
    try {
      const fresh = await getDiditDecision(row.session_id);
      const freshStatus = String((fresh as { status?: string }).status ?? status);
      decision = fresh;
      if (freshStatus !== status) {
        await applyDiditDecision({
          session_id: row.session_id,
          status: freshStatus,
          decision: fresh,
        });
      }
      status = freshStatus;
    } catch (error) {
      console.error("[didit] decision", error);
    }

    return {
      configured: true,
      status,
      sessionId: row.session_id,
      url: row.url,
      reason: reasonOf(decision),
    };
  });
