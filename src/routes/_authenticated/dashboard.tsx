import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wallet,
  Package,
  ShoppingBag,
  Plus,
  Loader2,
  BadgeCheck,
  Trash2,
  Zap,
  RefreshCw,
  Flame,
  TrendingUp,
  Store,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Eye,
  EyeOff,
  ShieldAlert,
  LayoutDashboard,
  Bell,
  User as UserIcon,
  Clock,
  AlertTriangle,
  ShieldCheck,
  MessageCircleQuestion,
  ArrowUpRight,
  BarChart3,
  ReceiptText,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ImagePlus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WarningsCard } from "@/components/warnings-card";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice, slugify, timeAgo, FEE_RATE } from "@/lib/format";
import { VariantManager } from "@/components/variant-manager";
import { StarRating } from "@/components/star-rating";
import { MetricsTab, StatementTab } from "@/components/dashboard-finance";
import { Layers } from "lucide-react";
import { fetchCategories, fetchMyReviews, uploadMedia } from "@/lib/marketplace";
import {
  requestWithdrawal,
  verifyPayment,
  syncMyOrders,
  submitAppeal,
  markOrderShipped,
} from "@/lib/commerce.functions";
import { ORDER_FLOW, orderStatusClass, orderStatusLabel, orderStepIndex } from "@/lib/order-status";

import { AdminBadge } from "@/components/site-header";
import { ADMIN_SUPPORT_DISCORD_URL } from "@/lib/support";
import { PageLoader, Spinner } from "@/components/loading";
import { Icon, Constellation, Orb, Rings } from "@/components/icons";
import { EmptyState, PageHeader, Panel, Pill, SectionTitle, StatCard } from "@/components/lynko-ui";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel do usuário | LynkoMarketplace" },
      {
        name: "description",
        content: "Gerencie anúncios, compras, vendas, saldo e saques no painel LynkoMarketplace.",
      },
      { property: "og:title", content: "Painel do usuário | LynkoMarketplace" },
      { property: "og:description", content: "Dashboard completo de compras, vendas e carteira." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});


function BanNotice() {
  const { profile } = useAuth();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (msg.trim().length < 20)
      return toast.error("Explica a tua apelação com pelo menos 20 caracteres.");
    setBusy(true);
    try {
      await submitAppeal({ data: { message: msg.trim() } });
      setSent(true);
      toast.success("Apelação enviada. A equipe vai analisar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl border border-destructive/40 bg-destructive/5 p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-destructive/20 blur-3xl" />
      <h2 className="relative flex items-center gap-2 font-display text-lg font-bold text-destructive">
        <Icon.Alert className="h-5 w-5" /> Conta suspensa
      </h2>
      <p className="relative mt-2 text-sm text-muted-foreground">
        Podes continuar a navegar e ver produtos, mas não podes comprar, vender, enviar mensagens nem
        abrir denúncias. Motivo:{" "}
        <strong className="text-foreground">
          {(profile as { ban_reason?: string | null })?.ban_reason || "Violação dos termos de uso."}
        </strong>
      </p>
      {sent ? (
        <p className="relative mt-4 rounded-2xl border border-border bg-card p-4 text-sm">
          Apelação em análise. Vais ser notificado assim que a equipe decidir.
        </p>
      ) : (
        <div className="relative mt-4 grid gap-2">
          <Label htmlFor="appeal">Apelação (explica o que aconteceu)</Label>
          <Textarea
            id="appeal"
            rows={4}
            maxLength={2000}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Descreve a tua versão dos fatos e porque a suspensão deve ser revista."
          />
          <Button disabled={busy} onClick={send} className="w-fit">
            {busy ? <Spinner /> : <Icon.Message className="h-4 w-4" />} Enviar apelação
          </Button>
        </div>
      )}
    </div>
  );
}

type NavItem = { v: string; i: React.ReactNode; l: string };

function QuickAction({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-3.5 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary transition group-hover:bg-gradient-primary group-hover:text-primary-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{title}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{text}</span>
      </span>
      <Icon.ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
}

function OrderLine({
  id,
  title,
  status,
  amount,
  highlight,
}: {
  id: string;
  title: string;
  status: string;
  amount: number;
  highlight?: boolean;
}) {
  return (
    <Link
      to="/pedido/$id"
      params={{ id }}
      className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-background/40 p-3 transition hover:border-primary/50 hover:bg-accent/50"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
        <Icon.Receipt className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{title}</span>
      <Badge className={orderStatusClass(status)}>{orderStatusLabel(status)}</Badge>
      <span className={`text-sm font-bold ${highlight ? "text-gradient" : ""}`}>{formatPrice(amount)}</span>
    </Link>
  );
}

function Dashboard() {
  const { user, profile, refreshProfile, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("visao");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const myProducts = useQuery({
    queryKey: ["my-products", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const purchases = useQuery({
    queryKey: ["purchases", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "*, product:products(title, slug, auto_delivery), seller:profiles!orders_seller_id_fkey(username)",
        )
        .eq("buyer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const sales = useQuery({
    queryKey: ["sales", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "*, product:products(title, auto_delivery), buyer:profiles!orders_buyer_id_fkey(username)",
        )
        .eq("seller_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const withdrawals = useQuery({
    queryKey: ["withdrawals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("seller_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const reviews = useQuery({
    queryKey: ["my-reviews", user?.id],
    queryFn: () => fetchMyReviews(user!.id),
    enabled: !!user,
  });

  // Notificação em tempo real quando a equipe muda o status de um saque.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`withdrawals-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "withdrawals",
          filter: `seller_id=eq.${user.id}`,
        },
        (payload) => {
          const next = payload.new as {
            status: string;
            note?: string | null;
            reason?: string | null;
          };
          const prev = payload.old as { status?: string };
          if (next.status === prev?.status) return;
          const detail = next.reason || next.note || "";
          if (next.status === "paid") toast.success(`Saque aprovado e pago! ${detail}`);
          else if (next.status === "rejected") toast.error(`Saque recusado. ${detail}`);
          else toast.info(`Status do saque atualizado: ${next.status}`);
          withdrawals.refetch();
          void refreshProfile();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Só contam vendas realmente pagas nada de pendentes, canceladas ou reembolsadas.
  const paidSales = (sales.data ?? []).filter((o) =>
    ["paid", "shipped", "delivered", "completed"].includes(o.status),
  );
  const revenue = paidSales.reduce((sum, o) => sum + o.seller_amount_cents, 0);

  // Automação: verifica pagamentos pendentes no Efí e entrega automaticamente.
  const pendingPurchases = (purchases.data ?? []).filter((o) => o.status === "pending").length;
  useEffect(() => {
    if (!user || pendingPurchases === 0) return;
    let stop = false;
    const run = async () => {
      try {
        const res = await syncMyOrders({ data: undefined });
        if (!stop && res.updated > 0) {
          purchases.refetch();
          void refreshProfile();
          toast.success("Pagamento confirmado e produto entregue automaticamente!");
        }
      } catch {
        /* silencioso */
      }
    };
    void run();
    const id = setInterval(run, 20000);
    return () => {
      stop = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, pendingPurchases]);

  if (authLoading) return <PageLoader label="Preparando sua central de vendas…" />;

  const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
    {
      group: "Visão geral",
      items: [{ v: "visao", i: <Icon.Dashboard className="h-4 w-4" />, l: "Resumo" }],
    },
    {
      group: "Negociações",
      items: [
        { v: "compras", i: <Icon.Bag className="h-4 w-4" />, l: "Minhas compras" },
        { v: "vendas", i: <Icon.Trend className="h-4 w-4" />, l: "Minhas vendas" },
        { v: "anuncios", i: <Icon.Package className="h-4 w-4" />, l: "Meus anúncios" },
        { v: "novo", i: <Icon.PlusCircle className="h-4 w-4" />, l: "Publicar anúncio" },
      ],
    },
    {
      group: "Financeiro",
      items: [
        { v: "carteira", i: <Icon.Wallet className="h-4 w-4" />, l: "Carteira e saques" },
        { v: "extrato", i: <Icon.Receipt className="h-4 w-4" />, l: "Extrato" },
        { v: "metricas", i: <Icon.Chart className="h-4 w-4" />, l: "Métricas" },
      ],
    },
    {
      group: "Conta",
      items: [
        { v: "perfil", i: <Icon.User className="h-4 w-4" />, l: "Perfil e loja" },
        { v: "avaliacoes", i: <Icon.Star className="h-4 w-4" />, l: "Minhas avaliações" },
      ],
    },
  ];

  const shortcutCls =
    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground";
  const name = profile?.display_name || profile?.username;

  return (
    <div className="relative mx-auto min-w-0 max-w-7xl overflow-x-hidden px-3 py-5 sm:px-4 sm:py-8">
      {profile?.banned && <BanNotice />}

      <Tabs
        value={tab}
        onValueChange={setTab}
        className="grid min-w-0 gap-5 lg:grid-cols-[272px_minmax(0,1fr)] lg:items-start lg:gap-7"
      >
        <aside className="min-w-0 lg:sticky lg:top-24">
          {/* Cartão do usuário */}
          <div className="gradient-border relative overflow-hidden rounded-3xl p-4 shadow-card">
            <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative flex items-center gap-3">
              <span className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback>{(profile?.username ?? "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-success" />
              </span>
              <div className="min-w-0">
                <p className="flex min-w-0 items-center gap-1.5 text-sm font-bold">
                  <span className="truncate">{name}</span>
                  {profile?.verified && <Icon.Verified className="h-4 w-4 shrink-0 text-primary" />}
                </p>
                <p className="truncate text-xs text-muted-foreground">@{profile?.username}</p>
                {isAdmin && <AdminBadge className="mt-1" />}
              </div>
            </div>
            <div className="relative mt-4 rounded-2xl bg-gradient-primary p-3.5 text-primary-foreground">
              <p className="flex items-center gap-1.5 text-[11px] font-medium opacity-85">
                <Icon.Wallet className="h-3.5 w-3.5" /> Saldo disponível
              </p>
              <p className="mt-1 font-display text-xl font-extrabold">
                {profile ? formatPrice(profile.balance_cents ?? 0) : "—"}
              </p>
            </div>
            {profile?.username && (
              <Link to="/vendedor/$slug" params={{ slug: profile.username }} className="relative mt-3 block">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Icon.Store className="h-4 w-4" /> Ver minha loja
                  <Icon.ArrowUpRight className="ml-auto h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Navegação */}
          <div className="mt-3 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0">
            <TabsList className="flex h-auto w-max min-w-full flex-row justify-start gap-1 rounded-3xl border border-border bg-card/70 p-2 shadow-card backdrop-blur lg:w-full lg:flex-col lg:items-stretch lg:gap-0">
              {NAV_GROUPS.map((g) => (
                <div key={g.group} className="contents lg:block lg:w-full">
                  <p className="eyebrow hidden px-3 pb-1 pt-3 lg:flex">{g.group}</p>
                  {g.items.map((t) => (
                    <TabsTrigger
                      key={t.v}
                      value={t.v}
                      className="group relative shrink-0 gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground lg:w-full lg:justify-start data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
                    >
                      {t.i} {t.l}
                    </TabsTrigger>
                  ))}
                </div>
              ))}
              <div className="contents lg:block lg:w-full">
                <p className="eyebrow hidden px-3 pb-1 pt-3 lg:flex">Atalhos</p>
                <Link to="/notificacoes" className={shortcutCls}>
                  <Icon.Bell className="h-4 w-4" /> Notificações
                </Link>
                <Link to="/mensagens" search={{ c: undefined }} className={shortcutCls}>
                  <Icon.Message className="h-4 w-4" /> Mensagens
                </Link>
                <Link to="/verificacao" className={shortcutCls}>
                  <Icon.ShieldCheck className="h-4 w-4" /> Verificação
                </Link>
              </div>
            </TabsList>
          </div>
        </aside>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-w-0 overflow-x-hidden"
          >
            <TabsContent value="visao" className="mt-0 grid gap-5">
              {/* Hero */}
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-surface p-6 shadow-card sm:p-8">
                <div className="aurora" aria-hidden="true" />
                <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_80%_90%_at_100%_0%,#000,transparent_70%)]" aria-hidden="true" />
                <Constellation className="pointer-events-none absolute right-4 top-4 hidden h-36 w-64 text-primary opacity-70 sm:block" />
                <div className="relative flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill icon={<Icon.Rocket className="h-3 w-3" />}>Central do vendedor</Pill>
                    {profile?.verified && (
                      <Pill tone="green" icon={<Icon.ShieldCheck className="h-3 w-3" />}>
                        Verificado
                      </Pill>
                    )}
                  </div>
                  <div>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                      Olá, <span className="text-gradient">{name}</span>
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                      Acompanhe sua operação, cuide dos anúncios e transforme visitas em vendas com mais
                      clareza.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <Button size="lg" onClick={() => setTab("novo")} className="gap-2">
                      <Icon.Plus className="h-4 w-4" /> Novo anúncio
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setTab("carteira")} className="gap-2">
                      <Icon.Wallet className="h-4 w-4" /> Sacar saldo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow animate-rise">
                  <Rings className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 text-white opacity-40" />
                  <div className="relative flex items-start justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-85">
                      Saldo disponível
                    </p>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur">
                      <Icon.Wallet className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="relative mt-3 font-display text-[1.75rem] font-extrabold leading-none">
                    {profile ? (
                      formatPrice(profile.balance_cents ?? 0)
                    ) : (
                      <Skeleton className="h-8 w-28 bg-white/25" />
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("carteira")}
                    className="relative mt-3 inline-flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white/30"
                  >
                    Realizar saque <Icon.ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <StatCard
                  delay={80}
                  label="Receita das vendas"
                  icon={<Icon.Trend className="h-4 w-4" />}
                  tone="green"
                  value={sales.isLoading ? <Skeleton className="h-8 w-28" /> : formatPrice(revenue)}
                  hint={`${paidSales.length} venda${paidSales.length === 1 ? "" : "s"} paga${paidSales.length === 1 ? "" : "s"}, já com as taxas descontadas`}
                />
                <StatCard
                  delay={160}
                  label="Saque pendente"
                  icon={<Icon.Clock className="h-4 w-4" />}
                  tone="amber"
                  value={
                    withdrawals.isLoading ? <Skeleton className="h-8 w-28" /> : formatPrice(profile?.pending_cents ?? 0)
                  }
                  hint="Aguardando análise ou pagamento"
                />
              </div>

              {/* Atalhos */}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <QuickAction icon={<Icon.PlusCircle className="h-5 w-5" />} title="Publicar anúncio" text="Crie em 4 passos" onClick={() => setTab("novo")} />
                <QuickAction icon={<Icon.Package className="h-5 w-5" />} title="Meus anúncios" text={`${myProducts.data?.length ?? 0} publicados`} onClick={() => setTab("anuncios")} />
                <QuickAction icon={<Icon.Chart className="h-5 w-5" />} title="Métricas" text="Desempenho da loja" onClick={() => setTab("metricas")} />
                <QuickAction icon={<Icon.User className="h-5 w-5" />} title="Perfil e loja" text="Foto, banner e bio" onClick={() => setTab("perfil")} />
              </div>

              {/* Informativos */}
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <InfoCard
                  tone={profile?.verified ? "green" : "amber"}
                  icon={profile?.verified ? <Icon.Verified className="h-5 w-5" /> : <Icon.Alert className="h-5 w-5" />}
                  title={profile?.verified ? "Conta verificada" : "Conta não verificada"}
                  text={
                    profile?.verified
                      ? "Sua identidade foi confirmada. Você ganha mais confiança nas negociações."
                      : "Complete dados e segurança para ganhar mais confiança nas negociações."
                  }
                />
                <InfoCard icon={<Icon.Clock className="h-5 w-5" />} title="Prazos de entrega" text="Acompanhe prazos combinados e evite conversas perdidas." />
                <InfoCard icon={<Icon.Bell className="h-5 w-5" />} title="Alertas importantes" text="Notificações de pagamento, entrega e suporte ficam centralizadas." />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card">
                  <Orb className="animate-float-slow pointer-events-none absolute -right-4 -top-4 h-24 w-24 opacity-70" />
                  <p className="relative flex items-center gap-2 font-display text-sm font-bold">
                    <Icon.Discord className="h-4 w-4 text-primary" /> Suporte administrativo
                  </p>
                  <p className="relative mt-1.5 max-w-[32ch] text-xs text-muted-foreground">
                    Tire dúvidas sobre a conta e o site diretamente com os administradores no Discord.
                  </p>
                  <Button asChild size="sm" className="relative mt-4 gap-2">
                    <a href={ADMIN_SUPPORT_DISCORD_URL} target="_blank" rel="noreferrer">
                      <Icon.Message className="h-4 w-4" /> Falar no Discord
                    </a>
                  </Button>
                </div>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card">
                  <Rings className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-primary opacity-40" />
                  <p className="relative flex items-center gap-2 font-display text-sm font-bold">
                    <Icon.ShieldCheck className="h-4 w-4 text-primary" /> Segurança garantida
                  </p>
                  <p className="relative mt-1.5 max-w-[32ch] text-xs text-muted-foreground">
                    O pagamento permanece protegido até a confirmação da entrega.
                  </p>
                  <Link to="/protecao" className="relative mt-4 inline-block">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Icon.ArrowUpRight className="h-4 w-4" /> Entender proteção
                    </Button>
                  </Link>
                </div>
              </div>

              <WarningsCard />

              <div className="grid gap-4 lg:grid-cols-2">
                <Panel>
                  <SectionTitle icon={<Icon.Trend className="h-4 w-4" />} title="Últimas vendas" hint="Seus pedidos mais recentes"
                    action={<button type="button" onClick={() => setTab("vendas")} className="text-xs font-semibold text-primary hover:underline">Ver todas</button>} />
                  {(sales.data ?? []).length === 0 ? (
                    <EmptyState icon={<Icon.Trend className="h-6 w-6" />} title="Ainda sem vendas" text="Publique um anúncio para começar a vender." className="py-8" />
                  ) : (
                    <div className="grid gap-2">
                      {(sales.data ?? []).slice(0, 4).map((o) => (
                        <OrderLine key={o.id} id={o.id} title={(o as { product?: { title?: string } }).product?.title ?? "Produto"} status={o.status} amount={o.seller_amount_cents} highlight />
                      ))}
                    </div>
                  )}
                </Panel>
                <Panel>
                  <SectionTitle icon={<Icon.Bag className="h-4 w-4" />} title="Últimas compras" hint="O que você comprou"
                    action={<button type="button" onClick={() => setTab("compras")} className="text-xs font-semibold text-primary hover:underline">Ver todas</button>} />
                  {(purchases.data ?? []).length === 0 ? (
                    <EmptyState icon={<Icon.Bag className="h-6 w-6" />} title="Nenhuma compra ainda" text="Explore o marketplace e encontre algo para você." className="py-8" />
                  ) : (
                    <div className="grid gap-2">
                      {(purchases.data ?? []).slice(0, 4).map((o) => (
                        <OrderLine key={o.id} id={o.id} title={(o as { product?: { title?: string } }).product?.title ?? "Produto"} status={o.status} amount={o.amount_cents} />
                      ))}
                    </div>
                  )}
                </Panel>
              </div>
            </TabsContent>

            <TabsContent value="anuncios" className="mt-0">
              <MyProducts products={myProducts.data ?? []} categories={categories} onChange={() => myProducts.refetch()} />
            </TabsContent>

            <TabsContent value="novo" className="mt-0">
              <NewProduct
                categories={categories}
                onCreated={() => {
                  myProducts.refetch();
                  toast.success("Anúncio publicado!");
                }}
              />
            </TabsContent>

            <TabsContent value="compras" className="mt-0">
              <Purchases orders={purchases.data ?? []} onRefresh={() => purchases.refetch()} />
            </TabsContent>

            <TabsContent value="vendas" className="mt-0">
              <PageHeader eyebrow="Negociações" title="Minhas vendas" description="Entregue, acompanhe e receba." icon={<Icon.Trend className="h-5 w-5" />} />
              {(sales.data ?? []).length === 0 ? (
                <EmptyState icon={<Icon.Trend className="h-7 w-7" />} title="Ainda sem vendas" text="Quando alguém comprar um dos seus anúncios, aparece aqui." />
              ) : (
                <div className="grid gap-3">
                  {(sales.data ?? []).map((o) => (
                    <SaleRow key={o.id} order={o as SaleOrder} onRefresh={() => sales.refetch()} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="carteira" className="mt-0">
              <WalletTab
                balance={profile?.balance_cents ?? 0}
                pixKey={profile?.pix_key ?? ""}
                withdrawals={withdrawals.data ?? []}
                onDone={() => {
                  void refreshProfile();
                  withdrawals.refetch();
                }}
              />
            </TabsContent>

            <TabsContent value="extrato" className="mt-0">
              <StatementTab sales={sales.data ?? []} withdrawals={withdrawals.data ?? []} />
            </TabsContent>

            <TabsContent value="metricas" className="mt-0">
              <MetricsTab sales={sales.data ?? []} products={myProducts.data ?? []} />
            </TabsContent>

            <TabsContent value="avaliacoes" className="mt-0">
              <MyReviewsTab reviews={reviews.data ?? []} isLoading={reviews.isLoading} />
            </TabsContent>

            <TabsContent value="perfil" className="mt-0">
              <ProfileTab onSaved={() => void refreshProfile()} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
  tone = "violet",
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tone?: "violet" | "green" | "amber";
}) {
  const tones = { violet: "bg-primary/12 text-primary", green: "bg-success/15 text-success", amber: "bg-warning/20 text-warning" };
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card transition hover:border-primary/40">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>{icon}</span>
      <p className="mt-3 font-display text-sm font-bold">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}


type MyProduct = {
  id: string;
  title: string;
  description?: string | null;
  category_slug?: string;
  price_cents: number;
  status: string;
  stock: number;
  promoted: boolean;
  auto_delivery: boolean;
  slug: string;
  images?: string[] | null;
  sales_count?: number | null;
  created_at: string;
};

function PurchaseDeliveryActions({ orderId, status }: { orderId: string; status: string }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState<"chat" | "mod" | null>(null);
  const unavailable = status === "pending" || status === "cancelled";

  const open = async (withModeration: boolean) => {
    setBusy(withModeration ? "mod" : "chat");
    try {
      const { orderConversation, requestModeration } = await import("@/lib/commerce.functions");
      const { conversationId } = await orderConversation({ data: { orderId } });
      if (withModeration) {
        const reason = window
          .prompt("Explique o motivo da mediação (mínimo de 10 caracteres):")
          ?.trim();
        if (!reason) return;
        if (reason.length < 10) {
          toast.error("Informe um motivo com pelo menos 10 caracteres.");
          return;
        }
        await requestModeration({ data: { conversationId, reason } });
        toast.success("Mediação solicitada. A equipe entrará na conversa.");
      }
      navigate({ to: "/mensagens", search: { c: conversationId } });
    } catch (e) {
      console.error("[compra] abrir entrega/mediação falhou", e);
      toast.error(e instanceof Error ? e.message : "Não foi possível abrir a conversa da entrega.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        disabled={unavailable || busy === "chat"}
        onClick={() => open(false)}
      >
        {busy === "chat" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {status === "delivered" ? "Falar com o vendedor" : "Ir para a entrega"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={unavailable || busy === "mod"}
        onClick={() => open(true)}
      >
        {busy === "mod" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {unavailable ? "Disponível após pagamento" : "Pedir mediação"}
      </Button>
    </>
  );
}

type SaleOrder = {
  id: string;
  status: string;
  created_at: string;
  seller_amount_cents: number;
  product?: { title?: string; auto_delivery?: boolean } | null;
  buyer?: { username?: string } | null;
};

function SaleRow({ order: o, onRefresh }: { order: SaleOrder; onRefresh: () => void }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState<"ship" | "chat" | null>(null);
  const auto = !!o.product?.auto_delivery;

  const goToDelivery = async () => {
    setBusy("chat");
    try {
      const { orderConversation } = await import("@/lib/commerce.functions");
      const { conversationId } = await orderConversation({ data: { orderId: o.id } });
      navigate({ to: "/mensagens", search: { c: conversationId } });
    } catch (e) {
      console.error("[venda] abrir entrega falhou", e);
      toast.error(e instanceof Error ? e.message : "Não foi possível abrir a entrega.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{o.product?.title ?? "Produto"}</p>
        <p className="text-xs text-muted-foreground">
          Comprador @{o.buyer?.username} · {timeAgo(o.created_at)}
          {auto ? " · entrega automática" : ""}
        </p>
      </div>
      <Badge className={orderStatusClass(o.status)}>{orderStatusLabel(o.status)}</Badge>
      <span className="font-bold text-primary">{formatPrice(o.seller_amount_cents)}</span>
      {o.status === "paid" && !auto && (
        <Button
          size="sm"
          variant="outline"
          disabled={busy === "ship"}
          onClick={async () => {
            setBusy("ship");
            try {
              await markOrderShipped({ data: { orderId: o.id } });
              toast.success("Pedido marcado como enviado.");
              onRefresh();
            } catch (e) {
              console.error("[venda] marcar enviado falhou", e);
              toast.error(e instanceof Error ? e.message : "Não foi possível marcar como enviado.");
            } finally {
              setBusy(null);
            }
          }}
        >
          {busy === "ship" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Marcar como enviado
        </Button>
      )}
      {o.status !== "pending" && (
        <Button size="sm" variant="outline" disabled={busy === "chat"} onClick={goToDelivery}>
          {busy === "chat" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ir para a entrega
        </Button>
      )}
      <Button asChild size="sm" variant="ghost">
        <Link to="/pedido/$id" params={{ id: o.id }}>
          Ver pedido
        </Link>
      </Button>
    </div>
  );
}

function MyProducts({
  products,
  categories,
  onChange,
}: {
  products: MyProduct[];
  categories: { slug: string; name: string }[];
  onChange: () => void;
}) {
  const [stockFor, setStockFor] = useState<string | null>(null);
  const [editFor, setEditFor] = useState<string | null>(null);
  const [variantsFor, setVariantsFor] = useState<string | null>(null);
  const [keys, setKeys] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "archived">("all");
  const [sort, setSort] = useState<"recent" | "price" | "sales">("recent");
  const { user } = useAuth();

  const visibleProducts = [...products]
    .filter((p) => {
      const term = search.trim().toLowerCase();
      return (
        (!term || p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term)) &&
        (statusFilter === "all" || p.status === statusFilter)
      );
    })
    .sort((a, b) => {
      if (sort === "price") return b.price_cents - a.price_cents;
      if (sort === "sales") return (b.sales_count ?? 0) - (a.sales_count ?? 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center">
        <Package className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-xl font-bold">Sua vitrine começa aqui</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Você ainda não publicou anúncios. Crie seu primeiro produto com imagens, preço e entrega
          bem definidos.
        </p>
      </div>
    );
  }

  const addKeys = async (productId: string) => {
    const lines = keys
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    const { error } = await supabase
      .from("delivery_items")
      .insert(lines.map((content) => ({ product_id: productId, seller_id: user!.id, content })));
    if (error) return toast.error(error.message);
    const { data: countData } = await supabase
      .from("delivery_items")
      .select("id", { count: "exact" })
      .eq("product_id", productId)
      .eq("sold", false);
    const { error: stockError } = await supabase
      .from("products")
      .update({ stock: countData?.length ?? lines.length })
      .eq("id", productId);
    if (stockError) return toast.error(stockError.message);
    setKeys("");
    setStockFor(null);
    toast.success(`${lines.length} itens adicionados ao estoque.`);
    onChange();
  };

  const activeCount = products.filter((p) => p.status === "active").length;
  const pausedCount = products.filter((p) => p.status === "paused").length;
  const archivedCount = products.filter((p) => p.status === "archived").length;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total de anúncios</p>
          <p className="mt-1 text-2xl font-extrabold">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs text-muted-foreground">Ativos</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-500">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-muted-foreground">Pausados</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-500">{pausedCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Arquivados</p>
          <p className="mt-1 text-2xl font-extrabold">{archivedCount}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título ou slug"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="paused">Pausados</SelectItem>
              <SelectItem value="archived">Arquivados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="sales">Mais vendidos</SelectItem>
              <SelectItem value="price">Maior preço</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {visibleProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nenhum anúncio corresponde aos filtros.
        </div>
      ) : (
        visibleProducts.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30 sm:p-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-accent">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(p.price_cents)} · estoque {p.stock} · {p.sales_count ?? 0} vendas
                </p>
              </div>
              {p.promoted && (
                <Badge className="gap-1 bg-gradient-primary text-primary-foreground">
                  <Flame className="h-3 w-3" /> Destaque
                </Badge>
              )}
              <Badge
                variant="outline"
                className={
                  p.status === "active"
                    ? "border-emerald-500/30 text-emerald-500"
                    : "text-muted-foreground"
                }
              >
                {p.status === "active"
                  ? "Publicado"
                  : p.status === "paused"
                    ? "Pausado"
                    : "Arquivado"}
              </Badge>
              {p.auto_delivery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStockFor(stockFor === p.id ? null : p.id)}
                >
                  <Zap className="mr-2 h-4 w-4" /> Estoque automático
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVariantsFor(variantsFor === p.id ? null : p.id)}
              >
                <Layers className="mr-2 h-4 w-4" /> Variações
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const { error } = await supabase
                    .from("products")
                    .update({ promoted: !p.promoted })
                    .eq("id", p.id);
                  if (error) return toast.error(error.message);
                  toast.success(p.promoted ? "Destaque removido." : "Anúncio destacado no topo!");
                  onChange();
                }}
              >
                <Flame className="mr-2 h-4 w-4" /> {p.promoted ? "Remover destaque" : "Destacar"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditFor(editFor === p.id ? null : p.id)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const next = p.status === "active" ? "paused" : "active";
                  const { error } = await supabase
                    .from("products")
                    .update({ status: next })
                    .eq("id", p.id);
                  if (error) return toast.error(error.message);
                  toast.success(next === "active" ? "Anúncio reativado." : "Anúncio pausado.");
                  onChange();
                }}
              >
                {p.status === "active" ? (
                  <EyeOff className="mr-2 h-4 w-4" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                {p.status === "active" ? "Pausar" : "Reativar"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remover anúncio"
                onClick={async () => {
                  if (
                    !window.confirm(
                      `Remover definitivamente "${p.title}"? Esta ação não pode ser desfeita.`,
                    )
                  )
                    return;
                  const { error } = await supabase.from("products").delete().eq("id", p.id);
                  if (error) {
                    await supabase.from("products").update({ status: "archived" }).eq("id", p.id);
                    toast.success("Anúncio arquivado (tinha vendas associadas).");
                  } else {
                    toast.success("Anúncio removido.");
                  }
                  onChange();
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            {editFor === p.id && (
              <EditProduct
                product={p}
                categories={categories}
                onDone={() => {
                  setEditFor(null);
                  onChange();
                }}
              />
            )}

            {variantsFor === p.id && (
              <VariantManager productId={p.id} autoDelivery={p.auto_delivery} onChange={onChange} />
            )}

            {stockFor === p.id && (
              <div className="mt-4 grid gap-2">
                <Label htmlFor={`keys-${p.id}`}>Um item por linha (chaves, contas, links)</Label>
                <Textarea
                  id={`keys-${p.id}`}
                  rows={5}
                  value={keys}
                  onChange={(e) => setKeys(e.target.value)}
                />
                <Button className="w-fit" onClick={() => addKeys(p.id)}>
                  Adicionar ao estoque
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function EditProduct({
  product,
  categories,
  onDone,
}: {
  product: MyProduct;
  categories: { slug: string; name: string }[];
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState(product.category_slug ?? categories[0]?.slug ?? "");
  const [auto, setAuto] = useState(product.auto_delivery);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const priceCents = Math.round(Number(String(form.get("price")).replace(",", ".")) * 100);
    if (!priceCents || priceCents < 100) return toast.error("Preço mínimo R$ 1,00.");
    setBusy(true);
    const { error } = await supabase
      .from("products")
      .update({
        title: String(form.get("title")),
        description: String(form.get("description") ?? ""),
        price_cents: priceCents,
        category_slug: category,
        auto_delivery: auto,
      })
      .eq("id", product.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Anúncio atualizado.");
    onDone();
  };

  return (
    <form
      onSubmit={save}
      className="mt-4 grid gap-4 rounded-2xl border border-border bg-background p-4"
    >
      <div className="grid gap-2">
        <Label htmlFor={`e-title-${product.id}`}>Título</Label>
        <Input
          id={`e-title-${product.id}`}
          name="title"
          defaultValue={product.title}
          required
          maxLength={120}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`e-desc-${product.id}`}>Descrição</Label>
        <Textarea
          id={`e-desc-${product.id}`}
          name="description"
          rows={4}
          maxLength={4000}
          defaultValue={product.description ?? ""}
        />
        <p className="text-[11px] text-muted-foreground">
          Você pode usar Markdown na descrição: **negrito**, *itálico*, listas, links, código e
          tabelas.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`e-price-${product.id}`}>Preço (R$)</Label>
          <Input
            id={`e-price-${product.id}`}
            name="price"
            inputMode="decimal"
            defaultValue={(product.price_cents / 100).toFixed(2).replace(".", ",")}
          />
        </div>
        <div className="grid gap-2">
          <Label>Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Escolher" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border p-3">
        <Label htmlFor={`e-auto-${product.id}`} className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Entrega automática
        </Label>
        <Switch id={`e-auto-${product.id}`} checked={auto} onCheckedChange={setAuto} />
      </div>
      <div className="flex gap-2">
        <Button disabled={busy} className="bg-gradient-primary text-primary-foreground">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Guardar alterações
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}


function NewProduct({
  categories,
  onCreated,
}: {
  categories: { slug: string; name: string }[];
  onCreated: () => void;
}) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(1);
  const [auto, setAuto] = useState(true);
  const [category, setCategory] = useState(categories[0]?.slug ?? "");
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!category && categories[0]) setCategory(categories[0].slug);
  }, [categories, category]);

  const steps = [
    { title: "Informações", description: "Nome e descrição", icon: <Icon.Doc className="h-4 w-4" /> },
    { title: "Preço", description: "Valor e categoria", icon: <Icon.Tag className="h-4 w-4" /> },
    { title: "Entrega e mídia", description: "Como o cliente recebe", icon: <Icon.Image className="h-4 w-4" /> },
    { title: "Revisão", description: "Confira e publique", icon: <Icon.Rocket className="h-4 w-4" /> },
  ];

  const priceCents = Math.round(Number(price.replace(",", ".")) * 100) || 0;
  const fee = Math.round(priceCents * FEE_RATE);
  const net = Math.max(0, priceCents - fee);
  const categoryName = categories.find((c) => c.slug === category)?.name;

  const nextStep = () => {
    if (step === 1 && title.trim().length < 4)
      return toast.error("Informe um título com pelo menos 4 caracteres.");
    if (step === 2) {
      if (!priceCents || priceCents < 100) return toast.error("Informe um preço mínimo de R$ 1,00.");
      if (!category) return toast.error("Escolha uma categoria.");
    }
    setStep((current) => Math.min(4, current + 1));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 4) return nextStep();
    if (!priceCents || priceCents < 100) return toast.error("Preço mínimo R$ 1,00.");
    if (!category) return toast.error("Escolha uma categoria.");
    if (title.trim().length < 4) return toast.error("Informe um título válido.");
    setBusy(true);
    const { error } = await supabase.from("products").insert({
      seller_id: user!.id,
      title: title.trim(),
      slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`,
      description: `${description.trim()}${deliveryNote.trim() ? `\n\n### Informações de entrega\n${deliveryNote.trim()}` : ""}`,
      price_cents: priceCents,
      category_slug: category,
      auto_delivery: auto,
      images,
      stock: auto ? 0 : 1,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setImages([]);
    setTitle("");
    setDescription("");
    setPrice("");
    setDeliveryNote("");
    setStep(1);
    toast.success("Anúncio publicado com sucesso!");
    onCreated();
  };

  const upload = async (files: FileList | File[] | null) => {
    if (!files || !files.length || !user) return;
    try {
      const remaining = Math.max(0, 5 - images.length);
      const urls = await Promise.all(
        Array.from(files)
          .slice(0, remaining)
          .map((f) => uploadMedia(user.id, f)),
      );
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no upload.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
      <form onSubmit={submit} className="min-w-0">
        <PageHeader
          eyebrow="Novo anúncio"
          title="Monte uma vitrine que converte"
          description="Preencha cada etapa com calma. Um anúncio claro reduz dúvidas e aumenta a confiança do comprador."
          icon={<Icon.Rocket className="h-5 w-5" />}
        />

        {/* Etapas */}
        <ol className="mb-6 grid grid-cols-4 gap-2">
          {steps.map((item, index) => {
            const number = index + 1;
            const done = number < step;
            const current = number === step;
            return (
              <li key={item.title} className="min-w-0">
                <button
                  type="button"
                  onClick={() => number < step && setStep(number)}
                  disabled={number > step}
                  className={`relative w-full overflow-hidden rounded-2xl border p-3 text-left transition ${
                    current
                      ? "border-primary/60 bg-primary/10 shadow-glow"
                      : done
                        ? "border-primary/30 bg-card hover:border-primary/60"
                        : "border-border bg-card/50 opacity-70"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-bold ${
                      current || done ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? <Icon.Check className="h-4 w-4" /> : item.icon}
                  </span>
                  <span className="mt-2 hidden truncate text-xs font-bold sm:block">{item.title}</span>
                  <span className="hidden truncate text-[10px] text-muted-foreground sm:block">{item.description}</span>
                  {current && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary" />}
                </button>
              </li>
            );
          })}
        </ol>

        <Panel>
          {step === 1 && (
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="p-title">Título do anúncio</Label>
                <Input
                  id="p-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={120}
                  placeholder="Ex.: Conta premium com acesso imediato"
                />
                <p className="text-[11px] text-muted-foreground">
                  Seja específico e destaque o principal benefício. {title.length}/120
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-desc">Descrição completa</Label>
                <Textarea
                  id="p-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={9}
                  maxLength={4000}
                  placeholder="Explique exatamente o que será entregue, condições, limitações e suporte..."
                />
                <p className="text-[11px] text-muted-foreground">
                  Use Markdown para organizar títulos, listas e informações importantes. {description.length}/4000
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="p-price">Preço de venda</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-sm font-bold text-primary">
                    R$
                  </span>
                  <Input
                    id="p-price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    inputMode="decimal"
                    placeholder="49,90"
                    className="h-14 pl-12 font-display text-2xl font-extrabold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-3 text-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Preço</p>
                    <p className="text-sm font-bold">{formatPrice(priceCents)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Taxa {Math.round(FEE_RATE * 100)}%
                    </p>
                    <p className="text-sm font-bold text-destructive">− {formatPrice(fee)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Você recebe</p>
                    <p className="text-sm font-extrabold text-gradient">{formatPrice(net)}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Categoria</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categories.map((c) => {
                    const on = c.slug === category;
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setCategory(c.slug)}
                        className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left text-sm font-medium transition ${
                          on
                            ? "border-primary/70 bg-primary/12 text-foreground shadow-glow"
                            : "border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${on ? "bg-gradient-primary text-primary-foreground" : "bg-muted"}`}>
                          {on ? <Icon.Check className="h-4 w-4" /> : <Icon.Tag className="h-4 w-4" />}
                        </span>
                        <span className="truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm">
                <Icon.Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Dica de posicionamento:</strong> escolha a categoria
                  mais específica e mantenha o título alinhado ao que o comprador procura.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label>Tipo de entrega</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { v: true, t: "Automática", d: "Liberada logo após o pagamento confirmado.", i: <Icon.Zap className="h-5 w-5" /> },
                    { v: false, t: "Manual", d: "Você entrega pelo chat do pedido.", i: <Icon.Message className="h-5 w-5" /> },
                  ].map((o) => {
                    const on = auto === o.v;
                    return (
                      <button
                        key={o.t}
                        type="button"
                        onClick={() => setAuto(o.v)}
                        className={`relative flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                          on ? "border-primary/70 bg-primary/10 shadow-glow" : "border-border bg-background/40 hover:border-primary/40"
                        }`}
                      >
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          {o.i}
                        </span>
                        <span>
                          <span className="block text-sm font-bold">{o.t}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">{o.d}</span>
                        </span>
                        {on && <Icon.CheckCircle className="absolute right-3 top-3 h-5 w-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="p-delivery">Orientações de entrega</Label>
                <Textarea
                  id="p-delivery"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  rows={4}
                  maxLength={1200}
                  placeholder={
                    auto
                      ? "Explique o formato, prazo e suporte após a entrega automática..."
                      : "Explique o prazo, formato e condições da entrega manual..."
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="p-img">Imagens do produto (até 5)</Label>
                <label
                  htmlFor="p-img"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    void upload(e.dataTransfer.files);
                  }}
                  className={`relative flex cursor-pointer flex-col items-center gap-2 overflow-hidden rounded-3xl border-2 border-dashed px-6 py-9 text-center transition ${
                    dragging ? "border-primary bg-primary/10" : "border-primary/30 bg-background/40 hover:border-primary/60 hover:bg-primary/5"
                  }`}
                >
                  <div className="absolute inset-0 bg-dots opacity-50" aria-hidden="true" />
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <Icon.Upload className="h-6 w-6" />
                  </span>
                  <span className="relative text-sm font-semibold">Arraste as imagens ou clique para enviar</span>
                  <span className="relative text-[11px] text-muted-foreground">
                    {images.length}/5 enviadas · PNG, JPG, WEBP
                  </span>
                  <input
                    id="p-img"
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      void upload(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2.5 pt-2 sm:grid-cols-5">
                    {images.map((img, index) => (
                      <div key={img} className="group relative aspect-video overflow-hidden rounded-2xl border border-border">
                        <img src={img} alt={`Imagem ${index + 1}`} className="h-full w-full object-cover" />
                        {index === 0 && (
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-gradient-primary px-2 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">
                            Capa
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label="Remover imagem"
                          onClick={() => setImages((prev) => prev.filter((item) => item !== img))}
                          className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                        >
                          <Icon.X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-3">
              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <p className="eyebrow">Título</p>
                <p className="mt-1 font-display font-bold">{title || "Ainda não informado"}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-background/50 p-4">
                  <p className="eyebrow">Preço</p>
                  <p className="mt-1 font-display font-extrabold text-gradient">{priceCents ? formatPrice(priceCents) : "—"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/50 p-4">
                  <p className="eyebrow">Você recebe</p>
                  <p className="mt-1 font-display font-bold">{priceCents ? formatPrice(net) : "—"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/50 p-4">
                  <p className="eyebrow">Entrega</p>
                  <p className="mt-1 font-display font-bold">{auto ? "Automática" : "Manual"}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <p className="eyebrow">Descrição</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {description || "Nenhuma descrição informada."}
                </p>
              </div>
              <div className="flex items-start gap-2.5 rounded-2xl border border-success/30 bg-success/10 p-4 text-sm">
                <Icon.CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <p>
                  Depois de publicar, você poderá editar, pausar, destacar, abastecer o estoque e administrar
                  variações em “Meus anúncios”.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <Button type="button" variant="ghost" disabled={step === 1 || busy} onClick={() => setStep((c) => Math.max(1, c - 1))}>
              <Icon.ChevronLeft className="h-4 w-4" /> Voltar
            </Button>
            {step < 4 ? (
              <Button type="button" onClick={nextStep}>
                Continuar <Icon.ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={busy} size="lg">
                {busy ? <Spinner /> : <Icon.Rocket className="h-4 w-4" />} Publicar anúncio
              </Button>
            )}
          </div>
        </Panel>
      </form>

      {/* Pré-visualização ao vivo */}
      <aside className="hidden xl:sticky xl:top-24 xl:block">
        <p className="eyebrow mb-3">
          <Icon.Eye className="h-3.5 w-3.5" /> Pré-visualização
        </p>
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-surface">
            {images[0] ? (
              <img src={images[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-grid text-primary/60">
                <Icon.Image className="h-10 w-10" />
              </div>
            )}
            {auto && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase text-white backdrop-blur">
                <Icon.Zap className="h-3 w-3 text-[oklch(0.85_0.15_95)]" /> Automática
              </span>
            )}
          </div>
          <div className="grid gap-2.5 p-5">
            <p className="text-[11px] font-medium text-muted-foreground">
              {categoryName ?? "Categoria"}
            </p>
            <h3 className="line-clamp-2 min-h-[2.5rem] font-display text-[0.95rem] font-bold leading-snug">
              {title || "O título do seu anúncio aparece aqui"}
            </h3>
            <p className="flex items-center gap-1 text-[11px] font-semibold text-success">
              <Icon.ShieldCheck className="h-3.5 w-3.5" /> Entrega garantida
            </p>
            <div className="flex items-end justify-between border-t border-dashed border-border pt-3">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">A partir de</span>
                <span className="font-display text-xl font-extrabold text-gradient">{formatPrice(priceCents)}</span>
              </div>
              <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-semibold text-primary">0 vendas</span>
            </div>
          </div>
        </div>
        <ul className="mt-4 grid gap-2 text-xs text-muted-foreground">
          {[
            "Títulos específicos vendem mais.",
            "Use 3+ imagens nítidas na vitrine.",
            "Descreva prazo e suporte pós-venda.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <Icon.Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {t}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}


function Purchases({
  orders,
  onRefresh,
}: {
  orders: {
    id: string;
    status: string;
    amount_cents: number;
    created_at: string;
    delivered_content: string | null;
    pix_copy_paste: string | null;
    product_id: string;
    seller_id: string;
  }[];
  onRefresh: () => void;
}) {
  const { user } = useAuth();
  const [checking, setChecking] = useState<string | null>(null);

  const myReviews = useQuery({
    queryKey: ["my-reviews", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, order_id, rating, positive, comment")
        .eq("buyer_id", user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const reviewByOrder = Object.fromEntries(
    (myReviews.data ?? []).map((r) => [r.order_id, r]),
  ) as Record<string, { id: string; rating: number | null; positive: boolean; comment: string }>;

  if (!orders.length) return <p className="text-sm text-muted-foreground">Ainda sem compras.</p>;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Os estados são confirmados automaticamente junto do Efí Bank.
        </p>
        <Button
          size="sm"
          variant="outline"
          disabled={checking === "all"}
          onClick={async () => {
            setChecking("all");
            try {
              const res = await syncMyOrders({ data: undefined });
              toast.success(
                res.updated > 0
                  ? `${res.updated} pedido(s) atualizado(s) pelo Efí.`
                  : "Nenhuma alteração encontrada no Efí.",
              );
              onRefresh();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Erro ao atualizar.");
            } finally {
              setChecking(null);
            }
          }}
        >
          {checking === "all" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Atualizar estados pelo Efí
        </Button>
      </div>

      {orders.map((o) => {
        const step = orderStepIndex(o.status);
        const closed = o.status === "cancelled" || o.status === "refunded";
        return (
          <div key={o.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {(o as unknown as { product?: { title?: string } }).product?.title ?? "Produto"}
                </p>
                <p className="text-xs text-muted-foreground">
                  #{o.id.slice(0, 8)} · {timeAgo(o.created_at)}
                </p>
              </div>
              <Badge className={orderStatusClass(o.status)}>{orderStatusLabel(o.status)}</Badge>
              <span className="font-bold text-primary">{formatPrice(o.amount_cents)}</span>
            </div>

            {!closed && (
              <ol className="mt-4 grid grid-cols-2 gap-1 sm:grid-cols-4">
                {ORDER_FLOW.map((s, i) => (
                  <li key={s} className="flex flex-col gap-1.5">
                    <span
                      className={`h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
                    />
                    <span
                      className={`text-[10px] ${i <= step ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {orderStatusLabel(s)}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {o.status === "pending" && o.pix_copy_paste && (
                <a href={o.pix_copy_paste} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                    Pagar agora
                  </Button>
                </a>
              )}
              {o.status === "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={checking === o.id}
                  onClick={async () => {
                    setChecking(o.id);
                    try {
                      const res = await verifyPayment({ data: { orderId: o.id } });
                      if (res.status === "pending") {
                        toast.info(
                          `Ainda sem pagamento confirmado${res.efiStatus ? ` (Efí: ${res.efiStatus})` : ""}.`,
                        );
                      } else {
                        toast.success(`Estado atualizado: ${orderStatusLabel(res.status)}`);
                      }
                      onRefresh();
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Erro.");
                    } finally {
                      setChecking(null);
                    }
                  }}
                >
                  {checking === o.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Verificar pagamento
                </Button>
              )}
              {o.status !== "pending" && (
                <PurchaseDeliveryActions orderId={o.id} status={o.status} />
              )}

              <Button asChild size="sm" variant="ghost">
                <Link to="/pedido/$id" params={{ id: o.id }}>
                  Ver pedido
                </Link>
              </Button>
            </div>

            {o.delivered_content && (
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-accent p-3 text-xs">
                {o.delivered_content}
              </pre>
            )}

            {o.status !== "pending" && !closed && (
              <ReviewBox
                order={o}
                existing={reviewByOrder[o.id]}
                onSaved={() => myReviews.refetch()}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewBox({
  order,
  existing,
  onSaved,
}: {
  order: { id: string; seller_id: string; product_id: string };
  existing?: { id: string; rating: number | null; positive: boolean; comment: string };
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const [stars, setStars] = useState(existing?.rating ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [saving, setSaving] = useState(false);

  if (existing) {
    return (
      <div className="mt-3 rounded-xl border border-border bg-accent/40 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sua avaliação
          </span>
          <StarRating value={existing.rating ?? (existing.positive ? 5 : 1)} />
          {existing.positive ? (
            <ThumbsUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <ThumbsDown className="h-4 w-4 text-destructive" />
          )}
        </div>
        {existing.comment && (
          <p className="mt-2 text-sm text-muted-foreground">{existing.comment}</p>
        )}
      </div>
    );
  }

  const submit = async () => {
    if (!stars) return toast.error("Escolha de 1 a 5 estrelas.");
    setSaving(true);
    const { error } = await supabase.from("reviews").insert({
      order_id: order.id,
      buyer_id: user!.id,
      seller_id: order.seller_id,
      product_id: order.product_id,
      positive: stars >= 3,
      rating: stars,
      comment: comment.trim(),
    });
    setSaving(false);
    if (error) {
      if (error.code === "23505" || error.message.includes("reviews_order_id_key")) {
        toast.info("Esta compra já foi avaliada.");
        onSaved();
        return;
      }
      return toast.error(error.message);
    }
    toast.success("Avaliação enviada. Obrigado!");
    onSaved();
  };

  return (
    <div className="mt-3 rounded-xl border border-border bg-accent/30 p-3">
      <p className="text-sm font-medium">Avalie esta compra</p>
      <div className="mt-2 flex items-center gap-3">
        <StarRating value={stars} onChange={setStars} size="md" />
        <span className="text-xs text-muted-foreground">
          {stars ? `${stars} de 5` : "Selecione as estrelas"}
        </span>
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Conte o que achou do produto e do atendimento do vendedor."
        rows={3}
        className="mt-3"
      />
      <Button
        size="sm"
        className="mt-3 bg-gradient-primary text-primary-foreground"
        disabled={saving}
        onClick={submit}
      >
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Enviar avaliação
      </Button>
    </div>
  );
}

function WalletTab({
  balance,
  pixKey,
  withdrawals,
  onDone,
}: {
  balance: number;
  pixKey: string;
  withdrawals: WithdrawalRow[];
  onDone: () => void;
}) {
  const { profile } = useAuth();
  const verified = !!profile?.verified;
  const [amount, setAmount] = useState("");
  const [pix, setPix] = useState(pixKey);

  const submit = useMutation({
    mutationFn: async () => {
      const cents = Math.round(Number(amount.replace(",", ".")) * 100);
      return requestWithdrawal({ data: { amountCents: cents, pixKey: pix.trim() } });
    },
    onSuccess: () => {
      toast.success("Pedido de saque enviado! A equipe analisa e aprova manualmente.");
      setAmount("");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 font-bold">
          <Wallet className="h-4 w-4 text-primary" /> Solicitar saque
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Disponível: <strong className="text-primary">{formatPrice(balance)}</strong>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Não há valor mínimo para sacar. A taxa da plataforma já é descontada automaticamente nas
          vendas. Todo saque passa por aprovação manual da equipe; se for recusado, o valor volta ao
          saldo.
        </p>
        {!verified && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
              🔒 Verifique a sua identidade para poder sacar
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              O saque só é liberado após a verificação automática de identidade. Leva cerca de 2
              minutos.
            </p>
            <Button asChild className="mt-3 w-fit bg-gradient-primary text-primary-foreground">
              <Link to="/verificacao">Verificar identidade</Link>
            </Button>
          </div>
        )}
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="w-amount">Valor (R$)</Label>
            <Input
              id="w-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              disabled={!verified}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="w-pix">Chave Pix para receber</Label>
            <Input
              id="w-pix"
              value={pix}
              onChange={(e) => setPix(e.target.value)}
              placeholder="e-mail, CPF ou aleatória"
              disabled={!verified}
            />
          </div>
          <Button
            disabled={submit.isPending || !verified}
            onClick={() => submit.mutate()}
            className="w-fit bg-gradient-primary text-primary-foreground"
          >
            Pedir saque
          </Button>
        </div>
      </div>

      <WithdrawalHistory withdrawals={withdrawals} />
    </div>
  );
}

type WithdrawalRow = {
  id: string;
  amount_cents: number;
  status: string;
  created_at: string;
  pix_key: string;
  note?: string | null;
  reason?: string | null;
  evidence_url?: string | null;
  reviewed_at?: string | null;
};

const WITHDRAWAL_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "requested", label: "Aguardando" },
  { key: "paid", label: "Pagos" },
  { key: "rejected", label: "Recusados" },
] as const;

function withdrawalLabel(status: string) {
  return status === "paid"
    ? "Aprovado e pago"
    : status === "rejected"
      ? "Recusado"
      : "Aguardando análise";
}

function WithdrawalAudit({ id }: { id: string }) {
  const events = useQuery({
    queryKey: ["withdrawal-events", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("withdrawal_events")
        .select("*")
        .eq("withdrawal_id", id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (events.isLoading)
    return <p className="mt-2 text-xs text-muted-foreground">Carregando auditoria...</p>;
  if (!events.data?.length)
    return <p className="mt-2 text-xs text-muted-foreground">Sem registros de auditoria.</p>;

  return (
    <ol className="mt-3 grid gap-2 border-l border-border pl-3">
      {events.data.map((e) => (
        <li key={e.id} className="text-xs">
          <p className="font-medium">
            {withdrawalLabel(e.status)}{" "}
            <span className="font-normal text-muted-foreground">
              · {e.actor_role === "staff" ? "equipe" : "usuário"} · {timeAgo(e.created_at)}
            </span>
          </p>
          {e.reason && <p className="text-muted-foreground">Motivo: {e.reason}</p>}
          {e.note && <p className="text-muted-foreground">{e.note}</p>}
          {e.evidence_url && (
            <a
              href={e.evidence_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Ver evidência
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}

function WithdrawalHistory({ withdrawals }: { withdrawals: WithdrawalRow[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = withdrawals.filter((w) => {
    if (filter !== "all" && w.status !== filter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      w.pix_key.toLowerCase().includes(q) ||
      (w.reason ?? "").toLowerCase().includes(q) ||
      (w.note ?? "").toLowerCase().includes(q) ||
      formatPrice(w.amount_cents).toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-bold">Histórico de saques</h3>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {WITHDRAWAL_FILTERS.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === f.key ? "default" : "outline"}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Button>
        ))}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por valor, Pix ou motivo"
          className="h-9 w-full sm:w-56"
        />
      </div>

      {list.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nenhum saque nesse filtro.</p>
      ) : (
        <div className="mt-4 grid gap-2">
          {list.map((w) => (
            <div key={w.id} className="rounded-xl border border-border p-3 text-sm">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{formatPrice(w.amount_cents)}</p>
                  <p className="text-xs text-muted-foreground">
                    Pix {w.pix_key} · {timeAgo(w.created_at)}
                  </p>
                </div>
                <Badge
                  variant={
                    w.status === "paid"
                      ? "secondary"
                      : w.status === "rejected"
                        ? "destructive"
                        : "outline"
                  }
                  className="shrink-0"
                >
                  {withdrawalLabel(w.status)}
                </Badge>
              </div>
              {w.reason && <p className="mt-2 text-xs text-muted-foreground">Motivo: {w.reason}</p>}
              {w.note && (
                <p className="mt-1 text-xs text-muted-foreground">Resposta da equipe: {w.note}</p>
              )}
              {w.evidence_url && (
                <a
                  href={w.evidence_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-primary underline"
                >
                  Ver evidência
                </a>
              )}
              <button
                onClick={() => setOpenId(openId === w.id ? null : w.id)}
                className="mt-2 text-xs font-medium text-primary"
              >
                {openId === w.id ? "Ocultar auditoria" : "Ver auditoria"}
              </button>
              {openId === w.id && <WithdrawalAudit id={w.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DEFAULT_USERNAME_RE = /^user_[0-9a-f]{8}$/;

function UsernameCard({ onSaved }: { onSaved: () => void }) {
  const { profile, refreshProfile } = useAuth();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const locked = !!profile?.username && !DEFAULT_USERNAME_RE.test(profile.username);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (username.length < 3) return toast.error("Escolha um @ com pelo menos 3 caracteres.");
    setBusy(true);
    try {
      const { chooseMyUsername } = await import("@/lib/profile.functions");
      await chooseMyUsername({ data: { username } });
      await refreshProfile();
      toast.success("@ definido! Agora ele é permanente.");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível definir o @.");
    } finally {
      setBusy(false);
    }
  };

  if (locked) {
    return (
      <div className="grid max-w-3xl gap-1 rounded-3xl border border-border bg-card p-6 shadow-card">
        <Label>Seu @ (permanente)</Label>
        <p className="text-lg font-semibold">@{profile?.username}</p>
        <p className="text-[11px] text-muted-foreground">
          O nome de usuário é fixo e não pode ser alterado.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="gradient-border grid max-w-3xl gap-2 rounded-3xl p-6 shadow-glow"
    >
      <Label htmlFor="pf-username">Escolha o seu @</Label>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">@</span>
        <Input
          id="pf-username"
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
          placeholder={profile?.username ?? "seunome"}
          maxLength={20}
        />
        <Button disabled={busy}>
          Definir
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        É o endereço da sua loja (/vendedor/seunome). Só pode ser escolhido uma vez depois fica
        fixo.
      </p>
    </form>
  );
}

function MyReviewsTab({
  reviews,
  isLoading,
}: {
  reviews: Array<{
    id: string;
    positive: boolean;
    comment: string;
    created_at: string;
    buyer?: { username?: string; display_name?: string | null; avatar_url?: string | null } | null;
  }>;
  isLoading: boolean;
}) {
  const positive = reviews.filter((review) => review.positive).length;
  const negative = reviews.filter((review) => !review.positive).length;
  const neutral = 0;

  return (
    <div className="grid gap-4">
      <div className="rounded-3xl border border-border bg-gradient-hero p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Reputação
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold">Minhas avaliações</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Acompanhe o que os compradores dizem sobre suas entregas e use os comentários para
              melhorar sua loja.
            </p>
          </div>
          <p className="text-3xl font-extrabold">
            {reviews.length}
            <span className="ml-1 text-sm font-medium text-muted-foreground">avaliações</span>
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ReviewStat
          label="Positivas"
          value={positive}
          icon={<ThumbsUp className="h-4 w-4" />}
          className="text-emerald-500"
        />
        <ReviewStat
          label="Neutras"
          value={neutral}
          icon={<MessageCircleQuestion className="h-4 w-4" />}
          className="text-muted-foreground"
        />
        <ReviewStat
          label="Negativas"
          value={negative}
          icon={<ThumbsDown className="h-4 w-4" />}
          className="text-destructive"
        />
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold">Feedback dos compradores</h3>
            <p className="text-xs text-muted-foreground">
              As avaliações aparecem depois que o pedido é concluído.
            </p>
          </div>
          <Badge variant="secondary">{positive} positivas</Badge>
        </div>
        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Carregando avaliações…</p>
        ) : reviews.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Você ainda não recebeu avaliações. Conclua sua primeira venda para começar a construir
            sua reputação.
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {reviews.map((review) => {
              const buyerName = review.buyer?.display_name || review.buyer?.username || "Comprador";
              return (
                <article
                  key={review.id}
                  className="flex gap-3 rounded-xl border border-border bg-background/50 p-4"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={review.buyer?.avatar_url ?? undefined} />
                    <AvatarFallback>{buyerName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{buyerName}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {timeAgo(review.created_at)}
                      </span>
                    </div>
                    <div
                      className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${review.positive ? "text-emerald-500" : "text-destructive"}`}
                    >
                      {review.positive ? (
                        <ThumbsUp className="h-3.5 w-3.5" />
                      ) : (
                        <ThumbsDown className="h-3.5 w-3.5" />
                      )}
                      {review.positive ? "Avaliação positiva" : "Avaliação negativa"}
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ReviewStat({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-extrabold">{value}</p>
        </div>
        <span className={className}>{icon}</span>
      </CardContent>
    </Card>
  );
}


function ProfileTab({ onSaved }: { onSaved: () => void }) {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [bio, setBio] = useState(profile?.bio ?? "");

  useEffect(() => {
    setBio(profile?.bio ?? "");
  }, [profile?.bio]);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ bio }).eq("id", user!.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["seller", profile?.username] }),
      queryClient.invalidateQueries({ queryKey: ["sellers"] }),
      queryClient.invalidateQueries({ queryKey: ["seller-products"] }),
    ]);
    toast.success("Perfil atualizado.");
    onSaved();
  };

  const uploadImage = async (file: File | undefined, field: "avatar_url" | "banner_url") => {
    if (!file || !user) return;
    try {
      const url = await uploadMedia(user.id, file);
      const patch = field === "avatar_url" ? { avatar_url: url } : { banner_url: url };
      const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["seller", profile?.username] });
      await queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast.success("Imagem atualizada.");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no upload.");
    }
  };

  const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff";
  const banner = (profile as { banner_url?: string | null } | null)?.banner_url;
  const name = profile?.display_name ?? profile?.username ?? "";

  return (
    <div className="grid gap-5">
      {/* Capa + avatar */}
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
        <div className="group relative h-40 overflow-hidden bg-gradient-surface sm:h-52">
          {banner ? (
            <img src={banner} alt="" className="h-full w-full object-cover" />
          ) : (
            <>
              <div className="aurora" aria-hidden="true" />
              <div className="absolute inset-0 bg-grid" aria-hidden="true" />
              <Constellation className="absolute right-6 top-4 h-32 w-56 text-primary opacity-70" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <label className="btn-sheen absolute right-3 top-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-black/55 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-primary/70">
            <Icon.Camera className="h-4 w-4" /> Alterar capa
            <input type="file" accept={ACCEPT} className="sr-only" onChange={(e) => uploadImage(e.target.files?.[0], "banner_url")} />
          </label>
        </div>
        <div className="relative flex flex-wrap items-end gap-4 px-5 pb-5 sm:px-7">
          <div className="relative -mt-12 sm:-mt-14">
            <Avatar className="h-24 w-24 border-4 border-card sm:h-28 sm:w-28">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-2xl">{(profile?.username ?? "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <label
              className="absolute -bottom-1 -right-1 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-2 border-card bg-gradient-primary text-primary-foreground shadow-glow transition hover:scale-110"
              aria-label="Alterar foto de perfil"
            >
              <Icon.Camera className="h-4 w-4" />
              <input type="file" accept={ACCEPT} className="sr-only" onChange={(e) => uploadImage(e.target.files?.[0], "avatar_url")} />
            </label>
          </div>
          <div className="min-w-0 flex-1 pt-3">
            <p className="flex items-center gap-2 font-display text-xl font-extrabold">
              <span className="truncate">{name}</span>
              {profile?.verified && <Icon.Verified className="h-5 w-5 shrink-0 text-primary" />}
            </p>
            <p className="text-sm text-muted-foreground">@{profile?.username}</p>
          </div>
          {profile?.username && (
            <Link to="/vendedor/$slug" params={{ slug: profile.username }}>
              <Button variant="outline" size="sm" className="gap-2">
                <Icon.Eye className="h-4 w-4" /> Ver como visitante
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Verificações */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            ok: !!user?.email_confirmed_at,
            icon: <Icon.Message className="h-5 w-5" />,
            t: `E-mail ${user?.email_confirmed_at ? "verificado" : "não verificado"}`,
            d: user?.email ?? "Nenhum e-mail disponível",
          },
          {
            ok: !!profile?.verified,
            icon: <Icon.ShieldCheck className="h-5 w-5" />,
            t: `Documentos ${profile?.verified ? "verificados" : "não verificados"}`,
            d: profile?.verified
              ? `Nível ${profile.verification_level}`
              : "Envie seus documentos para liberar a verificação.",
          },
        ].map((v) => (
          <div key={v.t} className={`flex items-start gap-3 rounded-3xl border p-4 shadow-card ${v.ok ? "border-success/30 bg-success/5" : "border-border bg-card"}`}>
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${v.ok ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
              {v.icon}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-bold">
                {v.t} {v.ok && <Icon.CheckCircle className="h-4 w-4 text-success" />}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{v.d}</p>
              {!v.ok && v.t.startsWith("Documentos") && (
                <Link to="/verificacao" className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  Verificar agora <Icon.ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <UsernameCard onSaved={onSaved} />

      <form onSubmit={save}>
        <Panel className="grid max-w-3xl gap-5">
          <SectionTitle icon={<Icon.Store className="h-4 w-4" />} title="Dados da loja" hint="Aparece na sua página pública" />
          <div className="grid gap-2">
            <Label htmlFor="pf-name">Nome cadastrado</Label>
            <div className="relative">
              <Icon.Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="pf-name" value={name} readOnly disabled className="pl-10" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              O nome cadastrado não pode ser alterado. Ele deve permanecer igual ao informado no cadastro.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pf-bio">Bio da loja</Label>
            <Textarea id="pf-bio" name="bio" rows={5} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} placeholder="Conte quem você é e o que vende…" />
            <p className="text-right text-[11px] text-muted-foreground">{bio.length}/500</p>
          </div>
          <Button disabled={busy} className="w-fit gap-2">
            {busy ? <Spinner /> : <Icon.Check className="h-4 w-4" />} Guardar alterações
          </Button>
        </Panel>
      </form>
    </div>
  );
}
