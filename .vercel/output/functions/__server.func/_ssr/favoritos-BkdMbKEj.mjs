import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { wt as Heart } from "../_libs/lucide-react.mjs";
import { b as fetchFavoriteProducts, et as Button, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as CardsSkeleton } from "./loading-BKu-cbWF.mjs";
import { n as ProductCard } from "./product-card-CyWpl6s6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/favoritos-BkdMbKEj.js
var import_jsx_runtime = require_jsx_runtime();
function Favoritos() {
	const { user } = useAuth();
	const { data = [], isLoading } = useQuery({
		queryKey: [
			"favorites",
			"products",
			user?.id
		],
		queryFn: () => fetchFavoriteProducts(user.id),
		enabled: !!user
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-6 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-5 w-5 fill-current" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "truncate text-xl font-extrabold sm:text-2xl",
					children: "Meus favoritos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: isLoading ? "Carregando…" : `${data.length} anúncio${data.length === 1 ? "" : "s"} guardado${data.length === 1 ? "" : "s"}`
				})]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardsSkeleton, { count: 8 }) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-dashed border-border p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Você ainda não guardou nenhum anúncio. Toque no coração de um produto para salvá-lo aqui."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "bg-gradient-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/produtos",
						search: {
							q: "",
							cat: "todas",
							sort: "recentes"
						},
						children: "Ver anúncios"
					})
				})
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
			children: data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
		})]
	});
}
//#endregion
export { Favoritos as component };
