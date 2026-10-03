import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts } from "@/lib/marketplace";

export const Route = createFileRoute("/ofertas")({
  head: () => ({
    meta: [
      { title: "Ofertas — LynkoMarket" },
      { name: "description", content: "Encontre produtos em destaque no LynkoMarket." },
    ],
  }),
  component: OffersPage,
});
function OffersPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: () => fetchProducts({ sort: "menor", limit: 60, promotedFirst: true }),
    staleTime: 60_000,
  });
  return (
    <main className="lynko-page">
      <div className="lynko-grid-bg pointer-events-none absolute inset-x-0 top-0 h-[30rem] opacity-50" />
      <div className="lynko-shell relative py-10 sm:py-16">
        <div className="surface-card relative overflow-hidden p-7 sm:p-12">
          <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="eyebrow">
              <Flame className="h-3.5 w-3.5" /> curadoria de preço
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[.96] tracking-[-.075em] sm:text-6xl">
              Boas escolhas.
              <br />
              <span className="gradient-text">Melhor momento.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Anúncios ativos, vendedores reais e oportunidades para você comprar com clareza. Sem
              truque, sem contagem regressiva falsa.
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-[11px] font-bold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> compra protegida
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> seleção ao vivo
              </span>
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">
              Agora em destaque
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading ? "Carregando oportunidades..." : `${data.length} anúncios para explorar`}
            </p>
          </div>
          <span className="hidden items-center gap-1 text-xs font-bold text-primary sm:flex">
            Atualizado agora <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        {isLoading ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-[1.35rem]" />
            ))}
          </div>
        ) : data.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="surface-card mt-5 p-12 text-center text-sm text-muted-foreground">
            Ainda não há ofertas publicadas.
          </div>
        )}
      </div>
    </main>
  );
}
