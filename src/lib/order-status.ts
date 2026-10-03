// Estados de pedido partilhados entre painel e página do pedido.
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "refunded" | "cancelled";

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  refunded: "Cancelado — dinheiro devolvido aos titulares.",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-500",
  paid: "bg-primary/15 text-primary",
  shipped: "bg-sky-500/15 text-sky-500",
  delivered: "bg-emerald-500/15 text-emerald-500",
  refunded: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

export const ORDER_FLOW = ["pending", "paid", "shipped", "delivered"] as const;

export function orderStepIndex(status: string) {
  const i = (ORDER_FLOW as readonly string[]).indexOf(status);
  if (i >= 0) return i;
  return 0; // refunded/cancelled ficam fora do fluxo
}

export function orderStatusLabel(status: string) {
  return ORDER_STATUS_LABEL[status] ?? status;
}

export function orderStatusClass(status: string) {
  return ORDER_STATUS_CLASS[status] ?? "bg-muted text-muted-foreground";
}
