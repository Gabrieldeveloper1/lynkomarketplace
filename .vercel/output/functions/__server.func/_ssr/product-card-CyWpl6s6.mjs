import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as ShieldCheck, Nt as Flame, T as ShoppingBag, hn as BadgeCheck, t as Zap, wt as Heart } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as formatPrice, L as setFavorite, et as Button, it as cn, tt as useAuth, y as fetchFavoriteIds } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-CyWpl6s6.js
var import_jsx_runtime = require_jsx_runtime();
function useFavorites() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const { data: ids = [], isLoading } = useQuery({
		queryKey: ["favorites", user?.id],
		queryFn: () => fetchFavoriteIds(user.id),
		enabled: !!user
	});
	return {
		ids,
		isLoading,
		toggle: useMutation({
			mutationFn: ({ productId, on }) => setFavorite(user.id, productId, on),
			onSuccess: () => {
				qc.invalidateQueries({ queryKey: ["favorites", user?.id] });
			},
			onError: () => toast.error("😕 Não foi possível atualizar os favoritos.")
		}),
		user
	};
}
function FavoriteButton({ productId, variant = "icon", className }) {
	const navigate = useNavigate();
	const { ids, toggle, user } = useFavorites();
	const active = ids.includes(productId);
	const onClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) {
			toast.info("🔐 Entre na sua conta para guardar favoritos.");
			navigate({ to: "/auth" });
			return;
		}
		toggle.mutate({
			productId,
			on: !active
		}, { onSuccess: () => toast.success(active ? "💔 Removido dos favoritos." : "❤️ Guardado nos favoritos!") });
	};
	if (variant === "full") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "outline",
		onClick,
		disabled: toggle.isPending,
		className: cn("gap-2", active && "border-primary/60 text-primary", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-4 w-4 transition", active && "fill-current scale-110") }), active ? "Nos favoritos" : "Favoritar"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": active ? "Remover dos favoritos" : "Adicionar aos favoritos",
		onClick,
		disabled: toggle.isPending,
		className: cn("grid h-9 w-9 place-items-center rounded-full border border-border bg-background/80 backdrop-blur transition hover:scale-110 hover:border-primary/60", active && "border-primary/60 text-primary", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-4 w-4 transition", active && "fill-current") })
	});
}
function ProductCard({ product }) {
	const cover = product.images?.[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/produto/$slug",
		params: { slug: product.slug },
		className: "group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[16/10] overflow-hidden bg-gradient-surface",
			children: [
				cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: cover,
					alt: product.title,
					loading: "lazy",
					decoding: "async",
					width: 640,
					height: 400,
					className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full w-full place-items-center text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-8 w-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-3 top-3 flex items-start justify-between gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1",
						children: [product.promoted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "gap-1 bg-gradient-primary text-primary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3 w-3" }), " Destaque"]
						}), product.auto_delivery && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3" }), " Automática"]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteButton, {
					productId: product.id,
					className: "absolute right-2 top-2"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-2.5 p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2 text-[11px] font-medium text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: product.seller?.display_name || product.seller?.username
					}), product.seller?.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3.5 w-3.5 shrink-0 text-primary" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "line-clamp-2 text-sm font-bold leading-snug sm:text-base",
					children: product.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-1 text-[11px] font-semibold text-emerald-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0" }), " Entrega garantida"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-end justify-between gap-2 border-t border-border/70 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[10px] uppercase tracking-wider text-muted-foreground",
						children: "A partir de"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-extrabold text-primary sm:text-xl",
						children: formatPrice(product.price_cents)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold text-muted-foreground",
						children: [product.sales_count, " vendas"]
					})]
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as n, FavoriteButton as t };
