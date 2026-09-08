import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  Handshake,
  PackageCheck,
  Scale,
  Wallet,
  Clock,
  MessageCircleQuestion,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PROTECTION_TIERS } from "@/lib/protection";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/protecao")({
  head: () => ({
    meta: [
      { title: "Como funciona a proteção de compra | LynkoMarketplace" },
      {
        name: "description",
        content:
          "Entenda a compra protegida do LynkoMarketplace: pagamento em custódia, etapas do pedido, níveis de proteção, prazos de disputa e reembolso.",
      },
      { property: "og:title", content: "Como funciona a proteção de compra | LynkoMarketplace" },
      {
        property: "og:description",
        content: "Pagamento retido até a entrega, mediação da equipe e reembolso garantido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProtecaoPage,
});

const PILLARS = [
  {
    icon: Lock,
    title: "Pagamento em custódia",
    text: "O dinheiro fica retido na plataforma e só vai para o vendedor depois que você confirma que recebeu.",
  },
  {
    icon: Zap,
    title: "Entrega automática",
    text: "Nos anúncios com o raio, o conteúdo chega no chat segundos após o pagamento ser aprovado.",
  },
  {
    icon: Scale,
    title: "Mediação imparcial",
    text: "Se algo der errado, a nossa equipe entra na conversa e analisa o histórico dos dois lados.",
  },
  {
    icon: Wallet,
    title: "Reembolso garantido",
    text: "Item inválido ou não entregue devolve o valor integral, conforme o nível de proteção escolhido.",
  },
];

const STEPS = [
  {
    icon: Handshake,
    title: "1. Você escolhe e paga",
    text: "O Pix é gerado na hora. O valor entra em custódia — o vendedor vê que o pedido foi pago, mas ainda não recebe nada.",
  },
  {
    icon: PackageCheck,
    title: "2. O vendedor entrega",
    text: "A entrega acontece no chat do pedido: automática nos anúncios com estoque digital, ou manual com prazo combinado.",
  },
  {
    icon: BadgeCheck,
    title: "3. Você confere e confirma",
    text: "Teste o que recebeu. Estando tudo certo, toque em “Confirmar recebimento” e o valor é liberado ao vendedor.",
  },
  {
    icon: ShieldCheck,
    title: "4. Deu problema? Abrimos disputa",
    text: "Chame a moderação pelo próprio chat. Analisamos as mensagens e o registro de entrega antes de liberar ou devolver o dinheiro.",
  },
];

const FAQ = [
  {
    q: "Quando o vendedor recebe o meu dinheiro?",
    a: "Só depois da confirmação de recebimento, ou automaticamente após o prazo de conferência sem nenhuma disputa aberta. Até lá o valor fica retido pela plataforma.",
  },
  {
    q: "O que acontece se o produto não funcionar?",
    a: "Abra a disputa pelo chat do pedido, no botão “Chamar moderador”, antes de confirmar o recebimento. A equipe analisa as mensagens, o conteúdo entregue e decide pelo reembolso ou pela substituição do item.",
  },
  {
    q: "Qual é o prazo para reclamar?",
    a: "O prazo começa na entrega e varia com o nível de proteção: 24 horas na Básica, com mediação prioritária na Média e atendimento imediato 24/7 na Máxima.",
  },
  {
    q: "A taxa de proteção é cobrada sobre o preço?",
    a: "Não. É um valor fixo por pedido, mostrado no checkout antes de você pagar, independentemente do preço do produto.",
  },
  {
    q: "Posso cancelar um pedido que ainda não paguei?",
    a: "Sim. Enquanto o pagamento estiver pendente, basta não pagar o Pix — a cobrança expira sozinha e nada é debitado.",
  },
  {
    q: "E se o vendedor sumir depois do pagamento?",
    a: "Sem entrega dentro do prazo combinado, o pedido é devolvido integralmente para você e a conta do vendedor entra em revisão.",
  },
  {
    q: "Como sei que o vendedor é confiável?",
    a: "Cada perfil mostra selo de verificação de identidade, número de vendas concluídas e avaliações reais de quem já comprou. Prefira vendedores verificados.",
  },
  {
    q: "Preciso falar com alguém. Como abro suporte?",
    a: "Use o chat do pedido e acione a moderação: assim a equipe já entra com todo o histórico à vista, o que resolve muito mais rápido do que um contato avulso.",
  },
];

function ProtecaoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Hero */}
      <header className="text-center">
        <Badge variant="secondary" className="gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Compra protegida
        </Badge>
        <h1 className="mt-4 font-display text-[1.9rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
          Seu dinheiro só sai daqui quando a entrega estiver certa
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Toda compra no LynkoMarketplace passa pela custódia da plataforma. Veja como funciona, o que cada
          nível de proteção cobre e as dúvidas mais comuns — provavelmente a sua resposta está aqui.
        </p>
      </header>

      {/* Pilares */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <p.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-bold">{p.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </section>

      {/* Etapas */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">As 4 etapas de um pedido protegido</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5">
              <span className="pointer-events-none absolute -right-3 -top-4 font-display text-6xl font-black text-primary/5">
                {i + 1}
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-bold">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Níveis */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">Níveis de proteção</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Você escolhe no checkout. A taxa é fixa por pedido — não é percentual sobre o preço.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PROTECTION_TIERS.map((t, i) => (
            <div
              key={t.id}
              className={`rounded-2xl border p-4 sm:p-5 ${
                i === 1 ? "border-primary/50 bg-primary/5 shadow-glow" : "border-border bg-card"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold">{t.name}</p>
                {i === 1 && <Badge className="bg-gradient-primary text-primary-foreground">Mais usada</Badge>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t.tagline}</p>
              <p className="mt-3 font-display text-2xl font-extrabold text-primary">
                +{formatPrice(t.feeCents)}
                <span className="ml-1 text-xs font-medium text-muted-foreground">por pedido</span>
              </p>
              <ul className="mt-3 grid gap-1.5">
                {t.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="mt-4 rounded-2xl border border-border bg-card px-4 sm:px-5">
          {FAQ.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-sm font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Suporte */}
      <section className="mt-10 rounded-2xl border border-border bg-gradient-hero p-5 text-center sm:p-8">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MessageCircleQuestion className="h-6 w-6" />
        </span>
        <p className="mt-3 font-display text-lg font-extrabold">Ainda com dúvida?</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Se for sobre um pedido, fale no chat dele — assim a equipe já vê todo o histórico e resolve mais rápido.
        </p>
        <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild className="bg-gradient-primary text-primary-foreground">
            <Link to="/mensagens" search={{ c: undefined }}>
              <MessageCircleQuestion className="mr-2 h-4 w-4" /> Falar com o suporte
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/status">
              <Clock className="mr-2 h-4 w-4" /> Ver estado da plataforma
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
