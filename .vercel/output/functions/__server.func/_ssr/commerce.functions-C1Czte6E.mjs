import { o as getRequest, r as createServerFn } from "./server-935pLRdS.mjs";
import { n as requireSupabaseAuth, t as optionalSupabaseAuth } from "./auth-middleware-DE2Fqus-.mjs";
import { a as objectType, i as numberType, n as coerce, o as stringType, r as enumType, t as booleanType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-DrpIJ8tE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce.functions-C1Czte6E.js
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
var PROTECTION_FEES = {
	basica: 10,
	media: 50,
	maxima: 200
};
var createCheckout_createServerFn_handler = createServerRpc({
	id: "a8652c971edc46d20a8ea644d2bfd9cf45e0baea82fed4958d653c1640d3ffee",
	name: "createCheckout",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => createCheckout.__executeServer(opts));
var createCheckout = createServerFn({ method: "POST" }).middleware([optionalSupabaseAuth]).inputValidator((data) => checkoutSchema.parse(data)).handler(createCheckout_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { efiConfigured } = await import("./efi.server-DFMEMm5a.mjs");
	const buyerEmail = String(data.email ?? context.claims?.email ?? "").trim().toLowerCase() || null;
	const { data: product } = await supabaseAdmin.from("products").select("*").eq("id", data.productId).eq("status", "active").maybeSingle();
	if (!product) throw new Error("Produto indisponível.");
	const { data: buyerProfile } = await supabaseAdmin.from("profiles").select("banned").eq("id", context.userId ?? "00000000-0000-0000-0000-000000000000").maybeSingle();
	if (buyerProfile?.banned) throw new Error("Conta suspensa: não é possível comprar. Envie uma apelação.");
	if (context.userId && product.seller_id === context.userId) throw new Error("Não pode comprar o seu próprio anúncio.");
	let variant = null;
	if (data.variantId) {
		const { data: v } = await supabaseAdmin.from("product_variants").select("id, name, price_cents, stock, active, product_id").eq("id", data.variantId).maybeSingle();
		if (!v || !v.active || v.product_id !== product.id) throw new Error("Variação indisponível.");
		variant = v;
	}
	const unitPrice = variant ? variant.price_cents : product.price_cents;
	const stock = variant ? variant.stock : product.stock;
	const quantity = Math.max(1, Math.min(20, data.quantity ?? 1));
	if (product.auto_delivery && stock < quantity) throw new Error(stock <= 0 ? "Sem estoque disponível." : `Só há ${stock} unidade(s) disponível(is).`);
	const basePrice = unitPrice * quantity;
	const protectionFee = PROTECTION_FEES[data.protection] ?? 10;
	const total = basePrice + protectionFee;
	const fee = Math.round(basePrice * .08);
	const title = variant ? `${product.title} ${variant.name}${quantity > 1 ? ` (${quantity}x)` : ""}` : `${product.title}${quantity > 1 ? ` (${quantity}x)` : ""}`;
	const { data: order, error } = await supabaseAdmin.from("orders").insert({
		buyer_id: context.userId,
		buyer_email: buyerEmail,
		seller_id: product.seller_id,
		product_id: product.id,
		variant_id: variant?.id ?? null,
		variant_name: variant?.name ?? null,
		quantity,
		base_price_cents: basePrice,
		amount_cents: total,
		fee_cents: fee + protectionFee,
		seller_amount_cents: basePrice - fee,
		protection: data.protection,
		protection_fee_cents: protectionFee
	}).select().single();
	if (error) throw error;
	if (!efiConfigured()) return {
		orderId: order.id,
		pixCode: null,
		pixQrcodeImage: null,
		paymentUrl: null,
		message: "Pagamentos Efí Bank ainda não configurados pelo administrador."
	};
	const notificationUrl = `${new URL(getRequest().url).origin}/api/public/efi-webhook`;
	try {
		const { createEfiPixCharge } = await import("./efi.server-DFMEMm5a.mjs");
		const pix = await createEfiPixCharge({
			title,
			amountCents: total,
			orderId: order.id,
			notificationUrl
		});
		const { error: pixUpdateError } = await supabaseAdmin.from("orders").update({
			charge_id: String(pix.chargeId),
			pix_copy_paste: pix.qrcode,
			pix_qrcode: pix.qrcodeImage
		}).eq("id", order.id);
		if (pixUpdateError) throw pixUpdateError;
		await supabaseAdmin.from("order_events").insert({
			order_id: order.id,
			status: "pending",
			label: "QR Code Pix gerado"
		});
		if (buyerEmail) try {
			const { marketplaceEmail, sendTransactionalEmail, escapeEmailHtml } = await import("./email.server-DODoz4im.mjs");
			await sendTransactionalEmail({
				to: buyerEmail,
				subject: `Compra registrada: ${title}`,
				html: marketplaceEmail({
					eyebrow: "Pagamento via Pix",
					title: "Seu pedido está reservado",
					intro: `A compra de <strong style="color:#fff">${escapeEmailHtml(title)}</strong> foi registrada. Falta apenas concluir o pagamento para liberar o pedido.`,
					content: `<div style="padding:18px;border-radius:16px;background:#211b35"><p style="margin:0 0 8px;color:#c4b5fd;font-size:12px;text-transform:uppercase">Total</p><p style="margin:0;color:#fff;font-size:26px;font-weight:700">R$ ${(total / 100).toFixed(2)}</p><p style="margin:18px 0 8px;color:#c4b5fd;font-size:12px;text-transform:uppercase">Pix copia e cola</p><p style="margin:0;word-break:break-all;color:#e9d5ff;font-size:12px;line-height:1.6">${escapeEmailHtml(pix.qrcode)}</p></div><p style="font-size:13px;color:#cbd5e1">Pedido <strong style="color:#fff">#${escapeEmailHtml(order.id.slice(0, 8))}</strong>. Após a confirmação, enviaremos a entrega para este e-mail.</p>`
				})
			});
		} catch (emailError) {
			console.error("[checkout] não foi possível enviar confirmação por e-mail", emailError);
		}
		return {
			orderId: order.id,
			pixCode: pix.qrcode,
			pixQrcodeImage: pix.qrcodeImage,
			paymentUrl: null,
			message: null
		};
	} catch (err) {
		const detail = err instanceof Error ? err.message : "Erro desconhecido";
		await supabaseAdmin.from("orders").update({ status: "cancelled" }).eq("id", order.id);
		await supabaseAdmin.from("order_events").insert({
			order_id: order.id,
			status: "cancelled",
			label: `Falha ao gerar pagamento: ${detail}`.slice(0, 200)
		});
		throw new Error(`Não foi possível gerar o pagamento. ${detail}`);
	}
});
var syncMyOrders_createServerFn_handler = createServerRpc({
	id: "965db48342060c942bd66ea1cddf375131adece30a98debcb3d56e728a742dbf",
	name: "syncMyOrders",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => syncMyOrders.__executeServer(opts));
var syncMyOrders = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(syncMyOrders_createServerFn_handler, async ({ context }) => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { getEfiChargeStatus, EFI_PAID_STATUSES, efiConfigured } = await import("./efi.server-DFMEMm5a.mjs");
	const { fulfillOrder } = await import("./fulfillment.server-Cub17CqI.mjs");
	if (!efiConfigured()) return { updated: 0 };
	const { data: orders } = await supabaseAdmin.from("orders").select("id, charge_id").eq("buyer_id", context.userId).eq("status", "pending").not("charge_id", "is", null).limit(20);
	let updated = 0;
	for (const order of orders ?? []) try {
		const detail = await getEfiChargeStatus(order.charge_id);
		if (EFI_PAID_STATUSES.includes(detail.status)) {
			await fulfillOrder(order.id);
			updated += 1;
		}
	} catch {}
	return { updated };
});
var verifyPayment_createServerFn_handler = createServerRpc({
	id: "26f44a872f268db094854309a06315ddb4dcf2ac054b4dc05a62f6983f0ad736",
	name: "verifyPayment",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => verifyPayment.__executeServer(opts));
var verifyPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ orderId: stringType().uuid() }).parse(data)).handler(verifyPayment_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { getEfiChargeStatus, EFI_PAID_STATUSES, efiConfigured } = await import("./efi.server-DFMEMm5a.mjs");
	const { fulfillOrder } = await import("./fulfillment.server-Cub17CqI.mjs");
	const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", data.orderId).maybeSingle();
	if (!order || order.buyer_id !== context.userId && order.seller_id !== context.userId) throw new Error("Pedido não encontrado.");
	if (order.status !== "pending") return {
		status: order.status,
		conversationId: null,
		efiStatus: null
	};
	if (!order.charge_id || !efiConfigured()) return {
		status: order.status,
		conversationId: null,
		efiStatus: null
	};
	const detail = await getEfiChargeStatus(order.charge_id);
	if (EFI_PAID_STATUSES.includes(detail.status)) {
		const result = await fulfillOrder(order.id);
		return {
			status: result.delivered ? "delivered" : "paid",
			conversationId: result.conversationId ?? null,
			efiStatus: detail.status
		};
	}
	return {
		status: order.status,
		conversationId: null,
		efiStatus: detail.status
	};
});
var markOrderShipped_createServerFn_handler = createServerRpc({
	id: "695b6a88464311d525de62f3917a9eaa28c449a710b6a6f8e47226007c07773b",
	name: "markOrderShipped",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => markOrderShipped.__executeServer(opts));
var markOrderShipped = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	orderId: stringType().uuid(),
	note: stringType().trim().max(200).optional()
}).parse(data)).handler(markOrderShipped_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { ensureOrderConversation } = await import("./fulfillment.server-Cub17CqI.mjs");
	const { data: order } = await supabaseAdmin.from("orders").select("id, seller_id, status").eq("id", data.orderId).maybeSingle();
	if (!order || order.seller_id !== context.userId) throw new Error("Pedido não encontrado.");
	if (order.status !== "paid") throw new Error("Só é possível enviar pedidos já pagos.");
	await supabaseAdmin.from("orders").update({ status: "shipped" }).eq("id", order.id);
	await supabaseAdmin.from("order_events").insert({
		order_id: order.id,
		status: "shipped",
		label: data.note?.slice(0, 200) || "Pedido enviado pelo vendedor"
	});
	await ensureOrderConversation(order.id);
	return { status: "shipped" };
});
var confirmOrderReceived_createServerFn_handler = createServerRpc({
	id: "98dbf845b91c160857a20158054c3365b80c3c29820d16eb29eec0ca2c8385bb",
	name: "confirmOrderReceived",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => confirmOrderReceived.__executeServer(opts));
var confirmOrderReceived = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ orderId: stringType().uuid() }).parse(data)).handler(confirmOrderReceived_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { data: order } = await supabaseAdmin.from("orders").select("id, buyer_id, status").eq("id", data.orderId).maybeSingle();
	if (!order || order.buyer_id !== context.userId) throw new Error("Pedido não encontrado.");
	if (order.status !== "paid" && order.status !== "shipped") throw new Error("Este pedido ainda não pode ser confirmado.");
	await supabaseAdmin.from("orders").update({ status: "delivered" }).eq("id", order.id);
	await supabaseAdmin.from("order_events").insert({
		order_id: order.id,
		status: "delivered",
		label: "Recebimento confirmado pelo comprador"
	});
	return { status: "delivered" };
});
var requestWithdrawal_createServerFn_handler = createServerRpc({
	id: "1e743d9a675638ee708898643a732451c57225c1e66289e8292f574da6de0c50",
	name: "requestWithdrawal",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => requestWithdrawal.__executeServer(opts));
var requestWithdrawal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	amountCents: numberType().int().min(1),
	pixKey: stringType().trim().min(4).max(140)
}).parse(data)).handler(requestWithdrawal_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { data: profile } = await supabaseAdmin.from("profiles").select("balance_cents, pending_cents, banned, verified").eq("id", context.userId).maybeSingle();
	if (!profile) throw new Error("Perfil não encontrado.");
	if (profile.banned) throw new Error("Conta suspensa: saques indisponíveis.");
	if (!profile.verified) throw new Error("Verifique a sua identidade antes de solicitar um saque.");
	if (profile.balance_cents < data.amountCents) throw new Error("Saldo insuficiente.");
	await supabaseAdmin.from("profiles").update({
		balance_cents: profile.balance_cents - data.amountCents,
		pending_cents: (profile.pending_cents ?? 0) + data.amountCents,
		pix_key: data.pixKey
	}).eq("id", context.userId);
	const { data: created, error } = await supabaseAdmin.from("withdrawals").insert({
		seller_id: context.userId,
		amount_cents: data.amountCents,
		pix_key: data.pixKey,
		status: "requested"
	}).select("id").maybeSingle();
	if (error) throw error;
	if (created) await supabaseAdmin.from("withdrawal_events").insert({
		withdrawal_id: created.id,
		actor_id: context.userId,
		actor_role: "seller",
		status: "requested",
		note: "Pedido de saque criado e enviado para análise."
	});
	return { ok: true };
});
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
var staffAction_createServerFn_handler = createServerRpc({
	id: "e5668ecf9ae66187316bdf264c550cb085d7b96cf8e4b5b0db2be89315bff8ed",
	name: "staffAction",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => staffAction.__executeServer(opts));
var staffAction = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => staffActionSchema.parse(data)).handler(staffAction_createServerFn_handler, async ({ data, context }) => {
	const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!isStaff) throw new Error("Sem permissão.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const id = data.targetId;
	switch (data.action) {
		case "block_product":
			await supabaseAdmin.from("products").update({ status: "blocked" }).eq("id", id);
			break;
		case "unblock_product":
			await supabaseAdmin.from("products").update({ status: "active" }).eq("id", id);
			break;
		case "ban_user":
			await supabaseAdmin.from("profiles").update({
				banned: true,
				ban_reason: data.note ?? "Violação dos termos de uso.",
				banned_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
			await supabaseAdmin.from("products").update({ status: "blocked" }).eq("seller_id", id);
			break;
		case "unban_user":
			await supabaseAdmin.from("profiles").update({
				banned: false,
				ban_reason: null,
				banned_at: null
			}).eq("id", id);
			break;
		case "accept_appeal": {
			const { data: a } = await supabaseAdmin.from("appeals").update({
				status: "accepted",
				staff_reply: data.note ?? "Apelação aceite. Conta reativada."
			}).eq("id", id).select("user_id").maybeSingle();
			if (a) await supabaseAdmin.from("profiles").update({
				banned: false,
				ban_reason: null,
				banned_at: null
			}).eq("id", a.user_id);
			break;
		}
		case "reject_appeal":
			await supabaseAdmin.from("appeals").update({
				status: "rejected",
				staff_reply: data.note ?? "Apelação recusada após análise."
			}).eq("id", id);
			break;
		case "verify_user":
			await supabaseAdmin.from("profiles").update({
				verified: true,
				verification_level: "maximo",
				verified_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
			break;
		case "unverify_user":
			await supabaseAdmin.from("profiles").update({
				verified: false,
				verification_level: "none",
				verified_at: null
			}).eq("id", id);
			break;
		case "resolve_report":
			await supabaseAdmin.from("reports").update({
				status: "resolved",
				resolution: data.note ?? null
			}).eq("id", id);
			break;
		case "dismiss_report":
			await supabaseAdmin.from("reports").update({
				status: "dismissed",
				resolution: data.note ?? null
			}).eq("id", id);
			break;
		case "hide_message":
			await supabaseAdmin.from("messages").update({ hidden: true }).eq("id", id);
			break;
		case "approve_kyc": {
			const { data: v } = await supabaseAdmin.from("verifications").update({ status: "approved" }).eq("id", id).select("user_id, level, country, city, business_name, social_url, social_network").maybeSingle();
			if (v) await supabaseAdmin.from("profiles").update({
				verified: true,
				verification_level: "maximo",
				verified_at: (/* @__PURE__ */ new Date()).toISOString(),
				verif_country: v.country ?? null,
				verif_city: v.city ?? null,
				verif_business: v.business_name ?? null,
				verif_social: v.social_url ?? null,
				verif_social_network: v.social_network ?? null
			}).eq("id", v.user_id);
			break;
		}
		case "reject_kyc":
			await supabaseAdmin.from("verifications").update({
				status: "rejected",
				note: data.note ?? null
			}).eq("id", id);
			break;
		case "pay_withdrawal": {
			const { data: w } = await supabaseAdmin.from("withdrawals").update({
				status: "paid",
				note: data.note ?? "Saque aprovado e pago via Pix.",
				reason: data.reason ?? null,
				evidence_url: data.evidenceUrl ?? null,
				reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
				reviewed_by: context.userId
			}).eq("id", id).eq("status", "requested").select("seller_id, amount_cents").maybeSingle();
			if (w) {
				const { data: p } = await supabaseAdmin.from("profiles").select("pending_cents").eq("id", w.seller_id).maybeSingle();
				await supabaseAdmin.from("profiles").update({ pending_cents: Math.max((p?.pending_cents ?? 0) - w.amount_cents, 0) }).eq("id", w.seller_id);
				await supabaseAdmin.from("withdrawal_events").insert({
					withdrawal_id: id,
					actor_id: context.userId,
					actor_role: "staff",
					status: "paid",
					reason: data.reason ?? null,
					evidence_url: data.evidenceUrl ?? null,
					note: data.note ?? "Saque aprovado e pago via Pix."
				});
			}
			break;
		}
		case "reject_withdrawal": {
			const { data: w } = await supabaseAdmin.from("withdrawals").update({
				status: "rejected",
				note: data.note ?? "Saque recusado pela equipe. Valor devolvido ao saldo.",
				reason: data.reason ?? null,
				evidence_url: data.evidenceUrl ?? null,
				reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
				reviewed_by: context.userId
			}).eq("id", id).eq("status", "requested").select("seller_id, amount_cents").maybeSingle();
			if (w) {
				const { data: p } = await supabaseAdmin.from("profiles").select("balance_cents, pending_cents").eq("id", w.seller_id).maybeSingle();
				await supabaseAdmin.from("profiles").update({
					balance_cents: (p?.balance_cents ?? 0) + w.amount_cents,
					pending_cents: Math.max((p?.pending_cents ?? 0) - w.amount_cents, 0)
				}).eq("id", w.seller_id);
				await supabaseAdmin.from("withdrawal_events").insert({
					withdrawal_id: id,
					actor_id: context.userId,
					actor_role: "staff",
					status: "rejected",
					reason: data.reason ?? null,
					evidence_url: data.evidenceUrl ?? null,
					note: data.note ?? "Saque recusado pela equipe. Valor devolvido ao saldo."
				});
			}
			break;
		}
	}
	return { ok: true };
});
var fetchAdminData_createServerFn_handler = createServerRpc({
	id: "4fb0bd7020d42cd39a75880d0c6772f16ddcfd9ac72b7d66a4ab32a9d57cf1fe",
	name: "fetchAdminData",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => fetchAdminData.__executeServer(opts));
var fetchAdminData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(fetchAdminData_createServerFn_handler, async ({ context }) => {
	const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!isStaff) throw new Error("Sem permissão.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const [users, products, reports, withdrawals, verifications, orders] = await Promise.all([
		supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }).limit(100),
		supabaseAdmin.from("products").select("*, seller:profiles!products_seller_id_fkey(username)").order("created_at", { ascending: false }).limit(100),
		supabaseAdmin.from("reports").select("*").order("created_at", { ascending: false }).limit(100),
		supabaseAdmin.from("withdrawals").select("*, seller:profiles!withdrawals_seller_id_fkey(username, pix_key)").order("created_at", { ascending: false }).limit(100),
		supabaseAdmin.from("verifications").select("*, user:profiles!verifications_user_id_fkey(username)").order("created_at", { ascending: false }).limit(100),
		supabaseAdmin.from("orders").select("amount_cents, fee_cents, status").limit(1e3)
	]);
	const [appeals, conversations, supportChats] = await Promise.all([
		supabaseAdmin.from("appeals").select("*, user:profiles!appeals_user_id_fkey(username, display_name, avatar_url, banned, ban_reason)").order("created_at", { ascending: false }).limit(100),
		supabaseAdmin.from("conversations").select("*, buyer:profiles!conversations_buyer_id_fkey(username), seller:profiles!conversations_seller_id_fkey(username)").eq("moderation_requested", true).order("last_message_at", { ascending: false }).limit(50),
		supabaseAdmin.from("conversations").select("*, buyer:profiles!conversations_buyer_id_fkey(username, display_name, avatar_url), seller:profiles!conversations_seller_id_fkey(username, display_name, avatar_url)").eq("conversation_type", "support").order("last_message_at", { ascending: false }).limit(100)
	]);
	return {
		users: users.data ?? [],
		products: products.data ?? [],
		reports: reports.data ?? [],
		withdrawals: withdrawals.data ?? [],
		verifications: verifications.data ?? [],
		orders: orders.data ?? [],
		appeals: appeals.data ?? [],
		moderationChats: conversations.data ?? [],
		supportChats: supportChats.data ?? []
	};
});
var adminProfileUpdateSchema = objectType({
	userId: stringType().uuid(),
	displayName: stringType().trim().min(2).max(120),
	username: stringType().trim().toLowerCase().regex(/^[a-z0-9_.]+$/, "Use apenas letras, números, ponto e sublinhado.").min(3).max(40)
});
var updateUserProfileByAdmin_createServerFn_handler = createServerRpc({
	id: "bb73a57b6fcaf9996472ab3e6495f88de01ad22bfd58b573a9b4fbaf17b2075a",
	name: "updateUserProfileByAdmin",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => updateUserProfileByAdmin.__executeServer(opts));
var updateUserProfileByAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => adminProfileUpdateSchema.parse(data)).handler(updateUserProfileByAdmin_createServerFn_handler, async ({ data, context }) => {
	const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!isStaff) throw new Error("Sem permissão.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { data: duplicate } = await supabaseAdmin.from("profiles").select("id").eq("username", data.username).neq("id", data.userId).maybeSingle();
	if (duplicate) throw new Error("Este @ já está sendo usado por outro usuário.");
	const { error } = await supabaseAdmin.from("profiles").update({
		display_name: data.displayName,
		username: data.username
	}).eq("id", data.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
async function assertAdmin(context) {
	const { data: isAdmin } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Sem permissão.");
}
var categorySchema = objectType({
	slug: stringType().trim().min(2).max(60),
	name: stringType().trim().min(1).max(80),
	description: stringType().max(300).default(""),
	icon: stringType().trim().min(1).max(40).default("package"),
	image_url: stringType().url().nullish(),
	display_mode: enumType(["icon", "image"]).default("icon"),
	position: numberType().int().min(0).max(999).default(0)
});
var saveCategory_createServerFn_handler = createServerRpc({
	id: "ba51a384babe2fa003f89a9bc609695a61a98f4c453988c7c2325f72d42b7b40",
	name: "saveCategory",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => saveCategory.__executeServer(opts));
var saveCategory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => categorySchema.parse(data)).handler(saveCategory_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { error } = await supabaseAdmin.from("categories").upsert({
		slug: data.slug,
		name: data.name,
		description: data.description,
		icon: data.icon,
		image_url: data.image_url ?? null,
		display_mode: data.display_mode,
		position: data.position
	}, { onConflict: "slug" });
	if (error) throw error;
	return { ok: true };
});
var deleteCategory_createServerFn_handler = createServerRpc({
	id: "c32bafae057376bf23baa874e22a23d5389059de35d666024f7d474b4bc9b9da",
	name: "deleteCategory",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => deleteCategory.__executeServer(opts));
var deleteCategory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ slug: stringType() }).parse(data)).handler(deleteCategory_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { count } = await supabaseAdmin.from("products").select("id", {
		count: "exact",
		head: true
	}).eq("category_slug", data.slug);
	if ((count ?? 0) > 0) throw new Error("Existem anúncios nesta categoria.");
	const { error } = await supabaseAdmin.from("categories").delete().eq("slug", data.slug);
	if (error) throw error;
	return { ok: true };
});
var pageSchema = objectType({
	slug: stringType().trim().min(2).max(60),
	title: stringType().trim().min(1).max(120),
	summary: stringType().max(300).default(""),
	content: stringType().max(6e4).default(""),
	image_url: stringType().url().nullable().optional(),
	published: booleanType().default(true),
	position: numberType().int().min(0).max(999).default(0)
});
var saveSitePage_createServerFn_handler = createServerRpc({
	id: "b3d99e792ba2daf92157a35d84f0c221fa413b216e25653ea1c36b66d0c0c2f8",
	name: "saveSitePage",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => saveSitePage.__executeServer(opts));
var saveSitePage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => pageSchema.parse(data)).handler(saveSitePage_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { error } = await supabaseAdmin.from("site_pages").upsert(data, { onConflict: "slug" });
	if (error) throw error;
	return { ok: true };
});
var BLOG_EDITOR_EMAIL = "gabrieljairo865@gmail.com";
function assertBlogEditor(context) {
	if (String(context.claims.email ?? "").trim().toLowerCase() !== BLOG_EDITOR_EMAIL) throw new Error("Apenas o editor autorizado pode alterar o blog.");
}
var fetchBlogPostsForEditor_createServerFn_handler = createServerRpc({
	id: "18e143c3b39f14b608cc33d996f93d03bb538ee3e67431b5f11e0b7bec5a19e5",
	name: "fetchBlogPostsForEditor",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => fetchBlogPostsForEditor.__executeServer(opts));
var fetchBlogPostsForEditor = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(fetchBlogPostsForEditor_createServerFn_handler, async ({ context }) => {
	assertBlogEditor(context);
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { data, error } = await supabaseAdmin.from("site_pages").select("*").like("slug", "blog-%").order("updated_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
});
var saveBlogPost_createServerFn_handler = createServerRpc({
	id: "1e3e9eed8e14bb85dab86973df6aab9ab9c6231d50a89c2169b321ef24b4cf3b",
	name: "saveBlogPost",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => saveBlogPost.__executeServer(opts));
var saveBlogPost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => pageSchema.extend({ slug: stringType().regex(/^blog-[a-z0-9-]+$/) }).parse(data)).handler(saveBlogPost_createServerFn_handler, async ({ data, context }) => {
	assertBlogEditor(context);
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { error } = await supabaseAdmin.from("site_pages").upsert(data, { onConflict: "slug" });
	if (error) throw error;
	return { ok: true };
});
var deleteBlogPost_createServerFn_handler = createServerRpc({
	id: "28b3557e93010f662f33d90b55da9392aebd1e263b4a427db0be3e5427c5fa86",
	name: "deleteBlogPost",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => deleteBlogPost.__executeServer(opts));
var deleteBlogPost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ slug: stringType().regex(/^blog-[a-z0-9-]+$/) }).parse(data)).handler(deleteBlogPost_createServerFn_handler, async ({ data, context }) => {
	assertBlogEditor(context);
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { error } = await supabaseAdmin.from("site_pages").delete().eq("slug", data.slug);
	if (error) throw error;
	return { ok: true };
});
var deleteSitePage_createServerFn_handler = createServerRpc({
	id: "dd8cd896ba8f229ea4981c49234787a2961fb5f16171c4683354c07d5072051a",
	name: "deleteSitePage",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => deleteSitePage.__executeServer(opts));
var deleteSitePage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ slug: stringType() }).parse(data)).handler(deleteSitePage_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { error } = await supabaseAdmin.from("site_pages").delete().eq("slug", data.slug);
	if (error) throw error;
	return { ok: true };
});
var fetchContentAdmin_createServerFn_handler = createServerRpc({
	id: "db8cd1e22a3b6e3483f95fe41a1770d7f2a33cdbed5deb828f9785eee6b642b8",
	name: "fetchContentAdmin",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => fetchContentAdmin.__executeServer(opts));
var fetchContentAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(fetchContentAdmin_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const [cats, pages] = await Promise.all([supabaseAdmin.from("categories").select("*").order("position"), supabaseAdmin.from("site_pages").select("*").order("position")]);
	return {
		categories: cats.data ?? [],
		pages: pages.data ?? []
	};
});
var submitAppeal_createServerFn_handler = createServerRpc({
	id: "70aa0f6d29ce8bf5872771a7a4b24c18e9f0d6c014014b64daf9514c1d1d90df",
	name: "submitAppeal",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => submitAppeal.__executeServer(opts));
var submitAppeal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ message: stringType().trim().min(20).max(2e3) }).parse(data)).handler(submitAppeal_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { data: profile } = await supabaseAdmin.from("profiles").select("banned").eq("id", context.userId).maybeSingle();
	if (!profile?.banned) throw new Error("A tua conta não está suspensa.");
	const { data: open } = await supabaseAdmin.from("appeals").select("id").eq("user_id", context.userId).eq("status", "pending").maybeSingle();
	if (open) throw new Error("Já tens uma apelação em análise.");
	const { error } = await supabaseAdmin.from("appeals").insert({
		user_id: context.userId,
		message: data.message
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var joinConversationAsModerator_createServerFn_handler = createServerRpc({
	id: "c51d4627a7ec2712ca119dff78e3b5229779cfb3822b1f23720b808082112b18",
	name: "joinConversationAsModerator",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => joinConversationAsModerator.__executeServer(opts));
var joinConversationAsModerator = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	conversationId: stringType().uuid(),
	message: stringType().trim().min(2).max(2e3)
}).parse(data)).handler(joinConversationAsModerator_createServerFn_handler, async ({ data, context }) => {
	const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!isStaff) throw new Error("Sem permissão.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	await supabaseAdmin.from("conversations").update({
		moderator_id: context.userId,
		moderation_requested: true,
		last_message_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.conversationId);
	const { error } = await supabaseAdmin.from("messages").insert({
		conversation_id: data.conversationId,
		sender_id: context.userId,
		body: data.message,
		kind: "moderator"
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var MEDIATION_COOLDOWN_MS = 108e5;
var requestModeration_createServerFn_handler = createServerRpc({
	id: "f51d31afe4e51f12bb8661aa0a088ae911b444a4a0be7045c3e05347b7151c80",
	name: "requestModeration",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => requestModeration.__executeServer(opts));
var requestModeration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	conversationId: stringType().uuid(),
	productId: stringType().uuid(),
	reason: stringType().trim().min(10, "Informe um motivo com pelo menos 10 caracteres.").max(1e3)
}).parse(data)).handler(requestModeration_createServerFn_handler, async ({ data, context }) => {
	const { data: member } = await context.supabase.rpc("is_conversation_member", {
		_conversation_id: data.conversationId,
		_user_id: context.userId
	});
	if (!member) throw new Error("Sem permissão.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { data: conv } = await supabaseAdmin.from("conversations").select("buyer_id, seller_id, product_id, moderation_status, moderation_cancelled_at, moderation_requested_by").eq("id", data.conversationId).maybeSingle();
	const current = conv;
	if (!current) throw new Error("Conversa não encontrada.");
	if (current.buyer_id !== context.userId) throw new Error("Somente o comprador pode abrir uma reclamação.");
	if (current.seller_id === context.userId) throw new Error("O vendedor não pode abrir uma reclamação da própria venda.");
	if (current.product_id && current.product_id !== data.productId) throw new Error("O produto selecionado não corresponde a esta conversa.");
	const { data: purchasedOrder, error: orderError } = await supabaseAdmin.from("orders").select("id").eq("buyer_id", context.userId).eq("seller_id", current.seller_id).eq("product_id", data.productId).in("status", [
		"paid",
		"delivered",
		"disputed"
	]).limit(1).maybeSingle();
	if (orderError) throw new Error(orderError.message);
	if (!purchasedOrder) throw new Error("Você só pode abrir uma reclamação sobre um produto que comprou.");
	if (current?.moderation_status === "requested") throw new Error("Já existe um pedido de mediação em aberto.");
	if (current?.moderation_status === "accepted") throw new Error("A mediação já está em andamento.");
	if (current?.moderation_status === "declined") throw new Error("Esta mediação já foi recusada e não pode ser aberta novamente para este pedido.");
	if (current?.moderation_status === "cancelled" && current.moderation_cancelled_at && current.moderation_requested_by === context.userId) {
		const elapsed = Date.now() - new Date(current.moderation_cancelled_at).getTime();
		if (elapsed < MEDIATION_COOLDOWN_MS) {
			const minutes = Math.ceil((MEDIATION_COOLDOWN_MS - elapsed) / 6e4);
			const hours = Math.floor(minutes / 60);
			const rest = minutes % 60;
			throw new Error(`Você cancelou uma mediação há pouco. Pode pedir de novo em ${hours > 0 ? `${hours}h${rest ? ` ${rest}min` : ""}` : `${minutes} min`}.`);
		}
	}
	const { error: moderationError } = await supabaseAdmin.from("conversations").update({
		moderation_requested: true,
		moderation_status: "requested",
		moderation_note: data.reason,
		moderation_requested_by: context.userId,
		moderation_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
		last_message_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.conversationId);
	if (moderationError) throw new Error(`Não foi possível pedir mediação: ${moderationError.message}`);
	const { error: messageError } = await supabaseAdmin.from("messages").insert({
		conversation_id: data.conversationId,
		sender_id: context.userId,
		body: `Pedido de mediação aberto. Motivo informado pelo usuário:
${data.reason}

Um administrador foi chamado. A análise será feita em até 24 horas.`,
		kind: "system"
	});
	if (messageError) throw new Error(`Não foi possível registrar o motivo da mediação: ${messageError.message}`);
	return { ok: true };
});
var cancelModeration_createServerFn_handler = createServerRpc({
	id: "b5888bc006064c430ebc666768ef3fc1ddfcabbccb9f0c74f10cea1697a83fd1",
	name: "cancelModeration",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => cancelModeration.__executeServer(opts));
var cancelModeration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ conversationId: stringType().uuid() }).parse(data)).handler(cancelModeration_createServerFn_handler, async ({ data, context }) => {
	const { data: member } = await context.supabase.rpc("is_conversation_member", {
		_conversation_id: data.conversationId,
		_user_id: context.userId
	});
	if (!member) throw new Error("Sem permissão.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { data: conv } = await supabaseAdmin.from("conversations").select("moderation_status, moderation_requested_by").eq("id", data.conversationId).maybeSingle();
	const row = conv;
	const status = row?.moderation_status ?? "none";
	if (status === "accepted") throw new Error("A mediação já foi aceita pela equipe.");
	if (status !== "requested") throw new Error("Não há pedido de mediação em aberto.");
	if (row?.moderation_requested_by && row.moderation_requested_by !== context.userId) throw new Error("Só quem pediu a mediação pode cancelá-la.");
	await supabaseAdmin.from("conversations").update({
		moderation_requested: false,
		moderation_status: "cancelled",
		moderation_cancelled_at: (/* @__PURE__ */ new Date()).toISOString(),
		moderation_updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.conversationId);
	await supabaseAdmin.from("messages").insert({
		conversation_id: data.conversationId,
		sender_id: context.userId,
		body: "O pedido de mediação foi cancelado. Uma nova mediação só pode ser aberta daqui a 3 horas.",
		kind: "system"
	});
	return { ok: true };
});
var respondModeration_createServerFn_handler = createServerRpc({
	id: "f735e8f750bd1cb671b227050ab91a767e2c48062ce1bb1e025d3092aff6c846",
	name: "respondModeration",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => respondModeration.__executeServer(opts));
var respondModeration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	conversationId: stringType().uuid(),
	decision: enumType(["accept", "decline"]),
	note: stringType().trim().max(500).optional()
}).parse(data)).handler(respondModeration_createServerFn_handler, async ({ data, context }) => {
	const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!isStaff) throw new Error("Sem permissão.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const accepted = data.decision === "accept";
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (accepted) {
		const { data: conversation, error: conversationError } = await supabaseAdmin.from("conversations").select("buyer_id, seller_id, product_id, moderation_status").eq("id", data.conversationId).maybeSingle();
		if (conversationError) throw conversationError;
		if (!conversation) throw new Error("Conversa de mediação não encontrada.");
		if (conversation.moderation_status !== "requested") throw new Error("Esta mediação já foi decidida e não pode ser contestada ou alterada.");
		if (!conversation?.product_id) throw new Error("A mediação não está vinculada a um pedido.");
		const { data: order, error: orderError } = await supabaseAdmin.from("orders").select("*").eq("buyer_id", conversation.buyer_id).eq("seller_id", conversation.seller_id).eq("product_id", conversation.product_id).in("status", [
			"paid",
			"delivered",
			"disputed",
			"refunded"
		]).order("created_at", { ascending: false }).limit(1).maybeSingle();
		if (orderError) throw orderError;
		if (!order) throw new Error("Não foi encontrado um pedido pago para esta mediação.");
		if (order.status === "refunded") return {
			ok: true,
			alreadyRefunded: true
		};
		const { efiConfigured, refundEfiPix } = await import("./efi.server-DFMEMm5a.mjs");
		if (!order.charge_id || !efiConfigured()) throw new Error("Não foi possível estornar: a integração de pagamentos não está configurada.");
		await refundEfiPix({
			txid: order.charge_id,
			amountCents: order.amount_cents
		});
		const { data: seller } = await supabaseAdmin.from("profiles").select("balance_cents").eq("id", order.seller_id).maybeSingle();
		const nextBalance = Math.max(0, (seller?.balance_cents ?? 0) - order.seller_amount_cents);
		const { error: balanceError } = await supabaseAdmin.from("profiles").update({ balance_cents: nextBalance }).eq("id", order.seller_id);
		if (balanceError) throw balanceError;
		const { data: product } = await supabaseAdmin.from("products").select("stock, sales_count, auto_delivery").eq("id", order.product_id).maybeSingle();
		if (order.delivered_content && product?.auto_delivery) await supabaseAdmin.from("delivery_items").update({ sold: false }).eq("product_id", order.product_id).eq("content", order.delivered_content);
		if (order.variant_id) {
			const { data: variant } = await supabaseAdmin.from("product_variants").select("stock").eq("id", order.variant_id).maybeSingle();
			if (variant) await supabaseAdmin.from("product_variants").update({ stock: variant.stock + order.quantity }).eq("id", order.variant_id);
		} else if (product?.auto_delivery) await supabaseAdmin.from("products").update({
			stock: (product.stock ?? 0) + order.quantity,
			sales_count: Math.max((product.sales_count ?? 0) - 1, 0)
		}).eq("id", order.product_id);
		else if (product) await supabaseAdmin.from("products").update({ sales_count: Math.max((product.sales_count ?? 0) - 1, 0) }).eq("id", order.product_id);
		const { error: orderUpdateError } = await supabaseAdmin.from("orders").update({
			status: "refunded",
			delivered_content: null
		}).eq("id", order.id).neq("status", "refunded");
		if (orderUpdateError) throw orderUpdateError;
		await supabaseAdmin.from("order_events").insert({
			order_id: order.id,
			status: "refunded",
			label: "O banco aprovou o reembolso, já foi enviado aos titulares."
		});
	}
	await supabaseAdmin.from("conversations").update({
		moderation_requested: accepted,
		moderation_status: accepted ? "accepted" : "declined",
		moderation_note: data.note ?? null,
		moderator_id: accepted ? context.userId : null,
		moderation_updated_at: now,
		last_message_at: now
	}).eq("id", data.conversationId);
	await supabaseAdmin.from("messages").insert({
		conversation_id: data.conversationId,
		sender_id: context.userId,
		body: accepted ? `O banco aprovou o reembolso, que já foi enviado aos titulares. A venda foi cancelada e o estoque foi reabastecido. Este reembolso foi processado pela Efí Bank e não pode ser contestado ou recuperado pelo vendedor.${data.note ? ` ${data.note}` : ""}` : `A mediação foi recusada pela equipe.${data.note ? ` Motivo: ${data.note}` : ""}`,
		kind: "system"
	});
	return { ok: true };
});
var orderConversation_createServerFn_handler = createServerRpc({
	id: "1d44cb157c71130733d74bb31fca70179a7f2a0a6d6ba817092b65a73dc1ce26",
	name: "orderConversation",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => orderConversation.__executeServer(opts));
var orderConversation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ orderId: stringType().uuid() }).parse(data)).handler(orderConversation_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { ensureOrderConversation } = await import("./fulfillment.server-Cub17CqI.mjs");
	const { data: order } = await supabaseAdmin.from("orders").select("id, buyer_id, seller_id, product_id, status, delivered_content").eq("id", data.orderId).maybeSingle();
	if (!order || order.buyer_id !== context.userId && order.seller_id !== context.userId) throw new Error("Pedido não encontrado.");
	if (!order.buyer_id || !order.seller_id || !order.product_id) throw new Error("Este pedido não possui participantes suficientes para abrir uma conversa.");
	let conversationId = null;
	try {
		conversationId = await ensureOrderConversation(order.id);
	} catch (error) {
		console.error("[orderConversation] reparo da conversa falhou; usando fallback", error);
	}
	if (!conversationId && order.status !== "pending" && order.status !== "cancelled") {
		const { data: existing } = await supabaseAdmin.from("conversations").select("id").eq("buyer_id", order.buyer_id).eq("seller_id", order.seller_id).eq("product_id", order.product_id).order("last_message_at", { ascending: false }).limit(1);
		conversationId = existing?.[0]?.id ?? null;
		if (!conversationId) {
			const { data: created, error: createError } = await supabaseAdmin.from("conversations").insert({
				buyer_id: order.buyer_id,
				seller_id: order.seller_id,
				product_id: order.product_id,
				conversation_type: "marketplace"
			}).select("id").single();
			if (createError) throw createError;
			conversationId = created.id;
		}
		const { data: orderMessage } = await supabaseAdmin.from("messages").select("id").eq("conversation_id", conversationId).eq("kind", "order").limit(1).maybeSingle();
		if (!orderMessage) await supabaseAdmin.from("messages").insert({
			conversation_id: conversationId,
			sender_id: order.seller_id,
			body: order.delivered_content ? `Pagamento confirmado ✅\nEntrega automática registrada:\n\n${order.delivered_content}` : "Pagamento confirmado ✅\nA entrega será enviada pelo chat. Fique atento às mensagens do vendedor.",
			kind: "order"
		});
	}
	if (!conversationId) throw new Error("A conversa só fica disponível após a confirmação do pagamento e da entrega.");
	return { conversationId };
});
var supportConversation_createServerFn_handler = createServerRpc({
	id: "a7cfd9042b98a257b075f02f575fa5cef04d2813b34ffa8e3fb589f723c8a4a6",
	name: "supportConversation",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => supportConversation.__executeServer(opts));
var supportConversation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(supportConversation_createServerFn_handler, async ({ context }) => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { data: staffRows } = await supabaseAdmin.from("user_roles").select("user_id").in("role", ["admin", "moderator"]).order("created_at", { ascending: true }).limit(20);
	const staff = staffRows?.find((row) => row.user_id !== context.userId) ?? staffRows?.[0];
	if (!staff?.user_id) throw new Error("A equipe de atendimento ainda não está disponível.");
	const { data: existing } = await supabaseAdmin.from("conversations").select("id").eq("buyer_id", context.userId).eq("seller_id", staff.user_id).is("product_id", null).eq("conversation_type", "support").order("last_message_at", { ascending: false }).limit(1);
	if (existing?.[0]?.id) {
		const conversationId = existing[0].id;
		await supabaseAdmin.from("conversations").update({ conversation_type: "support" }).eq("id", conversationId);
		const { data: firstMessage } = await supabaseAdmin.from("messages").select("id").eq("conversation_id", conversationId).limit(1).maybeSingle();
		if (!firstMessage) {
			await supabaseAdmin.from("messages").insert({
				conversation_id: conversationId,
				sender_id: staff.user_id,
				body: "Olá! Este é o canal oficial de atendimento da LynkoMarketplace. Como podemos ajudar?",
				kind: "system"
			});
			await supabaseAdmin.from("conversations").update({ last_message_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", conversationId);
		}
		return { conversationId };
	}
	const { data: created, error } = await supabaseAdmin.from("conversations").insert({
		buyer_id: context.userId,
		seller_id: staff.user_id,
		product_id: null,
		conversation_type: "support"
	}).select("id").single();
	if (error) throw new Error(error.message);
	const { error: messageError } = await supabaseAdmin.from("messages").insert({
		conversation_id: created.id,
		sender_id: staff.user_id,
		body: "Olá! Este é o canal oficial de atendimento da LynkoMarketplace. Como podemos ajudar?",
		kind: "system"
	});
	if (messageError) throw new Error(messageError.message);
	return { conversationId: created.id };
});
var markConversationRead_createServerFn_handler = createServerRpc({
	id: "d1e71d3c41664f6c09081678bdfb102baf48d46d27d9c1f5e60890edf7dee929",
	name: "markConversationRead",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => markConversationRead.__executeServer(opts));
var markConversationRead = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ conversationId: stringType().uuid() }).parse(data)).handler(markConversationRead_createServerFn_handler, async ({ data, context }) => {
	const { data: member } = await context.supabase.rpc("is_conversation_member", {
		_conversation_id: data.conversationId,
		_user_id: context.userId
	});
	if (!member) throw new Error("Sem permissão para ler esta conversa.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { error } = await supabaseAdmin.from("messages").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("conversation_id", data.conversationId).neq("sender_id", context.userId).is("read_at", null);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var issueWarning_createServerFn_handler = createServerRpc({
	id: "bb9597fb7b1c2aa901ae75e3f4e6ab472f9ebd59744c80d757ff7b48689d372f",
	name: "issueWarning",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => issueWarning.__executeServer(opts));
var issueWarning = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	userId: stringType().uuid(),
	reason: stringType().trim().min(3).max(140),
	details: stringType().trim().max(1e3).default(""),
	severity: enumType([
		"low",
		"medium",
		"high"
	]).default("low")
}).parse(data)).handler(issueWarning_createServerFn_handler, async ({ data, context }) => {
	const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!isStaff) throw new Error("Sem permissão.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { error } = await supabaseAdmin.from("warnings").insert({
		user_id: data.userId,
		issued_by: context.userId,
		reason: data.reason,
		details: data.details,
		severity: data.severity
	});
	if (error) throw new Error(error.message);
	await supabaseAdmin.rpc("notify_user", {
		_user_id: data.userId,
		_kind: "report",
		_title: "Você recebeu uma advertência",
		_body: data.reason,
		_link: "/dashboard"
	});
	return { ok: true };
});
var revokeWarning_createServerFn_handler = createServerRpc({
	id: "f89d49976463c92152982a0dc9d5275042b83443a887eeaaba580db890643793",
	name: "revokeWarning",
	filename: "src/lib/commerce.functions.ts"
}, (opts) => revokeWarning.__executeServer(opts));
var revokeWarning = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(revokeWarning_createServerFn_handler, async ({ data, context }) => {
	const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!isStaff) throw new Error("Sem permissão.");
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const { error } = await supabaseAdmin.from("warnings").update({ active: false }).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { cancelModeration_createServerFn_handler, confirmOrderReceived_createServerFn_handler, createCheckout_createServerFn_handler, deleteBlogPost_createServerFn_handler, deleteCategory_createServerFn_handler, deleteSitePage_createServerFn_handler, fetchAdminData_createServerFn_handler, fetchBlogPostsForEditor_createServerFn_handler, fetchContentAdmin_createServerFn_handler, issueWarning_createServerFn_handler, joinConversationAsModerator_createServerFn_handler, markConversationRead_createServerFn_handler, markOrderShipped_createServerFn_handler, orderConversation_createServerFn_handler, requestModeration_createServerFn_handler, requestWithdrawal_createServerFn_handler, respondModeration_createServerFn_handler, revokeWarning_createServerFn_handler, saveBlogPost_createServerFn_handler, saveCategory_createServerFn_handler, saveSitePage_createServerFn_handler, staffAction_createServerFn_handler, submitAppeal_createServerFn_handler, supportConversation_createServerFn_handler, syncMyOrders_createServerFn_handler, updateUserProfileByAdmin_createServerFn_handler, verifyPayment_createServerFn_handler };
