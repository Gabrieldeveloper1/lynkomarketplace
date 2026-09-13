import { n as __exportAll } from "../_runtime.mjs";
import { c as __exportAll$1, r as createServerFn } from "./server-935pLRdS.mjs";
import { t as createSsrRpc } from "./createSsrRpc-aZJu5MmU.mjs";
import { n as requireSupabaseAuth, t as optionalSupabaseAuth } from "./auth-middleware-DE2Fqus-.mjs";
import { a as objectType, i as numberType, n as coerce, o as stringType, r as enumType, t as booleanType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce.functions-BTItmHS8.js
var commerce_functions_BTItmHS8_exports = /* @__PURE__ */ __exportAll({
	C: () => updateUserProfileByAdmin,
	S: () => syncMyOrders,
	_: () => saveBlogPost,
	a: () => deleteCategory,
	b: () => staffAction,
	c: () => fetchBlogPostsForEditor,
	d: () => markConversationRead,
	f: () => markOrderShipped,
	g: () => respondModeration,
	h: () => requestWithdrawal,
	i: () => deleteBlogPost,
	l: () => fetchContentAdmin,
	m: () => requestModeration,
	n: () => commerce_functions_exports,
	o: () => deleteSitePage,
	p: () => orderConversation,
	r: () => createCheckout,
	s: () => fetchAdminData,
	t: () => cancelModeration,
	u: () => joinConversationAsModerator,
	v: () => saveCategory,
	w: () => verifyPayment,
	x: () => submitAppeal,
	y: () => saveSitePage
});
var commerce_functions_exports = /* @__PURE__ */ __exportAll$1({
	cancelModeration: () => cancelModeration,
	createCheckout: () => createCheckout,
	deleteBlogPost: () => deleteBlogPost,
	deleteCategory: () => deleteCategory,
	deleteSitePage: () => deleteSitePage,
	fetchAdminData: () => fetchAdminData,
	fetchBlogPostsForEditor: () => fetchBlogPostsForEditor,
	fetchContentAdmin: () => fetchContentAdmin,
	joinConversationAsModerator: () => joinConversationAsModerator,
	markConversationRead: () => markConversationRead,
	markOrderShipped: () => markOrderShipped,
	orderConversation: () => orderConversation,
	requestModeration: () => requestModeration,
	requestWithdrawal: () => requestWithdrawal,
	respondModeration: () => respondModeration,
	saveBlogPost: () => saveBlogPost,
	saveCategory: () => saveCategory,
	saveSitePage: () => saveSitePage,
	staffAction: () => staffAction,
	submitAppeal: () => submitAppeal,
	syncMyOrders: () => syncMyOrders,
	updateUserProfileByAdmin: () => updateUserProfileByAdmin,
	verifyPayment: () => verifyPayment
});
var checkoutSchema = objectType({
	productId: stringType().uuid(),
	variantId: stringType().uuid().nullish(),
	quantity: coerce.number().int().min(1).max(20).default(1),
	protection: enumType([
		"basica",
		"media",
		"maxima"
	]).default("basica"),
	email: stringType().email("Informe um e-mail válido.").optional()
});
var createCheckout = createServerFn({ method: "POST" }).middleware([optionalSupabaseAuth]).inputValidator((data) => checkoutSchema.parse(data)).handler(createSsrRpc("a8652c971edc46d20a8ea644d2bfd9cf45e0baea82fed4958d653c1640d3ffee"));
/**
* Automação: verifica todos os pedidos pendentes do comprador junto do Efí e
* entrega automaticamente os que já foram pagos. Chamado em background pelo painel.
*/
var syncMyOrders = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("965db48342060c942bd66ea1cddf375131adece30a98debcb3d56e728a742dbf"));
var verifyPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ orderId: stringType().uuid() }).parse(data)).handler(createSsrRpc("26f44a872f268db094854309a06315ddb4dcf2ac054b4dc05a62f6983f0ad736"));
/** Vendedor marca um pedido pago como enviado (entrega manual). */
var markOrderShipped = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	orderId: stringType().uuid(),
	note: stringType().trim().max(200).optional()
}).parse(data)).handler(createSsrRpc("695b6a88464311d525de62f3917a9eaa28c449a710b6a6f8e47226007c07773b"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ orderId: stringType().uuid() }).parse(data)).handler(createSsrRpc("98dbf845b91c160857a20158054c3365b80c3c29820d16eb29eec0ca2c8385bb"));
var requestWithdrawal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	amountCents: numberType().int().min(1),
	pixKey: stringType().trim().min(4).max(140)
}).parse(data)).handler(createSsrRpc("1e743d9a675638ee708898643a732451c57225c1e66289e8292f574da6de0c50"));
var staffActionSchema = objectType({
	action: enumType([
		"block_product",
		"unblock_product",
		"ban_user",
		"unban_user",
		"verify_user",
		"unverify_user",
		"resolve_report",
		"dismiss_report",
		"hide_message",
		"approve_kyc",
		"reject_kyc",
		"pay_withdrawal",
		"reject_withdrawal",
		"accept_appeal",
		"reject_appeal"
	]),
	targetId: stringType().uuid(),
	note: stringType().max(500).optional(),
	reason: stringType().max(500).optional(),
	evidenceUrl: stringType().max(500).optional()
});
var staffAction = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => staffActionSchema.parse(data)).handler(createSsrRpc("e5668ecf9ae66187316bdf264c550cb085d7b96cf8e4b5b0db2be89315bff8ed"));
var fetchAdminData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4fb0bd7020d42cd39a75880d0c6772f16ddcfd9ac72b7d66a4ab32a9d57cf1fe"));
var adminProfileUpdateSchema = objectType({
	userId: stringType().uuid(),
	displayName: stringType().trim().min(2).max(120),
	username: stringType().trim().toLowerCase().regex(/^[a-z0-9_.]+$/, "Use apenas letras, números, ponto e sublinhado.").min(3).max(40)
});
var updateUserProfileByAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => adminProfileUpdateSchema.parse(data)).handler(createSsrRpc("bb73a57b6fcaf9996472ab3e6495f88de01ad22bfd58b573a9b4fbaf17b2075a"));
var categorySchema = objectType({
	slug: stringType().trim().min(2).max(60),
	name: stringType().trim().min(1).max(80),
	description: stringType().max(300).default(""),
	icon: stringType().trim().min(1).max(40).default("package"),
	image_url: stringType().url().nullish(),
	display_mode: enumType(["icon", "image"]).default("icon"),
	position: numberType().int().min(0).max(999).default(0)
});
var saveCategory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => categorySchema.parse(data)).handler(createSsrRpc("ba51a384babe2fa003f89a9bc609695a61a98f4c453988c7c2325f72d42b7b40"));
var deleteCategory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ slug: stringType() }).parse(data)).handler(createSsrRpc("c32bafae057376bf23baa874e22a23d5389059de35d666024f7d474b4bc9b9da"));
var pageSchema = objectType({
	slug: stringType().trim().min(2).max(60),
	title: stringType().trim().min(1).max(120),
	summary: stringType().max(300).default(""),
	content: stringType().max(6e4).default(""),
	image_url: stringType().url().nullable().optional(),
	published: booleanType().default(true),
	position: numberType().int().min(0).max(999).default(0)
});
var saveSitePage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => pageSchema.parse(data)).handler(createSsrRpc("b3d99e792ba2daf92157a35d84f0c221fa413b216e25653ea1c36b66d0c0c2f8"));
var fetchBlogPostsForEditor = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("18e143c3b39f14b608cc33d996f93d03bb538ee3e67431b5f11e0b7bec5a19e5"));
var saveBlogPost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => pageSchema.extend({ slug: stringType().regex(/^blog-[a-z0-9-]+$/) }).parse(data)).handler(createSsrRpc("1e3e9eed8e14bb85dab86973df6aab9ab9c6231d50a89c2169b321ef24b4cf3b"));
var deleteBlogPost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ slug: stringType().regex(/^blog-[a-z0-9-]+$/) }).parse(data)).handler(createSsrRpc("28b3557e93010f662f33d90b55da9392aebd1e263b4a427db0be3e5427c5fa86"));
var deleteSitePage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ slug: stringType() }).parse(data)).handler(createSsrRpc("dd8cd896ba8f229ea4981c49234787a2961fb5f16171c4683354c07d5072051a"));
var fetchContentAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("db8cd1e22a3b6e3483f95fe41a1770d7f2a33cdbed5deb828f9785eee6b642b8"));
var submitAppeal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ message: stringType().trim().min(20).max(2e3) }).parse(data)).handler(createSsrRpc("70aa0f6d29ce8bf5872771a7a4b24c18e9f0d6c014014b64daf9514c1d1d90df"));
var joinConversationAsModerator = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	conversationId: stringType().uuid(),
	message: stringType().trim().min(2).max(2e3)
}).parse(data)).handler(createSsrRpc("c51d4627a7ec2712ca119dff78e3b5229779cfb3822b1f23720b808082112b18"));
var requestModeration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	conversationId: stringType().uuid(),
	productId: stringType().uuid(),
	reason: stringType().trim().min(10, "Informe um motivo com pelo menos 10 caracteres.").max(1e3)
}).parse(data)).handler(createSsrRpc("f51d31afe4e51f12bb8661aa0a088ae911b444a4a0be7045c3e05347b7151c80"));
/** Apenas quem abriu o pedido de mediação pode cancelá-lo, e só enquanto a equipe não aceitou. */
var cancelModeration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ conversationId: stringType().uuid() }).parse(data)).handler(createSsrRpc("b5888bc006064c430ebc666768ef3fc1ddfcabbccb9f0c74f10cea1697a83fd1"));
/** A equipe aceita ou recusa o pedido de mediação. */
var respondModeration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	conversationId: stringType().uuid(),
	decision: enumType(["accept", "decline"]),
	note: stringType().trim().max(500).optional()
}).parse(data)).handler(createSsrRpc("f735e8f750bd1cb671b227050ab91a767e2c48062ce1bb1e025d3092aff6c846"));
/** Devolve (criando se preciso) a conversa ligada a um pedido usado por "Ir para a entrega". */
var orderConversation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ orderId: stringType().uuid() }).parse(data)).handler(createSsrRpc("1d44cb157c71130733d74bb31fca70179a7f2a0a6d6ba817092b65a73dc1ce26"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a7cfd9042b98a257b075f02f575fa5cef04d2813b34ffa8e3fb589f723c8a4a6"));
/** Marca como lidas as mensagens recebidas pelo usuário na conversa aberta. */
var markConversationRead = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ conversationId: stringType().uuid() }).parse(data)).handler(createSsrRpc("d1e71d3c41664f6c09081678bdfb102baf48d46d27d9c1f5e60890edf7dee929"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	userId: stringType().uuid(),
	reason: stringType().trim().min(3).max(140),
	details: stringType().trim().max(1e3).default(""),
	severity: enumType([
		"low",
		"medium",
		"high"
	]).default("low")
}).parse(data)).handler(createSsrRpc("bb9597fb7b1c2aa901ae75e3f4e6ab472f9ebd59744c80d757ff7b48689d372f"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("f89d49976463c92152982a0dc9d5275042b83443a887eeaaba580db890643793"));
//#endregion
export { updateUserProfileByAdmin as C, syncMyOrders as S, saveBlogPost as _, deleteCategory as a, staffAction as b, fetchBlogPostsForEditor as c, markConversationRead as d, markOrderShipped as f, respondModeration as g, requestWithdrawal as h, deleteBlogPost as i, fetchContentAdmin as l, requestModeration as m, commerce_functions_BTItmHS8_exports as n, deleteSitePage as o, orderConversation as p, createCheckout as r, fetchAdminData as s, cancelModeration as t, joinConversationAsModerator as u, saveCategory as v, verifyPayment as w, submitAppeal as x, saveSitePage as y };
