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
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-accent">
        {cover ? (
          <img
            src={cover}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <ShoppingBag className="h-8 w-8" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
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
        <FavoriteButton productId={product.id} className="absolute right-2 top-2" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{product.seller?.display_name || product.seller?.username}</span>
          {product.seller?.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />}
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">{product.title}</h3>
        <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-500">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Entrega garantida
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <span className="text-base font-extrabold text-primary sm:text-lg">{formatPrice(product.price_cents)}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{product.sales_count} vendas</span>
        </div>
      </div>

    </Link>
  );
}
