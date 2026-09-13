import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as PublicInfoPage } from "./public-info-page-504NK5u9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roadmap-MN7LJO4z.js
var import_jsx_runtime = require_jsx_runtime();
function RoadmapPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicInfoPage, {
		eyebrow: "Construído com a comunidade",
		title: "O futuro da Lynko é público",
		description: "Prioridade para liquidez, confiança e uma experiência melhor para compradores e vendedores. Os status abaixo refletem o produto, não promessas de prazo.",
		sections: [
			{
				title: "🟢 Concluído",
				items: [
					"Marketplace e busca",
					"Checkout Pix com QR Code",
					"Pedidos e entrega",
					"Chat, avaliações e favoritos",
					"Verificação e suporte"
				]
			},
			{
				title: "🟡 Em desenvolvimento",
				items: [
					"Métricas de liquidez e recompra",
					"Melhorias na experiência mobile",
					"Programa Vendedor Fundador",
					"Mais automações de atendimento"
				]
			},
			{
				title: "🔵 Planejado",
				items: [
					"Alertas de preço",
					"Cupons e promoções reais",
					"Afiliados e indicações sustentáveis",
					"Votação de funcionalidades"
				]
			},
			{
				title: "Como participar",
				body: "Envie feedback pelo suporte, conte o que impede sua compra ou venda e ajude a decidir o que torna a Lynko mais útil."
			}
		],
		cta: {
			label: "Abrir central de ajuda",
			to: "/ajuda"
		}
	});
}
//#endregion
export { RoadmapPage as component };
