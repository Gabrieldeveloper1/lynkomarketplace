import { createFileRoute } from "@tanstack/react-router";
import { PublicInfoPage } from "@/components/public-info-page";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona | LynkoMarketplace" },
      {
        name: "description",
        content: "Veja como comprar e vender produtos digitais com Pix na Lynko.",
      },
    ],
  }),
  component: HowPage,
});
function HowPage() {
  return (
    <PublicInfoPage
      eyebrow="Como funciona"
      title="Compre. Venda. Conecte-se."
      description="A Lynko aproxima compradores e vendedores digitais com pagamento Pix, reputação e acompanhamento de pedidos."
      sections={[
        {
          title: "Para comprar",
          items: [
            "Encontre produtos por busca e categoria",
            "Confira preço, entrega, vendedor e avaliações",
            "Pague via Pix com o nível de proteção exibido",
            "Receba automaticamente ou acompanhe a entrega",
          ],
        },
        {
          title: "Para vender",
          items: [
            "Cadastre-se e crie seu perfil público",
            "Publique produto, preço, estoque e regras",
            "Escolha entrega automática quando aplicável",
            "Acompanhe vendas, avaliações e saldo no dashboard",
          ],
        },
        {
          title: "Depois da compra",
          body: "O pedido registra pagamento, entrega, mensagens e suporte em uma única linha do tempo. Avaliações só devem ocorrer após uma transação válida.",
        },
        {
          title: "Pix como diferencial",
          body: "A Lynko não simula cartão: o checkout é projetado para Pix, com QR Code, Pix copia e cola e confirmação integrada quando disponível.",
        },
      ]}
      cta={{ label: "Ver marketplace", to: "/produtos" }}
    />
  );
}
