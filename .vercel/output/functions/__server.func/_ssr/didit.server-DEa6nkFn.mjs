import { createHmac, timingSafeEqual } from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/didit.server-DEa6nkFn.js
/** Didit canonicalization: floats shortened, keys sorted, unescaped unicode. */
function shortenFloats(value) {
	if (typeof value === "number" && !Number.isInteger(value)) return Number(value.toFixed(6));
	if (Array.isArray(value)) return value.map(shortenFloats);
	if (value && typeof value === "object") {
		const out = {};
		for (const [k, v] of Object.entries(value)) out[k] = shortenFloats(v);
		return out;
	}
	return value;
}
function sortKeys(value) {
	if (Array.isArray(value)) return value.map(sortKeys);
	if (value && typeof value === "object") {
		const out = {};
		for (const k of Object.keys(value).sort()) out[k] = sortKeys(value[k]);
		return out;
	}
	return value;
}
function verifyDiditSignature(rawBody, signature, timestamp) {
	const secret = process.env["DIDIT_WEBHOOK_SECRET"];
	if (!secret || !signature || !timestamp) return false;
	const ts = Number(timestamp);
	if (!Number.isFinite(ts) || Math.abs(Date.now() / 1e3 - ts) > 300) return false;
	let canonical;
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
async function applyDiditDecision(payload) {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { data: row } = await supabaseAdmin.from("kyc_sessions").select("id, user_id, last_event_id, status").eq("session_id", payload.session_id).maybeSingle();
	if (!row) return;
	if (payload.event_id && row.last_event_id === payload.event_id) return;
	await supabaseAdmin.from("kyc_sessions").update({
		status: payload.status,
		decision: payload.decision ?? null,
		last_event_id: payload.event_id ?? row.last_event_id,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", row.id);
	if (payload.status === "Approved") await supabaseAdmin.from("profiles").update({
		verified: true,
		verification_level: "maximo"
	}).eq("id", row.user_id);
	else if (payload.status === "Declined") await supabaseAdmin.from("profiles").update({ verified: false }).eq("id", row.user_id);
}
//#endregion
export { applyDiditDecision, verifyDiditSignature };
