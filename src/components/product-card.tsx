import { Link } from "@tanstack/react-router";
import { BadgeCheck, Zap, Flame, ShoppingBag, ShieldCheck, ArrowUpRight } from "lucide-react";
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
      className="market-card group flex min-w-0 flex-col overflow-hidden"
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
          <div className="grid h-full place-items-center text-muted-foreground">
            <ShoppingBag className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.promoted && (
            <Badge className="gap-1 border-0 bg-white/90 text-violet-700 shadow-lg">
              <Flame className="h-3 w-3" /> Destaque
            </Badge>
          )}
          {product.auto_delivery && (
            <Badge className="gap-1 border-0 bg-black/60 text-white backdrop-blur">
              <Zap className="h-3 w-3 text-violet-300" /> Auto
            </Badge>
          )}
        </div>
        <FavoriteButton productId={product.id} className="absolute right-2.5 top-2.5" />
        <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
          {product.sales_count} vendas
        </span>
        <span className="absolute bottom-3 right-3 grid h-7 w-7 place-items-center rounded-full bg-white text-black opacity-0 transition group-hover:opacity-100">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-muted-foreground">
          <span className="truncate">
            {product.seller?.display_name || product.seller?.username}
          </span>
          {product.seller?.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />}
        </div>
        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug">{product.title}</h3>
        <p className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Compra protegida
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-3">
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-[.12em] text-muted-foreground">
              A partir de
            </span>
            <span className="text-lg font-black tracking-tight text-primary">
              {formatPrice(product.price_cents)}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground">ver anúncio</span>
        </div>
      </div>
    </Link>
  );
}
