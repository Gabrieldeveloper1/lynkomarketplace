import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Nt as Flame } from "../_libs/lucide-react.mjs";
import { O as fetchProducts } from "./router-BVA3mZO7.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as ProductCard } from "./product-card-CyWpl6s6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ofertas-BzmD0IQN.js
var import_jsx_runtime = require_jsx_runtime();
function OffersPage() {
	const { data = [], isLoading } = useQuery({
		queryKey: ["offers"],
		queryFn: () => fetchProducts({
			sort: "menor",
			limit: 60,
			promotedFirst: true
		}),
		staleTime: 6e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-bold uppercase tracking-wider",
					children: "Ofertas reais"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-3xl font-extrabold sm:text-5xl",
				children: "Descubra seu próximo produto digital."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-muted-foreground",
				children: "A página mostra apenas anúncios ativos; não inventamos descontos ou contagens regressivas."
			})
		] }), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-2xl" }, i))
		}) : data.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground",
			children: "Ainda não há ofertas publicadas. Seja o primeiro vendedor."
		})]
	});
}
//#endregion
export { OffersPage as component };
