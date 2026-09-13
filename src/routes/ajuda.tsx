import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PublicInfoPage } from "@/components/public-info-page";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Central de ajuda | LynkoMarketplace" },
      {
        name: "description",
        content: "Respostas sobre compras, vendas, Pix, pedidos, segurança e disputas na Lynko.",
      },
    ],
  }),
  component: HelpPage,
});

const faq = [
  [
    "Como pagar com Pix?",
    "Na página do checkout, confira o resumo, escolha a proteção aplicável e gere o QR Code. Você também poderá copiar o código Pix.",
  ],
  [
    "Quando recebo meu produto?",
    "Produtos com entrega automática são liberados após a confirmação do pagamento. Nos demais, acompanhe o pedido e converse com o vendedor.",
  ],
  [
    "O que fazer se houver um problema?",
    "Abra a central de suporte ou uma disputa no pedido, descreva o motivo e envie evidências. A equipe analisa o histórico.",
  ],
  [
    "Como começo a vender?",
    "Crie sua conta, abra o dashboard e use o assistente de criação de produto. Publicar é gratuito; revise as regras antes de publicar.",
  ],
];

function HelpPage() {
  return (
    <PublicInfoPage
      eyebrow="Central de ajuda"
      title="Encontre respostas sem ficar sozinho"
      description="A Lynko organiza suporte por compra, venda, Pix, pedidos, reembolsos, disputas, segurança e conta."
      sections={[
        {
          title: "Comprar",
          items: [
            "Encontrar e comparar produtos",
            "Pagamento via Pix",
            "Acompanhar entrega e pedido",
          ],
        },
        {
          title: "Vender",
          items: [
            "Publicar produto e cadastrar estoque",
            "Entrega automática ou manual",
            "Saldo, avaliações e saques",
          ],
        },
        {
          title: "Segurança",
          items: [
            "Não pague por fora da Lynko",
            "Confira a reputação e a verificação",
            "Denuncie anúncios suspeitos",
          ],
        },
        {
          title: "Reporte de bugs",
          body: "Se qualquer tela, pagamento, entrega ou recurso apresentar comportamento inesperado, reporte imediatamente pelo suporte administrativo no Discord. Envie a rota, horário, usuário, descrição e captura de tela. Nunca envie senhas, tokens ou chaves privadas.",
        },
      ]}
      cta={{ label: "Explorar produtos", to: "/produtos" }}
    />
  );
}

export function HelpFaq() {
  return (
    <div className="mx-auto mt-10 max-w-3xl px-4 pb-16">
      <h2 className="text-2xl font-bold">Perguntas frequentes</h2>
      <Accordion type="single" collapsible className="mt-4">
        {faq.map(([q, a], i) => (
          <AccordionItem key={q} value={String(i)}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
