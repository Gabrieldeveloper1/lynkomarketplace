import { createFileRoute } from "@tanstack/react-router";
import { PublicInfoPage } from "@/components/public-info-page";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap público | LynkoMarketplace" },
      {
        name: "description",
        content:
          "A Lynko está operacional. Consulte os recursos disponíveis e reporte bugs imediatamente pelo suporte.",
      },
    ],
  }),
  component: RoadmapPage,
});
function RoadmapPage() {
  return (
    <PublicInfoPage
      eyebrow="Lynko operacional"
      title="A plataforma está 100% operacional"
      description="Todos os fluxos principais de compra, venda, Pix, entrega, suporte e segurança estão disponíveis. Se você encontrar qualquer comportamento inesperado, reporte imediatamente para correção."
      sections={[
        {
          title: "Operacional",
          items: [
            "Marketplace e busca",
            "Checkout Pix com QR Code",
            "Pedidos e entrega",
            "Chat, avaliações e favoritos",
            "Verificação e suporte",
          ],
        },
        {
          title: "Manutenção contínua",
          items: [
            "Monitoramento de pagamentos e entregas",
            "Melhorias de desempenho e experiência mobile",
            "Aprimoramentos de atendimento e segurança",
            "Correção imediata de bugs reportados",
          ],
        },
        {
          title: "Reporte bugs imediatamente",
          body: "Encontrou uma tela quebrada, erro de pagamento, problema de entrega ou comportamento inesperado? Envie a rota, o horário, seu usuário e uma captura de tela pelo suporte administrativo no Discord. Não compartilhe senhas ou chaves privadas.",
        },
      ]}
      cta={{ label: "Abrir central de ajuda", to: "/ajuda" }}
    />
  );
}
