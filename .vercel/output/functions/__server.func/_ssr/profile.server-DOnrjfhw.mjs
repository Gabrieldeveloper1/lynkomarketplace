import { supabaseAdmin } from "./client.server-BwQZA6UW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile.server-DOnrjfhw.js
function slugifyUsername(value) {
	return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9_]/g, "");
}
async function freeUsername(base) {
	let candidate = base;
	for (let i = 0; i < 50; i++) {
		const { data } = await supabaseAdmin.from("profiles").select("id").eq("username", candidate).maybeSingle();
		if (!data) return candidate;
		candidate = `${base}${i + 1}`;
	}
	return `${base}${Date.now().toString().slice(-5)}`;
}
var DEFAULT_USERNAME_RE = /^user_[0-9a-f]{8}$/;
async function ensureProfile(userId, claims) {
	const { data: existing } = await supabaseAdmin.from("profiles").select("id").eq("id", userId).maybeSingle();
	if (existing) return existing.id;
	const email = typeof claims?.email === "string" ? claims.email : "";
	const displayName = typeof claims?.user_metadata?.display_name === "string" && claims.user_metadata.display_name || (email ? email.split("@")[0] : "") || `user_${userId.slice(0, 8)}`;
	const wanted = slugifyUsername(typeof claims?.user_metadata?.username === "string" ? claims.user_metadata.username : "");
	const username = await freeUsername(wanted.length >= 3 ? wanted : `user_${userId.slice(0, 8)}`);
	await supabaseAdmin.from("profiles").upsert({
		id: userId,
		username,
		display_name: displayName
	}, {
		onConflict: "id",
		ignoreDuplicates: true
	});
	return userId;
}
/** Define o @ do utilizador uma única vez (só enquanto for o gerado automaticamente). */
async function setUsername(userId, raw) {
	const username = slugifyUsername(raw);
	if (username.length < 3 || username.length > 20) throw new Error("O @ precisa de ter entre 3 e 20 caracteres (letras, números e _).");
	if (DEFAULT_USERNAME_RE.test(username)) throw new Error("Escolha um @ diferente.");
	const { data: profile } = await supabaseAdmin.from("profiles").select("username").eq("id", userId).maybeSingle();
	if (!profile) throw new Error("Perfil não encontrado.");
	if (!DEFAULT_USERNAME_RE.test(profile.username)) throw new Error("O seu @ já foi definido e não pode ser alterado.");
	const { data: taken } = await supabaseAdmin.from("profiles").select("id").eq("username", username).maybeSingle();
	if (taken) throw new Error("Este @ já está em uso.");
	const { error } = await supabaseAdmin.from("profiles").update({ username }).eq("id", userId);
	if (error) throw new Error(error.message);
	return username;
}
//#endregion
export { ensureProfile, setUsername };
