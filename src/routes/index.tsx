import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { fetchCategories, fetchProducts } from "@/lib/marketplace";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Icon } from "@/components/icons";

const FAQ_GROUPS: { id: string; label: string; items: { q: string; a: string }[] }[] = [
  {
    id: "compra",
    label: "Processo de compra",
    items: [
      {
        q: "Passo a passo: como comprar na Lynko?",
        a: "1) Escolha o anúncio e a variação. 2) No checkout, selecione o nível de proteção. 3) Pague via Pix com QR Code ou copia e cola. 4) O pagamento é confirmado automaticamente. 5) A entrega aparece no chat do pedido e você acompanha cada etapa em tempo real.",
      },
      {
        q: "Como funciona a entrega automática?",
        a: "Quando o anúncio tem entrega automática, o vendedor carrega o estoque (chaves, contas, códigos) na dashboard. Assim que o pagamento é confirmado, o conteúdo é enviado no chat do pedido em segundos, sem intervenção humana.",
      },
      {
        q: "O meu dinheiro fica protegido?",
        a: "Sim. Todo o pagamento fica em custódia. O valor só é liberado ao vendedor depois de a entrega ser confirmada. Se algo der errado, abra uma disputa no chat e a equipe Lynko medeia.",
      },
      {
        q: "Como acompanho o meu pedido?",
        a: "Cada pedido tem uma página de rastreamento com estado em tempo real, histórico de eventos e recibo detalhado das taxas cobradas.",
      },
    ],
  },
  {
    id: "venda",
    label: "Processo de venda",
    items: [
      {
        q: "Passo a passo: como vender na Lynko?",
        a: "1) Crie a conta e abra a dashboard. 2) Publique o anúncio com fotos, descrição e variações. 3) Carregue o estoque de entrega automática. 4) A cada venda, a Lynko entrega e credita o valor no seu saldo. 5) Peça o saque via Pix e a equipe aprova a transferência.",
      },
      {
        q: "Um anúncio pode ter várias opções?",
        a: 'Pode. Um anúncio pode ter variações como "Netflix 1 dia", "Netflix 2 dias" ou "Netflix 3 dias", cada uma com preço e estoque próprios. O comprador escolhe a variação antes de pagar.',
      },
      {
        q: "Quanto custa vender na Lynko?",
        a: "Publicar é grátis. Cobramos 8% sobre o valor da venda, descontado automaticamente. O restante vai para o seu saldo e você saca por Pix na dashboard.",
      },
      {
        q: "Como recebo o dinheiro das minhas vendas?",
        a: "O saldo aparece na aba Carteira da dashboard. Você pode pedir saque de qualquer valor positivo disponível com a sua chave Pix; a taxa da plataforma é descontada automaticamente e o status aparece no histórico.",
      },
    ],
  },
  {
    id: "verificacao",
    label: "Verificação e taxas",
    items: [
      {
        q: "Quais são os níveis de verificação?",
        a: "Há dois níveis: Básico, para contas com e-mail confirmado, e Máximo, para identidade confirmada com documento e selfie.",
      },
      {
        q: "Quais dados aparecem no meu perfil público?",
        a: "Apenas o selo de conta verificada e informações não sensíveis que você informou (país, cidade, nome comercial e rede social). Foto do documento, selfie, número do documento e telefone nunca são públicos.",
      },
      {
        q: "O que é o nível de proteção e por que aparece no checkout?",
        a: "É a nossa taxa de serviço. Escolha no checkout entre Proteção Básica (+R$ 0,10), Proteção Média (+R$ 0,50) ou Proteção Máxima (+R$ 2,00). O valor é fixo em centavos, independentemente do preço do produto; muda apenas a rapidez da mediação e a cobertura de reembolso.",
      },
    ],
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LynkoMarketplace Produtos digitais com entrega automática" },
      {
        name: "google-site-verification",
        content: "xVeXP1vN-Vlx0bHd1Rw9URLIKZrVdcNYeBGYCrjLA9g",
      },
      {
        name: "description",
        content:
          "Compre e venda contas, chaves e serviços digitais com entrega automática, vendedores verificados e pagamento protegido no LynkoMarketplace.",
      },
      {
        property: "og:title",
        content: "LynkoMarketplace Produtos digitais com entrega automática",
      },
      {
        property: "og:description",
        content: "Entrega automática, vendedores verificados e pagamento protegido em custódia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
    ],
    links: [
      { rel: "canonical", href: "https://www.lynkomarketplace.online/" },
      { rel: "preconnect", href: "https://i.ibb.co" },
    ],
  }),
  component: Home,
});

function Section({
  title,
  subtitle,
  icon,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display text-2xl font-light tracking-tight sm:text-4xl">
            <span className="sr-only">{icon}</span>
            {title}
          </h2>
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Grid({
  loading,
  items,
}: {
  loading: boolean;
  items: Awaited<ReturnType<typeof fetchProducts>>;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-[1.25rem]" />
        ))}
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="relative overflow-hidden rounded-[1.25rem] border border-dashed border-primary/30 bg-card/50 p-10 text-center text-sm text-muted-foreground">
        <div className="absolute inset-0 bg-dots opacity-50" aria-hidden="true" />
        <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Icon.Package className="h-6 w-6" />
        </span>
        <p className="relative mt-4">Ainda não há anúncios publicados aqui. Seja o primeiro a vender!</p>
        <div className="relative mt-4">
          <Link to="/dashboard">
            <Button>
              <Icon.Plus className="h-4 w-4" /> Publicar anúncio
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

const steps = [
  {
    icon: <Icon.Search className="h-5 w-5" />,
    t: "1. O vendedor anuncia, você escolhe",
    d: "Quem vende publica o anúncio; quem compra filtra por categoria, preço e reputação do vendedor.",
  },
  {
    icon: <Icon.ShieldCheck className="h-5 w-5" />,
    t: "2. O pagamento fica com o marketplace",
    d: "A Lynko guarda o valor em custódia: o comprador paga com segurança e o vendedor só recebe depois da entrega.",
  },
  {
    icon: <Icon.Zap className="h-5 w-5" />,
    t: "3. Entrega confirmada, dinheiro liberado",
    d: "O comprador recebe o produto no painel e o valor entra no saldo do vendedor para saque via Pix.",
  },
];

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
  const categories = categoriesQuery.data ?? [];
  const recent = useQuery({
    queryKey: ["products", "recent"],
    queryFn: () => fetchProducts({ sort: "recentes", limit: 8, promotedFirst: true }),
    staleTime: 60 * 1000,
  });
  const _promoted = useQuery({
    queryKey: ["products", "promoted"],
    queryFn: () => fetchProducts({ sort: "vendidos", limit: 4, promotedFirst: true }),
    staleTime: 60 * 1000,
  });
  const mostWanted = useQuery({
    queryKey: ["products", "most-wanted"],
    queryFn: () => fetchProducts({ sort: "vendidos", limit: 8 }),
    staleTime: 60 * 1000,
  });
  // A seção "Novos & Bombando" usa a mesma lista recente, sem repetir uma chamada ao Supabase.
  const subscriptions = useQuery({
    queryKey: ["products", "subscriptions"],
    queryFn: () => fetchProducts({ category: "assinaturas", sort: "vendidos", limit: 8 }),
    staleTime: 60 * 1000,
  });

  const profileCtas: {
    title: string;
    desc: string;
    icon: React.ReactNode;
    points: string[];
    link: React.ReactNode;
  }[] = [
    {
      title: "Quero comprar",
      desc: "Encontre o produto, pague por Pix e receba na hora.",
      icon: <Icon.Search className="h-5 w-5" />,
      points: [
        "Entrega automática na página do pedido",
        "Pagamento em custódia até a entrega",
        "Chat direto com o vendedor",
      ],
      link: (
        <Button asChild className="w-full">
          <Link to="/produtos">
            Ver anúncios <Icon.ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      ),
    },
    {
      title: "Quero vender",
      desc: "Publique grátis, venda no automático e saque por Pix.",
      icon: <Icon.Store className="h-5 w-5" />,
      points: [
        "Variações com preço e estoque próprios",
        "Saldo na carteira a cada venda",
        "Saque de qualquer valor positivo disponível",
      ],
      link: (
        <Button asChild variant="outline" className="w-full">
          <Link to={user ? "/dashboard" : "/auth"}>
            {user ? "Abrir minha dashboard" : "Criar conta de vendedor"}{" "}
            <Icon.ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      ),
    },
    {
      title: "Quero mais confiança",
      desc: "Escolha o nível de verificação que combina com você.",
      icon: <Icon.ShieldCheck className="h-5 w-5" />,
      points: ["Básico com e-mail confirmado", "Máximo com documento e selfie"],
      link: (
        <Button asChild variant="outline" className="w-full">
          <Link to={user ? "/verificacao" : "/auth"}>
            Verificação de conta <Icon.ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LynkoMarketplace",
    url: "https://www.lynkomarketplace.online/",
    description: "Marketplace de produtos digitais com entrega automática e pagamento protegido.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.lynkomarketplace.online/produtos?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:pt-16">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[1.25rem] border border-border bg-card p-6 sm:p-9">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="live-dot" /> Ao vivo · Entrega automática · Pagamento em custódia
            </p>
            <h1 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl">
              Produtos digitais com entrega na hora e dinheiro protegido
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Compre e venda contas, chaves e serviços com vendedores verificados. Pague por Pix e receba no chat do pedido.
            </p>
            <form
              className="mt-7 flex max-w-xl items-center gap-2 rounded-full border border-border bg-background p-1.5 pl-5"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/produtos", search: { q: heroSearch } as never });
              }}
            >
              <Icon.Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Buscar produtos, categorias ou vendedores"
                className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Buscar"
              />
              <Button type="submit" size="sm">Buscar</Button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm"><Link to="/produtos">Ver anúncios</Link></Button>
              <Button asChild variant="outline" size="sm"><Link to={user ? "/dashboard" : "/auth"}>{user ? "Minha dashboard" : "Começar a vender"}</Link></Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.25rem] border border-border bg-card p-6">
              <p className="text-xs text-muted-foreground">Taxa para vender</p>
              <p className="mt-2 font-display text-6xl font-light tracking-tight">8<span className="text-2xl text-muted-foreground">%</span></p>
              <p className="mt-1 text-sm text-muted-foreground">Publicar é grátis. Saque por Pix na carteira.</p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#262524]"><div className="h-full w-[8%] rounded-full bg-foreground" /></div>
            </div>
            <div className="rounded-[1.25rem] border border-border bg-card p-6">
              <p className="text-xs text-muted-foreground">Como funciona</p>
              <ul className="mt-3 divide-y divide-border text-sm">
                {steps.map((st) => (
                  <li key={st.t} className="flex items-start gap-3 py-3">
                    <span className="mt-0.5 text-muted-foreground">{st.icon}</span>
                    <span>{st.t.replace(/^\d\.\s/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-7xl px-4 py-4">
        <div className="pill-nav flex max-w-full overflow-x-auto">
          {categories.map((c: { id: string; slug: string; name: string }) => (
            <Link key={c.id} to="/produtos" search={{ cat: c.slug } as never} className="shrink-0">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <Section title="Mais vendidos" subtitle="O que está saindo agora." icon={<Icon.Zap className="h-5 w-5" />} action={<Button asChild variant="outline" size="sm"><Link to="/produtos">Ver todos</Link></Button>}>
        <Grid loading={mostWanted.isLoading} items={mostWanted.data ?? []} />
      </Section>
      <Section title="Novos anúncios" icon={<Icon.Package className="h-5 w-5" />}>
        <Grid loading={recent.isLoading} items={recent.data ?? []} />
      </Section>
      <Section title="Assinaturas" icon={<Icon.Store className="h-5 w-5" />}>
        <Grid loading={subscriptions.isLoading} items={subscriptions.data ?? []} />
      </Section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
        {profileCtas.map((c) => (
          <div key={c.title} className="flex flex-col rounded-[1.25rem] border border-border bg-card p-6">
            <h3 className="font-display text-2xl font-light">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            <ul className="my-5 flex-1 space-y-2 text-sm">
              {c.points.map((pt) => (<li key={pt} className="flex justify-between border-t border-border pt-2 text-muted-foreground">{pt}</li>))}
            </ul>
            {c.link}
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="mb-6 font-display text-3xl font-light">Perguntas frequentes</h2>
        <Accordion type="single" collapsible>
          {FAQ_GROUPS.flatMap((g) => g.items).map((it, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{it.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
