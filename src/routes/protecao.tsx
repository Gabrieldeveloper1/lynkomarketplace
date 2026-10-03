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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PROTECTION_TIERS } from "@/lib/protection";
import { formatPrice } from "@/lib/format";
import { ADMIN_SUPPORT_DISCORD_URL } from "@/lib/support";

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
    text: "O pagamento é processado pela Efí Bank. Se uma mediação for aprovada, o reembolso é solicitado automaticamente ao banco.",
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
    title: "Reembolso automático",
    text: "Quando a equipe aprova a mediação, a Efí Bank processa o reembolso aos titulares. A plataforma não interfere no processamento bancário.",
  },
];

const STEPS = [
  {
    icon: Handshake,
    title: "1. Você escolhe e paga",
    text: "O Pix é gerado na hora e o pagamento é processado pela Efí Bank. O pedido e a entrega ficam registrados no chat.",
  },
  {
    icon: PackageCheck,
    title: "2. O vendedor entrega",
    text: "A entrega acontece no chat do pedido: automática nos anúncios com estoque digital, ou manual com prazo combinado.",
  },
  {
    icon: BadgeCheck,
    title: "3. Pagamento e entrega registrados",
    text: "A confirmação do cliente não é necessária para concluir o fluxo. O pedido permanece documentado no chat para eventual análise.",
  },
  {
    icon: ShieldCheck,
    title: "4. Deu problema? Abra mediação",
    text: "Chame a mediação pelo chat do pedido. Se aprovada, a Efí Bank processa o reembolso automaticamente; se recusada, não é possível abrir nova mediação para o mesmo produto.",
  },
];

const FAQ = [
  {
    q: "Quando o vendedor recebe o meu dinheiro?",
    a: "O pagamento e o reembolso são processados pela Efí Bank. A equipe não movimenta o dinheiro manualmente: quando uma mediação é aprovada, apenas solicita o reembolso ao banco.",
  },
  {
    q: "O que acontece se o produto não funcionar?",
    a: "Abra a mediação pelo chat do pedido. A equipe analisa as mensagens, o conteúdo entregue e decide pela aprovação ou recusa. Se aprovada, a Efí Bank envia automaticamente o reembolso aos titulares.",
  },
  {
    q: "Qual é o prazo para reclamar?",
    a: "O prazo interno para abrir uma disputa começa na entrega: até 24 horas na Proteção Básica; na Proteção Média, a mediação é prioritária; na Proteção Máxima, o atendimento é imediato, 24 horas por dia, 7 dias por semana. Esses prazos da plataforma não reduzem direitos previstos na legislação aplicável.",
  },
  {
    q: "A taxa de proteção é cobrada sobre o preço?",
    a: "Não. É um valor fixo por pedido, mostrado no checkout antes de você pagar, independentemente do preço do produto.",
  },
  {
    q: "Posso cancelar um pedido que ainda não paguei?",
    a: "Sim. Enquanto o pagamento estiver pendente, basta não pagar o Pix a cobrança expira sozinha e nada é debitado.",
  },
  {
    q: "E se o vendedor sumir depois do pagamento?",
    a: "Sem entrega dentro do prazo combinado, abra a mediação no chat. Se aprovada, a solicitação de reembolso é enviada automaticamente à Efí Bank, sem intervenção manual da plataforma.",
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

const LEGAL_NOTES = [
  {
    title: "Direito de arrependimento",
    text: "Em contratações feitas fora do estabelecimento comercial, o art. 49 do Código de Defesa do Consumidor prevê prazo de 7 dias para desistência, contado da assinatura ou do recebimento, observadas as regras aplicáveis ao caso concreto.",
    href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
    label: "Consultar art. 49 do CDC",
  },
  {
    title: "Produto ou serviço com problema",
    text: "O CDC prevê responsabilidade por vícios e estabelece prazos para reclamar, conforme a natureza do produto ou serviço. A disputa deve ser aberta no chat assim que o problema for identificado, com provas e detalhes da compra.",
    href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
    label: "Consultar CDC no Planalto",
  },
  {
    title: "Privacidade e dados pessoais",
    text: "O tratamento de dados pessoais segue a Lei Geral de Proteção de Dados (LGPD). O checkout Pix não solicita mais CPF, telefone ou nome do comprador para gerar a cobrança.",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm",
    label: "Consultar LGPD",
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
          Sua compra fica protegida do pagamento à resolução
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Toda compra no LynkoMarketplace é processada pela Efí Bank e fica registrada no chat. Veja
          como funciona, o que cada nível de proteção cobre e as dúvidas mais comuns.
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-primary/20 bg-primary/5 p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          <div>
            <h2 className="font-display text-lg font-extrabold">Compra protegida</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              O pagamento é processado pela Efí Bank. Se o produto não chegar, estiver inválido ou
              não corresponder ao anúncio, abra uma mediação pelo chat do pedido para análise. A
              decisão aprovada dispara automaticamente a solicitação de reembolso à Efí Bank.
            </p>
          </div>
        </div>
      </section>

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
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">
          As 4 etapas de um pedido protegido
        </h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5"
            >
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
          Você escolhe no checkout. A taxa é fixa por pedido não é percentual sobre o preço.
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
                {i === 1 && (
                  <Badge className="bg-gradient-primary text-primary-foreground">Mais usada</Badge>
                )}
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
        <Accordion
          type="single"
          collapsible
          className="mt-4 rounded-2xl border border-border bg-card px-4 sm:px-5"
        >
          {FAQ.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-sm font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Direitos e referências */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">
          Direitos, prazos e transparência
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          As regras abaixo explicam o funcionamento da plataforma e não substituem a legislação
          brasileira nem a orientação de um profissional. Em caso de conflito, prevalecem os
          direitos previstos em lei.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {LEGAL_NOTES.map((note) => (
            <article key={note.title} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold">{note.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note.text}</p>
              <a
                href={note.href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
              >
                {note.label} →
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Suporte */}
      <section className="mt-10 rounded-2xl border border-border bg-gradient-hero p-5 text-center sm:p-8">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MessageCircleQuestion className="h-6 w-6" />
        </span>
        <p className="mt-3 font-display text-lg font-extrabold">Ainda com dúvida?</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Para dúvidas administrativas sobre o site ou sua conta, fale com a equipe pelo Discord. Se
          for sobre um pedido, use o chat dele para que a equipe veja todo o histórico e possa fazer
          a mediação.
        </p>
        <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild className="bg-gradient-primary text-primary-foreground">
            <a href={ADMIN_SUPPORT_DISCORD_URL} target="_blank" rel="noreferrer">
              <MessageCircleQuestion className="mr-2 h-4 w-4" /> Falar no Discord
            </a>
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
