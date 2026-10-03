import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Flame } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts } from "@/lib/marketplace";

export const Route = createFileRoute("/ofertas")({
  head: () => ({
    meta: [
      { title: "Ofertas reais | LynkoMarketplace" },
      {
        name: "description",
        content: "Encontre produtos em destaque e ofertas publicadas por vendedores da Lynko.",
      },
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
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header>
        <div className="flex items-center gap-2 text-primary">
          <Flame className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Ofertas reais</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">
          Descubra seu próximo produto digital.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A página mostra apenas anúncios ativos; não inventamos descontos ou contagens regressivas.
        </p>
      </header>
      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : data.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Ainda não há ofertas publicadas. Seja o primeiro vendedor.
        </div>
      )}
    </main>
  );
}
