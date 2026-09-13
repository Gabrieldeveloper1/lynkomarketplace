import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { dt as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/loading-BKu-cbWF.js
var import_jsx_runtime = require_jsx_runtime();
/** Tela de carregamento usada enquanto uma página é preparada. */
function PageLoader({ label = "Carregando…" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[50vh] w-full place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "relative grid h-16 w-16 place-items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 animate-ping rounded-full bg-primary/20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-2 rounded-full bg-primary/10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "relative h-7 w-7 animate-spin text-primary" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted-foreground",
				children: label
			})]
		})
	});
}
function CardsSkeleton({ count = 8 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
		children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-64 animate-pulse rounded-2xl border border-border bg-card",
			style: { animationDelay: `${i * 60}ms` }
		}, i))
	});
}
//#endregion
export { PageLoader as n, CardsSkeleton as t };
