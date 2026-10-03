// Server-only fulfillment: marks an order paid, delivers automatically and credits the seller.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Garante que todo pedido pago tenha uma conversa própria e que a entrega
 * fique registrada no histórico do chat. Também repara pedidos antigos que
 * foram marcados como entregues antes da mensagem ser criada.
 */
export async function ensureOrderConversation(orderId: string) {
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, buyer_id, seller_id, product_id, status, delivered_content")
    .eq("id", orderId)
    .maybeSingle();
  if (orderError) throw orderError;
  if (!order) return null;
  if (order.status === "pending" || order.status === "cancelled") return null;
  if (!order.buyer_id) return null;

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("title")
    .eq("id", order.product_id)
    .maybeSingle();

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("conversations")
    .select("id")
    .eq("buyer_id", order.buyer_id)
    .eq("seller_id", order.seller_id)
    .eq("product_id", order.product_id)
    .or("conversation_type.is.null,conversation_type.eq.marketplace")
    .order("last_message_at", { ascending: false })
    .limit(1);
  if (existingError) throw existingError;

  let conversationId = existing?.[0]?.id ?? null;
  if (conversationId) {
    await supabaseAdmin
      .from("conversations")
      .update({ conversation_type: "marketplace" })
      .eq("id", conversationId);
  }
  if (!conversationId) {
    const { data: created, error } = await supabaseAdmin
      .from("conversations")
      .insert({
        buyer_id: order.buyer_id,
        seller_id: order.seller_id,
        product_id: order.product_id,
        conversation_type: "marketplace",
      })
      .select("id")
      .single();
    if (error) throw error;
    conversationId = created.id;
  }

  const { data: deliveryMessage, error: messageLookupError } = await supabaseAdmin
    .from("messages")
    .select("id")
    .eq("conversation_id", conversationId)
    .eq("kind", "order")
    .limit(1)
    .maybeSingle();
  if (messageLookupError) throw messageLookupError;

  if (!deliveryMessage) {
    const title = product?.title ?? "produto";
    const body = order.delivered_content
      ? `Pagamento confirmado ✅\nEntrega automática de "${title}":\n\n${order.delivered_content}`
      : `Pagamento confirmado ✅\nA entrega de "${title}" será enviada pelo chat. Fique atento às mensagens do vendedor.`;
    const { error } = await supabaseAdmin.from("messages").insert({
      conversation_id: conversationId,
      sender_id: order.seller_id,
      body,
      kind: "order",
    });
    if (error) throw error;
  }

  await supabaseAdmin
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return conversationId;
}

export async function fulfillOrder(orderId: string) {
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw error;
  if (!order) return { ok: false, reason: "order_not_found" as const };
  if (order.status !== "pending") return { ok: true, alreadyProcessed: true, order };

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", order.product_id)
    .maybeSingle();

  let deliveredContent: string | null = null;

  if (product?.auto_delivery) {
    let query = supabaseAdmin
      .from("delivery_items")
      .select("*")
      .eq("product_id", product.id)
      .eq("sold", false);
    query = order.variant_id
      ? query.eq("variant_id", order.variant_id)
      : query.is("variant_id", null);

    const { data: item } = await query.limit(1).maybeSingle();
    if (item) {
      deliveredContent = item.content;
      await supabaseAdmin.from("delivery_items").update({ sold: true }).eq("id", item.id);
    }
  }

  // Só há entrega automática quando um item real foi reservado. Sem conteúdo,
  // o pedido permanece pago e a entrega precisa acontecer pelo chat.
  const autoDelivered = Boolean(product?.auto_delivery && deliveredContent);

  await supabaseAdmin
    .from("orders")
    .update({
      status: deliveredContent || autoDelivered ? "delivered" : "paid",
      delivered_content: deliveredContent,
      paid_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  const { data: seller } = await supabaseAdmin
    .from("profiles")
    .select("balance_cents")
    .eq("id", order.seller_id)
    .maybeSingle();

  await supabaseAdmin
    .from("profiles")
    .update({ balance_cents: (seller?.balance_cents ?? 0) + order.seller_amount_cents })
    .eq("id", order.seller_id);

  if (order.variant_id) {
    const { data: v } = await supabaseAdmin
      .from("product_variants")
      .select("stock")
      .eq("id", order.variant_id)
      .maybeSingle();
    if (v) {
      await supabaseAdmin
        .from("product_variants")
        .update({ stock: Math.max(v.stock - 1, 0) })
        .eq("id", order.variant_id);
    }
  }

  if (product) {
    const remaining =
      product.auto_delivery && !order.variant_id ? Math.max(product.stock - 1, 0) : product.stock;
    await supabaseAdmin
      .from("products")
      .update({ sales_count: product.sales_count + 1, stock: remaining })
      .eq("id", product.id);
  }

  let conversationId: string | null = null;
  try {
    conversationId = await ensureOrderConversation(order.id);
  } catch (error) {
    console.error("[fulfillment] não foi possível registrar a entrega no chat", error);
  }

  if (order.buyer_email) {
    try {
      const { deliveryEmail, sendTransactionalEmail } = await import("@/lib/email.server");
      await sendTransactionalEmail({
        to: order.buyer_email,
        subject: deliveredContent
          ? `Sua entrega chegou: ${product?.title ?? "seu produto"}`
          : `Pagamento confirmado: ${product?.title ?? "seu produto"}`,
        html: deliveryEmail({
          productTitle: product?.title ?? "seu produto",
          orderShortId: order.id.slice(0, 8),
          deliveredContent,
        }),
      });
    } catch (emailError) {
      console.error("[fulfillment] não foi possível enviar a entrega por e-mail", emailError);
    }
  }

  return { ok: true, delivered: Boolean(deliveredContent), conversationId };
}
