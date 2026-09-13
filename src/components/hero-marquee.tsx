import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Zap, Package } from "lucide-react";
import { fetchProducts } from "@/lib/marketplace";
import { formatPrice } from "@/lib/format";

/** Slide animado com os anúncios publicados mais recentes. */
export function HeroMarquee() {
  const { data: products = [] } = useQuery({
    queryKey: ["products", "recent"],
    queryFn: () => fetchProducts({ sort: "recentes", limit: 8, promotedFirst: true }),
  });

  if (!products.length) {
    return (
      <div className="grid h-64 place-items-center rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground backdrop-blur-xl">
        <div>
          <Package className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3">
            Ainda não há anúncios publicados. Seja o primeiro a vender na Lynko!
          </p>
        </div>
      </div>
    );
  }

  const loop = [...products, ...products];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-4 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-card to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card to-transparent" />

      <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Publicados recentemente
      </p>

      <div className="marquee-mask flex gap-3 overflow-hidden">
        <div className="animate-marquee flex shrink-0 gap-3">
          {loop.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              to="/produto/$slug"
              params={{ slug: p.slug }}
              className="group flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-background transition hover:border-primary/50 hover:shadow-glow"
            >
              <div className="relative h-28 w-full overflow-hidden bg-accent">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-muted-foreground">
                    <Package className="h-6 w-6" />
                  </span>
                )}
                {p.auto_delivery && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                    <Zap className="h-3 w-3" /> Automático
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{p.title}</p>
                <p className="mt-1 text-sm font-extrabold text-primary">
                  {formatPrice(p.price_cents)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
