import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as syncMyOrders, f as markOrderShipped, h as requestWithdrawal, w as verifyPayment, x as submitAppeal } from "./commerce.functions-BTItmHS8.mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { n as CardContent, t as Card } from "./card-BXjpJ96D.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { B as ReceiptText, D as ShieldCheck, G as Plus, Jt as Clock, N as Search, Nt as Flame, O as ShieldAlert, Qt as CircleQuestionMark, R as RefreshCw, Rt as Eye, St as ImagePlus, T as ShoppingBag, Y as Package, _ as ThumbsDown, _n as ArrowUpRight, a as Wallet, an as Check, b as Store, cn as ChartColumn, dt as LoaderCircle, g as ThumbsUp, gt as Layers, h as Trash2, hn as BadgeCheck, ht as LayoutDashboard, m as TrendingUp, nn as ChevronRight, nt as MessageCircleQuestionMark, p as TriangleAlert, pn as Bell, q as Pencil, r as X, rn as ChevronLeft, s as User, t as Zap, w as SlidersHorizontal, xn as ArrowDownLeft, zt as EyeOff } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Input, B as formatPrice, C as fetchMyWarnings, H as timeAgo, Q as AvatarImage, R as uploadMedia, S as fetchMyReviews, V as slugify, X as Avatar, Z as AvatarFallback, et as Button, f as ADMIN_SUPPORT_DISCORD_URL, p as AdminBadge, tt as useAuth, v as fetchCategories } from "./router-BVA3mZO7.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as PageLoader } from "./loading-BKu-cbWF.mjs";
import { t as StarRating } from "./star-rating-Qt0Vbggm.mjs";
import { a as orderStepIndex, i as orderStatusLabel, r as orderStatusClass, t as ORDER_FLOW } from "./order-status-CVCd9_OY.mjs";
import { a as CartesianGrid, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-B3bYhCu-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dashboard_support_default = "/assets/dashboard-support-DXlgyxn8.jpg";
var SEVERITY = {
	low: {
		label: "Leve",
		emoji: "🟡",
		cls: "bg-primary/10 text-primary"
	},
	medium: {
		label: "Média",
		emoji: "🟠",
		cls: "bg-primary/15 text-primary"
	},
	high: {
		label: "Grave",
		emoji: "🔴",
		cls: "bg-destructive/15 text-destructive"
	}
};
function WarningsCard() {
	const { user } = useAuth();
	const { data = [], isLoading } = useQuery({
		queryKey: ["warnings", user?.id],
		queryFn: () => fetchMyWarnings(user.id),
		enabled: !!user
	});
	const active = data.filter((w) => w.active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${active.length ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`,
						children: active.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate text-base font-bold",
							children: "Advertências"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: isLoading ? "Verificando…" : active.length ? "Regularize para não perder a sua conta." : "Nenhuma advertência ativa. Continue assim! 🎉"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: active.length ? "destructive" : "secondary",
						className: "shrink-0",
						children: active.length
					})
				]
			}),
			active.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-3",
				children: active.map((w) => {
					const s = SEVERITY[w.severity] ?? SEVERITY.low;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-background/60 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.cls}`,
									children: [
										s.emoji,
										" ",
										s.label
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: new Date(w.created_at).toLocaleDateString("pt-BR")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-semibold",
								children: w.reason
							}),
							w.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: w.details
							})
						]
					}, w.id);
				})
			}),
			data.length > active.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [data.length - active.length, " advertência(s) já resolvida(s) pela equipe."]
			})
		]
	});
}
/** Gestão de variações de um anúncio (ex.: Netflix 1 dia / 2 dias / 3 dias). */
function VariantManager({ productId, autoDelivery, onChange }) {
	const { user } = useAuth();
	const [name, setName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [stock, setStock] = (0, import_react.useState)("0");
	const [keysFor, setKeysFor] = (0, import_react.useState)(null);
	const [keys, setKeys] = (0, import_react.useState)("");
	const { data: variants = [], refetch } = useQuery({
		queryKey: ["variants", productId],
		queryFn: async () => {
			const { data, error } = await supabase.from("product_variants").select("*").eq("product_id", productId).order("position");
			if (error) throw error;
			return data;
		}
	});
	const add = async () => {
		const cents = Math.round(Number(price.replace(",", ".")) * 100);
		if (!name.trim() || !Number.isFinite(cents) || cents <= 0) return toast.error("Indique nome e preço válidos.");
		const { error } = await supabase.from("product_variants").insert({
			product_id: productId,
			seller_id: user.id,
			name: name.trim(),
			price_cents: cents,
			stock: autoDelivery ? 0 : Number(stock) || 0,
			position: variants.length
		});
		if (error) return toast.error(error.message);
		setName("");
		setPrice("");
		setStock("0");
		toast.success("Variação criada.");
		refetch();
		onChange();
	};
	const remove = async (id) => {
		const { error } = await supabase.from("product_variants").delete().eq("id", id);
		if (error) return toast.error(error.message);
		refetch();
		onChange();
	};
	const addKeys = async (variantId) => {
		const lines = keys.split("\n").map((l) => l.trim()).filter(Boolean);
		if (!lines.length) return;
		const { error } = await supabase.from("delivery_items").insert(lines.map((content) => ({
			product_id: productId,
			variant_id: variantId,
			seller_id: user.id,
			content
		})));
		if (error) return toast.error(error.message);
		const { data: available } = await supabase.from("delivery_items").select("id").eq("variant_id", variantId).eq("sold", false);
		await supabase.from("product_variants").update({ stock: available?.length ?? lines.length }).eq("id", variantId);
		setKeys("");
		setKeysFor(null);
		toast.success(`${lines.length} itens adicionados.`);
		refetch();
		onChange();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 rounded-xl border border-border bg-background/60 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-primary" }), " Variações do anúncio"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [variants.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: v.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										formatPrice(v.price_cents),
										" · estoque ",
										v.stock
									]
								})]
							}),
							autoDelivery && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3 text-primary" }), " Auto"]
							}),
							autoDelivery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setKeysFor(keysFor === v.id ? null : v.id),
								children: "Estoque"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => remove(v.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
							})
						]
					}), keysFor === v.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Um item por linha (chaves, contas, links)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 4,
								value: keys,
								onChange: (e) => setKeys(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-fit",
								size: "sm",
								onClick: () => addKeys(v.id),
								children: "Adicionar ao estoque"
							})
						]
					})]
				}, v.id)), !variants.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Sem variações o anúncio é vendido com o preço e estoque principais."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-[1fr_8rem_7rem_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Ex.: Netflix 1 dia",
						value: name,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Preço 9,90",
						value: price,
						onChange: (e) => setPrice(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Estoque",
						value: stock,
						onChange: (e) => setStock(e.target.value),
						disabled: autoDelivery
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: add,
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Adicionar"]
					})
				]
			})
		]
	});
}
function StatementTab({ sales, withdrawals }) {
	const rows = [...sales.map((sale) => ({
		id: `sale-${sale.id}`,
		title: sale.product?.title ?? "Venda",
		amount: sale.seller_amount_cents,
		date: sale.created_at,
		status: sale.status,
		positive: true
	})), ...withdrawals.map((withdrawal) => ({
		id: `withdrawal-${withdrawal.id}`,
		title: "Saque",
		amount: withdrawal.amount_cents,
		date: withdrawal.created_at,
		status: withdrawal.status,
		positive: false
	}))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	const totalIn = sales.filter((s) => [
		"paid",
		"shipped",
		"delivered",
		"completed"
	].includes(s.status)).reduce((sum, s) => sum + s.seller_amount_cents, 0);
	const totalOut = withdrawals.filter((w) => w.status === "paid").reduce((sum, w) => sum + w.amount_cents, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Entradas confirmadas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-2xl font-extrabold text-emerald-500",
					children: formatPrice(totalIn)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Saques pagos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-2xl font-extrabold",
					children: formatPrice(totalOut)
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Extrato financeiro"
				})]
			}), !rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm text-muted-foreground",
				children: "Ainda não há movimentações."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-2",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border/60 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid h-8 w-8 shrink-0 place-items-center rounded-lg ${row.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"}`,
							children: row.positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: row.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: timeAgo(row.date)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: row.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `text-sm font-bold ${row.positive ? "text-emerald-500" : "text-foreground"}`,
							children: [row.positive ? "+" : "-", formatPrice(row.amount)]
						})
					]
				}, row.id))
			})]
		})]
	});
}
function MetricsTab({ sales, products }) {
	const paid = sales.filter((s) => [
		"paid",
		"shipped",
		"delivered",
		"completed"
	].includes(s.status));
	const chart = [...Array(7)].map((_, index) => {
		const date = /* @__PURE__ */ new Date();
		date.setDate(date.getDate() - (6 - index));
		const key = date.toISOString().slice(0, 10);
		return {
			label: date.toLocaleDateString("pt-BR", {
				day: "2-digit",
				month: "short"
			}).replace(".", ""),
			sales: paid.filter((s) => s.created_at.slice(0, 10) === key).length,
			revenue: paid.filter((s) => s.created_at.slice(0, 10) === key).reduce((sum, sale) => sum + sale.seller_amount_cents, 0)
		};
	});
	const best = [...products].sort((a, b) => b.sales_count - a.sales_count).slice(0, 5);
	const revenue = paid.reduce((sum, sale) => sum + sale.seller_amount_cents, 0);
	const average = paid.length ? Math.round(revenue / paid.length) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: "Métricas da sua loja"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Acompanhe faturamento, conversão e desempenho dos anúncios."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: "Últimos 7 dias"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Vendas confirmadas",
						value: String(paid.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Receita líquida",
						value: formatPrice(revenue)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Produtos publicados",
						value: String(products.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Ticket médio",
						value: formatPrice(average)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Desempenho no período"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Receita líquida e quantidade de vendas por dia."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "h-2 w-2 rounded-full bg-primary" }), " Receita"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "h-2 w-2 rounded-full bg-cyan-400" }), " Vendas"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 h-64 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: chart,
							margin: {
								top: 10,
								right: 8,
								left: 4,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 11 },
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									yAxisId: "revenue",
									tick: { fontSize: 10 },
									tickLine: false,
									axisLine: false,
									tickFormatter: (value) => `R$${(value / 100).toFixed(0)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									yAxisId: "sales",
									orientation: "right",
									hide: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (value, name) => [name === "revenue" ? formatPrice(Number(value)) : value, name === "revenue" ? "Receita" : "Vendas"],
									contentStyle: {
										borderRadius: 16,
										border: "1px solid hsl(var(--border))",
										background: "hsl(var(--card))"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									yAxisId: "revenue",
									type: "monotone",
									dataKey: "revenue",
									stroke: "hsl(var(--primary))",
									strokeWidth: 3,
									dot: {
										r: 3,
										fill: "hsl(var(--primary))"
									},
									activeDot: { r: 5 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									yAxisId: "sales",
									type: "monotone",
									dataKey: "sales",
									stroke: "#22d3ee",
									strokeWidth: 2,
									dot: false
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: "Produtos com melhor desempenho"
				}), best.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3",
					children: best.map((product, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary",
								children: index + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate text-sm",
								children: product.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [product.sales_count, " venda(s)"]
							})
						]
					}, product.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Publique produtos para ver seu desempenho."
				})]
			})
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-2xl font-extrabold",
			children: value
		})]
	});
}
function BanNotice() {
	const { profile } = useAuth();
	const [msg, setMsg] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	const send = async () => {
		if (msg.trim().length < 20) return toast.error("Explica a tua apelação com pelo menos 20 caracteres.");
		setBusy(true);
		try {
			await submitAppeal({ data: { message: msg.trim() } });
			setSent(true);
			toast.success("Apelação enviada. A equipe vai analisar.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao enviar.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 rounded-3xl border border-destructive/40 bg-destructive/5 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 text-lg font-bold text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" }), " Conta suspensa"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"Podes continuar a navegar e ver produtos, mas não podes comprar, vender, enviar mensagens nem abrir denúncias. Motivo:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: profile?.ban_reason || "Violação dos termos de uso."
					})
				]
			}),
			sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-xl border border-border bg-card p-4 text-sm",
				children: "Apelação em análise. Vais ser notificado assim que a equipe decidir."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "appeal",
						children: "Apelação (explica o que aconteceu)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "appeal",
						rows: 4,
						maxLength: 2e3,
						value: msg,
						onChange: (e) => setMsg(e.target.value),
						placeholder: "Descreve a tua versão dos fatos e porque a suspensão deve ser revista."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: busy,
						onClick: send,
						className: "w-fit bg-gradient-primary text-primary-foreground",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, " Enviar apelação"]
					})
				]
			})
		]
	});
}
function InfoCard({ icon, title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: [
			icon,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm font-bold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-relaxed text-muted-foreground",
				children: text
			})
		]
	});
}
function Dashboard() {
	const { user, profile, refreshProfile, isAdmin, loading: authLoading } = useAuth();
	useNavigate();
	const [tab, setTab] = (0, import_react.useState)("visao");
	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories
	});
	const myProducts = useQuery({
		queryKey: ["my-products", user?.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		},
		enabled: !!user
	});
	const purchases = useQuery({
		queryKey: ["purchases", user?.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*, product:products(title, slug, auto_delivery), seller:profiles!orders_seller_id_fkey(username)").eq("buyer_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		},
		enabled: !!user
	});
	const sales = useQuery({
		queryKey: ["sales", user?.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*, product:products(title, auto_delivery), buyer:profiles!orders_buyer_id_fkey(username)").eq("seller_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		},
		enabled: !!user
	});
	const withdrawals = useQuery({
		queryKey: ["withdrawals", user?.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("withdrawals").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		},
		enabled: !!user
	});
	const reviews = useQuery({
		queryKey: ["my-reviews", user?.id],
		queryFn: () => fetchMyReviews(user.id),
		enabled: !!user
	});
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const channel = supabase.channel(`withdrawals-${user.id}`).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "withdrawals",
			filter: `seller_id=eq.${user.id}`
		}, (payload) => {
			const next = payload.new;
			const prev = payload.old;
			if (next.status === prev?.status) return;
			const detail = next.reason || next.note || "";
			if (next.status === "paid") toast.success(`Saque aprovado e pago! ${detail}`);
			else if (next.status === "rejected") toast.error(`Saque recusado. ${detail}`);
			else toast.info(`Status do saque atualizado: ${next.status}`);
			withdrawals.refetch();
			refreshProfile();
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user?.id]);
	const paidSales = (sales.data ?? []).filter((o) => [
		"paid",
		"shipped",
		"delivered",
		"completed"
	].includes(o.status));
	const revenue = paidSales.reduce((sum, o) => sum + o.seller_amount_cents, 0);
	const pendingPurchases = (purchases.data ?? []).filter((o) => o.status === "pending").length;
	(0, import_react.useEffect)(() => {
		if (!user || pendingPurchases === 0) return;
		let stop = false;
		const run = async () => {
			try {
				const res = await syncMyOrders({ data: void 0 });
				if (!stop && res.updated > 0) {
					purchases.refetch();
					refreshProfile();
					toast.success("Pagamento confirmado e produto entregue automaticamente!");
				}
			} catch {}
		};
		run();
		const id = setInterval(run, 2e4);
		return () => {
			stop = true;
			clearInterval(id);
		};
	}, [user?.id, pendingPurchases]);
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageLoader, { label: "Preparando sua central de vendas…" });
	const NAV_GROUPS = [
		{
			group: "Visão geral",
			items: [{
				v: "visao",
				i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }),
				l: "Resumo"
			}]
		},
		{
			group: "Negociações",
			items: [
				{
					v: "compras",
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }),
					l: "Minhas compras"
				},
				{
					v: "vendas",
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
					l: "Minhas vendas"
				},
				{
					v: "anuncios",
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }),
					l: "Meus anúncios"
				},
				{
					v: "novo",
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
					l: "Publicar anúncio"
				}
			]
		},
		{
			group: "Financeiro",
			items: [
				{
					v: "carteira",
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
					l: "Carteira e saques"
				},
				{
					v: "extrato",
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "h-4 w-4" }),
					l: "Extrato"
				},
				{
					v: "metricas",
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }),
					l: "Métricas"
				}
			]
		},
		{
			group: "Conta",
			items: [{
				v: "perfil",
				i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }),
				l: "Perfil e loja"
			}]
		},
		{
			group: "Reputação",
			items: [{
				v: "avaliacoes",
				i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-4 w-4" }),
				l: "Minhas avaliações"
			}]
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-w-0 max-w-7xl overflow-x-hidden px-3 py-4 sm:px-4 sm:py-8",
		children: [profile?.banned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BanNotice, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: tab,
			onValueChange: setTab,
			className: "grid min-w-0 gap-4 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-6 lg:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "min-w-0 lg:sticky lg:top-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-0 overflow-hidden rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "h-11 w-11 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: profile?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: (profile?.username ?? "U").slice(0, 2).toUpperCase() })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex min-w-0 items-center gap-1.5 text-sm font-bold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate",
										children: ["Olá, ", profile?.display_name || profile?.username]
									}),
									profile?.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4 shrink-0 text-primary" }),
									isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminBadge, {})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: "Bem-vindo ao painel"
							})]
						})]
					}), profile?.username && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vendedor/$slug",
						params: { slug: profile.username },
						className: "mt-3 block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "relative z-10 w-full justify-start gap-2 bg-background/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }), " Ver meu perfil"]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex h-auto w-max min-w-full flex-row justify-start gap-1 rounded-2xl border border-border bg-card p-2 lg:w-full lg:flex-col lg:items-stretch lg:gap-0",
						children: [NAV_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "contents lg:block lg:w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hidden px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground lg:block",
								children: g.group
							}), g.items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: t.v,
								className: "shrink-0 gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium lg:w-full lg:justify-start data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:shadow-sm",
								children: [
									t.i,
									" ",
									t.l
								]
							}, t.v))]
						}, g.group)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "contents lg:block lg:w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "hidden px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground lg:block",
									children: "Atalhos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/notificacoes",
									className: "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), " Notificações"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/mensagens",
									search: { c: void 0 },
									className: "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleQuestionMark, { className: "h-4 w-4" }), " Mensagens"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/verificacao",
									className: "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), " Verificação"]
								})
							]
						})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				initial: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -6
					},
					transition: {
						duration: .18,
						ease: "easeOut"
					},
					className: "min-w-0 overflow-x-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "visao",
							className: "mt-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative overflow-hidden rounded-3xl border border-border bg-gradient-surface p-5 shadow-card sm:p-7",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl",
										"aria-hidden": true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: "gap-1 border-primary/30 text-primary",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-3 w-3" }), " Central do vendedor"]
												}), profile?.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													className: "gap-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Verificado"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
												className: "mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl",
												children: ["Olá, ", profile?.display_name || profile?.username]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 max-w-xl text-sm text-muted-foreground",
												children: "Acompanhe sua operação, cuide dos anúncios e transforme visitas em vendas com mais clareza."
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												onClick: () => setTab("novo"),
												className: "gap-2 bg-gradient-primary text-primary-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo anúncio"]
											}), profile?.username && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/vendedor/$slug",
												params: { slug: profile.username },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "outline",
													className: "gap-2 bg-background/70",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }), " Ver loja"]
												})
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-glow",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium opacity-80",
												children: "Saldo disponível"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex flex-wrap items-center justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-2xl font-extrabold",
													children: profile ? formatPrice(profile.balance_cents ?? 0) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-28 bg-primary-foreground/20" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setTab("carteira"),
													className: "rounded-lg bg-background/20 px-3 py-1.5 text-xs font-semibold text-primary-foreground backdrop-blur transition hover:bg-background/30",
													children: "Realizar saque"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-border bg-card p-5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-medium text-muted-foreground",
													children: "Receita das vendas pagas"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-2xl font-extrabold",
													children: sales.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-28" }) : formatPrice(revenue)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-[11px] text-muted-foreground",
													children: [
														paidSales.length,
														" venda",
														paidSales.length === 1 ? "" : "s",
														" paga",
														paidSales.length === 1 ? "" : "s",
														", já com as taxas descontadas"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-border bg-card p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium text-muted-foreground",
												children: "Saque pendente"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-2xl font-extrabold",
												children: withdrawals.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-28" }) : formatPrice(profile?.pending_cents ?? 0)
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-warning" }),
											title: profile?.verified ? "Conta verificada" : "Conta não verificada",
											text: profile?.verified ? "Sua identidade foi confirmada. Você ganha mais confiança nas negociações." : "Complete dados e segurança para ganhar mais confiança nas negociações."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5 text-muted-foreground" }),
											title: "Prazos de entrega",
											text: "Acompanhe prazos combinados e evite conversas perdidas."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5 text-muted-foreground" }),
											title: "Alertas importantes",
											text: "Notificações de pagamento, entrega e suporte ficam centralizadas."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative overflow-hidden rounded-2xl border border-border bg-card bg-cover bg-center p-5",
										style: { backgroundImage: `url(${dashboard_support_default})` },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-display text-sm font-bold",
													children: "Suporte administrativo"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 max-w-[30ch] text-xs text-muted-foreground",
													children: "Tire dúvidas sobre a conta e o site diretamente com os administradores no Discord."
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													asChild: true,
													size: "sm",
													className: "mt-4 gap-2 bg-gradient-primary text-primary-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
														href: ADMIN_SUPPORT_DISCORD_URL,
														target: "_blank",
														rel: "noreferrer",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleQuestionMark, { className: "h-4 w-4" }), "Falar no Discord"]
													})
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative overflow-hidden rounded-2xl border border-border bg-card bg-cover bg-center p-5",
										style: { backgroundImage: `url(${dashboard_support_default})` },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-display text-sm font-bold",
													children: "Segurança garantida"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 max-w-[26ch] text-xs text-muted-foreground",
													children: "O pagamento permanece protegido até a confirmação da entrega."
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/protecao",
													className: "mt-4 inline-block",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														className: "gap-2 bg-gradient-primary text-primary-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" }), " Entender proteção"]
													})
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WarningsCard, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid gap-4 lg:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-card p-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-base font-bold",
											children: "Últimas vendas"
										}), (sales.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-sm text-muted-foreground",
											children: "Ainda sem vendas."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 grid gap-2",
											children: (sales.data ?? []).slice(0, 4).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/pedido/$id",
												params: { id: o.id },
												className: "flex items-center gap-3 rounded-xl border border-border/60 p-3 transition hover:border-primary/40",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "min-w-0 flex-1 truncate text-sm",
														children: o.product?.title ?? "Produto"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														className: orderStatusClass(o.status),
														children: orderStatusLabel(o.status)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-bold text-primary",
														children: formatPrice(o.seller_amount_cents)
													})
												]
											}, o.id))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-card p-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-base font-bold",
											children: "Últimas compras"
										}), (purchases.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-sm text-muted-foreground",
											children: "Você ainda não comprou nada."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 grid gap-2",
											children: (purchases.data ?? []).slice(0, 4).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/pedido/$id",
												params: { id: o.id },
												className: "flex items-center gap-3 rounded-xl border border-border/60 p-3 transition hover:border-primary/40",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "min-w-0 flex-1 truncate text-sm",
														children: o.product?.title ?? "Produto"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														className: orderStatusClass(o.status),
														children: orderStatusLabel(o.status)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-bold",
														children: formatPrice(o.amount_cents)
													})
												]
											}, o.id))
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "anuncios",
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyProducts, {
								products: myProducts.data ?? [],
								categories,
								onChange: () => myProducts.refetch()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "novo",
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewProduct, {
								categories,
								onCreated: () => {
									myProducts.refetch();
									toast.success("Anúncio publicado!");
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "compras",
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Purchases, {
								orders: purchases.data ?? [],
								onRefresh: () => purchases.refetch()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "vendas",
							className: "mt-0",
							children: (sales.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Ainda sem vendas."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3",
								children: (sales.data ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaleRow, {
									order: o,
									onRefresh: () => sales.refetch()
								}, o.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "carteira",
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletTab, {
								balance: profile?.balance_cents ?? 0,
								pixKey: profile?.pix_key ?? "",
								withdrawals: withdrawals.data ?? [],
								onDone: () => {
									refreshProfile();
									withdrawals.refetch();
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "extrato",
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatementTab, {
								sales: sales.data ?? [],
								withdrawals: withdrawals.data ?? []
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "metricas",
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricsTab, {
								sales: sales.data ?? [],
								products: myProducts.data ?? []
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "avaliacoes",
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyReviewsTab, {
								reviews: reviews.data ?? [],
								isLoading: reviews.isLoading
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "perfil",
							className: "mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileTab, { onSaved: () => void refreshProfile() })
						})
					]
				}, tab)
			})]
		})]
	});
}
function PurchaseDeliveryActions({ orderId, status }) {
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const unavailable = status === "pending" || status === "cancelled";
	const open = async (withModeration) => {
		setBusy(withModeration ? "mod" : "chat");
		try {
			const { orderConversation, requestModeration } = await import("./commerce.functions-BTItmHS8.mjs").then((n) => n.n).then((n) => n.n);
			const { conversationId } = await orderConversation({ data: { orderId } });
			if (withModeration) {
				const reason = window.prompt("Explique o motivo da mediação (mínimo de 10 caracteres):")?.trim();
				if (!reason) return;
				if (reason.length < 10) {
					toast.error("Informe um motivo com pelo menos 10 caracteres.");
					return;
				}
				await requestModeration({ data: {
					conversationId,
					reason
				} });
				toast.success("Mediação solicitada. A equipe entrará na conversa.");
			}
			navigate({
				to: "/mensagens",
				search: { c: conversationId }
			});
		} catch (e) {
			console.error("[compra] abrir entrega/mediação falhou", e);
			toast.error(e instanceof Error ? e.message : "Não foi possível abrir a conversa da entrega.");
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		size: "sm",
		variant: "outline",
		disabled: unavailable || busy === "chat",
		onClick: () => open(false),
		children: [busy === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), status === "delivered" ? "Falar com o vendedor" : "Ir para a entrega"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		size: "sm",
		variant: "ghost",
		disabled: unavailable || busy === "mod",
		onClick: () => open(true),
		children: [busy === "mod" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), unavailable ? "Disponível após pagamento" : "Pedir mediação"]
	})] });
}
function SaleRow({ order: o, onRefresh }) {
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const auto = !!o.product?.auto_delivery;
	const goToDelivery = async () => {
		setBusy("chat");
		try {
			const { orderConversation } = await import("./commerce.functions-BTItmHS8.mjs").then((n) => n.n).then((n) => n.n);
			const { conversationId } = await orderConversation({ data: { orderId: o.id } });
			navigate({
				to: "/mensagens",
				search: { c: conversationId }
			});
		} catch (e) {
			console.error("[venda] abrir entrega falhou", e);
			toast.error(e instanceof Error ? e.message : "Não foi possível abrir a entrega.");
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-medium",
					children: o.product?.title ?? "Produto"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Comprador @",
						o.buyer?.username,
						" · ",
						timeAgo(o.created_at),
						auto ? " · entrega automática" : ""
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: orderStatusClass(o.status),
				children: orderStatusLabel(o.status)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-bold text-primary",
				children: formatPrice(o.seller_amount_cents)
			}),
			o.status === "paid" && !auto && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				disabled: busy === "ship",
				onClick: async () => {
					setBusy("ship");
					try {
						await markOrderShipped({ data: { orderId: o.id } });
						toast.success("Pedido marcado como enviado.");
						onRefresh();
					} catch (e) {
						console.error("[venda] marcar enviado falhou", e);
						toast.error(e instanceof Error ? e.message : "Não foi possível marcar como enviado.");
					} finally {
						setBusy(null);
					}
				},
				children: [busy === "ship" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Marcar como enviado"]
			}),
			o.status !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				disabled: busy === "chat",
				onClick: goToDelivery,
				children: [busy === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Ir para a entrega"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				variant: "ghost",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/pedido/$id",
					params: { id: o.id },
					children: "Ver pedido"
				})
			})
		]
	});
}
function MyProducts({ products, categories, onChange }) {
	const [stockFor, setStockFor] = (0, import_react.useState)(null);
	const [editFor, setEditFor] = (0, import_react.useState)(null);
	const [variantsFor, setVariantsFor] = (0, import_react.useState)(null);
	const [keys, setKeys] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("recent");
	const { user } = useAuth();
	const visibleProducts = [...products].filter((p) => {
		const term = search.trim().toLowerCase();
		return (!term || p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term)) && (statusFilter === "all" || p.status === statusFilter);
	}).sort((a, b) => {
		if (sort === "price") return b.price_cents - a.price_cents;
		if (sort === "sales") return (b.sales_count ?? 0) - (a.sales_count ?? 0);
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	});
	if (!products.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-10 w-10 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-xl font-bold",
				children: "Sua vitrine começa aqui"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
				children: "Você ainda não publicou anúncios. Crie seu primeiro produto com imagens, preço e entrega bem definidos."
			})
		]
	});
	const addKeys = async (productId) => {
		const lines = keys.split("\n").map((l) => l.trim()).filter(Boolean);
		if (!lines.length) return;
		const { error } = await supabase.from("delivery_items").insert(lines.map((content) => ({
			product_id: productId,
			seller_id: user.id,
			content
		})));
		if (error) return toast.error(error.message);
		const { data: countData } = await supabase.from("delivery_items").select("id", { count: "exact" }).eq("product_id", productId).eq("sold", false);
		const { error: stockError } = await supabase.from("products").update({ stock: countData?.length ?? lines.length }).eq("id", productId);
		if (stockError) return toast.error(stockError.message);
		setKeys("");
		setStockFor(null);
		toast.success(`${lines.length} itens adicionados ao estoque.`);
		onChange();
	};
	const activeCount = products.filter((p) => p.status === "active").length;
	const pausedCount = products.filter((p) => p.status === "paused").length;
	const archivedCount = products.filter((p) => p.status === "archived").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Total de anúncios"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-extrabold",
							children: products.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Ativos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-extrabold text-emerald-500",
							children: activeCount
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Pausados"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-extrabold text-amber-500",
							children: pausedCount
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Arquivados"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-extrabold",
							children: archivedCount
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar por título ou slug",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: statusFilter,
							onValueChange: (v) => setStatusFilter(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[140px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Todos os status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "active",
									children: "Ativos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "paused",
									children: "Pausados"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "archived",
									children: "Arquivados"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: sort,
							onValueChange: (v) => setSort(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[140px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "recent",
									children: "Mais recentes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "sales",
									children: "Mais vendidos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "price",
									children: "Maior preço"
								})
							] })]
						})
					]
				})]
			}),
			visibleProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground",
				children: "Nenhum anúncio corresponde aos filtros."
			}) : visibleProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-accent",
								children: p.images?.[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.images[0],
									alt: "",
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-5 w-5 text-muted-foreground" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: p.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										formatPrice(p.price_cents),
										" · estoque ",
										p.stock,
										" · ",
										p.sales_count ?? 0,
										" vendas"
									]
								})]
							}),
							p.promoted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "gap-1 bg-gradient-primary text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3 w-3" }), " Destaque"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: p.status === "active" ? "border-emerald-500/30 text-emerald-500" : "text-muted-foreground",
								children: p.status === "active" ? "Publicado" : p.status === "paused" ? "Pausado" : "Arquivado"
							}),
							p.auto_delivery && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setStockFor(stockFor === p.id ? null : p.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mr-2 h-4 w-4" }), " Estoque automático"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setVariantsFor(variantsFor === p.id ? null : p.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "mr-2 h-4 w-4" }), " Variações"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: async () => {
									const { error } = await supabase.from("products").update({ promoted: !p.promoted }).eq("id", p.id);
									if (error) return toast.error(error.message);
									toast.success(p.promoted ? "Destaque removido." : "Anúncio destacado no topo!");
									onChange();
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "mr-2 h-4 w-4" }),
									" ",
									p.promoted ? "Remover destaque" : "Destacar"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setEditFor(editFor === p.id ? null : p.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Editar"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: async () => {
									const next = p.status === "active" ? "paused" : "active";
									const { error } = await supabase.from("products").update({ status: next }).eq("id", p.id);
									if (error) return toast.error(error.message);
									toast.success(next === "active" ? "Anúncio reativado." : "Anúncio pausado.");
									onChange();
								},
								children: [p.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), p.status === "active" ? "Pausar" : "Reativar"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Remover anúncio",
								onClick: async () => {
									if (!window.confirm(`Remover definitivamente "${p.title}"? Esta ação não pode ser desfeita.`)) return;
									const { error } = await supabase.from("products").delete().eq("id", p.id);
									if (error) {
										await supabase.from("products").update({ status: "archived" }).eq("id", p.id);
										toast.success("Anúncio arquivado (tinha vendas associadas).");
									} else toast.success("Anúncio removido.");
									onChange();
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
							})
						]
					}),
					editFor === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditProduct, {
						product: p,
						categories,
						onDone: () => {
							setEditFor(null);
							onChange();
						}
					}),
					variantsFor === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantManager, {
						productId: p.id,
						autoDelivery: p.auto_delivery,
						onChange
					}),
					stockFor === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `keys-${p.id}`,
								children: "Um item por linha (chaves, contas, links)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: `keys-${p.id}`,
								rows: 5,
								value: keys,
								onChange: (e) => setKeys(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-fit",
								onClick: () => addKeys(p.id),
								children: "Adicionar ao estoque"
							})
						]
					})
				]
			}, p.id))
		]
	});
}
function EditProduct({ product, categories, onDone }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [category, setCategory] = (0, import_react.useState)(product.category_slug ?? categories[0]?.slug ?? "");
	const [auto, setAuto] = (0, import_react.useState)(product.auto_delivery);
	const save = async (e) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const priceCents = Math.round(Number(String(form.get("price")).replace(",", ".")) * 100);
		if (!priceCents || priceCents < 100) return toast.error("Preço mínimo R$ 1,00.");
		setBusy(true);
		const { error } = await supabase.from("products").update({
			title: String(form.get("title")),
			description: String(form.get("description") ?? ""),
			price_cents: priceCents,
			category_slug: category,
			auto_delivery: auto
		}).eq("id", product.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Anúncio atualizado.");
		onDone();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: save,
		className: "mt-4 grid gap-4 rounded-2xl border border-border bg-background p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: `e-title-${product.id}`,
					children: "Título"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: `e-title-${product.id}`,
					name: "title",
					defaultValue: product.title,
					required: true,
					maxLength: 120
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `e-desc-${product.id}`,
						children: "Descrição"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: `e-desc-${product.id}`,
						name: "description",
						rows: 4,
						maxLength: 4e3,
						defaultValue: product.description ?? ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: "Você pode usar Markdown na descrição: **negrito**, *itálico*, listas, links, código e tabelas."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `e-price-${product.id}`,
						children: "Preço (R$)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `e-price-${product.id}`,
						name: "price",
						inputMode: "decimal",
						defaultValue: (product.price_cents / 100).toFixed(2).replace(".", ",")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoria" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onValueChange: setCategory,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Escolher" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.slug,
							children: c.name
						}, c.slug)) })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl border border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
					htmlFor: `e-auto-${product.id}`,
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-primary" }), " Entrega automática"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					id: `e-auto-${product.id}`,
					checked: auto,
					onCheckedChange: setAuto
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					disabled: busy,
					className: "bg-gradient-primary text-primary-foreground",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, " Guardar alterações"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onDone,
					children: "Cancelar"
				})]
			})
		]
	});
}
function NewProduct({ categories, onCreated }) {
	const { user } = useAuth();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)(1);
	const [auto, setAuto] = (0, import_react.useState)(true);
	const [category, setCategory] = (0, import_react.useState)(categories[0]?.slug ?? "");
	const [images, setImages] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [deliveryNote, setDeliveryNote] = (0, import_react.useState)("");
	const steps = [
		{
			title: "Informações",
			description: "Nome e descrição"
		},
		{
			title: "Preço e categoria",
			description: "Posicionamento do anúncio"
		},
		{
			title: "Entrega e mídia",
			description: "Como o cliente recebe"
		},
		{
			title: "Revisão",
			description: "Confira antes de publicar"
		}
	];
	const nextStep = () => {
		if (step === 1 && title.trim().length < 4) return toast.error("Informe um título com pelo menos 4 caracteres.");
		if (step === 2) {
			const cents = Math.round(Number(price.replace(",", ".")) * 100);
			if (!cents || cents < 100) return toast.error("Informe um preço mínimo de R$ 1,00.");
			if (!category) return toast.error("Escolha uma categoria.");
		}
		setStep((current) => Math.min(4, current + 1));
	};
	const submit = async (e) => {
		e.preventDefault();
		const priceCents = Math.round(Number(price.replace(",", ".")) * 100);
		if (!priceCents || priceCents < 100) return toast.error("Preço mínimo R$ 1,00.");
		if (!category) return toast.error("Escolha uma categoria.");
		if (title.trim().length < 4) return toast.error("Informe um título válido.");
		setBusy(true);
		const { error } = await supabase.from("products").insert({
			seller_id: user.id,
			title: title.trim(),
			slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`,
			description: `${description.trim()}${deliveryNote.trim() ? `\n\n### Informações de entrega\n${deliveryNote.trim()}` : ""}`,
			price_cents: priceCents,
			category_slug: category,
			auto_delivery: auto,
			images,
			stock: auto ? 0 : 1
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		setImages([]);
		setTitle("");
		setDescription("");
		setPrice("");
		setDeliveryNote("");
		setStep(1);
		toast.success("Anúncio publicado com sucesso!");
		onCreated();
	};
	const upload = async (files) => {
		if (!files?.length || !user) return;
		try {
			const remaining = Math.max(0, 5 - images.length);
			const urls = await Promise.all(Array.from(files).slice(0, remaining).map((f) => uploadMedia(user.id, f)));
			setImages((prev) => [...prev, ...urls]);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Falha no upload.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "max-w-3xl rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-7 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-primary",
						children: "Novo anúncio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-2xl font-extrabold",
						children: "Monte uma vitrine que converte"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted-foreground",
						children: "Preencha cada etapa com calma. Um anúncio claro reduz dúvidas e aumenta a confiança do comprador."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden rounded-2xl bg-primary/10 p-3 text-primary sm:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: steps.map((item, index) => {
					const number = index + 1;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center gap-2 border-b-2 pb-3 ${number <= step ? "border-primary" : "border-border"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${number <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
								children: number < step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : number
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden min-w-0 sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs font-semibold",
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-[10px] text-muted-foreground",
									children: item.description
								})]
							})]
						})
					}, item.title);
				})
			}),
			step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "p-title",
							children: "Título do anúncio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "p-title",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							required: true,
							maxLength: 120,
							placeholder: "Ex.: Conta premium com acesso imediato"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: [
								"Seja específico e destaque o principal benefício. ",
								title.length,
								"/120"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "p-desc",
							children: "Descrição completa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "p-desc",
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 8,
							maxLength: 4e3,
							placeholder: "Explique exatamente o que será entregue, condições, limitações e suporte..."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: [
								"Use Markdown para organizar títulos, listas e informações importantes.",
								" ",
								description.length,
								"/4000"
							]
						})
					]
				})]
			}),
			step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "p-price",
								children: "Preço de venda (R$)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "p-price",
								value: price,
								onChange: (e) => setPrice(e.target.value),
								required: true,
								inputMode: "decimal",
								placeholder: "49,90"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Taxa da plataforma: ",
									Math.round(8),
									"% por venda."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoria" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: category,
							onValueChange: setCategory,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Escolha onde seu anúncio será encontrado" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c.slug,
								children: c.name
							}, c.slug)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Dica de posicionamento"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted-foreground",
							children: "Escolha a categoria mais específica e mantenha o título alinhado ao que o comprador procura."
						})]
					})
				]
			}),
			step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-2xl border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: "p-auto",
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-primary" }), " Entrega automática"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "O produto será liberado automaticamente após o pagamento confirmado."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							id: "p-auto",
							checked: auto,
							onCheckedChange: setAuto
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "p-delivery",
							children: "Orientações de entrega"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "p-delivery",
							value: deliveryNote,
							onChange: (e) => setDeliveryNote(e.target.value),
							rows: 4,
							maxLength: 1200,
							placeholder: auto ? "Explique o formato, prazo e suporte após a entrega automática..." : "Explique o prazo, formato e condições da entrega manual..."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "p-img",
								children: "Imagens do produto (até 5)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "p-img",
								type: "file",
								accept: "image/*",
								multiple: true,
								onChange: (e) => upload(e.target.files)
							}),
							images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2 pt-2 sm:grid-cols-5",
								children: images.map((img, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative aspect-video overflow-hidden rounded-xl border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img,
										alt: `Imagem ${index + 1}`,
										className: "h-full w-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Remover imagem",
										onClick: () => setImages((prev) => prev.filter((item) => item !== img)),
										className: "absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition group-hover:opacity-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})]
								}, img))
							})
						]
					})
				]
			}),
			step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-background p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-muted-foreground",
							children: "Título"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-bold",
							children: title || "Ainda não informado"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-background p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Preço"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-bold text-primary",
								children: price ? `R$ ${price}` : "Ainda não informado"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-background p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Entrega"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-bold",
								children: auto ? "Automática" : "Manual"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-background p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-muted-foreground",
							children: "Descrição"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-wrap text-sm text-muted-foreground",
							children: description || "Nenhuma descrição informada."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "mt-0.5 h-4 w-4 shrink-0 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Depois de publicar, você poderá editar, pausar, destacar, abastecer o estoque e administrar variações em “Meus anúncios”." })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					disabled: step === 1 || busy,
					onClick: () => setStep((current) => Math.max(1, current - 1)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-1 h-4 w-4" }), " Voltar"]
				}), step < 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					onClick: nextStep,
					children: ["Continuar ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-1 h-4 w-4" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					disabled: busy,
					className: "gap-2 bg-gradient-primary text-primary-foreground",
					children: [
						busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
						" ",
						"Publicar anúncio"
					]
				})]
			})
		]
	});
}
function Purchases({ orders, onRefresh }) {
	const { user } = useAuth();
	const [checking, setChecking] = (0, import_react.useState)(null);
	const myReviews = useQuery({
		queryKey: ["my-reviews", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("reviews").select("id, order_id, rating, positive, comment").eq("buyer_id", user.id);
			if (error) throw error;
			return data ?? [];
		}
	});
	const reviewByOrder = Object.fromEntries((myReviews.data ?? []).map((r) => [r.order_id, r]));
	if (!orders.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Ainda sem compras."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Os estados são confirmados automaticamente junto do Efí Bank."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				disabled: checking === "all",
				onClick: async () => {
					setChecking("all");
					try {
						const res = await syncMyOrders({ data: void 0 });
						toast.success(res.updated > 0 ? `${res.updated} pedido(s) atualizado(s) pelo Efí.` : "Nenhuma alteração encontrada no Efí.");
						onRefresh();
					} catch (e) {
						toast.error(e instanceof Error ? e.message : "Erro ao atualizar.");
					} finally {
						setChecking(null);
					}
				},
				children: [checking === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Atualizar estados pelo Efí"]
			})]
		}), orders.map((o) => {
			const step = orderStepIndex(o.status);
			const closed = o.status === "cancelled" || o.status === "refunded";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: o.product?.title ?? "Produto"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"#",
										o.id.slice(0, 8),
										" · ",
										timeAgo(o.created_at)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: orderStatusClass(o.status),
								children: orderStatusLabel(o.status)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-primary",
								children: formatPrice(o.amount_cents)
							})
						]
					}),
					!closed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 grid grid-cols-2 gap-1 sm:grid-cols-4",
						children: ORDER_FLOW.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-border"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] ${i <= step ? "text-foreground" : "text-muted-foreground"}`,
								children: orderStatusLabel(s)
							})]
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							o.status === "pending" && o.pix_copy_paste && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: o.pix_copy_paste,
								target: "_blank",
								rel: "noopener noreferrer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "bg-gradient-primary text-primary-foreground",
									children: "Pagar agora"
								})
							}),
							o.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: checking === o.id,
								onClick: async () => {
									setChecking(o.id);
									try {
										const res = await verifyPayment({ data: { orderId: o.id } });
										if (res.status === "pending") toast.info(`Ainda sem pagamento confirmado${res.efiStatus ? ` (Efí: ${res.efiStatus})` : ""}.`);
										else toast.success(`Estado atualizado: ${orderStatusLabel(res.status)}`);
										onRefresh();
									} catch (e) {
										toast.error(e instanceof Error ? e.message : "Erro.");
									} finally {
										setChecking(null);
									}
								},
								children: [checking === o.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Verificar pagamento"]
							}),
							o.status !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PurchaseDeliveryActions, {
								orderId: o.id,
								status: o.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "ghost",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/pedido/$id",
									params: { id: o.id },
									children: "Ver pedido"
								})
							})
						]
					}),
					o.delivered_content && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-accent p-3 text-xs",
						children: o.delivered_content
					}),
					o.status !== "pending" && !closed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewBox, {
						order: o,
						existing: reviewByOrder[o.id],
						onSaved: () => myReviews.refetch()
					})
				]
			}, o.id);
		})]
	});
}
function ReviewBox({ order, existing, onSaved }) {
	const { user } = useAuth();
	const [stars, setStars] = (0, import_react.useState)(existing?.rating ?? 0);
	const [comment, setComment] = (0, import_react.useState)(existing?.comment ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	if (existing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-xl border border-border bg-accent/40 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Sua avaliação"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRating, { value: existing.rating ?? (existing.positive ? 5 : 1) }),
				existing.positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-4 w-4 text-destructive" })
			]
		}), existing.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: existing.comment
		})]
	});
	const submit = async () => {
		if (!stars) return toast.error("Escolha de 1 a 5 estrelas.");
		setSaving(true);
		const { error } = await supabase.from("reviews").insert({
			order_id: order.id,
			buyer_id: user.id,
			seller_id: order.seller_id,
			product_id: order.product_id,
			positive: stars >= 3,
			rating: stars,
			comment: comment.trim()
		});
		setSaving(false);
		if (error) {
			if (error.code === "23505" || error.message.includes("reviews_order_id_key")) {
				toast.info("Esta compra já foi avaliada.");
				onSaved();
				return;
			}
			return toast.error(error.message);
		}
		toast.success("Avaliação enviada. Obrigado!");
		onSaved();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-xl border border-border bg-accent/30 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "Avalie esta compra"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRating, {
					value: stars,
					onChange: setStars,
					size: "md"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: stars ? `${stars} de 5` : "Selecione as estrelas"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: comment,
				onChange: (e) => setComment(e.target.value),
				placeholder: "Conte o que achou do produto e do atendimento do vendedor.",
				rows: 3,
				className: "mt-3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "mt-3 bg-gradient-primary text-primary-foreground",
				disabled: saving,
				onClick: submit,
				children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, " Enviar avaliação"]
			})
		]
	});
}
function WalletTab({ balance, pixKey, withdrawals, onDone }) {
	const { profile } = useAuth();
	const verified = !!profile?.verified;
	const [amount, setAmount] = (0, import_react.useState)("");
	const [pix, setPix] = (0, import_react.useState)(pixKey);
	const submit = useMutation({
		mutationFn: async () => {
			const cents = Math.round(Number(amount.replace(",", ".")) * 100);
			return requestWithdrawal({ data: {
				amountCents: cents,
				pixKey: pix.trim()
			} });
		},
		onSuccess: () => {
			toast.success("Pedido de saque enviado! A equipe analisa e aprova manualmente.");
			setAmount("");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "flex items-center gap-2 font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary" }), " Solicitar saque"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: ["Disponível: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-primary",
						children: formatPrice(balance)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Não há valor mínimo para sacar. A taxa da plataforma já é descontada automaticamente nas vendas. Todo saque passa por aprovação manual da equipe; se for recusado, o valor volta ao saldo."
				}),
				!verified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-amber-600 dark:text-amber-400",
							children: "🔒 Verifique a sua identidade para poder sacar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "O saque só é liberado após a verificação automática de identidade. Leva cerca de 2 minutos."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-3 w-fit bg-gradient-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/verificacao",
								children: "Verificar identidade"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "w-amount",
								children: "Valor (R$)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "w-amount",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								inputMode: "decimal",
								disabled: !verified
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "w-pix",
								children: "Chave Pix para receber"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "w-pix",
								value: pix,
								onChange: (e) => setPix(e.target.value),
								placeholder: "e-mail, CPF ou aleatória",
								disabled: !verified
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: submit.isPending || !verified,
							onClick: () => submit.mutate(),
							className: "w-fit bg-gradient-primary text-primary-foreground",
							children: "Pedir saque"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WithdrawalHistory, { withdrawals })]
	});
}
var WITHDRAWAL_FILTERS = [
	{
		key: "all",
		label: "Todos"
	},
	{
		key: "requested",
		label: "Aguardando"
	},
	{
		key: "paid",
		label: "Pagos"
	},
	{
		key: "rejected",
		label: "Recusados"
	}
];
function withdrawalLabel(status) {
	return status === "paid" ? "Aprovado e pago" : status === "rejected" ? "Recusado" : "Aguardando análise";
}
function WithdrawalAudit({ id }) {
	const events = useQuery({
		queryKey: ["withdrawal-events", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("withdrawal_events").select("*").eq("withdrawal_id", id).order("created_at", { ascending: true });
			if (error) throw error;
			return data;
		}
	});
	if (events.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-xs text-muted-foreground",
		children: "Carregando auditoria..."
	});
	if (!events.data?.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-xs text-muted-foreground",
		children: "Sem registros de auditoria."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "mt-3 grid gap-2 border-l border-border pl-3",
		children: events.data.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-medium",
					children: [
						withdrawalLabel(e.status),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-normal text-muted-foreground",
							children: [
								"· ",
								e.actor_role === "staff" ? "equipe" : "usuário",
								" · ",
								timeAgo(e.created_at)
							]
						})
					]
				}),
				e.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground",
					children: ["Motivo: ", e.reason]
				}),
				e.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: e.note
				}),
				e.evidence_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: e.evidence_url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "text-primary underline",
					children: "Ver evidência"
				})
			]
		}, e.id))
	});
}
function WithdrawalHistory({ withdrawals }) {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const list = withdrawals.filter((w) => {
		if (filter !== "all" && w.status !== filter) return false;
		const q = search.trim().toLowerCase();
		if (!q) return true;
		return w.pix_key.toLowerCase().includes(q) || (w.reason ?? "").toLowerCase().includes(q) || (w.note ?? "").toLowerCase().includes(q) || formatPrice(w.amount_cents).toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold",
				children: "Histórico de saques"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [WITHDRAWAL_FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: filter === f.key ? "default" : "outline",
					onClick: () => setFilter(f.key),
					children: f.label
				}, f.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Buscar por valor, Pix ou motivo",
					className: "h-9 w-full sm:w-56"
				})]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Nenhum saque nesse filtro."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-2",
				children: list.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: formatPrice(w.amount_cents)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Pix ",
										w.pix_key,
										" · ",
										timeAgo(w.created_at)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: w.status === "paid" ? "secondary" : w.status === "rejected" ? "destructive" : "outline",
								className: "shrink-0",
								children: withdrawalLabel(w.status)
							})]
						}),
						w.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: ["Motivo: ", w.reason]
						}),
						w.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: ["Resposta da equipe: ", w.note]
						}),
						w.evidence_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: w.evidence_url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "mt-1 inline-block text-xs text-primary underline",
							children: "Ver evidência"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpenId(openId === w.id ? null : w.id),
							className: "mt-2 text-xs font-medium text-primary",
							children: openId === w.id ? "Ocultar auditoria" : "Ver auditoria"
						}),
						openId === w.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WithdrawalAudit, { id: w.id })
					]
				}, w.id))
			})
		]
	});
}
var DEFAULT_USERNAME_RE = /^user_[0-9a-f]{8}$/;
function UsernameCard({ onSaved }) {
	const { profile, refreshProfile } = useAuth();
	const [value, setValue] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const locked = !!profile?.username && !DEFAULT_USERNAME_RE.test(profile.username);
	const submit = async (e) => {
		e.preventDefault();
		const username = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
		if (username.length < 3) return toast.error("Escolha um @ com pelo menos 3 caracteres.");
		setBusy(true);
		try {
			const { chooseMyUsername } = await import("../_libs/_.mjs").then((n) => n.n);
			await chooseMyUsername({ data: { username } });
			await refreshProfile();
			toast.success("@ definido! Agora ele é permanente.");
			onSaved();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Não foi possível definir o @.");
		} finally {
			setBusy(false);
		}
	};
	if (locked) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid max-w-2xl gap-1 rounded-2xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Seu @ (permanente)" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-lg font-semibold",
				children: ["@", profile?.username]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: "O nome de usuário é fixo e não pode ser alterado."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "grid max-w-2xl gap-2 rounded-2xl border border-primary/40 bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "pf-username",
				children: "Escolha o seu @"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "@"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "pf-username",
						value,
						onChange: (e) => setValue(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")),
						placeholder: profile?.username ?? "seunome",
						maxLength: 20
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						className: "bg-gradient-primary text-primary-foreground",
						children: "Definir"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: "É o endereço da sua loja (/vendedor/seunome). Só pode ser escolhido uma vez depois fica fixo."
			})
		]
	});
}
function MyReviewsTab({ reviews, isLoading }) {
	const positive = reviews.filter((review) => review.positive).length;
	const negative = reviews.filter((review) => !review.positive).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-border bg-gradient-hero p-5 sm:p-7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-between gap-4 sm:flex-row sm:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
							children: "Reputação"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl font-extrabold",
							children: "Minhas avaliações"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-xl text-sm text-muted-foreground",
							children: "Acompanhe o que os compradores dizem sobre suas entregas e use os comentários para melhorar sua loja."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-3xl font-extrabold",
						children: [reviews.length, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 text-sm font-medium text-muted-foreground",
							children: "avaliações"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewStat, {
						label: "Positivas",
						value: positive,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-4 w-4" }),
						className: "text-emerald-500"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewStat, {
						label: "Neutras",
						value: 0,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleQuestionMark, { className: "h-4 w-4" }),
						className: "text-muted-foreground"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewStat, {
						label: "Negativas",
						value: negative,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-4 w-4" }),
						className: "text-destructive"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border bg-card p-5 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold",
						children: "Feedback dos compradores"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "As avaliações aparecem depois que o pedido é concluído."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						children: [positive, " positivas"]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted-foreground",
					children: "Carregando avaliações…"
				}) : reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
					children: "Você ainda não recebeu avaliações. Conclua sua primeira venda para começar a construir sua reputação."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-3",
					children: reviews.map((review) => {
						const buyerName = review.buyer?.display_name || review.buyer?.username || "Comprador";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "flex gap-3 rounded-xl border border-border bg-background/50 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "h-9 w-9 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: review.buyer?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: buyerName.slice(0, 2).toUpperCase() })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: buyerName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: timeAgo(review.created_at)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `mt-1 inline-flex items-center gap-1 text-xs font-semibold ${review.positive ? "text-emerald-500" : "text-destructive"}`,
										children: [review.positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-3.5 w-3.5" }), review.positive ? "Avaliação positiva" : "Avaliação negativa"]
									}),
									review.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: review.comment
									})
								]
							})]
						}, review.id);
					})
				})]
			})
		]
	});
}
function ReviewStat({ label, value, icon, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex items-center justify-between p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-2xl font-extrabold",
			children: value
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className,
			children: icon
		})]
	}) });
}
function ProfileTab({ onSaved }) {
	const { user, profile } = useAuth();
	const queryClient = useQueryClient();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const save = async (e) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		setBusy(true);
		const { error } = await supabase.from("profiles").update({ bio: String(form.get("bio") ?? "") }).eq("id", user.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["seller", profile?.username] }),
			queryClient.invalidateQueries({ queryKey: ["sellers"] }),
			queryClient.invalidateQueries({ queryKey: ["seller-products"] })
		]);
		toast.success("Perfil atualizado.");
		onSaved();
	};
	const uploadImage = async (file, field) => {
		if (!file || !user) return;
		try {
			const url = await uploadMedia(user.id, file);
			const patch = field === "avatar_url" ? { avatar_url: url } : { banner_url: url };
			const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
			if (error) throw error;
			await queryClient.invalidateQueries({ queryKey: ["seller", profile?.username] });
			await queryClient.invalidateQueries({ queryKey: ["sellers"] });
			toast.success("Imagem atualizada.");
			onSaved();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Falha no upload.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid h-9 w-9 shrink-0 place-items-center rounded-xl ${user?.email_confirmed_at ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold",
						children: ["E-mail ", user?.email_confirmed_at ? "verificado" : "não verificado"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: user?.email ?? "Nenhum e-mail disponível"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid h-9 w-9 shrink-0 place-items-center rounded-xl ${profile?.verified ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold",
						children: ["Documentos ", profile?.verified ? "verificados" : "não verificados"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: profile?.verified ? `Nível ${profile.verification_level}` : "Envie seus documentos para liberar a verificação."
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsernameCard, { onSaved }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "grid max-w-2xl gap-4 rounded-2xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "pf-name",
								children: "Nome cadastrado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "pf-name",
								value: profile?.display_name ?? profile?.username ?? "",
								readOnly: true,
								disabled: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "O nome cadastrado não pode ser alterado. Ele deve permanecer igual ao informado no cadastro."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "pf-bio",
							children: "Bio da loja"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "pf-bio",
							name: "bio",
							rows: 4,
							defaultValue: profile?.bio ?? "",
							maxLength: 500
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "pf-avatar",
								children: "Foto de perfil"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "pf-avatar",
								type: "file",
								accept: "image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff",
								onChange: (e) => uploadImage(e.target.files?.[0], "avatar_url")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "pf-banner",
								children: "Banner de fundo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "pf-banner",
								type: "file",
								accept: "image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff",
								onChange: (e) => uploadImage(e.target.files?.[0], "banner_url")
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						className: "w-fit bg-gradient-primary text-primary-foreground",
						children: "Guardar alterações"
					})
				]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
