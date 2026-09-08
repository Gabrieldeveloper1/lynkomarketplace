// Server-only Efí Bank (Efí / Gerencianet) integration.
// Uses the Cobranças API with client_id/client_secret (no certificate required).

const SANDBOX_URL = "https://cobrancas-h.api.efipay.com.br";
const PROD_URL = "https://cobrancas.api.efipay.com.br";

export function efiBaseUrl() {
  return process.env.EFI_SANDBOX === "true" ? SANDBOX_URL : PROD_URL;
}

export function efiConfigured() {
  return Boolean(process.env.EFI_CLIENT_ID && process.env.EFI_CLIENT_SECRET);
}

/** A Efí devolve error_description como string OU objeto {property, message}. */
function efiErrorMessage(json: unknown, fallback: string | number) {
  const j = json as { error_description?: unknown; error?: string } | null;
  const d = j?.error_description;
  if (typeof d === "string" && d) return d;
  if (d && typeof d === "object") {
    const o = d as { message?: string; property?: string };
    if (o.message) return o.property ? `${o.property}: ${o.message}` : o.message;
    try {
      return JSON.stringify(d);
    } catch {
      /* ignore */
    }
  }
  if (j?.error) return j.error;
  return String(fallback);
}

async function efiToken(): Promise<string> {
  const id = process.env.EFI_CLIENT_ID;
  const secret = process.env.EFI_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Efí Bank não está configurado (EFI_CLIENT_ID/EFI_CLIENT_SECRET).");

  const res = await fetch(`${efiBaseUrl()}/v1/authorize`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grant_type: "client_credentials" }),
  });
  const json = (await res.json()) as { access_token?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(`Falha na autenticação Efí: ${efiErrorMessage(json, res.status)}`);
  }
  return json.access_token;
}

async function efiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await efiToken();
  const res = await fetch(`${efiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const json = (await res.json()) as T;
  if (!res.ok) throw new Error(`Efí ${path}: ${efiErrorMessage(json, res.status)}`);
  return json;
}

export type EfiCharge = {
  chargeId: number;
  paymentUrl: string;
  status: string;
};

type LinkResponse = { data: { payment_url: string; status: string } };

/** A Efí só aceita notification_url pública (https). Em dev (localhost) omitimos. */
function publicNotificationUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return null;
    if (/^(localhost|127\.|0\.0\.0\.0|\[?::1)/.test(u.hostname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

async function createCharge(title: string, amountCents: number, orderId: string, notificationUrl: string) {
  const notify = publicNotificationUrl(notificationUrl);
  const created = await efiFetch<{ data: { charge_id: number } }>("/v1/charge", {
    method: "POST",
    body: JSON.stringify({
      items: [{ name: title.slice(0, 255), value: amountCents, amount: 1 }],
      metadata: notify ? { custom_id: orderId, notification_url: notify } : { custom_id: orderId },
    }),
  });
  return created.data.charge_id;
}

export type EfiPixCharge = {
  chargeId: number;
  qrcode: string;        // Pix copia e cola
  qrcodeImage: string | null; // imagem (data URL) devolvida pela Efí, quando existir
  status: string;
};

/** Cobrança Pix (QR Code + copia e cola) via API de Cobranças da Efí. */
export async function createEfiPixCharge(params: {
  title: string;
  amountCents: number;
  orderId: string;
  notificationUrl: string;
  customer: { name: string; cpf: string; email: string; phone: string };
}): Promise<EfiPixCharge> {
  const chargeId = await createCharge(
    params.title,
    params.amountCents,
    params.orderId,
    params.notificationUrl,
  );

  type PayResponse = {
    data: {
      status?: string;
      pix?: { qrcode?: string; qrcode_image?: string };
      qrcode?: string;
      qrcode_image?: string;
    };
  };

  let paid: PayResponse;
  try {
    paid = await efiFetch<PayResponse>(`/v1/charge/${chargeId}/pay`, {
      method: "POST",
      body: JSON.stringify({
        payment: {
          pix: {
            customer: {
              name: params.customer.name.slice(0, 255),
              cpf: params.customer.cpf.replace(/\D/g, ""),
              email: params.customer.email,
              phone_number: params.customer.phone.replace(/\D/g, ""),
            },
          },
        },
      }),
    });
  } catch {
    // Conta sem Pix direto liberado: usamos a cobrança híbrida (Bolix), que a
    // Efí devolve já com QR Code e copia e cola Pix válidos.
    const expireAt = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
    paid = await efiFetch<PayResponse>(`/v1/charge/${chargeId}/pay`, {
      method: "POST",
      body: JSON.stringify({
        payment: {
          banking_billet: {
            expire_at: expireAt,
            customer: {
              name: params.customer.name.slice(0, 255),
              cpf: params.customer.cpf.replace(/\D/g, ""),
              email: params.customer.email,
              phone_number: params.customer.phone.replace(/\D/g, ""),
            },
          },
        },
      }),
    });
  }



  const d = paid.data ?? {};
  const qrcode = d.pix?.qrcode ?? d.qrcode ?? "";
  if (!qrcode) throw new Error("A Efí não devolveu o código Pix desta cobrança.");
  return {
    chargeId,
    qrcode,
    qrcodeImage: d.pix?.qrcode_image ?? d.qrcode_image ?? null,
    status: d.status ?? "waiting",
  };
}

export async function createEfiCharge(params: {
  title: string;
  amountCents: number;
  customerName: string;
  customerEmail: string;
  orderId: string;
  notificationUrl: string;
}): Promise<EfiCharge> {
  const expireAt = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
  const message = params.title.slice(0, 80);

  // Preferimos um link só de Pix (página Efí com QR). Se a conta ainda não tiver
  // Pix liberado, caímos para "all" e por fim boleto.
  const methods = ["pix", "all", "banking_billet"] as const;
  let lastError: unknown = null;

  for (const payment_method of methods) {
    // Um link só pode ser definido uma vez por cobrança → nova cobrança por tentativa.
    const chargeId = await createCharge(
      params.title,
      params.amountCents,
      params.orderId,
      params.notificationUrl,
    );
    try {
      const link = await efiFetch<LinkResponse>(`/v1/charge/${chargeId}/link`, {
        method: "POST",
        body: JSON.stringify({
          message,
          expire_at: expireAt,
          request_delivery_address: false,
          payment_method,
        }),
      });
      return { chargeId, paymentUrl: link.data.payment_url, status: link.data.status ?? "link" };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Não foi possível gerar o link de pagamento Efí.");
}

export type EfiChargeDetail = {
  status: string;
  custom_id?: string | null;
  total?: number;
  history?: { message: string; created_at: string }[];
};

export async function getEfiChargeStatus(chargeId: string | number): Promise<EfiChargeDetail> {
  const res = await efiFetch<{ data: EfiChargeDetail }>(`/v1/charge/${chargeId}`);
  return res.data;
}

export async function getEfiNotification(token: string) {
  const res = await efiFetch<{
    data: { custom_id?: string; identifiers?: { charge_id?: number }; status?: { current?: string } }[];
  }>(`/v1/notification/${token}`);
  return res.data ?? [];
}

export const EFI_PAID_STATUSES = ["paid", "settled", "confirmed", "approved", "link_paid"];
