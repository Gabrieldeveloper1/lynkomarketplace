import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { optionalSupabaseAuth, requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const checkoutSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullish(),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
  protection: z.enum(["basica", "media", "maxima"]).default("basica"),
  email: z.string().email("Informe um e-mail válido.").optional(),
});

const PROTECTION_FEES: Record<string, number> = { basica: 10, media: 50, maxima: 200 };

export const createCheckout = createServerFn({ method: "POST" })
  .middleware([optionalSupabaseAuth])
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { efiConfigured } = await import("@/lib/efi.server");
    const buyerEmail =
      String(data.email ?? context.claims?.email ?? "")
        .trim()
        .toLowerCase() || null;

    const { data: product } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", data.productId)
      .eq("status", "active")
      .maybeSingle();
    if (!product) throw new Error("Produto indisponível.");

    const { data: buyerProfile } = await supabaseAdmin
      .from("profiles")
      .select("banned")
      .eq("id", context.userId ?? "00000000-0000-0000-0000-000000000000")
      .maybeSingle();
    if (buyerProfile?.banned)
      throw new Error("Conta suspensa: não é possível comprar. Envie uma apelação.");
    if (context.userId && product.seller_id === context.userId)
      throw new Error("Não pode comprar o seu próprio anúncio.");

    let variant: { id: string; name: string; price_cents: number; stock: number } | null = null;
    if (data.variantId) {
      const { data: v } = await supabaseAdmin
        .from("product_variants")
        .select("id, name, price_cents, stock, active, product_id")
        .eq("id", data.variantId)
        .maybeSingle();
      if (!v || !v.active || v.product_id !== product.id) throw new Error("Variação indisponível.");
      variant = v;
    }

    const unitPrice = variant ? variant.price_cents : product.price_cents;
    const stock = variant ? variant.stock : product.stock;
    const quantity = Math.max(1, Math.min(20, data.quantity ?? 1));
    if (product.auto_delivery && stock < quantity)
      throw new Error(
        stock <= 0 ? "Sem estoque disponível." : `Só há ${stock} unidade(s) disponível(is).`,
      );
    const basePrice = unitPrice * quantity;

    const protectionFee = PROTECTION_FEES[data.protection] ?? 10;
    const total = basePrice + protectionFee;
    const fee = Math.round(basePrice * 0.08);
    const title = variant
      ? `${product.title} ${variant.name}${quantity > 1 ? ` (${quantity}x)` : ""}`
      : `${product.title}${quantity > 1 ? ` (${quantity}x)` : ""}`;
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
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
        protection_fee_cents: protectionFee,
      })
      .select()
      .single();

    if (error) throw error;

    if (!efiConfigured()) {
      return {
        orderId: order.id,
        pixCode: null as string | null,
        pixQrcodeImage: null as string | null,
        paymentUrl: null as string | null,
        message: "Pagamentos Efí Bank ainda não configurados pelo administrador.",
      };
    }

    const origin = new URL(getRequest()!.url).origin;
    const notificationUrl = `${origin}/api/public/efi-webhook`;
    try {
      // Pix imediato: somente QR Code e código copia e cola.
      const { createEfiPixCharge } = await import("@/lib/efi.server");
      const pix = await createEfiPixCharge({
        title,
        amountCents: total,
        orderId: order.id,
        notificationUrl,
      });

      const { error: pixUpdateError } = await supabaseAdmin
        .from("orders")
        .update({
          charge_id: String(pix.chargeId),
          pix_copy_paste: pix.qrcode,
          pix_qrcode: pix.qrcodeImage,
        })
        .eq("id", order.id);
      if (pixUpdateError) throw pixUpdateError;

      await supabaseAdmin.from("order_events").insert({
        order_id: order.id,
        status: "pending",
        label: "QR Code Pix gerado",
      });

      if (buyerEmail) {
        try {
          const { marketplaceEmail, sendTransactionalEmail, escapeEmailHtml } =
            await import("@/lib/email.server");
          await sendTransactionalEmail({
            to: buyerEmail,
            subject: `Compra registrada: ${title}`,
            html: marketplaceEmail({
              eyebrow: "Pagamento via Pix",
              title: "Seu pedido está reservado",
              intro: `A compra de <strong style="color:#fff">${escapeEmailHtml(title)}</strong> foi registrada. Falta apenas concluir o pagamento para liberar o pedido.`,
              content: `<div style="padding:18px;border-radius:16px;background:#211b35"><p style="margin:0 0 8px;color:#c4b5fd;font-size:12px;text-transform:uppercase">Total</p><p style="margin:0;color:#fff;font-size:26px;font-weight:700">R$ ${(total / 100).toFixed(2)}</p><p style="margin:18px 0 8px;color:#c4b5fd;font-size:12px;text-transform:uppercase">Pix copia e cola</p><p style="margin:0;word-break:break-all;color:#e9d5ff;font-size:12px;line-height:1.6">${escapeEmailHtml(pix.qrcode)}</p></div><p style="font-size:13px;color:#cbd5e1">Pedido <strong style="color:#fff">#${escapeEmailHtml(order.id.slice(0, 8))}</strong>. Após a confirmação, enviaremos a entrega para este e-mail.</p>`,
            }),
          });
        } catch (emailError) {
          console.error("[checkout] não foi possível enviar confirmação por e-mail", emailError);
        }
      }

      return {
        orderId: order.id,
        pixCode: pix.qrcode,
        pixQrcodeImage: pix.qrcodeImage,
        paymentUrl: null as string | null,
        message: null as string | null,
      };
    } catch (err) {
      const detail = err instanceof Error ? err.message : "Erro desconhecido";
      await supabaseAdmin.from("orders").update({ status: "cancelled" }).eq("id", order.id);
      await supabaseAdmin.from("order_events").insert({
        order_id: order.id,
        status: "cancelled",
        label: `Falha ao gerar pagamento: ${detail}`.slice(0, 200),
      });
      throw new Error(`Não foi possível gerar o pagamento. ${detail}`);
    }
  });

/**
 * Automação: verifica todos os pedidos pendentes do comprador junto do Efí e
 * entrega automaticamente os que já foram pagos. Chamado em background pelo painel.
 */
export const syncMyOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getEfiChargeStatus, EFI_PAID_STATUSES, efiConfigured } =
      await import("@/lib/efi.server");
    const { fulfillOrder } = await import("@/lib/fulfillment.server");
    if (!efiConfigured()) return { updated: 0 };

    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("id, charge_id")
      .eq("buyer_id", context.userId)
      .eq("status", "pending")
      .not("charge_id", "is", null)
      .limit(20);

    let updated = 0;
    for (const order of orders ?? []) {
      try {
        const detail = await getEfiChargeStatus(order.charge_id!);
        if (EFI_PAID_STATUSES.includes(detail.status)) {
          await fulfillOrder(order.id);
          updated += 1;
        }
      } catch {
        // ignora falhas pontuais de rede/estado
      }
    }
    return { updated };
  });

export const verifyPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getEfiChargeStatus, EFI_PAID_STATUSES, efiConfigured } =
      await import("@/lib/efi.server");
    const { fulfillOrder } = await import("@/lib/fulfillment.server");

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || (order.buyer_id !== context.userId && order.seller_id !== context.userId))
      throw new Error("Pedido não encontrado.");
    if (order.status !== "pending")
      return {
        status: order.status,
        conversationId: null as string | null,
        efiStatus: null as string | null,
      };
    if (!order.charge_id || !efiConfigured())
      return {
        status: order.status,
        conversationId: null as string | null,
        efiStatus: null as string | null,
      };

    const detail = await getEfiChargeStatus(order.charge_id);
    if (EFI_PAID_STATUSES.includes(detail.status)) {
      const result = (await fulfillOrder(order.id)) as {
        delivered?: boolean;
        conversationId?: string | null;
      };
      return {
        status: result.delivered ? "delivered" : "paid",
        conversationId: result.conversationId ?? null,
        efiStatus: detail.status as string | null,
      };
    }
    return {
      status: order.status,
      conversationId: null as string | null,
      efiStatus: detail.status as string | null,
    };
  });

/** Vendedor marca um pedido pago como enviado (entrega manual). */
export const markOrderShipped = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ orderId: z.string().uuid(), note: z.string().trim().max(200).optional() })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ensureOrderConversation } = await import("@/lib/fulfillment.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, seller_id, status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || order.seller_id !== context.userId) throw new Error("Pedido não encontrado.");
    if (order.status !== "paid") throw new Error("Só é possível enviar pedidos já pagos.");

    await supabaseAdmin.from("orders").update({ status: "shipped" }).eq("id", order.id);
    await supabaseAdmin.from("order_events").insert({
      order_id: order.id,
      status: "shipped",
      label: data.note?.slice(0, 200) || "Pedido enviado pelo vendedor",
    });
    await ensureOrderConversation(order.id);
    return { status: "shipped" };
  });

/** Comprador confirma que recebeu o pedido. */
export const confirmOrderReceived = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, buyer_id, status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || order.buyer_id !== context.userId) throw new Error("Pedido não encontrado.");
    if (order.status !== "paid" && order.status !== "shipped")
      throw new Error("Este pedido ainda não pode ser confirmado.");

    await supabaseAdmin.from("orders").update({ status: "delivered" }).eq("id", order.id);
    await supabaseAdmin.from("order_events").insert({
      order_id: order.id,
      status: "delivered",
      label: "Recebimento confirmado pelo comprador",
    });
    return { status: "delivered" };
  });

export const requestWithdrawal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ amountCents: z.number().int().min(1), pixKey: z.string().trim().min(4).max(140) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("balance_cents, pending_cents, banned, verified")
      .eq("id", context.userId)
      .maybeSingle();
    if (!profile) throw new Error("Perfil não encontrado.");
    if (profile.banned) throw new Error("Conta suspensa: saques indisponíveis.");
    if (!profile.verified)
      throw new Error("Verifique a sua identidade antes de solicitar um saque.");
    if (profile.balance_cents < data.amountCents) throw new Error("Saldo insuficiente.");

    await supabaseAdmin
      .from("profiles")
      .update({
        balance_cents: profile.balance_cents - data.amountCents,
        pending_cents: (profile.pending_cents ?? 0) + data.amountCents,
        pix_key: data.pixKey,
      })
      .eq("id", context.userId);

    const { data: created, error } = await supabaseAdmin
      .from("withdrawals")
      .insert({
        seller_id: context.userId,
        amount_cents: data.amountCents,
        pix_key: data.pixKey,
        status: "requested",
      })
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (created)
      await supabaseAdmin.from("withdrawal_events").insert({
        withdrawal_id: created.id,
        actor_id: context.userId,
        actor_role: "seller",
        status: "requested",
        note: "Pedido de saque criado e enviado para análise.",
      });
    return { ok: true };
  });

const staffActionSchema = z.object({
  action: z.enum([
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
    "reject_appeal",
  ]),
  targetId: z.string().uuid(),
  note: z.string().max(500).optional(),
  reason: z.string().max(500).optional(),
  evidenceUrl: z.string().max(500).optional(),
});

export const staffAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => staffActionSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!isStaff) throw new Error("Sem permissão.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const id = data.targetId;

    switch (data.action) {
      case "block_product":
        await supabaseAdmin.from("products").update({ status: "blocked" }).eq("id", id);
        break;
      case "unblock_product":
        await supabaseAdmin.from("products").update({ status: "active" }).eq("id", id);
        break;
      case "ban_user":
        await supabaseAdmin
          .from("profiles")
          .update({
            banned: true,
            ban_reason: data.note ?? "Violação dos termos de uso.",
            banned_at: new Date().toISOString(),
          })
          .eq("id", id);
        await supabaseAdmin.from("products").update({ status: "blocked" }).eq("seller_id", id);
        break;
      case "unban_user":
        await supabaseAdmin
          .from("profiles")
          .update({ banned: false, ban_reason: null, banned_at: null })
          .eq("id", id);
        break;
      case "accept_appeal": {
        const { data: a } = await supabaseAdmin
          .from("appeals")
          .update({
            status: "accepted",
            staff_reply: data.note ?? "Apelação aceite. Conta reativada.",
          })
          .eq("id", id)
          .select("user_id")
          .maybeSingle();
        if (a)
          await supabaseAdmin
            .from("profiles")
            .update({ banned: false, ban_reason: null, banned_at: null })
            .eq("id", a.user_id);
        break;
      }
      case "reject_appeal":
        await supabaseAdmin
          .from("appeals")
          .update({
            status: "rejected",
            staff_reply: data.note ?? "Apelação recusada após análise.",
          })
          .eq("id", id);
        break;
      case "verify_user":
        await supabaseAdmin
          .from("profiles")
          .update({
            verified: true,
            verification_level: "maximo",
            verified_at: new Date().toISOString(),
          })
          .eq("id", id);
        break;
      case "unverify_user":
        await supabaseAdmin
          .from("profiles")
          .update({ verified: false, verification_level: "none", verified_at: null })
          .eq("id", id);
        break;

      case "resolve_report":
        await supabaseAdmin
          .from("reports")
          .update({ status: "resolved", resolution: data.note ?? null })
          .eq("id", id);
        break;
      case "dismiss_report":
        await supabaseAdmin
          .from("reports")
          .update({ status: "dismissed", resolution: data.note ?? null })
          .eq("id", id);
        break;
      case "hide_message":
        await supabaseAdmin.from("messages").update({ hidden: true }).eq("id", id);
        break;
      case "approve_kyc": {
        const { data: v } = await supabaseAdmin
          .from("verifications")
          .update({ status: "approved" })
          .eq("id", id)
          .select("user_id, level, country, city, business_name, social_url, social_network")
          .maybeSingle();
        if (v)
          await supabaseAdmin
            .from("profiles")
            .update({
              verified: true,
              verification_level: "maximo",
              verified_at: new Date().toISOString(),
              verif_country: v.country ?? null,
              verif_city: v.city ?? null,
              verif_business: v.business_name ?? null,
              verif_social: v.social_url ?? null,
              verif_social_network: v.social_network ?? null,
            })

            .eq("id", v.user_id);
        break;
      }

      case "reject_kyc":
        await supabaseAdmin
          .from("verifications")
          .update({ status: "rejected", note: data.note ?? null })
          .eq("id", id);
        break;
      case "pay_withdrawal": {
        const { data: w } = await supabaseAdmin
          .from("withdrawals")
          .update({
            status: "paid",
            note: data.note ?? "Saque aprovado e pago via Pix.",
            reason: data.reason ?? null,
            evidence_url: data.evidenceUrl ?? null,
            reviewed_at: new Date().toISOString(),
            reviewed_by: context.userId,
          })
          .eq("id", id)
          .eq("status", "requested")
          .select("seller_id, amount_cents")
          .maybeSingle();
        if (w) {
          const { data: p } = await supabaseAdmin
            .from("profiles")
            .select("pending_cents")
            .eq("id", w.seller_id)
            .maybeSingle();
          await supabaseAdmin
            .from("profiles")
            .update({ pending_cents: Math.max((p?.pending_cents ?? 0) - w.amount_cents, 0) })
            .eq("id", w.seller_id);
          await supabaseAdmin.from("withdrawal_events").insert({
            withdrawal_id: id,
            actor_id: context.userId,
            actor_role: "staff",
            status: "paid",
            reason: data.reason ?? null,
            evidence_url: data.evidenceUrl ?? null,
            note: data.note ?? "Saque aprovado e pago via Pix.",
          });
        }
        break;
      }
      case "reject_withdrawal": {
        const { data: w } = await supabaseAdmin
          .from("withdrawals")
          .update({
            status: "rejected",
            note: data.note ?? "Saque recusado pela equipe. Valor devolvido ao saldo.",
            reason: data.reason ?? null,
            evidence_url: data.evidenceUrl ?? null,
            reviewed_at: new Date().toISOString(),
            reviewed_by: context.userId,
          })
          .eq("id", id)
          .eq("status", "requested")
          .select("seller_id, amount_cents")
          .maybeSingle();
        if (w) {
          const { data: p } = await supabaseAdmin
            .from("profiles")
            .select("balance_cents, pending_cents")
            .eq("id", w.seller_id)
            .maybeSingle();
          await supabaseAdmin
            .from("profiles")
            .update({
              balance_cents: (p?.balance_cents ?? 0) + w.amount_cents,
              pending_cents: Math.max((p?.pending_cents ?? 0) - w.amount_cents, 0),
            })
            .eq("id", w.seller_id);
          await supabaseAdmin.from("withdrawal_events").insert({
            withdrawal_id: id,
            actor_id: context.userId,
            actor_role: "staff",
            status: "rejected",
            reason: data.reason ?? null,
            evidence_url: data.evidenceUrl ?? null,
            note: data.note ?? "Saque recusado pela equipe. Valor devolvido ao saldo.",
          });
        }
        break;
      }
    }
    return { ok: true };
  });

export const fetchAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!isStaff) throw new Error("Sem permissão.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [users, products, reports, withdrawals, verifications, orders] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("products")
        .select("*, seller:profiles!products_seller_id_fkey(username)")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("withdrawals")
        .select("*, seller:profiles!withdrawals_seller_id_fkey(username, pix_key)")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("verifications")
        .select("*, user:profiles!verifications_user_id_fkey(username)")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin.from("orders").select("amount_cents, fee_cents, status").limit(1000),
    ]);

    const [appeals, conversations, supportChats] = await Promise.all([
      supabaseAdmin
        .from("appeals")
        .select(
          "*, user:profiles!appeals_user_id_fkey(username, display_name, avatar_url, banned, ban_reason)",
        )
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("conversations")
        .select(
          "*, buyer:profiles!conversations_buyer_id_fkey(username), seller:profiles!conversations_seller_id_fkey(username)",
        )
        .eq("moderation_requested", true)
        .order("last_message_at", { ascending: false })
        .limit(50),
      supabaseAdmin
        .from("conversations")
        .select(
          "*, buyer:profiles!conversations_buyer_id_fkey(username, display_name, avatar_url), seller:profiles!conversations_seller_id_fkey(username, display_name, avatar_url)",
        )
        .eq("conversation_type", "support")
        .order("last_message_at", { ascending: false })
        .limit(100),
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
      supportChats: supportChats.data ?? [],
    };
  });

const adminProfileUpdateSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string().trim().min(2).max(120),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_.]+$/, "Use apenas letras, números, ponto e sublinhado.")
    .min(3)
    .max(40),
});

export const updateUserProfileByAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => adminProfileUpdateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!isStaff) throw new Error("Sem permissão.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: duplicate } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", data.username)
      .neq("id", data.userId)
      .maybeSingle();
    if (duplicate) throw new Error("Este @ já está sendo usado por outro usuário.");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ display_name: data.displayName, username: data.username })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------ Conteúdo do site (admin) ------------------------------ */

async function assertAdmin(context: { supabase: unknown; userId: string }) {
  const supabase = context.supabase as {
    rpc: (
      fn: "has_role",
      args: { _user_id: string; _role: "admin" },
    ) => Promise<{ data: boolean | null }>;
  };
  const { data: isAdmin } = await supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!isAdmin) throw new Error("Sem permissão.");
}

const categorySchema = z.object({
  slug: z.string().trim().min(2).max(60),
  name: z.string().trim().min(1).max(80),
  description: z.string().max(300).default(""),
  icon: z.string().trim().min(1).max(40).default("package"),
  image_url: z.string().url().nullish(),
  display_mode: z.enum(["icon", "image"]).default("icon"),
  position: z.number().int().min(0).max(999).default(0),
});

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => categorySchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("categories").upsert(
      {
        slug: data.slug,
        name: data.name,
        description: data.description,
        icon: data.icon,
        image_url: data.image_url ?? null,
        display_mode: data.display_mode,
        position: data.position,
      },
      { onConflict: "slug" },
    );
    if (error) throw error;
    return { ok: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_slug", data.slug);
    if ((count ?? 0) > 0) throw new Error("Existem anúncios nesta categoria.");
    const { error } = await supabaseAdmin.from("categories").delete().eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });

const pageSchema = z.object({
  slug: z.string().trim().min(2).max(60),
  title: z.string().trim().min(1).max(120),
  summary: z.string().max(300).default(""),
  content: z.string().max(60000).default(""),
  image_url: z.string().url().nullable().optional(),
  published: z.boolean().default(true),
  position: z.number().int().min(0).max(999).default(0),
});

export const saveSitePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => pageSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("site_pages").upsert(data, { onConflict: "slug" });
    if (error) throw error;
    return { ok: true };
  });

const BLOG_EDITOR_EMAIL = "gabrieljairo865@gmail.com";
function assertBlogEditor(context: { claims: Record<string, unknown> }) {
  const email = String(context.claims.email ?? "")
    .trim()
    .toLowerCase();
  if (email !== BLOG_EDITOR_EMAIL)
    throw new Error("Apenas o editor autorizado pode alterar o blog.");
}

export const fetchBlogPostsForEditor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertBlogEditor(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("site_pages")
      .select("*")
      .like("slug", "blog-%")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const saveBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    pageSchema.extend({ slug: z.string().regex(/^blog-[a-z0-9-]+$/) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    assertBlogEditor(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("site_pages").upsert(data, { onConflict: "slug" });
    if (error) throw error;
    return { ok: true };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ slug: z.string().regex(/^blog-[a-z0-9-]+$/) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    assertBlogEditor(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("site_pages").delete().eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });

export const deleteSitePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("site_pages").delete().eq("slug", data.slug);
    if (error) throw error;
    return { ok: true };
  });

export const fetchContentAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [cats, pages] = await Promise.all([
      supabaseAdmin.from("categories").select("*").order("position"),
      supabaseAdmin.from("site_pages").select("*").order("position"),
    ]);
    return { categories: cats.data ?? [], pages: pages.data ?? [] };
  });

/* ------------------------------ Apelações e moderação de chat ------------------------------ */

export const submitAppeal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ message: z.string().trim().min(20).max(2000) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("banned")
      .eq("id", context.userId)
      .maybeSingle();
    if (!profile?.banned) throw new Error("A tua conta não está suspensa.");

    const { data: open } = await supabaseAdmin
      .from("appeals")
      .select("id")
      .eq("user_id", context.userId)
      .eq("status", "pending")
      .maybeSingle();
    if (open) throw new Error("Já tens uma apelação em análise.");

    const { error } = await supabaseAdmin
      .from("appeals")
      .insert({ user_id: context.userId, message: data.message });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const joinConversationAsModerator = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ conversationId: z.string().uuid(), message: z.string().trim().min(2).max(2000) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!isStaff) throw new Error("Sem permissão.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin
      .from("conversations")
      .update({
        moderator_id: context.userId,
        moderation_requested: true,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", data.conversationId);

    const { error } = await supabaseAdmin.from("messages").insert({
      conversation_id: data.conversationId,
      sender_id: context.userId,
      body: data.message,
      kind: "moderator",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const MEDIATION_COOLDOWN_MS = 3 * 60 * 60 * 1000;

export const requestModeration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        conversationId: z.string().uuid(),
        productId: z.string().uuid(),
        reason: z
          .string()
          .trim()
          .min(10, "Informe um motivo com pelo menos 10 caracteres.")
          .max(1000),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: member } = await context.supabase.rpc("is_conversation_member", {
      _conversation_id: data.conversationId,
      _user_id: context.userId,
    });
    if (!member) throw new Error("Sem permissão.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: conv } = await supabaseAdmin
      .from("conversations")
      .select(
        "buyer_id, seller_id, product_id, moderation_status, moderation_cancelled_at, moderation_requested_by",
      )
      .eq("id", data.conversationId)
      .maybeSingle();
    const current = conv as {
      buyer_id?: string;
      seller_id?: string;
      product_id?: string | null;
      moderation_status?: string;
      moderation_cancelled_at?: string | null;
      moderation_requested_by?: string | null;
    } | null;

    if (!current) throw new Error("Conversa não encontrada.");
    if (current.buyer_id !== context.userId)
      throw new Error("Somente o comprador pode abrir uma reclamação.");
    if (current.seller_id === context.userId)
      throw new Error("O vendedor não pode abrir uma reclamação da própria venda.");
    if (current.product_id && current.product_id !== data.productId)
      throw new Error("O produto selecionado não corresponde a esta conversa.");

    const { data: purchasedOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("buyer_id", context.userId)
      .eq("seller_id", current.seller_id!)
      .eq("product_id", data.productId)
      .in("status", ["paid", "delivered", "disputed"])
      .limit(1)
      .maybeSingle();
    if (orderError) throw new Error(orderError.message);
    if (!purchasedOrder)
      throw new Error("Você só pode abrir uma reclamação sobre um produto que comprou.");

    if (current?.moderation_status === "requested")
      throw new Error("Já existe um pedido de mediação em aberto.");
    if (current?.moderation_status === "accepted")
      throw new Error("A mediação já está em andamento.");
    if (current?.moderation_status === "declined")
      throw new Error(
        "Esta mediação já foi recusada e não pode ser aberta novamente para este pedido.",
      );

    if (
      current?.moderation_status === "cancelled" &&
      current.moderation_cancelled_at &&
      current.moderation_requested_by === context.userId
    ) {
      const elapsed = Date.now() - new Date(current.moderation_cancelled_at).getTime();
      if (elapsed < MEDIATION_COOLDOWN_MS) {
        const minutes = Math.ceil((MEDIATION_COOLDOWN_MS - elapsed) / 60000);
        const hours = Math.floor(minutes / 60);
        const rest = minutes % 60;
        throw new Error(
          `Você cancelou uma mediação há pouco. Pode pedir de novo em ${
            hours > 0 ? `${hours}h${rest ? ` ${rest}min` : ""}` : `${minutes} min`
          }.`,
        );
      }
    }

    const { error: moderationError } = await supabaseAdmin
      .from("conversations")
      .update({
        moderation_requested: true,
        moderation_status: "requested",
        moderation_note: data.reason,
        moderation_requested_by: context.userId,
        moderation_updated_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
      } as never)
      .eq("id", data.conversationId);
    if (moderationError)
      throw new Error(`Não foi possível pedir mediação: ${moderationError.message}`);
    const { error: messageError } = await supabaseAdmin.from("messages").insert({
      conversation_id: data.conversationId,
      sender_id: context.userId,
      body: `Pedido de mediação aberto. Motivo informado pelo usuário:
${data.reason}

Um administrador foi chamado. A análise será feita em até 24 horas.`,
      kind: "system",
    });
    if (messageError)
      throw new Error(`Não foi possível registrar o motivo da mediação: ${messageError.message}`);
    return { ok: true };
  });

/** Apenas quem abriu o pedido de mediação pode cancelá-lo, e só enquanto a equipe não aceitou. */
export const cancelModeration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ conversationId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: member } = await context.supabase.rpc("is_conversation_member", {
      _conversation_id: data.conversationId,
      _user_id: context.userId,
    });
    if (!member) throw new Error("Sem permissão.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: conv } = await supabaseAdmin
      .from("conversations")
      .select("moderation_status, moderation_requested_by")
      .eq("id", data.conversationId)
      .maybeSingle();
    const row = conv as {
      moderation_status?: string;
      moderation_requested_by?: string | null;
    } | null;
    const status = row?.moderation_status ?? "none";
    if (status === "accepted") throw new Error("A mediação já foi aceita pela equipe.");
    if (status !== "requested") throw new Error("Não há pedido de mediação em aberto.");
    if (row?.moderation_requested_by && row.moderation_requested_by !== context.userId)
      throw new Error("Só quem pediu a mediação pode cancelá-la.");

    await supabaseAdmin
      .from("conversations")
      .update({
        moderation_requested: false,
        moderation_status: "cancelled",
        moderation_cancelled_at: new Date().toISOString(),
        moderation_updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.conversationId);
    await supabaseAdmin.from("messages").insert({
      conversation_id: data.conversationId,
      sender_id: context.userId,
      body: "O pedido de mediação foi cancelado. Uma nova mediação só pode ser aberta daqui a 3 horas.",
      kind: "system",
    });
    return { ok: true };
  });

/** A equipe aceita ou recusa o pedido de mediação. */
export const respondModeration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        conversationId: z.string().uuid(),
        decision: z.enum(["accept", "decline"]),
        note: z.string().trim().max(500).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!isStaff) throw new Error("Sem permissão.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const accepted = data.decision === "accept";
    const now = new Date().toISOString();

    if (accepted) {
      const { data: conversation, error: conversationError } = await supabaseAdmin
        .from("conversations")
        .select("buyer_id, seller_id, product_id, moderation_status")
        .eq("id", data.conversationId)
        .maybeSingle();
      if (conversationError) throw conversationError;
      if (!conversation) throw new Error("Conversa de mediação não encontrada.");
      if (conversation.moderation_status !== "requested") {
        throw new Error("Esta mediação já foi decidida e não pode ser contestada ou alterada.");
      }
      if (!conversation?.product_id) throw new Error("A mediação não está vinculada a um pedido.");

      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("buyer_id", conversation.buyer_id)
        .eq("seller_id", conversation.seller_id)
        .eq("product_id", conversation.product_id)
        .in("status", ["paid", "delivered", "disputed", "refunded"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (orderError) throw orderError;
      if (!order) throw new Error("Não foi encontrado um pedido pago para esta mediação.");
      if (order.status === "refunded") {
        return { ok: true, alreadyRefunded: true };
      }
      const { efiConfigured, refundEfiPix } = await import("@/lib/efi.server");
      if (!order.charge_id || !efiConfigured()) {
        throw new Error(
          "Não foi possível estornar: a integração de pagamentos não está configurada.",
        );
      }

      await refundEfiPix({ txid: order.charge_id, amountCents: order.amount_cents });

      const { data: seller } = await supabaseAdmin
        .from("profiles")
        .select("balance_cents")
        .eq("id", order.seller_id)
        .maybeSingle();
      const nextBalance = Math.max(0, (seller?.balance_cents ?? 0) - order.seller_amount_cents);
      const { error: balanceError } = await supabaseAdmin
        .from("profiles")
        .update({ balance_cents: nextBalance })
        .eq("id", order.seller_id);
      if (balanceError) throw balanceError;

      const { data: product } = await supabaseAdmin
        .from("products")
        .select("stock, sales_count, auto_delivery")
        .eq("id", order.product_id)
        .maybeSingle();
      if (order.delivered_content && product?.auto_delivery) {
        await supabaseAdmin
          .from("delivery_items")
          .update({ sold: false })
          .eq("product_id", order.product_id)
          .eq("content", order.delivered_content);
      }
      if (order.variant_id) {
        const { data: variant } = await supabaseAdmin
          .from("product_variants")
          .select("stock")
          .eq("id", order.variant_id)
          .maybeSingle();
        if (variant) {
          await supabaseAdmin
            .from("product_variants")
            .update({ stock: variant.stock + order.quantity })
            .eq("id", order.variant_id);
        }
      } else if (product?.auto_delivery) {
        await supabaseAdmin
          .from("products")
          .update({
            stock: (product.stock ?? 0) + order.quantity,
            sales_count: Math.max((product.sales_count ?? 0) - 1, 0),
          })
          .eq("id", order.product_id);
      } else if (product) {
        await supabaseAdmin
          .from("products")
          .update({ sales_count: Math.max((product.sales_count ?? 0) - 1, 0) })
          .eq("id", order.product_id);
      }

      const { error: orderUpdateError } = await supabaseAdmin
        .from("orders")
        .update({ status: "refunded", delivered_content: null })
        .eq("id", order.id)
        .neq("status", "refunded");
      if (orderUpdateError) throw orderUpdateError;
      await supabaseAdmin.from("order_events").insert({
        order_id: order.id,
        status: "refunded",
        label: "O banco aprovou o reembolso, já foi enviado aos titulares.",
      });
    }

    await supabaseAdmin
      .from("conversations")
      .update({
        moderation_requested: accepted,
        moderation_status: accepted ? "accepted" : "declined",
        moderation_note: data.note ?? null,
        moderator_id: accepted ? context.userId : null,
        moderation_updated_at: now,
        last_message_at: now,
      } as never)
      .eq("id", data.conversationId);

    await supabaseAdmin.from("messages").insert({
      conversation_id: data.conversationId,
      sender_id: context.userId,
      body: accepted
        ? `O banco aprovou o reembolso, que já foi enviado aos titulares. A venda foi cancelada e o estoque foi reabastecido. Este reembolso foi processado pela Efí Bank e não pode ser contestado ou recuperado pelo vendedor.${data.note ? ` ${data.note}` : ""}`
        : `A mediação foi recusada pela equipe.${data.note ? ` Motivo: ${data.note}` : ""}`,
      kind: "system",
    });
    return { ok: true };
  });

/** Devolve (criando se preciso) a conversa ligada a um pedido usado por "Ir para a entrega". */
export const orderConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ensureOrderConversation } = await import("@/lib/fulfillment.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, buyer_id, seller_id, product_id, status, delivered_content")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || (order.buyer_id !== context.userId && order.seller_id !== context.userId))
      throw new Error("Pedido não encontrado.");
    if (!order.buyer_id || !order.seller_id || !order.product_id)
      throw new Error("Este pedido não possui participantes suficientes para abrir uma conversa.");
    let conversationId: string | null = null;
    try {
      conversationId = await ensureOrderConversation(order.id);
    } catch (error) {
      console.error("[orderConversation] reparo da conversa falhou; usando fallback", error);
    }
    if (!conversationId && order.status !== "pending" && order.status !== "cancelled") {
      const { data: existing } = await supabaseAdmin
        .from("conversations")
        .select("id")
        .eq("buyer_id", order.buyer_id)
        .eq("seller_id", order.seller_id)
        .eq("product_id", order.product_id)
        .order("last_message_at", { ascending: false })
        .limit(1);
      conversationId = existing?.[0]?.id ?? null;
      if (!conversationId) {
        const { data: created, error: createError } = await supabaseAdmin
          .from("conversations")
          .insert({
            buyer_id: order.buyer_id,
            seller_id: order.seller_id,
            product_id: order.product_id,
            conversation_type: "marketplace",
          })
          .select("id")
          .single();
        if (createError) throw createError;
        conversationId = created.id;
      }
      const { data: orderMessage } = await supabaseAdmin
        .from("messages")
        .select("id")
        .eq("conversation_id", conversationId)
        .eq("kind", "order")
        .limit(1)
        .maybeSingle();
      if (!orderMessage) {
        await supabaseAdmin.from("messages").insert({
          conversation_id: conversationId,
          sender_id: order.seller_id,
          body: order.delivered_content
            ? `Pagamento confirmado ✅\nEntrega automática registrada:\n\n${order.delivered_content}`
            : "Pagamento confirmado ✅\nA entrega será enviada pelo chat. Fique atento às mensagens do vendedor.",
          kind: "order",
        });
      }
    }
    if (!conversationId)
      throw new Error(
        "A conversa só fica disponível após a confirmação do pagamento e da entrega.",
      );
    return { conversationId };
  });

/** Abre um canal privado de atendimento com um administrador ou moderador. */
export const supportConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: staffRows } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .in("role", ["admin", "moderator"])
      .order("created_at", { ascending: true })
      .limit(20);
    const staff = staffRows?.find((row) => row.user_id !== context.userId) ?? staffRows?.[0];
    if (!staff?.user_id) throw new Error("A equipe de atendimento ainda não está disponível.");

    const { data: existing } = await supabaseAdmin
      .from("conversations")
      .select("id")
      .eq("buyer_id", context.userId)
      .eq("seller_id", staff.user_id)
      .is("product_id", null)
      .eq("conversation_type", "support")
      .order("last_message_at", { ascending: false })
      .limit(1);
    if (existing?.[0]?.id) {
      const conversationId = existing[0].id;
      await supabaseAdmin
        .from("conversations")
        .update({ conversation_type: "support" })
        .eq("id", conversationId);
      const { data: firstMessage } = await supabaseAdmin
        .from("messages")
        .select("id")
        .eq("conversation_id", conversationId)
        .limit(1)
        .maybeSingle();
      if (!firstMessage) {
        await supabaseAdmin.from("messages").insert({
          conversation_id: conversationId,
          sender_id: staff.user_id,
          body: "Olá! Este é o canal oficial de atendimento da LynkoMarketplace. Como podemos ajudar?",
          kind: "system",
        });
        await supabaseAdmin
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      }
      return { conversationId };
    }

    const { data: created, error } = await supabaseAdmin
      .from("conversations")
      .insert({
        buyer_id: context.userId,
        seller_id: staff.user_id,
        product_id: null,
        conversation_type: "support",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const { error: messageError } = await supabaseAdmin.from("messages").insert({
      conversation_id: created.id,
      sender_id: staff.user_id,
      body: "Olá! Este é o canal oficial de atendimento da LynkoMarketplace. Como podemos ajudar?",
      kind: "system",
    });
    if (messageError) throw new Error(messageError.message);
    return { conversationId: created.id };
  });

/** Marca como lidas as mensagens recebidas pelo usuário na conversa aberta. */
export const markConversationRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ conversationId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: member } = await context.supabase.rpc("is_conversation_member", {
      _conversation_id: data.conversationId,
      _user_id: context.userId,
    });
    if (!member) throw new Error("Sem permissão para ler esta conversa.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", data.conversationId)
      .neq("sender_id", context.userId)
      .is("read_at", null);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------ Advertências ------------------------------ */

export const issueWarning = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        reason: z.string().trim().min(3).max(140),
        details: z.string().trim().max(1000).default(""),
        severity: z.enum(["low", "medium", "high"]).default("low"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!isStaff) throw new Error("Sem permissão.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("warnings").insert({
      user_id: data.userId,
      issued_by: context.userId,
      reason: data.reason,
      details: data.details,
      severity: data.severity,
    } as never);
    if (error) throw new Error(error.message);
    await supabaseAdmin.rpc("notify_user", {
      _user_id: data.userId,
      _kind: "report",
      _title: "Você recebeu uma advertência",
      _body: data.reason,
      _link: "/dashboard",
    } as never);
    return { ok: true };
  });

export const revokeWarning = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!isStaff) throw new Error("Sem permissão.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("warnings")
      .update({ active: false } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
