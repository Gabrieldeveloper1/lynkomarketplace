import { Link } from "@tanstack/react-router";
import { FavoriteButton } from "@/components/favorite-button";
import { Icon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import type { ProductWithSeller } from "@/lib/marketplace";

export function ProductCard({ product }: { product: ProductWithSeller }) {
  const cover = product.images?.[0];
  const sellerName = product.seller?.display_name || product.seller?.username;
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-glow"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-surface">
        {cover ? (
          <img
            src={cover}
            alt={product.title}
            loading="lazy"
            decoding="async"
            width={640}
            height={400}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-grid text-primary/60">
            <Icon.Bag className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.promoted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-glow">
              <Icon.Flame className="h-3 w-3" /> Destaque
            </span>
          )}
          {product.auto_delivery && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
              <Icon.Zap className="h-3 w-3 text-[oklch(0.85_0.15_95)]" /> Automática
            </span>
          )}
        </div>
        <FavoriteButton productId={product.id} className="absolute right-2.5 top-2.5" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
            <Icon.User className="h-3 w-3" />
          </span>
          <span className="truncate">{sellerName}</span>
          {product.seller?.verified && <Icon.Verified className="h-3.5 w-3.5 shrink-0 text-primary" />}
        </div>
        <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug sm:text-[0.95rem]">
          {product.title}
        </h3>
        <p className="flex items-center gap-1 text-[11px] font-semibold text-success">
          <Icon.ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Entrega garantida
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-dashed border-border pt-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">A partir de</span>
            <span className="font-display text-lg font-extrabold text-gradient sm:text-xl">
              {formatPrice(product.price_cents)}
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-semibold text-primary">
            <Icon.Trend className="h-3 w-3" /> {product.sales_count} vendas
          </span>
        </div>
      </div>
    </Link>
  );
}
