import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Input, B as formatPrice, z as FEE_RATE } from "./router-BVA3mZO7.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as PublicInfoPage } from "./public-info-page-504NK5u9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/taxas-BrKAKBa7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FeesPage() {
	const [value, setValue] = (0, import_react.useState)("100");
	const calc = (0, import_react.useMemo)(() => {
		const cents = Math.max(0, Number(value.replace(",", ".")) * 100 || 0);
		const fee = Math.round(cents * FEE_RATE);
		return {
			cents,
			fee,
			net: cents - fee
		};
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicInfoPage, {
		eyebrow: "Transparência financeira",
		title: "Saiba quanto você recebe",
		description: "A Lynko exibe as regras financeiras antes da venda. Não escondemos a taxa no checkout.",
		sections: [
			{
				title: "Calculadora",
				body: "Digite o preço da venda para ver a taxa da plataforma e o valor líquido estimado."
			},
			{
				title: "Publicação",
				body: "Criar um anúncio não exige pagamento. A taxa de serviço é aplicada conforme as regras da venda."
			},
			{
				title: "Proteção no checkout",
				body: "O nível de proteção escolhido pelo comprador é apresentado separadamente no resumo do pedido."
			}
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto mb-16 max-w-xl rounded-3xl border border-border bg-card p-6 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "fee-price",
				children: "Preço da venda"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "fee-price",
				inputMode: "decimal",
				value,
				onChange: (e) => setValue(e.target.value),
				className: "mt-2",
				placeholder: "100,00"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preço" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatPrice(calc.cents) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Taxa (",
							Math.round(FEE_RATE * 100),
							"%)"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["- ", formatPrice(calc.fee)] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-t border-border pt-3 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Valor líquido" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-primary",
							children: formatPrice(calc.net)
						})]
					})
				]
			})
		]
	})] });
}
//#endregion
export { FeesPage as component };
