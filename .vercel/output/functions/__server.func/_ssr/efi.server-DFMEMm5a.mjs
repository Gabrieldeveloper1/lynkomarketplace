import nodeHTTPS from "node:https";
import { randomUUID } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/efi.server-DFMEMm5a.js
var SANDBOX_URL = "https://pix-h.api.efipay.com.br";
var PROD_URL = "https://pix.api.efipay.com.br";
function env(name) {
	return process.env[name]?.trim() || "";
}
function efiBaseUrl() {
	return env("EFI_SANDBOX").toLowerCase() === "true" ? SANDBOX_URL : PROD_URL;
}
function efiConfigured() {
	return Boolean(env("EFI_CLIENT_ID") && env("EFI_CLIENT_SECRET") && env("EFI_CERTIFICATE_BASE64") && env("EFI_CERTIFICATE_KEY_BASE64") && env("EFI_PIX_KEY"));
}
function decodedBase64(name) {
	const value = env(name);
	if (!value) throw new Error(`Efí não configurada: ${name} está ausente.`);
	return Buffer.from(value, "base64");
}
function efiErrorMessage(json, fallback) {
	const j = json;
	if (typeof j?.error_description === "string" && j.error_description) return j.error_description;
	if (typeof j?.mensagem === "string" && j.mensagem) return j.mensagem;
	if (Array.isArray(j?.violacoes) && j.violacoes.length > 0) return j.violacoes.map((violation) => `${violation.propriedade ?? "campo"}: ${violation.razao ?? "valor inválido"}`).join("; ");
	if (typeof j?.error === "string" && j.error) return j.error;
	return String(fallback);
}
function httpsJson(urlString, options) {
	const url = new URL(urlString);
	const certificate = decodedBase64("EFI_CERTIFICATE_BASE64").toString("utf8");
	const key = decodedBase64("EFI_CERTIFICATE_KEY_BASE64").toString("utf8");
	return new Promise((resolve, reject) => {
		const request = nodeHTTPS.request({
			protocol: url.protocol,
			hostname: url.hostname,
			port: url.port || 443,
			path: `${url.pathname}${url.search}`,
			method: options.method,
			headers: options.headers,
			cert: certificate,
			key,
			minVersion: "TLSv1.2"
		}, (response) => {
			let raw = "";
			response.setEncoding("utf8");
			response.on("data", (chunk) => raw += chunk);
			response.on("end", () => {
				let json;
				try {
					json = raw ? JSON.parse(raw) : {};
				} catch {
					reject(/* @__PURE__ */ new Error(`Resposta inválida da Efí (${response.statusCode ?? 0}).`));
					return;
				}
				resolve({
					status: response.statusCode ?? 0,
					json
				});
			});
		});
		request.on("error", (error) => reject(/* @__PURE__ */ new Error(`Falha de conexão mTLS com a Efí: ${error.message}`)));
		if (options.body) request.write(options.body);
		request.end();
	});
}
async function efiToken() {
	const basic = Buffer.from(`${env("EFI_CLIENT_ID")}:${env("EFI_CLIENT_SECRET")}`).toString("base64");
	const result = await httpsJson(`${efiBaseUrl()}/oauth/token`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${basic}`,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ grant_type: "client_credentials" })
	});
	if (result.status < 200 || result.status >= 300 || !result.json.access_token) throw new Error(`Falha na autenticação Efí: ${efiErrorMessage(result.json, result.status)}`);
	return result.json.access_token;
}
async function efiPixFetch(path, init) {
	const token = await efiToken();
	const result = await httpsJson(`${efiBaseUrl()}${path}`, {
		method: init.method,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: init.body ? JSON.stringify(init.body) : void 0
	});
	if (result.status < 200 || result.status >= 300) throw new Error(`Efí ${path}: ${efiErrorMessage(result.json, result.status)}`);
	return result.json;
}
/** Cria uma cobrança Pix imediata. A API devolve o payload EMV em pixCopiaECola. */
async function createEfiPixCharge(params) {
	const debtor = params.customer?.cpf && params.customer?.name ? {
		cpf: params.customer.cpf.replace(/\D/g, ""),
		nome: params.customer.name.slice(0, 200)
	} : void 0;
	const created = await efiPixFetch("/v2/cob", {
		method: "POST",
		body: {
			calendario: { expiracao: 3600 },
			...debtor ? { devedor: debtor } : {},
			valor: { original: (params.amountCents / 100).toFixed(2) },
			chave: env("EFI_PIX_KEY"),
			solicitacaoPagador: `${params.title.slice(0, 120)} | Pedido ${params.orderId.slice(0, 8)}`
		}
	});
	if (!created.txid || !created.pixCopiaECola) throw new Error("A Efí não devolveu pixCopiaECola. Verifique a chave Pix e os escopos cob.write/cob.read.");
	return {
		chargeId: created.txid,
		qrcode: created.pixCopiaECola,
		qrcodeImage: null,
		status: created.status ?? "ATIVA"
	};
}
async function getEfiChargeStatus(chargeId) {
	return efiPixFetch(`/v2/cob/${encodeURIComponent(String(chargeId))}`, { method: "GET" });
}
/** Estorna uma cobrança Pix já liquidada e devolve o identificador da devolução. */
async function refundEfiPix(params) {
	const payments = await efiPixFetch(`/v2/pix?txid=${encodeURIComponent(params.txid)}`, { method: "GET" });
	const payment = payments.pix?.find((item) => item.txid === params.txid) ?? payments.pix?.[0];
	if (!payment?.endToEndId) throw new Error("A Efí não encontrou o pagamento liquidado para estorno.");
	const refundId = params.refundId ?? `lynko${randomUUID().replaceAll("-", "").slice(0, 28)}`;
	await efiPixFetch(`/v2/pix/${encodeURIComponent(payment.endToEndId)}/devolucao/${refundId}`, {
		method: "PUT",
		body: { valor: (params.amountCents / 100).toFixed(2) }
	});
	return {
		refundId,
		endToEndId: payment.endToEndId
	};
}
async function getEfiNotification(token) {
	return (await efiPixFetch(`/v2/gn/notifications/${encodeURIComponent(token)}`, { method: "GET" })).data ?? [];
}
var EFI_PAID_STATUSES = [
	"CONCLUIDA",
	"paid",
	"settled",
	"confirmed",
	"approved"
];
//#endregion
export { EFI_PAID_STATUSES, createEfiPixCharge, efiConfigured, getEfiChargeStatus, getEfiNotification, refundEfiPix };
