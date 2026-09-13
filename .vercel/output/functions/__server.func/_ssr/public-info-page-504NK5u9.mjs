import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { an as Check, vn as ArrowRight } from "../_libs/lucide-react.mjs";
import { et as Button } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-info-page-504NK5u9.js
var import_jsx_runtime = require_jsx_runtime();
function PublicInfoPage({ eyebrow, title, description, sections, cta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "gap-1 bg-primary/10 text-primary hover:bg-primary/15",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg",
					children: description
				}),
				cta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: cta.to,
					className: "mt-7 inline-flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "gap-2 bg-gradient-primary text-primary-foreground",
						children: [
							cta.label,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
						]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 grid gap-4 md:grid-cols-2",
			children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: section.title
					}),
					section.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: section.body
					}),
					section.items && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-3",
						children: section.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2 text-sm leading-relaxed text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
								" ",
								item
							]
						}, item))
					})
				]
			}, section.title))
		})]
	});
}
//#endregion
export { PublicInfoPage as t };
