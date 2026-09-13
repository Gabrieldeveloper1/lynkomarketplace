import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Flame,
  Clock,
  Store,
  Search,
  Users,
  Check,
  Sparkles,
  LineChart,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  QrCode,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { fetchCategories, fetchProducts } from "@/lib/marketplace";
import { PROTECTION_TIERS } from "@/lib/protection";
import { formatPrice } from "@/lib/format";
import { CategoryVisual, getCategoryImage } from "@/components/category-icon";
import { HeroMarquee } from "@/components/hero-marquee";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

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
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-7 sm:gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </span>
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
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
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Ainda não há anúncios publicados aqui. Seja o primeiro a vender!
        <div className="mt-4">
          <Link to="/dashboard">
            <Button className="bg-gradient-primary text-primary-foreground">
              Publicar anúncio
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
    icon: <Search className="h-5 w-5" />,
    t: "1. O vendedor anuncia, você escolhe",
    d: "Quem vende publica o anúncio; quem compra filtra por categoria, preço e reputação do vendedor.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    t: "2. O pagamento fica com o marketplace",
    d: "A Lynko guarda o valor em custódia: o comprador paga com segurança e o vendedor só recebe depois da entrega.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
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
  const promoted = useQuery({
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
  const newAndHot = recent;
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
      icon: <Search className="h-5 w-5" />,
      points: [
        "Entrega automática na página do pedido",
        "Pagamento em custódia até a entrega",
        "Chat direto com o vendedor",
      ],
      link: (
        <Button asChild className="w-full bg-gradient-primary text-primary-foreground">
          <Link to="/produtos">
            Ver anúncios <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      ),
    },
    {
      title: "Quero vender",
      desc: "Publique grátis, venda no automático e saque por Pix.",
      icon: <Store className="h-5 w-5" />,
      points: [
        "Variações com preço e estoque próprios",
        "Saldo na carteira a cada venda",
        "Saque de qualquer valor positivo disponível",
      ],
      link: (
        <Button asChild variant="outline" className="w-full">
          <Link to={user ? "/dashboard" : "/auth"}>
            {user ? "Abrir minha dashboard" : "Criar conta de vendedor"}{" "}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      ),
    },
    {
      title: "Quero mais confiança",
      desc: "Escolha o nível de verificação que combina com você.",
      icon: <ShieldCheck className="h-5 w-5" />,
      points: ["Básico com e-mail confirmado", "Máximo com documento e selfie"],
      link: (
        <Button asChild variant="outline" className="w-full">
          <Link to={user ? "/verificacao" : "/auth"}>
            Verificação de conta <ArrowRight className="ml-1 h-4 w-4" />
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
    <div className="bg-[radial-gradient(circle_at_50%_0%,oklch(0.7_0.2_264_/_0.1),transparent_34%)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-80" />
        <div
          className="pointer-events-none absolute left-1/2 -top-56 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl px-4 py-10 text-center sm:py-14">
          <div className="mx-auto flex max-w-4xl flex-col items-center">
            <Badge className="mb-5 gap-1 bg-primary/15 text-primary hover:bg-primary/20">
              <QrCode className="h-3 w-3" /> Compre via Pix. Receba com segurança.
            </Badge>
            <h1 className="max-w-4xl font-display text-[2rem] font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              Compre produtos digitais{" "}
              <span className="hero-shimmer-text bg-gradient-primary bg-clip-text text-transparent">
                com segurança.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:mt-5 sm:text-lg">
              Encontre produtos, compare vendedores e pague via Pix. A Lynko protege a compra e
              acompanha a entrega do início ao fim.
            </p>
            <form
              className="mt-7 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-card sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                navigate({
                  to: "/produtos",
                  search: { q: heroSearch, cat: "todas", sort: "recentes" },
                });
              }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  value={heroSearch}
                  onChange={(event) => setHeroSearch(event.target.value)}
                  placeholder="Procure por jogos, gift cards, IA, software, serviços..."
                  aria-label="O que você está procurando?"
                  className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="gap-2 bg-gradient-primary text-primary-foreground"
              >
                Buscar <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-5 grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
              <Link
                to="/produtos"
                search={{ q: "", cat: "todas", sort: "recentes" }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full gap-2 bg-gradient-primary text-primary-foreground shadow-glow sm:w-auto"
                >
                  Explorar ofertas <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                  <Store className="h-4 w-4" /> Começar a vender
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid w-full max-w-2xl grid-cols-3 gap-3 sm:mt-12 sm:gap-4">
              {[
                { v: "Pix", l: "Pagamento simples" },
                { v: "100%", l: "Compra acompanhada" },
                { v: "24/7", l: "Entrega automática" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-xl font-extrabold text-primary sm:text-3xl">{s.v}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border-t border-border/60 py-4">
          <HeroMarquee />
        </div>
      </section>

      <section className="border-b border-border bg-card/60" aria-label="Por que comprar na Lynko">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-2 lg:grid-cols-5">
          {[
            [QrCode, "Pagamento via Pix"],
            [ShieldCheck, "Compra protegida"],
            [BadgeCheck, "Vendedores avaliados"],
            [Zap, "Entrega rápida"],
            [Users, "Suporte da Lynko"],
          ].map(([Icon, label]) => (
            <div key={label as string} className="flex items-center gap-2 text-sm font-semibold">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              {label as string}
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <Section
        title="Categorias do marketplace"
        subtitle="Escolha uma categoria para comprar ou para descobrir onde anunciar o seu produto."
        icon={<Store className="h-4 w-4" />}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categoriesQuery.isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))
            : categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/produtos"
                  search={{ q: "", cat: c.slug, sort: "recentes" }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card text-center text-sm font-medium transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow"
                >
                  {getCategoryImage(c) ? (
                    <span className="block aspect-[4/3] w-full overflow-hidden bg-accent">
                      <CategoryVisual
                        category={c}
                        imageClassName="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </span>
                  ) : (
                    <span className="mx-auto mt-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <CategoryVisual category={c} className="h-5 w-5" />
                    </span>
                  )}
                  <span className="block px-3 py-3">
                    <span className="block">{c.name}</span>
                    {c.product_count ? (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {c.product_count} {c.product_count === 1 ? "produto" : "produtos"}
                      </span>
                    ) : (
                      <span className="mt-1 block text-[11px] leading-tight text-muted-foreground">
                        Seja o primeiro vendedor
                      </span>
                    )}
                  </span>
                </Link>
              ))}
        </div>
      </Section>

      <Section
        title="Em Destaque"
        subtitle="Seleção especial de produtos impulsionados e bem avaliados."
        icon={<Flame className="h-4 w-4" />}
        action={
          <Link to="/produtos" search={{ q: "", cat: "todas", sort: "vendidos" }}>
            <Button variant="ghost" className="gap-1 text-sm">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      >
        <Grid loading={promoted.isLoading} items={promoted.data ?? []} />
      </Section>

      <Section
        title="Mais Procurados da Semana"
        subtitle="Os anúncios com maior procura e mais vendas na plataforma."
        icon={<TrendingUp className="h-4 w-4" />}
        action={
          <Link to="/produtos" search={{ q: "", cat: "todas", sort: "vendidos" }}>
            <Button variant="ghost" className="gap-1 text-sm">
              Ver mais <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      >
        <Grid loading={mostWanted.isLoading} items={mostWanted.data ?? []} />
      </Section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/[0.06] p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <Badge className="mb-4 gap-1 bg-primary text-primary-foreground hover:bg-primary">
                <Sparkles className="h-3 w-3" /> Programa Lynko Founders
              </Badge>
              <h2 className="max-w-2xl text-2xl font-extrabold sm:text-4xl">
                Seja um dos primeiros vendedores da Lynko.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Estamos abrindo espaço para quem quer construir sua loja desde o começo. Publique
                gratuitamente, ganhe destaque inicial e ajude a formar o marketplace brasileiro de
                produtos digitais.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
                {["Publicação gratuita", "Destaque inicial", "Selo Vendedor Fundador"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-background/70 px-3 py-1.5"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
              <Link to={user ? "/dashboard" : "/auth"} className="mt-7 inline-flex">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-primary text-primary-foreground shadow-glow"
                >
                  {user ? "Abrir minha loja" : "Começar a vender"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                O que vem primeiro
              </p>
              <div className="mt-4 grid gap-3">
                {["Publique seu produto", "Construa sua reputação", "Venda e receba via Pix"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl bg-background/70 p-3 text-sm font-semibold"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        title="Novos & Bombando"
        subtitle="Produtos recém-publicados que já estão chamando atenção."
        icon={<Sparkles className="h-4 w-4" />}
      >
        <Grid loading={newAndHot.isLoading} items={newAndHot.data ?? []} />
      </Section>

      {!!subscriptions.data?.length && (
        <Section
          title="Assinaturas"
          subtitle="Planos e acessos recorrentes para você encontrar tudo em um só lugar."
          icon={<RefreshCw className="h-4 w-4" />}
          action={
            <Link to="/produtos" search={{ q: "", cat: "assinaturas", sort: "vendidos" }}>
              <Button variant="ghost" className="gap-1 text-sm">
                Ver assinaturas <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        >
          <Grid loading={subscriptions.isLoading} items={subscriptions.data ?? []} />
        </Section>
      )}

      <Section
        title="Anúncios publicados recentemente"
        subtitle="Os últimos produtos colocados à venda pelos vendedores."
        icon={<Clock className="h-4 w-4" />}
        action={
          <Link to="/produtos" search={{ q: "", cat: "todas", sort: "recentes" }}>
            <Button variant="ghost" className="gap-1 text-sm">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      >
        <Grid loading={recent.isLoading} items={recent.data ?? []} />
      </Section>

      {/* COMO FUNCIONA */}
      <Section
        title="Como funciona o LynkoMarketplace"
        subtitle="Conectamos quem compra e quem vende a negociação é entre vocês, a proteção é nossa."
        icon={<Sparkles className="h-4 w-4" />}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.t} className="relative rounded-2xl border border-border bg-card p-5 sm:p-6">
              <span className="absolute right-5 top-5 text-4xl font-black text-primary/10">
                {i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                {s.icon}
              </span>
              <p className="mt-4 text-base font-bold">{s.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PROTEÇÃO / TAXAS */}
      <Section
        title="Taxa de serviço justa"
        subtitle="Taxa fixa em centavos, igual para qualquer valor de compra. Somos justos em todos os níveis."
        icon={<ShieldCheck className="h-4 w-4" />}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {PROTECTION_TIERS.map((t, i) => (
            <div
              key={t.id}
              className={`relative rounded-2xl border bg-card p-6 transition hover:-translate-y-0.5 ${
                i === 1 ? "border-primary/60 shadow-glow" : "border-border"
              }`}
            >
              {i === 1 && (
                <Badge className="absolute -top-3 left-6 bg-gradient-primary text-primary-foreground">
                  Mais escolhida
                </Badge>
              )}
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="mt-2 text-3xl font-extrabold text-primary">
                +{formatPrice(t.feeCents)}
                <span className="ml-1 text-xs font-medium text-muted-foreground">por compra</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{t.tagline}</p>
              <ul className="mt-4 grid gap-2 text-sm">
                {t.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* AVALIAÇÕES RECENTES */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold sm:text-3xl">Avaliações recentes</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              O que os compradores estão dizendo agora mesmo na Lynko.
            </p>
          </div>
        </div>
        <ReviewsCarousel />
      </section>

      {/* CTA VENDEDORES */}

      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-70" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <Badge className="mb-4 gap-1 bg-primary/15 text-primary hover:bg-primary/20">
                <LineChart className="h-3 w-3" /> Para vendedores
              </Badge>
              <h2 className="text-xl font-extrabold sm:text-4xl">
                Venda 24 horas por dia, mesmo dormindo
              </h2>
              <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
                Cadastre o estoque de chaves uma vez e a Lynko entrega automaticamente a cada venda.
                Acompanhe saldo, avaliações e seguidores no painel e saque via Pix quando quiser.
              </p>
              <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-gradient-primary text-primary-foreground shadow-glow sm:w-auto"
                  >
                    <Store className="h-4 w-4" /> Abrir minha loja
                  </Button>
                </Link>
                <Link to="/vendedores" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                    <Users className="h-4 w-4" /> Ver vendedores
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {[
                "Estoque automático de chaves e contas",
                "Anúncios impulsionados aparecem em primeiro",
                "Perfil com banner, seguidores e avaliações",
                "Saque via Pix direto no painel",
              ].map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm backdrop-blur-xl"
                >
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTAs POR PERFIL */}
      <Section
        title="Qual é o seu perfil?"
        subtitle="Somos o marketplace no meio: cada lado tem um caminho pronto para começar."
        icon={<Users className="h-4 w-4" />}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {profileCtas.map((c) => (
            <div
              key={c.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 sm:p-6 transition hover:-translate-y-0.5 hover:border-primary/50"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                {c.icon}
              </span>
              <p className="mt-4 text-base font-bold">{c.title}</p>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.desc}</p>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                {c.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p}
                  </li>
                ))}
              </ul>
              <div className="mt-5">{c.link}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="FAQ do processo"
        subtitle="Passo a passo de compra, de venda e das verificações sem letras miúdas."
        icon={<HelpCircle className="h-4 w-4" />}
      >
        <div className="mx-auto max-w-3xl">
          <Tabs defaultValue={FAQ_GROUPS[0].id}>
            <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto">
              {FAQ_GROUPS.map((g) => (
                <TabsTrigger key={g.id} value={g.id}>
                  {g.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {FAQ_GROUPS.map((g) => (
              <TabsContent key={g.id} value={g.id} className="mt-4">
                <Accordion type="single" collapsible className="w-full">
                  {g.items.map((f, i) => (
                    <AccordionItem key={f.q} value={`${g.id}-${i}`} className="border-border">
                      <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Section>
    </div>
  );
}
