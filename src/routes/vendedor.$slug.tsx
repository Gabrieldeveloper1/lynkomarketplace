import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  Loader2,
  BadgeCheck,

  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Flag,
  UserPlus,
  UserCheck,
  ShieldCheck,
  MapPin,
  Building2,
  Link as LinkIcon,
  CalendarDays,
  Package,
  Star,
  Zap,
} from "lucide-react";
import { levelLabel } from "@/lib/verification";
import { networkOf } from "@/lib/social";


import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import { StarRating } from "@/components/star-rating";
import { ReportDialog } from "@/components/report-dialog";
import { openConversation } from "@/components/chat-panel";
import { useAuth } from "@/hooks/use-auth";
import { timeAgo } from "@/lib/format";
import {
  fetchFollowerCount,
  fetchProducts,
  fetchSellerByUsername,
  fetchSellerReviews,
  ratingOf,
} from "@/lib/marketplace";

export const Route = createFileRoute("/vendedor/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.slug} — perfil do vendedor | LynkoMarketplace` },
      {
        name: "description",
        content: `Veja anúncios, avaliações e reputação do vendedor @${params.slug} no LynkoMarketplace.`,
      },
      { property: "og:title", content: `@${params.slug} — perfil do vendedor | LynkoMarketplace` },
      { property: "og:description", content: "Reputação, avaliações e anúncios do vendedor." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SellerPage,
});

function SellerPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<"follow" | "chat" | null>(null);


  const { data: seller, isLoading } = useQuery({
    queryKey: ["seller", slug],
    queryFn: () => fetchSellerByUsername(slug),
    refetchOnMount: "always",
  });

  const { data: products = [] } = useQuery({
    queryKey: ["seller-products", seller?.id],
    queryFn: () => fetchProducts({ sellerId: seller!.id, limit: 60 }),
    enabled: !!seller,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["seller-reviews", seller?.id],
    queryFn: () => fetchSellerReviews(seller!.id),
    enabled: !!seller,
  });

  const { data: followers = 0 } = useQuery({
    queryKey: ["followers", seller?.id],
    queryFn: () => fetchFollowerCount(seller!.id),
    enabled: !!seller,
  });

  const { data: isFollowing = false } = useQuery({
    queryKey: ["following", seller?.id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("follows")
        .select("seller_id")
        .eq("seller_id", seller!.id)
        .eq("follower_id", user!.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!seller && !!user,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Vendedor não encontrado</h1>
      </div>
    );
  }

  const rating = ratingOf(reviews);

  const toggleFollow = async () => {
    if (!user) return navigate({ to: "/auth", search: { redirect: `/vendedor/${slug}` } });
    if (user.id === seller.id) return toast.info("Não pode seguir a sua própria loja.");
    setBusy("follow");
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("seller_id", seller.id)
          .eq("follower_id", user.id);
        if (error) throw error;
        toast.success("Deixou de seguir esta loja.");
      } else {
        const add = () =>
          supabase.from("follows").insert({ seller_id: seller.id, follower_id: user.id });
        let { error } = await add();
        if (error?.code === "23503") {
          const { ensureMyProfile } = await import("@/lib/profile.functions");
          await ensureMyProfile();
          ({ error } = await add());
        }
        if (error && error.code !== "23505") throw error;
        toast.success("Agora segue esta loja.");
      }
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["following", seller.id, user.id] }),
        qc.invalidateQueries({ queryKey: ["followers", seller.id] }),
      ]);
    } catch (e) {
      console.error("[perfil] seguir falhou", { sellerId: seller.id, userId: user.id, error: e });
      toast.error(
        e instanceof Error && e.message
          ? `Não foi possível atualizar o seguimento: ${e.message}`
          : "Não foi possível atualizar o seguimento.",
      );
    } finally {
      setBusy(null);
    }
  };

  const chat = async () => {
    if (!user) return navigate({ to: "/auth", search: { redirect: `/vendedor/${slug}` } });
    if (user.id === seller.id) return toast.info("Este é o seu perfil.");
    setBusy("chat");
    try {
      const id = await openConversation({ buyerId: user.id, sellerId: seller.id });
      navigate({ to: "/mensagens", search: { c: id } });
    } catch (e) {
      console.error("[perfil] abrir conversa falhou", { sellerId: seller.id, userId: user.id, error: e });
      toast.error(
        e instanceof Error && e.message
          ? `Não foi possível abrir a conversa: ${e.message}`
          : "Não foi possível abrir a conversa.",
      );
    } finally {
      setBusy(null);
    }
  };


  return (
    <div className="pb-16">
      {/* Cover */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-hero sm:h-64">
        {seller.banner_url && (
          <img src={seller.banner_url} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* Identity card */}
        <div className="relative z-10 -mt-12 rounded-3xl border border-border bg-card p-4 shadow-card sm:-mt-16 sm:p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <Avatar className="h-24 w-24 shrink-0 border-4 border-background ring-2 ring-primary/25 sm:h-28 sm:w-28">
              <AvatarImage src={seller.avatar_url ?? undefined} />
              <AvatarFallback className="text-2xl">
                {seller.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h1 className="flex min-w-0 flex-wrap items-center gap-2 font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                <span className="break-words">{seller.display_name?.trim() || seller.username}</span>
                {seller.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />}
              </h1>
              <p className="text-sm text-muted-foreground">@{seller.username}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {seller.verified && (
                  <Badge className="gap-1 bg-gradient-primary text-primary-foreground">
                    <ShieldCheck className="h-3 w-3" /> Verificação {levelLabel(seller.verification_level)}
                  </Badge>
                )}
                {(seller.verif_city || seller.verif_country) && (
                  <Badge variant="secondary" className="gap-1 text-[11px]">
                    <MapPin className="h-3 w-3" />
                    {[seller.verif_city, seller.verif_country].filter(Boolean).join(", ")}
                  </Badge>
                )}
                {seller.verif_business && (
                  <Badge variant="secondary" className="gap-1 text-[11px]">
                    <Building2 className="h-3 w-3" /> {seller.verif_business}
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1 text-[11px]">
                  <CalendarDays className="h-3 w-3" /> No site {timeAgo(seller.created_at)}
                </Badge>
                {seller.verif_social && (
                  <a
                    href={seller.verif_social}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-[11px] text-primary underline"
                  >
                    <LinkIcon className="h-3 w-3" aria-hidden />{" "}
                    {networkOf(seller.verif_social_network)?.label ?? "Rede social"}
                  </a>
                )}
              </div>

              {seller.bio && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{seller.bio}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
              <Button
                onClick={toggleFollow}
                disabled={busy === "follow"}
                variant={isFollowing ? "secondary" : "default"}
                className="gap-2"
              >
                {busy === "follow" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isFollowing ? (
                  <UserCheck className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {busy === "follow" ? "A processar…" : isFollowing ? "A seguir" : "Seguir"}
              </Button>
              <Button onClick={chat} disabled={busy === "chat"} variant="outline" className="gap-2">
                {busy === "chat" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                {busy === "chat" ? "A abrir…" : "Mensagem"}
              </Button>

              <ReportDialog
                targetType="user"
                targetId={seller.id}
                trigger={
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <Flag className="h-4 w-4" /> Denunciar
                  </Button>
                }
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-4">
            <Stat label="Seguidores" value={String(followers)} icon={<Users className="h-4 w-4" />} />
            <Stat label="Anúncios" value={String(products.length)} icon={<Package className="h-4 w-4" />} />
            <Stat label="Avaliações" value={String(reviews.length)} icon={<Star className="h-4 w-4" />} />
            <Stat
              label="Reputação"
              value={rating === null ? "—" : `${rating}%`}
              icon={<ThumbsUp className="h-4 w-4" />}
              highlight={rating !== null && rating >= 80}
            />
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Pagamento protegido", text: "Valor retido até a entrega" },
            { icon: Zap, title: "Entrega automática", text: "Nos anúncios marcados com o raio" },
            { icon: MessageSquare, title: "Fale antes de comprar", text: "Chat direto com o vendedor" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-2.5 rounded-2xl border border-border bg-card p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold">{f.title}</span>
                <span className="block text-[11px] leading-snug text-muted-foreground">{f.text}</span>
              </span>
            </div>
          ))}
        </div>

        <Tabs defaultValue="anuncios" className="mt-8">
          <TabsList>
            <TabsTrigger value="anuncios">Anúncios</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            <TabsTrigger value="linha">Linha do tempo</TabsTrigger>
          </TabsList>


          <TabsContent value="anuncios" className="mt-6">
            {products.length ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este vendedor ainda não publicou anúncios.</p>
            )}
          </TabsContent>

          <TabsContent value="avaliacoes" className="mt-6">
            {reviews.length ? (
              <div className="grid gap-3">
                {reviews.map((r) => {
                  const buyer = (
                    r as { buyer?: { username?: string; display_name?: string | null; avatar_url?: string | null } }
                  ).buyer;
                  const name = buyer?.display_name || buyer?.username || "Cliente";
                  const stars = (r as { rating?: number | null }).rating;
                  return (
                    <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={buyer?.avatar_url ?? undefined} />
                          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{name}</p>
                          {buyer?.username && (
                            <p className="truncate text-xs text-muted-foreground">@{buyer.username}</p>
                          )}
                        </div>
                        {stars ? (
                          <StarRating value={stars} />
                        ) : r.positive ? (
                          <ThumbsUp className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
                      </div>
                      {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem avaliações ainda.</p>
            )}
          </TabsContent>

          <TabsContent value="linha" className="mt-6">
            <SellerTimeline
              createdAt={seller.created_at}
              verifiedAt={seller.verified_at}
              verificationLevel={seller.verification_level}
              products={products.map((p) => ({ id: p.id, title: p.title, created_at: p.created_at }))}
              reviews={reviews.map((r) => ({ id: r.id, positive: r.positive, created_at: r.created_at }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

type TimelineEvent = {
  id: string;
  at: string;
  title: string;
  detail?: string;
  tone: "neutral" | "good" | "bad";
};

function SellerTimeline({
  createdAt,
  verifiedAt,
  verificationLevel,
  products,
  reviews,
}: {
  createdAt: string;
  verifiedAt: string | null;
  verificationLevel: string | null;
  products: { id: string; title: string; created_at: string }[];
  reviews: { id: string; positive: boolean; created_at: string }[];
}) {
  const events: TimelineEvent[] = [
    { id: "joined", at: createdAt, title: "Entrou no LynkoMarketplace", tone: "neutral" as const },
    ...(verifiedAt
      ? [
          {
            id: "verified",
            at: verifiedAt,
            title: `Identidade verificada — nível ${levelLabel(verificationLevel)}`,
            tone: "good" as const,
          },
        ]
      : []),
    ...products.slice(0, 12).map((p) => ({
      id: `p-${p.id}`,
      at: p.created_at,
      title: "Publicou um anúncio",
      detail: p.title,
      tone: "neutral" as const,
    })),
    ...reviews.slice(0, 12).map((r) => ({
      id: `r-${r.id}`,
      at: r.created_at,
      title: r.positive ? "Recebeu avaliação positiva" : "Recebeu avaliação negativa",
      tone: r.positive ? ("good" as const) : ("bad" as const),
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <ol className="relative max-w-2xl border-l border-border pl-6">
      {events.map((ev) => (
        <li key={ev.id} className="relative pb-6 last:pb-0">
          <span
            className={`absolute -left-[1.9rem] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-background ${
              ev.tone === "good"
                ? "bg-emerald-500"
                : ev.tone === "bad"
                  ? "bg-destructive"
                  : "bg-muted-foreground"
            }`}
            aria-hidden
          />
          <p className="text-sm font-medium">{ev.title}</p>
          {ev.detail && <p className="text-sm text-muted-foreground">{ev.detail}</p>}
          <p className="text-[11px] text-muted-foreground">
            {new Date(ev.at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} ·{" "}
            {timeAgo(ev.at)}
          </p>
        </li>
      ))}
    </ol>
  );
}


function Stat({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon} {label}
      </div>
      <p className={`mt-1 text-xl font-extrabold ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
