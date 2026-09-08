import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CardsSkeleton } from "@/components/loading";
import { fetchFavoriteProducts } from "@/lib/marketplace";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/favoritos")({
  head: () => ({
    meta: [
      { title: "Meus favoritos — LynkoMarketplace" },
      { name: "description", content: "Os anúncios que você guardou para comprar depois no LynkoMarketplace." },
      { property: "og:title", content: "Meus favoritos — LynkoMarketplace" },
      { property: "og:description", content: "Os anúncios que você guardou para comprar depois." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const { user } = useAuth();
  const { data = [], isLoading } = useQuery({
    queryKey: ["favorites", "products", user?.id],
    queryFn: () => fetchFavoriteProducts(user!.id),
    enabled: !!user,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <header className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Heart className="h-5 w-5 fill-current" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold sm:text-2xl">Meus favoritos</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Carregando…" : `${data.length} anúncio${data.length === 1 ? "" : "s"} guardado${data.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </header>

      {isLoading ? (
        <CardsSkeleton count={8} />
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Você ainda não guardou nenhum anúncio. Toque no coração de um produto para salvá-lo aqui.
          </p>
          <div className="mt-4">
            <Button asChild className="bg-gradient-primary text-primary-foreground">
              <Link to="/produtos" search={{ q: "", cat: "todas", sort: "recentes" }}>
                Ver anúncios
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
