import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-uwqhymWC.mjs";
import { t as PublicInfoPage } from "./public-info-page-504NK5u9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ajuda-DOp8ySJZ.js
var import_jsx_runtime = require_jsx_runtime();
var faq = [
	["Como pagar com Pix?", "Na página do checkout, confira o resumo, escolha a proteção aplicável e gere o QR Code. Você também poderá copiar o código Pix."],
	["Quando recebo meu produto?", "Produtos com entrega automática são liberados após a confirmação do pagamento. Nos demais, acompanhe o pedido e converse com o vendedor."],
	["O que fazer se houver um problema?", "Abra a central de suporte ou uma disputa no pedido, descreva o motivo e envie evidências. A equipe analisa o histórico."],
	["Como começo a vender?", "Crie sua conta, abra o dashboard e use o assistente de criação de produto. Publicar é gratuito; revise as regras antes de publicar."]
];
function HelpPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicInfoPage, {
		eyebrow: "Central de ajuda",
		title: "Encontre respostas sem ficar sozinho",
		description: "A Lynko organiza suporte por compra, venda, Pix, pedidos, reembolsos, disputas, segurança e conta.",
		sections: [
			{
				title: "Comprar",
				items: [
					"Encontrar e comparar produtos",
					"Pagamento via Pix",
					"Acompanhar entrega e pedido"
				]
			},
			{
				title: "Vender",
				items: [
					"Publicar produto e cadastrar estoque",
					"Entrega automática ou manual",
					"Saldo, avaliações e saques"
				]
			},
			{
				title: "Segurança",
				items: [
					"Não pague por fora da Lynko",
					"Confira a reputação e a verificação",
					"Denuncie anúncios suspeitos"
				]
			}
		],
		cta: {
			label: "Explorar produtos",
			to: "/produtos"
		}
	});
}
function HelpFaq() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto mt-10 max-w-3xl px-4 pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl font-bold",
			children: "Perguntas frequentes"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
			type: "single",
			collapsible: true,
			className: "mt-4",
			children: faq.map(([q, a], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
				value: String(i),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { children: q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: a })]
			}, q))
		})]
	});
}
//#endregion
export { HelpFaq, HelpPage as component };
