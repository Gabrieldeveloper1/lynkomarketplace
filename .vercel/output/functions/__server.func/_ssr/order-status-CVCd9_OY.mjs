//#region node_modules/.nitro/vite/services/ssr/assets/order-status-CVCd9_OY.js
var ORDER_STATUS_LABEL = {
	pending: "Aguardando pagamento",
	paid: "Pago",
	shipped: "Enviado",
	delivered: "Entregue",
	refunded: "Cancelado — dinheiro devolvido aos titulares.",
	cancelled: "Cancelado"
};
var ORDER_STATUS_CLASS = {
	pending: "bg-amber-500/15 text-amber-500",
	paid: "bg-primary/15 text-primary",
	shipped: "bg-sky-500/15 text-sky-500",
	delivered: "bg-emerald-500/15 text-emerald-500",
	refunded: "bg-muted text-muted-foreground",
	cancelled: "bg-destructive/15 text-destructive"
};
var ORDER_FLOW = [
	"pending",
	"paid",
	"shipped",
	"delivered"
];
function orderStepIndex(status) {
	const i = ORDER_FLOW.indexOf(status);
	if (i >= 0) return i;
	return 0;
}
function orderStatusLabel(status) {
	return ORDER_STATUS_LABEL[status] ?? status;
}
function orderStatusClass(status) {
	return ORDER_STATUS_CLASS[status] ?? "bg-muted text-muted-foreground";
}
//#endregion
export { orderStepIndex as a, orderStatusLabel as i, ORDER_STATUS_LABEL as n, orderStatusClass as r, ORDER_FLOW as t };
