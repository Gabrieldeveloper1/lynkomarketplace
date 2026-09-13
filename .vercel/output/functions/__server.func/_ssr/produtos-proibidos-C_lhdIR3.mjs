import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as PublicInfoPage } from "./public-info-page-504NK5u9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/produtos-proibidos-C_lhdIR3.js
var import_jsx_runtime = require_jsx_runtime();
function ProhibitedPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicInfoPage, {
		eyebrow: "Regras da plataforma",
		title: "Nem todo produto digital pode ser vendido",
		description: "Estas regras ajudam a proteger compradores, vendedores e a operação. Dúvidas devem ser levadas ao suporte antes da publicação.",
		sections: [
			{
				title: "Proibido",
				items: [
					"Fraudes, golpes, phishing ou malware",
					"Credenciais obtidas sem autorização ou dados pessoais",
					"Conteúdo ilegal, exploração ou violação de direitos",
					"Produtos falsificados, chargeback ou manipulação de pagamento"
				]
			},
			{
				title: "Anúncios honestos",
				items: [
					"Descreva exatamente o que será entregue",
					"Informe região, prazo, limitações e condições",
					"Não use imagens ou avaliações enganosas",
					"Não prometa benefícios que a Lynko ainda não oferece"
				]
			},
			{
				title: "Fiscalização",
				body: "Anúncios podem ser denunciados, revisados, pausados ou removidos. Reincidência pode limitar mensagens, saques ou acesso à conta."
			},
			{
				title: "Como denunciar",
				body: "Use o botão de denúncia no produto ou abra um chamado com o link do anúncio e o motivo. Nunca tente resolver fraude pagando por fora."
			}
		],
		cta: {
			label: "Ir para a ajuda",
			to: "/ajuda"
		}
	});
}
//#endregion
export { ProhibitedPage as component };
