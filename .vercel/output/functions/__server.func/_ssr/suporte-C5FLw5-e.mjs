import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Bt as ExternalLink, Et as Headphones } from "../_libs/lucide-react.mjs";
import { et as Button, f as ADMIN_SUPPORT_DISCORD_URL } from "./router-BVA3mZO7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suporte-C5FLw5-e.js
var import_jsx_runtime = require_jsx_runtime();
function SupportPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-3xl border border-border bg-gradient-hero p-6 text-center shadow-card sm:p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-2xl font-extrabold sm:text-3xl",
					children: "Suporte administrativo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
					children: "Todo suporte relacionado ao site, à conta e aos administradores da LynkoMarketplace acontece pelo nosso Discord oficial. Entre no servidor para falar com a equipe."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6 gap-2 bg-gradient-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: ADMIN_SUPPORT_DISCORD_URL,
						target: "_blank",
						rel: "noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }), "Abrir suporte no Discord"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-xs text-muted-foreground",
					children: "Para pedidos, entregas, mensagens comprador-vendedor e mediação, continue usando os recursos dentro do site."
				})
			]
		})
	});
}
//#endregion
export { SupportPage as component };
