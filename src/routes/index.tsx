import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";
import { fetchCategories, fetchProducts } from "@/lib/marketplace";
import { ProductCard } from "@/components/product-card";
import { CategoryVisual } from "@/components/category-icon";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LynkoMarket — o marketplace do digital" },
      {
        name: "description",
        content:
          "Descubra, venda e receba produtos digitais com proteção, velocidade e reputação em uma só experiência.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [term, setTerm] = useState("");
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
  const featured = useQuery({
    queryKey: ["landing-featured"],
    queryFn: () => fetchProducts({ sort: "vendidos", limit: 4, promotedFirst: true }),
    staleTime: 60_000,
  });
  const latest = useQuery({
    queryKey: ["landing-latest"],
    queryFn: () => fetchProducts({ sort: "recentes", limit: 8, promotedFirst: true }),
    staleTime: 60_000,
  });
  const categoryItems = (categories.data ?? []).slice(0, 8);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate({ to: "/produtos", search: { q: term, cat: "todas", sort: "recentes" } });
  };

  return (
    <div className="lynko-page">
      <section className="relative overflow-hidden border-b border-border">
        <div className="lynko-grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="lynko-orb lynko-orb-purple -right-24 top-10 h-80 w-80" />
        <div className="lynko-orb lynko-orb-pink left-[38%] top-40 h-64 w-64" />
        <div className="lynko-shell relative grid gap-12 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:grid-cols-[1.04fr_.96fr] lg:items-center lg:gap-10 lg:pt-24">
          <div>
            <span className="eyebrow">A nova camada do digital</span>
            <h1 className="mt-6 max-w-3xl text-[3.25rem] font-black leading-[.94] tracking-[-.075em] sm:text-6xl lg:text-[5.8rem]">
              Descubra o que <span className="gradient-text">move</span> o seu próximo passo.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Um marketplace feito para comprar sem ruído e vender com clareza. Produtos digitais,
              vendedores reais e proteção em cada transação.
            </p>
            <form
              onSubmit={submitSearch}
              className="surface-card mt-8 flex max-w-xl items-center gap-2 p-2 transition focus-within:border-primary/60 focus-within:shadow-glow"
            >
              <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="O que você quer encontrar hoje?"
                className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm font-medium outline-none placeholder:text-muted-foreground"
                aria-label="Buscar produtos"
              />
              <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-primary px-4 text-sm font-extrabold text-primary-foreground shadow-glow transition hover:brightness-110">
                Buscar <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> pagamento protegido
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" /> entrega automática
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-primary" /> reputação real
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[31rem] lg:ml-auto">
            <div className="surface-card relative overflow-hidden p-4 sm:p-5">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-primary">
                    Lynko pulse
                  </p>
                  <p className="mt-1 text-sm font-bold">O que está acontecendo agora</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> ao vivo
                </span>
              </div>
              <div className="relative mt-5 grid gap-3">
                {[
                  {
                    title: "Gift cards e créditos",
                    detail: "+ 24 anúncios hoje",
                    icon: Store,
                    tone: "bg-violet-400/12 text-violet-300",
                  },
                  {
                    title: "Jogos & contas",
                    detail: "mais procurados agora",
                    icon: Sparkles,
                    tone: "bg-pink-400/12 text-pink-300",
                  },
                  {
                    title: "Serviços com entrega rápida",
                    detail: "97% satisfação média",
                    icon: Zap,
                    tone: "bg-cyan-400/12 text-cyan-300",
                  },
                ].map(({ title, detail, icon: Icon, tone }, index) => (
                  <div
                    key={title}
                    className="surface-card-soft flex items-center gap-3 p-3.5"
                    style={{ transform: `translateX(${index * 8}px)` }}
                  >
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{title}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4">
                <Metric value="8k+" label="produtos" />
                <Metric value="4.9" label="nota média" />
                <Metric value="24/7" label="proteção" />
              </div>
            </div>
            <div className="lynko-float absolute -bottom-8 -left-5 hidden rounded-2xl border border-primary/25 bg-card p-3 shadow-glow sm:flex sm:items-center sm:gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/12 text-emerald-400">
                <Check className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-extrabold">Compra confirmada</p>
                <p className="text-[10px] text-muted-foreground">entrega liberada em segundos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lynko-shell py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Explore por intenção</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-.055em] sm:text-4xl">
              Comece pelo que <span className="text-primary">você procura.</span>
            </h2>
          </div>
          <Link
            to="/produtos"
            search={{ q: "", cat: "todas", sort: "recentes" }}
            className="hidden items-center gap-1 text-xs font-bold text-primary sm:flex"
          >
            Ver tudo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categoryItems.map((category, index) => (
            <Link
              key={category.slug}
              to="/produtos"
              search={{ q: "", cat: category.slug, sort: "recentes" }}
              className="group surface-card-soft p-3 transition hover:-translate-y-1 hover:border-primary/50 hover:bg-accent/60"
            >
              <span
                className={`grid aspect-square place-items-center rounded-xl ${index % 2 === 0 ? "bg-primary/12 text-primary" : "bg-white/5 text-foreground"}`}
              >
                <CategoryVisual
                  category={category}
                  className="h-6 w-6"
                  imageClassName="h-full w-full rounded-xl object-cover"
                />
              </span>
              <span className="mt-3 block truncate text-xs font-bold">{category.name}</span>
              <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                explorar <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative border-y border-border bg-card/30 py-16 sm:py-20">
        <div className="lynko-shell">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Curadoria Lynko</span>
              <h2 className="mt-3 text-3xl font-black tracking-[-.055em] sm:text-4xl">
                Escolhas que já estão <span className="gradient-text">bombando.</span>
              </h2>
            </div>
            <Link
              to="/ofertas"
              className="hidden items-center gap-1 text-xs font-bold text-primary sm:flex"
            >
              Ver ofertas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-[1.35rem] bg-muted" />
                ))
              : (featured.data ?? []).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      <section className="lynko-shell grid gap-6 py-16 sm:py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-stretch">
        <div className="surface-card relative overflow-hidden p-7 sm:p-9">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <span className="eyebrow">Confiança por design</span>
          <h2 className="relative mt-4 max-w-md text-3xl font-black tracking-[-.06em] sm:text-4xl">
            Compre como se o produto já fosse seu.
          </h2>
          <p className="relative mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Do primeiro clique à entrega, cada etapa tem contexto. Você sabe quem vende, o que está
            comprando e quando o pagamento é liberado.
          </p>
          <div className="relative mt-8 grid gap-3">
            {[
              {
                icon: LockKeyhole,
                title: "Pagamento em custódia",
                text: "Seu dinheiro só segue quando a entrega acontece.",
              },
              {
                icon: ShieldCheck,
                title: "Proteção em camadas",
                text: "Sinais de confiança visíveis antes da compra.",
              },
              {
                icon: MessageIcon,
                title: "Suporte humano",
                text: "Conversa direta e moderação quando precisar.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <span className="icon-tile h-9 w-9 rounded-lg">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TrustStat value="99,2%" label="entregas concluídas" />
          <TrustStat value="4.9/5" label="experiência média" />
          <TrustStat value="< 2 min" label="tempo de liberação" />
          <TrustStat value="24/7" label="monitoramento" />
        </div>
      </section>

      <section className="lynko-shell border-t border-border py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Novo no marketplace</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-.055em] sm:text-4xl">
              Acabou de chegar.
            </h2>
          </div>
          <Link
            to="/produtos"
            search={{ q: "", cat: "todas", sort: "recentes" }}
            className="hidden items-center gap-1 text-xs font-bold text-primary sm:flex"
          >
            Explorar novidades <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(latest.data ?? []).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="lynko-shell pb-20">
        <div className="relative overflow-hidden rounded-[1.65rem] border border-primary/25 bg-gradient-primary p-8 text-primary-foreground shadow-glow sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[.18em] text-white/70">
                Para quem cria e vende
              </span>
              <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-.06em] sm:text-5xl">
                Seu produto merece um lugar à altura.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">
                Publique em minutos, automatize a entrega e transforme reputação em recorrência.
              </p>
            </div>
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-violet-700 transition hover:bg-white/90"
            >
              Começar a vender <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="metric-number text-lg font-black">{value}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="surface-card flex flex-col justify-end p-6">
      <span className="text-3xl font-black tracking-[-.07em] text-primary sm:text-4xl">
        {value}
      </span>
      <span className="mt-2 text-xs font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}
function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.1-.6L4 20l1.6-3.6A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
      <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" strokeLinecap="round" />
    </svg>
  );
}
