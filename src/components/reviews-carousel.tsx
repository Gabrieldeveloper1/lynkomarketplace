import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Star, ThumbsUp, ThumbsDown, Quote, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchRecentReviews } from "@/lib/marketplace";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units = [
    { label: "ano", seconds: 31536000 },
    { label: "mês", seconds: 2592000 },
    { label: "semana", seconds: 604800 },
    { label: "dia", seconds: 86400 },
    { label: "hora", seconds: 3600 },
    { label: "minuto", seconds: 60 },
  ];
  for (const unit of units) {
    const value = Math.floor(seconds / unit.seconds);
    if (value >= 1) {
      return `há ${value} ${unit.label}${value > 1 ? "s" : ""}`;
    }
  }
  return "agora";
}

type ReviewRow = {
  id: string;
  positive: boolean;
  rating: number | null;
  comment: string;
  created_at: string;
  buyer?: { username?: string; display_name?: string; avatar_url?: string | null } | null;
  product?: { title?: string; slug?: string; image_url?: string | null } | null;
};

function ReviewCard({ r }: { r: ReviewRow }) {
  const name = r.buyer?.display_name || `@${r.buyer?.username ?? "comprador"}`;
  const stars = r.rating ?? (r.positive ? 5 : 2);
  return (
    <article className="relative w-[300px] shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:w-[360px]">
      <Quote className="absolute right-4 top-4 h-8 w-8 rotate-6 text-primary/10" />
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          <AvatarImage src={r.buyer?.avatar_url ?? undefined} />
          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
            {(r.buyer?.username ?? "U").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{name}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 p-1.5 text-primary">
          {r.positive ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
        </span>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        “{r.comment || (r.positive ? "Compra tranquila, entrega rápida." : "A compra não correu como esperado.")}”
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-3">
        {r.product?.slug ? (
          <Link
            to="/produto/$slug"
            params={{ slug: r.product.slug }}
            className="group/link flex min-w-0 items-center gap-2 text-xs font-medium text-primary"
          >
            <Package className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate group-hover/link:underline">{r.product.title}</span>
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">Avaliação de compra</span>
        )}
        <span className="shrink-0 text-xs text-muted-foreground/80">{timeAgo(r.created_at)}</span>
      </div>
    </article>
  );
}

function ReviewSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[180px] w-[300px] shrink-0 animate-pulse rounded-2xl border border-border/60 bg-card p-5 sm:w-[360px]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-24 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewsCarousel() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["reviews", "recent"],
    queryFn: () => fetchRecentReviews(12),
  });

  if (isLoading) return <ReviewSkeleton />;

  const reviews = data as unknown as ReviewRow[];
  if (!reviews.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Ainda não há avaliações. As primeiras compras vão aparecer aqui.
      </div>
    );
  }

  const loop = reviews.length >= 4 ? [...reviews, ...reviews, ...reviews] : reviews;
  const duration = Math.max(20, reviews.length * 6);

  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div
        className="flex w-max gap-4 animate-[review-marquee_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((r, i) => (
          <ReviewCard key={`${r.id}-${i}`} r={r} />
        ))}
      </div>
    </div>
  );
}
