import { Link } from "@tanstack/react-router";
import { BadgeCheck, Zap, Flame, ShoppingBag, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorite-button";
import { formatPrice } from "@/lib/format";
import type { ProductWithSeller } from "@/lib/marketplace";

export function ProductCard({ product }: { product: ProductWithSeller }) {
  const cover = product.images?.[0];
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
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
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <ShoppingBag className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {product.promoted && (
              <Badge className="gap-1 bg-gradient-primary text-primary-foreground">
                <Flame className="h-3 w-3" /> Destaque
              </Badge>
            )}
            {product.auto_delivery && (
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" /> Automática
              </Badge>
            )}
          </div>
        </div>
        <FavoriteButton productId={product.id} className="absolute right-2 top-2" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-2 text-[11px] font-medium text-muted-foreground">
          <span className="truncate">
            {product.seller?.display_name || product.seller?.username}
          </span>
          {product.seller?.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />}
        </div>
        <h3 className="line-clamp-2 text-sm font-bold leading-snug sm:text-base">
          {product.title}
        </h3>
        <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Entrega garantida
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/70 pt-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
              A partir de
            </span>
            <span className="text-lg font-extrabold text-primary sm:text-xl">
              {formatPrice(product.price_cents)}
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold text-muted-foreground">
            {product.sales_count} vendas
          </span>
        </div>
      </div>
    </Link>
  );
}
