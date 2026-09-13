import { r as createServerFn } from "./server-935pLRdS.mjs";
import { n as requireSupabaseAuth } from "./auth-middleware-DE2Fqus-.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-DrpIJ8tE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile.functions-DEzoExCK.js
/** Cria o perfil público da conta caso ainda não exista. */
var ensureMyProfile_createServerFn_handler = createServerRpc({
	id: "d636923ce4c79be80e1d33e9c7ba2ead4c614ff9a70e141d9b10ff3551257a42",
	name: "ensureMyProfile",
	filename: "src/lib/profile.functions.ts"
}, (opts) => ensureMyProfile.__executeServer(opts));
var ensureMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(ensureMyProfile_createServerFn_handler, async ({ context }) => {
	const { ensureProfile } = await import("./profile.server-DOnrjfhw.mjs");
	await ensureProfile(context.userId, context.claims);
	return { ok: true };
});
var chooseMyUsername_createServerFn_handler = createServerRpc({
	id: "a03a7386f9d9d89c89143fedc745d2be66f07084e6e34a81e8201ed574ce0040",
	name: "chooseMyUsername",
	filename: "src/lib/profile.functions.ts"
}, (opts) => chooseMyUsername.__executeServer(opts));
var chooseMyUsername = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ username: stringType().min(3).max(30) }).parse(data)).handler(chooseMyUsername_createServerFn_handler, async ({ context, data }) => {
	const { setUsername } = await import("./profile.server-DOnrjfhw.mjs");
	return { username: await setUsername(context.userId, data.username) };
});
//#endregion
export { chooseMyUsername_createServerFn_handler, ensureMyProfile_createServerFn_handler };
