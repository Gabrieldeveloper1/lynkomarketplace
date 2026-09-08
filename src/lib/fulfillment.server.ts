// Server-only fulfillment: marks an order paid, delivers automatically and credits the seller.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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

  // Entrega automática: o pedido já entra como entregue (o comprador ainda pode pedir mediação).
  const autoDelivered = Boolean(product?.auto_delivery);

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

  // Abre (ou reaproveita) a conversa comprador x vendedor e envia a entrega como mensagem do vendedor
  let conversationId: string | null = null;
  try {
    const { data: existing } = await supabaseAdmin
      .from("conversations")
      .select("id")
      .eq("buyer_id", order.buyer_id)
      .eq("seller_id", order.seller_id)
      .maybeSingle();
    conversationId = existing?.id ?? null;
    if (!conversationId) {
      const { data: created } = await supabaseAdmin
        .from("conversations")
        .insert({
          buyer_id: order.buyer_id,
          seller_id: order.seller_id,
          product_id: order.product_id,
        })
        .select("id")
        .single();
      conversationId = created?.id ?? null;
    }

    if (conversationId) {
      const title = product?.title ?? "produto";
      const body = deliveredContent
        ? `Pagamento confirmado ✅\nEntrega automática do produto "${title}":\n\n${deliveredContent}`
        : `Pagamento confirmado ✅\nObrigado pela compra de "${title}"! Vou enviar a entrega por aqui.`;
      await supabaseAdmin.from("messages").insert({
        conversation_id: conversationId,
        sender_id: order.seller_id,
        body,
      });
      await supabaseAdmin
        .from("conversations")
        .update({ last_message_at: new Date().toISOString(), product_id: order.product_id })
        .eq("id", conversationId);
    }
  } catch {
    /* a entrega não pode falhar por causa do chat */
  }

  return { ok: true, delivered: Boolean(deliveredContent), conversationId };
}
