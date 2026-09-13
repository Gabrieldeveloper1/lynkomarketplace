import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { p as orderConversation, w as verifyPayment } from "./commerce.functions-BTItmHS8.mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $t as CircleCheck, Bt as ExternalLink, D as ShieldCheck, Gt as Copy, Jt as Clock, R as RefreshCw, V as Receipt, Wt as CreditCard, Y as Package, tt as MessageCircle, yn as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as formatPrice, H as timeAgo, T as fetchOrderEvents, et as Button, g as protectionTier, r as Route$5, tt as useAuth, w as fetchOrder } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Separator } from "./separator-B3hsz7IR.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
import { a as orderStepIndex, n as ORDER_STATUS_LABEL, r as orderStatusClass } from "./order-status-CVCd9_OY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pedido._id-CssJpe8x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		key: "pending",
		label: "Aguardando pagamento",
		icon: CreditCard
	},
	{
		key: "paid",
		label: "Pagamento confirmado",
		icon: ShieldCheck
	},
	{
		key: "shipped",
		label: "Enviado",
		icon: Package
	},
	{
		key: "delivered",
		label: "Entregue",
		icon: CircleCheck
	}
];
var stepIndex = orderStepIndex;
var STATUS_LABEL = ORDER_STATUS_LABEL;
function PedidoPage() {
	const { id } = Route$5.useParams();
	const { user } = useAuth();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [localPayment, setLocalPayment] = (0, import_react.useState)(null);
	const [openingConversation, setOpeningConversation] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = sessionStorage.getItem(`efi-payment:${id}`);
			if (raw) setLocalPayment(JSON.parse(raw));
		} catch {
			setLocalPayment(null);
		}
	}, [id]);
	const { data: order, isLoading } = useQuery({
		queryKey: ["order", id],
		queryFn: () => fetchOrder(id),
		refetchInterval: (q) => q.state.data?.status === "pending" ? 1e4 : false
	});
	const { data: events = [] } = useQuery({
		queryKey: ["order-events", id],
		queryFn: () => fetchOrderEvents(id)
	});
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(`order-${id}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "orders",
			filter: `id=eq.${id}`
		}, () => {
			qc.invalidateQueries({ queryKey: ["order", id] });
			qc.invalidateQueries({ queryKey: ["order-events", id] });
		}).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "order_events",
			filter: `order_id=eq.${id}`
		}, () => void qc.invalidateQueries({ queryKey: ["order-events", id] })).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [id, qc]);
	(0, import_react.useEffect)(() => {
		if (order?.status !== "pending") return;
		const tick = async () => {
			try {
				if ((await verifyPayment({ data: { orderId: id } })).status !== "pending") {
					qc.invalidateQueries({ queryKey: ["order", id] });
					qc.invalidateQueries({ queryKey: ["order-events", id] });
					qc.invalidateQueries({ queryKey: ["conversations"] });
					toast.success("Pagamento confirmado!");
					navigate({
						to: "/recibo/$id",
						params: { id }
					});
				}
			} catch {}
		};
		tick();
		const t = setInterval(tick, 15e3);
		return () => clearInterval(t);
	}, [
		order?.status,
		id,
		qc,
		navigate
	]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-4xl px-4 py-8 sm:py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 w-full rounded-2xl" })
	});
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Pedido não encontrado."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard",
				children: "Voltar à dashboard"
			})
		})]
	});
	const product = order.product;
	const seller = order.seller;
	const isSeller = user?.id === order.seller_id;
	const tier = protectionTier(order.protection);
	const base = order.base_price_cents || order.amount_cents - order.protection_fee_cents;
	const platformFee = order.fee_cents - order.protection_fee_cents;
	const current = stepIndex(order.status);
	const live = order.status === "pending";
	const pixCode = order.pix_copy_paste ?? localPayment?.pix_copy_paste ?? null;
	const pixQrCode = order.pix_qrcode ?? localPayment?.pix_qrcode ?? null;
	const openDeliveryConversation = async () => {
		setOpeningConversation(true);
		try {
			const { conversationId } = await orderConversation({ data: { orderId: id } });
			await navigate({
				to: "/mensagens",
				search: { c: conversationId }
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível abrir a conversa da entrega.");
		} finally {
			setOpeningConversation(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dashboard",
				className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Dashboard"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl font-extrabold sm:text-3xl",
						children: ["Pedido #", order.id.slice(0, 8)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: orderStatusClass(order.status),
						children: [live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-current" }), STATUS_LABEL[order.status] ?? order.status]
					}),
					live && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3 animate-spin" }), " a atualizar em tempo real"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold uppercase tracking-wider text-muted-foreground",
						children: "Rastreamento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-5 grid gap-5 sm:grid-cols-4",
						children: STEPS.map((s, i) => {
							const done = i <= current;
							const Icon = s.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "relative flex items-start gap-3 sm:flex-col sm:items-center sm:text-center",
								children: [
									i < STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute left-4 top-9 h-[calc(100%+0.75rem)] w-0.5 sm:left-auto sm:top-4 sm:h-0.5 sm:w-full sm:translate-x-1/2 ${i < current ? "bg-primary" : "bg-border"}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-medium ${done ? "" : "text-muted-foreground"}`,
										children: s.label
									})
								]
							}, s.key);
						})
					}),
					events.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 space-y-2 border-t border-border pt-4",
						children: events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: STATUS_LABEL[e.status] ?? e.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", e.label] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto",
									children: timeAgo(e.created_at)
								})
							]
						}, e.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4 text-primary" }), " Recibo da taxa"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: ["Produto", order.variant_name ? ` · ${order.variant_name}` : ""]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(base) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: tier.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-primary",
										children: ["+", formatPrice(order.protection_fee_cents)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total pago" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: formatPrice(order.amount_cents)
									})]
								}),
								isSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Taxa da plataforma (8%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", formatPrice(platformFee)] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-sm font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Você recebe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-500",
											children: formatPrice(order.seller_amount_cents)
										})]
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-[11px] text-muted-foreground",
							children: [
								"Pagamento processado via Efí Bank ·",
								" ",
								order.charge_id ? `cobrança ${order.charge_id}` : "aguardando cobrança"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-accent",
								children: product?.images?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: product.images[0],
									alt: product.title,
									className: "h-full w-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-semibold",
										children: product?.title ?? "Produto"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Vendedor: @", seller?.username ?? ""]
									}),
									product?.slug && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/produto/$slug",
										params: { slug: product.slug },
										className: "mt-1 inline-flex items-center gap-1 text-xs text-primary",
										children: ["Ver anúncio ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
						order.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Assim que o pagamento for confirmado pelo Efí Bank, o estado atualiza-se aqui automaticamente."
							}), pixCode && !pixCode.startsWith("http") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-accent/40 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Pague com Pix"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 flex justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-xl bg-white p-3",
											children: pixQrCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: pixQrCode,
												alt: "QR Code Pix do pedido",
												className: "h-44 w-44"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
												value: pixCode,
												size: 176
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mb-1 text-xs font-semibold text-foreground",
											children: "Pix copia e cola"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "break-all rounded-lg bg-background p-2 text-[10px] text-muted-foreground",
											children: pixCode
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "mt-2 w-full gap-2 bg-gradient-primary text-primary-foreground",
										onClick: () => {
											navigator.clipboard.writeText(pixCode);
											toast.success("Código Pix copiado!");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), " Copiar Pix copia e cola"]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200",
								children: "O QR Code Pix ainda não foi gerado. Atualize a página ou tente gerar o pagamento novamente."
							})]
						}) : order.delivered_content ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Conteúdo entregue"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-xl bg-accent p-3 text-xs",
								children: order.delivered_content
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "mt-2 w-full gap-2",
								onClick: () => {
									navigator.clipboard.writeText(order.delivered_content);
									toast.success("Copiado!");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), " Copiar"]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Pagamento confirmado. O vendedor vai entregar em breve fale com ele nas mensagens se precisar."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "mt-4 w-full gap-2",
							disabled: openingConversation || order.status === "pending" || order.status === "cancelled",
							onClick: () => void openDeliveryConversation(),
							children: [openingConversation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), order.status === "pending" ? "Conversa disponível após o pagamento" : "Falar com o vendedor"]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { PedidoPage as component };
