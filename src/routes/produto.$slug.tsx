import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Zap,
  ShieldCheck,
  Flag,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ShoppingBag,
  Layers,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RefreshCcw,
  Headset,
  Package,
  Clock,
  Star,
  Lock,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/star-rating";
import { ProductCard } from "@/components/product-card";
import { ReportDialog } from "@/components/report-dialog";
import { FavoriteButton } from "@/components/favorite-button";

import { openConversation } from "@/components/chat-panel";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice, timeAgo } from "@/lib/format";
import {
  fetchProductBySlug,
  fetchProductReviews,
  fetchProducts,
  fetchVariants,
  ratingOf,
} from "@/lib/marketplace";

export const Route = createFileRoute("/produto/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ");
    return {
      meta: [
        { title: `${name} | LynkoMarketplace` },
        {
          name: "description",
          content:
            "Detalhes do anúncio, avaliações do vendedor e compra protegida no LynkoMarketplace.",
        },
        { property: "og:title", content: `${name} | LynkoMarketplace` },
        { property: "og:description", content: "Compra protegida com entrega automática." },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProdutoPage,
});

function ProdutoPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [buying, setBuying] = useState(false);
  const [variantId, setVariantId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const p = await fetchProductBySlug(slug);
      if (!p) throw notFound();
      return p;
    },
  });

  const { data: variants = [] } = useQuery({
    queryKey: ["variants", product?.id],
    queryFn: () => fetchVariants(product!.id),
    enabled: !!product,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["product-reviews", product?.id],
    queryFn: () => fetchProductReviews(product!.id),
    enabled: !!product,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", product?.category_slug],
    queryFn: () => fetchProducts({ category: product!.category_slug, limit: 5 }),
    enabled: !!product,
  });

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === variantId) ?? (variants.length ? variants[0] : null),
    [variants, variantId],
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <Skeleton className="aspect-[16/10] w-full rounded-3xl" />
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      </div>
    );
  }
  if (!product) return null;

  const rating = ratingOf(reviews);
  const displayPrice = selectedVariant ? selectedVariant.price_cents : product.price_cents;
  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;
  const soldOut = product.auto_delivery && displayStock <= 0;
  const maxQty = Math.max(1, Math.min(20, product.auto_delivery ? displayStock : 20));

  const buy = async () => {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: `/produto/${slug}` } });
      return;
    }
    setBuying(true);
    try {
      await navigate({
        to: "/checkout/$slug",
        params: { slug },
        search: { variant: selectedVariant?.id, qty: quantity },
      });
    } finally {
      setBuying(false);
    }
  };

  const chat = async () => {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: `/produto/${slug}` } });
      return;
    }
    if (user.id === product.seller_id) return toast.info("Este anúncio é seu.");
    try {
      await openConversation({
        buyerId: user.id,
        sellerId: product.seller_id,
        productId: product.id,
      });
      navigate({ to: "/mensagens" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao abrir conversa.");
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado!");
      }
    } catch {
      /* cancelado */
    }
  };

  const siteUrl = import.meta.env.VITE_SITE_URL || "http://localhost:3000";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    ...(product.description ? { description: product.description } : {}),
    ...(product.images?.length ? { image: product.images } : {}),
    url: `${siteUrl}/produto/${slug}`,
    offers: {
      "@type": "Offer",
      price: (displayPrice / 100).toFixed(2),
      priceCurrency: "BRL",
      url: `${siteUrl}/produto/${slug}`,
      availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
    ...(reviews.length > 0 && rating != null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(rating).toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 lg:pb-0 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Breadcrumb */}
      <nav
        aria-label="Trilha"
        className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
      >
        <Link to="/" className="transition-colors hover:text-foreground">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to="/produtos"
          search={{ q: "", cat: "todas", sort: "recentes" }}
          className="transition-colors hover:text-foreground"
        >
          Marketplace
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to="/produtos"
          search={{ q: "", cat: product.category_slug, sort: "recentes" }}
          className="transition-colors hover:text-foreground"
        >
          {product.category_slug}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate font-medium text-foreground">{product.title}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          {/* Gallery */}
          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <div className="relative flex-1 overflow-hidden rounded-3xl border border-border bg-card">
              <div className="aspect-[4/3] bg-accent sm:aspect-[16/10]">
                {product.images?.length ? (
                  <img
                    src={product.images[active]}
                    alt={`${product.title} — imagem ${active + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-muted-foreground">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                {product.promoted && (
                  <Badge className="bg-gradient-primary text-primary-foreground shadow-glow">
                    Destaque
                  </Badge>
                )}
                {product.auto_delivery && (
                  <Badge variant="secondary" className="gap-1">
                    <Zap className="h-3 w-3" /> Entrega automática
                  </Badge>
                )}
              </div>
              <Button
                variant="secondary"
                size="icon"
                onClick={share}
                aria-label="Partilhar anúncio"
                className="absolute right-3 top-3 rounded-full"
              >
                <Share2 className="h-4 w-4" />
              </Button>

              {product.images?.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Imagem anterior"
                    onClick={() =>
                      setActive((i) => (i - 1 + product.images.length) % product.images.length)
                    }
                    className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Próxima imagem"
                    onClick={() => setActive((i) => (i + 1) % product.images.length)}
                    className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                    {active + 1}/{product.images.length}
                  </span>
                </>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 sm:w-24 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActive(i)}
                    aria-label={`Imagem ${i + 1}`}
                    aria-current={i === active}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-16 sm:w-24 ${
                      i === active
                        ? "border-primary shadow-glow"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title block */}
          <div className="mt-6">
            <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              {product.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-primary" />
                {rating !== null ? `${rating}% positivas` : "Sem avaliações ainda"}
                <span className="text-muted-foreground/70">({reviews.length})</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                {product.auto_delivery ? `${displayStock} em estoque` : "Entrega manual"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Publicado {timeAgo(product.created_at)}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {product.category_slug}
              </Badge>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {[
              {
                icon: Lock,
                title: "Pagamento protegido",
                text: "O valor só é liberado após a entrega",
              },
              {
                icon: Zap,
                title: product.auto_delivery ? "Entrega imediata" : "Entrega acompanhada",
                text: product.auto_delivery
                  ? "Receba assim que pagar"
                  : "Suporte durante todo o pedido",
              },
              {
                icon: ShieldCheck,
                title: "Suporte e disputa",
                text: "Abra uma denúncia se algo falhar",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-2.5 rounded-2xl border border-border bg-card p-3"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold">{f.title}</span>
                  <span className="block text-[11px] leading-snug text-muted-foreground">
                    {f.text}
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* Detalhes e benefícios */}
          <section className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <p className="font-display text-sm font-bold">Detalhes do anúncio</p>
              <dl className="mt-3 grid gap-2 text-xs">
                {[
                  ["Categoria", product.category_slug],
                  [
                    "Tipo de entrega",
                    product.auto_delivery ? "Automática (imediata)" : "Manual pelo vendedor",
                  ],
                  [
                    "Disponibilidade",
                    product.auto_delivery
                      ? `${displayStock} unidade(s) em estoque`
                      : "Sob combinação",
                  ],
                  ["Vendas concluídas", String(product.sales_count ?? 0)],
                  ["Publicado", timeAgo(product.created_at)],
                  ...(selectedVariant
                    ? [["Variação escolhida", selectedVariant.name] as const]
                    : []),
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-start justify-between gap-3 border-b border-border/60 pb-2"
                  >
                    <dt className="shrink-0 text-muted-foreground">{k}</dt>
                    <dd className="min-w-0 break-words text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <p className="font-display text-sm font-bold">Benefícios de comprar aqui</p>
              <ul className="mt-3 grid gap-3">
                {[
                  {
                    icon: Lock,
                    title: "Dinheiro protegido",
                    text: "O valor fica retido conosco até você confirmar que recebeu.",
                  },
                  {
                    icon: Sparkles,
                    title: product.auto_delivery ? "Recebe em segundos" : "Prazo acompanhado",
                    text: product.auto_delivery
                      ? "A entrega cai no chat assim que o Pix é aprovado."
                      : "Acompanhamos o prazo combinado com o vendedor.",
                  },
                  {
                    icon: RefreshCcw,
                    title: "Reembolso em caso de falha",
                    text: "Item inválido ou não entregue devolve o valor pago.",
                  },
                  {
                    icon: Headset,
                    title: "Suporte com histórico",
                    text: "A moderação entra no chat e analisa as duas versões.",
                  },
                ].map((b) => (
                  <li key={b.title} className="flex items-start gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <b.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold">{b.title}</span>
                      <span className="block text-[11px] leading-snug text-muted-foreground">
                        {b.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/protecao"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Como funciona a proteção <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </section>

          {/* Tabs */}
          <Tabs defaultValue="descricao" className="mt-8">
            <TabsList className="h-auto flex-wrap gap-1">
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações ({reviews.length})</TabsTrigger>
              <TabsTrigger value="entrega">Entrega e proteção</TabsTrigger>
            </TabsList>

            <TabsContent value="descricao">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {product.description ||
                    "O vendedor não adicionou uma descrição para este anúncio."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="avaliacoes">
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Este produto ainda não tem avaliações.
                </div>
              ) : (
                <div className="grid gap-3">
                  {reviews.map((r) => {
                    const buyer = (
                      r as {
                        buyer?: {
                          username?: string;
                          display_name?: string | null;
                          avatar_url?: string | null;
                        };
                      }
                    ).buyer;
                    const name = buyer?.display_name || buyer?.username || "Cliente";
                    const stars = (r as { rating?: number | null }).rating;
                    return (
                      <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={buyer?.avatar_url ?? undefined} />
                            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{name}</p>
                            {buyer?.username && (
                              <p className="truncate text-xs text-muted-foreground">
                                @{buyer.username}
                              </p>
                            )}
                          </div>
                          {stars ? (
                            <StarRating value={stars} />
                          ) : r.positive ? (
                            <ThumbsUp className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <ThumbsDown className="h-4 w-4 text-destructive" />
                          )}
                          <span className="ml-auto text-xs text-muted-foreground">
                            {timeAgo(r.created_at)}
                          </span>
                        </div>
                        {r.comment && (
                          <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="entrega">
              <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Como recebe: </strong>
                  {product.auto_delivery
                    ? "o conteúdo é entregue automaticamente no seu painel logo após a confirmação do pagamento."
                    : "o vendedor entrega manualmente pelo chat, dentro do prazo combinado."}
                </p>
                <p>
                  <strong className="text-foreground">Pagamento: </strong>
                  Pix instantâneo. O valor fica retido até a entrega ser confirmada.
                </p>
                <p>
                  <strong className="text-foreground">Problemas? </strong>
                  Fale primeiro com o vendedor pelo chat. Se não resolver, abra uma denúncia e a
                  nossa equipa analisa o caso.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <aside className="h-fit lg:sticky lg:top-20">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <div className="border-b border-border bg-gradient-surface p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Preço final
              </p>
              <p className="font-display text-4xl font-extrabold text-primary">
                {formatPrice(displayPrice * quantity)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {product.auto_delivery
                  ? `${displayStock} em estoque · entrega imediata`
                  : "Entrega manual pelo vendedor"}
              </p>
            </div>

            <div className="p-5">
              {variants.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Escolha a variação
                  </p>
                  <div className="mt-2 grid gap-2">
                    {variants.map((v) => {
                      const selected = selectedVariant?.id === v.id;
                      const out = product.auto_delivery && v.stock <= 0;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={out}
                          onClick={() => setVariantId(v.id)}
                          className={`rounded-2xl border p-3 text-left transition disabled:opacity-40 ${
                            selected
                              ? "border-primary bg-primary/5 shadow-glow"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                            <span className="flex items-center gap-1.5">
                              <Layers
                                className={`h-4 w-4 ${selected ? "text-primary" : "text-muted-foreground"}`}
                              />
                              {v.name}
                            </span>
                            <span className="text-primary">{formatPrice(v.price_cents)}</span>
                          </span>
                          <span className="mt-1 block text-[11px] text-muted-foreground">
                            {out ? "Esgotado" : v.description || `${v.stock} disponíveis`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Favoritos + quantidade */}
              <div className="mb-3 flex items-center gap-2">
                <FavoriteButton productId={product.id} variant="full" className="h-11 flex-1" />
                <div className="flex h-11 items-center rounded-md border border-border">
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="grid h-full w-10 place-items-center rounded-l-md text-lg font-bold transition hover:bg-accent disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-9 text-center text-sm font-bold tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    className="grid h-full w-10 place-items-center rounded-r-md text-lg font-bold transition hover:bg-accent disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={buy}
                disabled={buying || soldOut}
                className="w-full bg-gradient-primary text-primary-foreground shadow-glow"
                size="lg"
              >
                {buying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {soldOut
                  ? "Esgotado"
                  : `Comprar agora${quantity > 1 ? ` · ${formatPrice(displayPrice * quantity)}` : ""}`}
              </Button>
              <Button onClick={chat} variant="outline" className="mt-2 w-full gap-2">
                <MessageSquare className="h-4 w-4" /> Falar com o vendedor
              </Button>

              <div className="mt-3 flex items-start gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-500">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                Entrega garantida. Se o produto não for entregue, o dinheiro volta.
              </div>

              <div className="mt-2 flex items-start gap-2 rounded-2xl bg-accent/60 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Pagamento protegido. Escolhe o nível de proteção no checkout — a partir de +
                {formatPrice(10)}.
              </div>
            </div>
          </div>

          {/* Seller */}
          <div className="mt-4 rounded-3xl border border-border bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Vendido por
            </p>
            <Link
              to="/vendedor/$slug"
              params={{ slug: product.seller?.username ?? "" }}
              className="mt-3 flex items-center gap-3 rounded-2xl border border-transparent p-1 transition-colors hover:border-border"
            >
              <Avatar className="h-11 w-11">
                <AvatarImage src={product.seller?.avatar_url ?? undefined} />
                <AvatarFallback>
                  {(product.seller?.username ?? "U").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate font-semibold">
                  {product.seller?.display_name || product.seller?.username}
                  {product.seller?.verified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  @{product.seller?.username}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
            <ReportDialog
              targetType="product"
              targetId={product.id}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full gap-2 text-muted-foreground"
                >
                  <Flag className="h-4 w-4" /> Denunciar anúncio
                </Button>
              }
            />
          </div>
        </aside>
      </div>

      {related.filter((p) => p.id !== product.id).length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 font-display text-xl font-bold">Anúncios relacionados</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      )}

      {/* Barra fixa de compra no celular */}
      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl md:bottom-0 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Preço final
            </p>
            <p className="truncate font-display text-lg font-extrabold text-primary">
              {formatPrice(displayPrice * quantity)}
            </p>
          </div>
          <Button
            onClick={buy}
            disabled={buying || soldOut}
            className="ml-auto h-11 flex-1 bg-gradient-primary text-primary-foreground shadow-glow"
          >
            {buying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {soldOut ? "Esgotado" : "Comprar agora"}
          </Button>
        </div>
      </div>
    </div>
  );
}
