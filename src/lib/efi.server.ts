// Server-only Efí Pix API integration.
// Requires the Efí mTLS certificate/key and a Pix receiving key.
import https from "node:https";
import type { IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";

const SANDBOX_URL = "https://pix-h.api.efipay.com.br";
const PROD_URL = "https://pix.api.efipay.com.br";

type Json = Record<string, unknown>;

function env(name: string) {
  return process.env[name]?.trim() || "";
}

export function efiBaseUrl() {
  return env("EFI_SANDBOX").toLowerCase() === "true" ? SANDBOX_URL : PROD_URL;
}

export function efiConfigured() {
  return Boolean(
    env("EFI_CLIENT_ID") &&
    env("EFI_CLIENT_SECRET") &&
    env("EFI_CERTIFICATE_BASE64") &&
    env("EFI_CERTIFICATE_KEY_BASE64") &&
    env("EFI_PIX_KEY"),
  );
}

function decodedBase64(name: string) {
  const value = env(name);
  if (!value) throw new Error(`Efí não configurada: ${name} está ausente.`);
  return Buffer.from(value, "base64");
}

function efiErrorMessage(json: unknown, fallback: string | number) {
  const j = json as {
    error_description?: unknown;
    mensagem?: unknown;
    error?: string;
    violacoes?: { propriedade?: string; razao?: string }[];
  } | null;
  if (typeof j?.error_description === "string" && j.error_description) return j.error_description;
  if (typeof j?.mensagem === "string" && j.mensagem) return j.mensagem;
  if (Array.isArray(j?.violacoes) && j.violacoes.length > 0) {
    return j.violacoes
      .map(
        (violation) =>
          `${violation.propriedade ?? "campo"}: ${violation.razao ?? "valor inválido"}`,
      )
      .join("; ");
  }
  if (typeof j?.error === "string" && j.error) return j.error;
  return String(fallback);
}

function httpsJson<T>(
  urlString: string,
  options: { method: string; headers?: Record<string, string>; body?: string },
) {
  const url = new URL(urlString);
  const certificate = decodedBase64("EFI_CERTIFICATE_BASE64").toString("utf8");
  const key = decodedBase64("EFI_CERTIFICATE_KEY_BASE64").toString("utf8");

  return new Promise<{ status: number; json: T }>((resolve, reject) => {
    const request = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        method: options.method,
        headers: options.headers,
        cert: certificate,
        key,
        minVersion: "TLSv1.2",
      },
      (response: IncomingMessage) => {
        let raw = "";
        response.setEncoding("utf8");
        response.on("data", (chunk: string) => (raw += chunk));
        response.on("end", () => {
          let json: T;
          try {
            json = (raw ? JSON.parse(raw) : {}) as T;
          } catch {
            reject(new Error(`Resposta inválida da Efí (${response.statusCode ?? 0}).`));
            return;
          }
          resolve({ status: response.statusCode ?? 0, json });
        });
      },
    );
    request.on("error", (error) =>
      reject(new Error(`Falha de conexão mTLS com a Efí: ${error.message}`)),
    );
    if (options.body) request.write(options.body);
    request.end();
  });
}

async function efiToken(): Promise<string> {
  const basic = Buffer.from(`${env("EFI_CLIENT_ID")}:${env("EFI_CLIENT_SECRET")}`).toString(
    "base64",
  );
  const result = await httpsJson<{ access_token?: string; error_description?: unknown }>(
    `${efiBaseUrl()}/oauth/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ grant_type: "client_credentials" }),
    },
  );
  if (result.status < 200 || result.status >= 300 || !result.json.access_token) {
    throw new Error(`Falha na autenticação Efí: ${efiErrorMessage(result.json, result.status)}`);
  }
  return result.json.access_token;
}

async function efiPixFetch<T extends Json>(path: string, init: { method: string; body?: Json }) {
  const token = await efiToken();
  const result = await httpsJson<T>(`${efiBaseUrl()}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Efí ${path}: ${efiErrorMessage(result.json, result.status)}`);
  }
  return result.json;
}

export type EfiPixCharge = {
  chargeId: string;
  qrcode: string;
  qrcodeImage: null;
  status: string;
};

/** Cria uma cobrança Pix imediata. A API devolve o payload EMV em pixCopiaECola. */
export async function createEfiPixCharge(params: {
  title: string;
  amountCents: number;
  orderId: string;
  notificationUrl: string;
  customer?: { name?: string; cpf?: string; email?: string; phone?: string };
}): Promise<EfiPixCharge> {
  const debtor =
    params.customer?.cpf && params.customer?.name
      ? { cpf: params.customer.cpf.replace(/\D/g, ""), nome: params.customer.name.slice(0, 200) }
      : undefined;
  const created = await efiPixFetch<{
    txid?: string;
    status?: string;
    pixCopiaECola?: string;
  }>("/v2/cob", {
    method: "POST",
    body: {
      calendario: { expiracao: 3600 },
      ...(debtor ? { devedor: debtor } : {}),
      valor: { original: (params.amountCents / 100).toFixed(2) },
      chave: env("EFI_PIX_KEY"),
      solicitacaoPagador: `${params.title.slice(0, 120)} | Pedido ${params.orderId.slice(0, 8)}`,
    },
  });

  if (!created.txid || !created.pixCopiaECola) {
    throw new Error(
      "A Efí não devolveu pixCopiaECola. Verifique a chave Pix e os escopos cob.write/cob.read.",
    );
  }

  return {
    chargeId: created.txid,
    qrcode: created.pixCopiaECola,
    qrcodeImage: null,
    status: created.status ?? "ATIVA",
  };
}

export type EfiChargeDetail = {
  status: string;
  custom_id?: string | null;
  total?: number;
  txid?: string;
  pixCopiaECola?: string;
};

export async function getEfiChargeStatus(chargeId: string | number): Promise<EfiChargeDetail> {
  return efiPixFetch<EfiChargeDetail>(`/v2/cob/${encodeURIComponent(String(chargeId))}`, {
    method: "GET",
  });
}

/** Estorna uma cobrança Pix já liquidada e devolve o identificador da devolução. */
export async function refundEfiPix(params: {
  txid: string;
  amountCents: number;
  refundId?: string;
}) {
  const payments = await efiPixFetch<{
    pix?: Array<{ endToEndId?: string; txid?: string }>;
  }>(`/v2/pix?txid=${encodeURIComponent(params.txid)}`, { method: "GET" });
  const payment = payments.pix?.find((item) => item.txid === params.txid) ?? payments.pix?.[0];
  if (!payment?.endToEndId) {
    throw new Error("A Efí não encontrou o pagamento liquidado para estorno.");
  }

  const refundId = params.refundId ?? `lynko${randomUUID().replaceAll("-", "").slice(0, 28)}`;
  await efiPixFetch(`/v2/pix/${encodeURIComponent(payment.endToEndId)}/devolucao/${refundId}`, {
    method: "PUT",
    body: { valor: (params.amountCents / 100).toFixed(2) },
  });
  return { refundId, endToEndId: payment.endToEndId };
}

export async function getEfiNotification(token: string) {
  const response = await efiPixFetch<{ data?: Json[] }>(
    `/v2/gn/notifications/${encodeURIComponent(token)}`,
    {
      method: "GET",
    },
  );
  return response.data ?? [];
}

export const EFI_PAID_STATUSES = ["CONCLUIDA", "paid", "settled", "confirmed", "approved"];
