import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as ShieldCheck, N as Search, hn as BadgeCheck } from "../_libs/lucide-react.mjs";
import { $ as Input, M as fetchSellers, Q as AvatarImage, X as Avatar, Z as AvatarFallback, et as Button } from "./router-BVA3mZO7.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as publicVerificationLabel, t as SellerBadges } from "./seller-badges-BVdOl_T1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendedores-i5ELCLwI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [{
	id: "todos",
	label: "Todos"
}, {
	id: "verificados",
	label: "Somente verificados"
}];
function Vendedores() {
	const { data = [], isLoading } = useQuery({
		queryKey: ["sellers"],
		queryFn: fetchSellers
	});
	const [filter, setFilter] = (0, import_react.useState)("todos");
	const [term, setTerm] = (0, import_react.useState)("");
	const sellers = (0, import_react.useMemo)(() => {
		const q = term.trim().toLowerCase();
		return data.filter((s) => {
			const matchTerm = !q || s.username.toLowerCase().includes(q) || (s.display_name ?? "").toLowerCase().includes(q);
			const matchFilter = filter === "todos" ? true : filter === "verificados" ? !!s.verified : s.verified && s.verification_level === filter;
			return matchTerm && matchFilter;
		});
	}, [
		data,
		filter,
		term
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-extrabold sm:text-3xl",
				children: "Vendedores"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Perfis públicos da comunidade LynkoMarketplace, com documentos verificados e reputação pública."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative sm:max-w-xs sm:flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: term,
						onChange: (e) => setTerm(e.target.value),
						placeholder: "Buscar vendedor",
						"aria-label": "Buscar vendedor pelo nome ou usuário",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					role: "group",
					"aria-label": "Filtrar por nível de verificação",
					children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "pill",
						variant: filter === f.id ? "default" : "outline",
						onClick: () => setFilter(f.id),
						"aria-pressed": filter === f.id,
						className: "text-xs",
						children: f.label
					}, f.id))
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-2xl" }, i))
			}) : sellers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
				children: sellers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/vendedor/$slug",
					params: { slug: s.username },
					className: "block rounded-2xl border border-border bg-card p-5 text-center transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "mx-auto h-16 w-16",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
								src: s.avatar_url ?? void 0,
								alt: ""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: (s.display_name || s.username).slice(0, 2).toUpperCase() })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 flex items-center justify-center gap-1 font-semibold",
							children: [s.display_name || s.username, s.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
								className: "h-4 w-4 text-primary",
								"aria-label": "Vendedor verificado"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["@", s.username]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SellerBadges, {
								profile: s,
								compact: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
								className: "h-3 w-3",
								"aria-hidden": true
							}), publicVerificationLabel(s.verified)]
						})
					]
				}) }, s.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-muted-foreground",
				children: "Nenhum vendedor encontrado com esse filtro."
			})
		]
	});
}
//#endregion
export { Vendedores as component };
