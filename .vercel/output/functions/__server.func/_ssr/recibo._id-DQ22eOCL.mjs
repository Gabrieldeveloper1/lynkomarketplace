import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { p as orderConversation, w as verifyPayment } from "./commerce.functions-BTItmHS8.mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $t as CircleCheck, Bt as ExternalLink, D as ShieldCheck, Gt as Copy, Jt as Clock, V as Receipt, W as Printer, Y as Package, dt as LoaderCircle, ht as LayoutDashboard, nt as MessageCircleQuestionMark } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as formatPrice, et as Button, g as protectionTier, n as Route$4, tt as useAuth, w as fetchOrder } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Separator } from "./separator-B3hsz7IR.mjs";
import { n as ORDER_STATUS_LABEL, r as orderStatusClass } from "./order-status-CVCd9_OY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recibo._id-DQ22eOCL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DATE = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit"
});
function ReciboPage() {
	const { id } = Route$4.useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [openingChat, setOpeningChat] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	const { data: order, isLoading } = useQuery({
		queryKey: ["order", id],
		queryFn: () => fetchOrder(id),
		refetchOnWindowFocus: true,
		refetchInterval: (q) => {
			const s = q.state.data?.status;
			return s && s !== "delivered" && s !== "cancelled" && s !== "refunded" ? 5e3 : false;
		}
	});
	const live = order?.status === "pending";
	(0, import_react.useEffect)(() => {
		if (!live) return;
		let stopped = false;
		const tick = async () => {
			try {
				const res = await verifyPayment({ data: { orderId: id } });
				if (!stopped && res.status !== "pending") {
					await queryClient.invalidateQueries({ queryKey: ["order", id] });
					toast.success("Pagamento confirmado!");
				}
			} catch {}
		};
		tick();
		const t = setInterval(() => void tick(), 8e3);
		return () => {
			stopped = true;
			clearInterval(t);
		};
	}, [
		live,
		id,
		queryClient
	]);
	(0, import_react.useEffect)(() => {
		const ch = supabase.channel(`order-${id}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "orders",
			filter: `id=eq.${id}`
		}, () => void queryClient.invalidateQueries({ queryKey: ["order", id] })).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [id, queryClient]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full rounded-3xl" })
	});
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Pedido não encontrado."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard",
				children: "Voltar ao painel"
			})
		})]
	});
	const product = order.product;
	const seller = order.seller;
	const tier = protectionTier(order.protection);
	const base = order.base_price_cents || order.amount_cents - order.protection_fee_cents;
	const paid = order.status !== "pending" && order.status !== "cancelled";
	const isSeller = user?.id === order.seller_id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `overflow-hidden rounded-3xl border p-6 text-center sm:p-8 ${paid ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-card"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `mx-auto grid h-16 w-16 place-items-center rounded-full ${paid ? "bg-emerald-500/15 text-emerald-500" : "bg-primary/10 text-primary"}`,
						children: paid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl",
						children: paid ? "Compra concluída!" : "Aguardando o seu pagamento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
						children: paid ? "O pagamento foi confirmado pela Efí Bank e a entrega ficou registrada no chat." : "Assim que o Pix for compensado, esta página atualiza sozinha e a entrega é liberada."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: orderStatusClass(order.status),
								children: ORDER_STATUS_LABEL[order.status] ?? order.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "gap-1 font-mono text-[11px]",
								children: ["#", order.id.slice(0, 8)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
									" ",
									DATE.format(new Date(order.paid_at ?? order.created_at))
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-accent sm:h-20 sm:w-20",
						children: product?.images?.[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.images[0],
							alt: product.title,
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-full place-items-center text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-display text-base font-bold",
								children: product?.title ?? "Produto"
							}),
							order.variant_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: order.variant_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 truncate text-xs text-muted-foreground",
								children: ["Vendedor: ", seller?.display_name || `@${seller?.username ?? ""}`]
							}),
							product?.slug && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/produto/$slug",
								params: { slug: product.slug },
								className: "mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline",
								children: ["Ver anúncio ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4 text-primary" }), " Resumo do pagamento"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "min-w-0 text-muted-foreground",
									children: "Produto"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "shrink-0",
									children: formatPrice(base)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "min-w-0 text-muted-foreground",
									children: tier.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "shrink-0 text-primary",
									children: ["+", formatPrice(order.protection_fee_cents)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4 text-base font-extrabold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-primary",
									children: formatPrice(order.amount_cents)
								})]
							}),
							isSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4 text-sm font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Você recebe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-emerald-500",
									children: formatPrice(order.seller_amount_cents)
								})]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-accent/50 p-3 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [
								"Pago por Pix via Efí Bank",
								order.charge_id ? ` · cobrança ${order.charge_id}` : "",
								". Em caso de mediação aprovada, o reembolso é solicitado automaticamente ao banco."
							]
						})]
					})
				]
			}),
			order.delivered_content && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Conteúdo entregue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-accent p-3 text-xs",
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), " Copiar conteúdo"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid gap-2 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "h-11 bg-gradient-primary text-primary-foreground",
						disabled: openingChat || !order,
						onClick: async () => {
							if (!order) return;
							setOpeningChat(true);
							try {
								const { conversationId } = await orderConversation({ data: { orderId: order.id } });
								navigate({
									to: "/mensagens",
									search: { c: conversationId }
								});
							} catch (error) {
								toast.error(error instanceof Error ? error.message : "Não foi possível abrir o chat do vendedor.");
							} finally {
								setOpeningChat(false);
							}
						},
						children: [
							openingChat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleQuestionMark, { className: "mr-2 h-4 w-4" }),
							" ",
							"Falar com o vendedor"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "h-11",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/pedido/$id",
							params: { id: order.id },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mr-2 h-4 w-4" }), " Acompanhar pedido"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						className: "h-11",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "mr-2 h-4 w-4" }), " Ir para o painel"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "h-11",
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 h-4 w-4" }), " Guardar recibo"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-center text-xs text-muted-foreground",
				children: [
					"Recebeu algo diferente do combinado?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/protecao",
						className: "text-primary hover:underline",
						children: "Veja como funciona a proteção"
					}),
					" ",
					"e abra a mediação pelo chat do pedido."
				]
			})
		]
	});
}
//#endregion
export { ReciboPage as component };
