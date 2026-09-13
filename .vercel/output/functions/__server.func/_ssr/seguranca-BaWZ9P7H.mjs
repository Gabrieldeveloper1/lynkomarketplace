import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as PublicInfoPage } from "./public-info-page-504NK5u9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seguranca-BaWZ9P7H.js
var import_jsx_runtime = require_jsx_runtime();
function SecurityPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicInfoPage, {
		eyebrow: "Confiança e segurança",
		title: "Segurança é parte do produto",
		description: "Nenhum marketplace elimina todo risco, mas a Lynko cria camadas para reduzir fraude e dar contexto antes, durante e depois da compra.",
		sections: [
			{
				title: "Para compradores",
				items: [
					"Pague somente pelo checkout oficial",
					"Confira vendedor, avaliações, preço e entrega",
					"Não compartilhe códigos, senhas ou dados fora do necessário",
					"Use o pedido e a disputa se algo não corresponder ao anúncio"
				]
			},
			{
				title: "Para vendedores",
				items: [
					"Publique somente produtos permitidos",
					"Mantenha estoque e descrição corretos",
					"Responda pelo chat e nunca peça pagamento por fora",
					"Conclua verificações para aumentar a confiança"
				]
			},
			{
				title: "Sinais monitorados",
				items: [
					"Comportamento de contas e pedidos",
					"Disputas, cancelamentos e saques suspeitos",
					"Tentativas de fraude e anúncios proibidos",
					"Logs e permissões administrativas"
				]
			},
			{
				title: "Conta protegida",
				body: "Use uma senha única, confirme seu e-mail e ative recursos de segurança disponíveis. A equipe nunca pedirá sua senha ou código de autenticação."
			}
		],
		cta: {
			label: "Ler regras de produtos",
			to: "/produtos-proibidos"
		}
	});
}
//#endregion
export { SecurityPage as component };
