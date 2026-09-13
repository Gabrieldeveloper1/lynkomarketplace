import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Mt as FlaskConical, S as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/labs-CjPYVTkn.js
var import_jsx_runtime = require_jsx_runtime();
function LabsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "gap-1 bg-primary/10 text-primary hover:bg-primary/15",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "h-3 w-3" }), " Lynko Labs"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 text-3xl font-extrabold sm:text-5xl",
				children: "Novidades que estamos testando."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-lg text-muted-foreground",
				children: "Um espaço para experimentar ferramentas, automações e recursos para vendedores sem confundir teste com promessa de produto final."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-4 md:grid-cols-3",
				children: [
					[
						"Assistente de anúncio",
						"Em pesquisa",
						"Ajudar vendedores a revisar título, descrição e categoria antes da publicação."
					],
					[
						"Alertas de preço",
						"Planejado",
						"Avisar compradores quando um produto chegar ao valor desejado."
					],
					[
						"Campanhas de fundadores",
						"Em desenvolvimento",
						"Dar visibilidade a vendedores que estão ajudando a construir a oferta inicial."
					]
				].map(([title, status, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-3xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-bold",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "mt-2",
							children: status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: body
						})
					]
				}, title))
			})
		]
	});
}
//#endregion
export { LabsPage as component };
