import { AdminContent } from "@/components/admin-content";
import { WithdrawalReviewDialog } from "@/components/withdrawal-review-dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatPanel } from "@/components/chat-panel";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Shield,
  Users,
  Package,
  Flag,
  Wallet,
  BadgeCheck,
  Ban,
  Check,
  X,
  DollarSign,
  MessageSquare,
  Gavel,
  LayoutGrid,
  Activity,
  AlertTriangle,
  Clock3,
  BarChart3,
  Download,
  FileJson,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice, timeAgo } from "@/lib/format";
import { fetchAdminData, staffAction, updateUserProfileByAdmin } from "@/lib/commerce.functions";
import { supabase } from "@/integrations/supabase/client";
import { PageLoader } from "@/components/loading";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administração | LynkoMarketplace" },
      {
        name: "description",
        content: "Painel de administração: moderação, denúncias, KYC e saques.",
      },
      { property: "og:title", content: "Administração | LynkoMarketplace" },
      { property: "og:description", content: "Gestão completa da plataforma LynkoMarketplace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

type Action =
  | "block_product"
  | "unblock_product"
  | "ban_user"
  | "unban_user"
  | "verify_user"
  | "unverify_user"
  | "resolve_report"
  | "dismiss_report"
  | "hide_message"
  | "approve_kyc"
  | "reject_kyc"
  | "pay_withdrawal"
  | "reject_withdrawal"
  | "accept_appeal"
  | "reject_appeal";

type ModerationChat = {
  id: string;
  last_message_at: string;
  buyer?: { username?: string };
  seller?: { username?: string };
};
type SupportChat = {
  id: string;
  last_message_at: string;
  buyer?: { username?: string; display_name?: string | null };
};

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadCsv(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return toast.info("Não há dados para exportar.");
  const keys = Object.keys(rows[0]);
  const quote = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    keys.join(","),
    ...rows.map((row) => keys.map((key) => quote(row[key])).join(",")),
  ].join("\n");
  downloadFile(`\ufeff${csv}`, filename, "text/csv;charset=utf-8");
  toast.success("Relatório CSV exportado.");
}

async function openKycFile(path: string | null) {
  if (!path) return;
  const { data, error } = await supabase.storage.from("kyc-documents").createSignedUrl(path, 300);
  if (error) return toast.error("Não foi possível abrir o documento.");
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

function ModerationChats({
  chats,
  activeId,
  onSelect,
}: {
  chats: ModerationChat[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  if (!chats.length)
    return <p className="text-sm text-muted-foreground">Nenhuma conversa pediu moderação.</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit max-h-[600px] overflow-y-auto rounded-2xl border border-border bg-card p-2">
        {chats.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full rounded-xl p-3 text-left text-sm transition ${
              activeId === c.id ? "bg-accent" : "hover:bg-accent/60"
            }`}
          >
            <p className="truncate font-medium">
              @{c.buyer?.username ?? "comprador"} ↔ @{c.seller?.username ?? "vendedor"}
            </p>
            <p className="text-xs text-muted-foreground">{timeAgo(c.last_message_at)}</p>
          </button>
        ))}
      </aside>
      {activeId ? (
        <ChatPanel conversationId={activeId} moderatorMode />
      ) : (
        <div className="grid h-[600px] place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
          Seleciona uma conversa para entrar como moderador
        </div>
      )}
    </div>
  );
}

function SupportChats({
  chats,
  activeId,
  onSelect,
}: {
  chats: SupportChat[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit max-h-[600px] overflow-y-auto rounded-2xl border border-border bg-card p-2">
        {chats.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Nenhum atendimento aberto.</p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`w-full rounded-xl p-3 text-left text-sm transition ${
                activeId === chat.id ? "bg-accent" : "hover:bg-accent/60"
              }`}
            >
              <p className="truncate font-medium">
                {chat.buyer?.display_name || `@${chat.buyer?.username ?? "cliente"}`}
              </p>
              <p className="text-xs text-muted-foreground">{timeAgo(chat.last_message_at)}</p>
            </button>
          ))
        )}
      </aside>
      {activeId ? (
        <ChatPanel conversationId={activeId} />
      ) : (
        <div className="grid h-[600px] place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
          Selecione um atendimento para responder
        </div>
      )}
    </div>
  );
}

function Admin() {
  const { isStaff, loading } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [supportChatId, setSupportChatId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [activeTab, setActiveTab] = useState("denuncias");
  const [reportPeriod, setReportPeriod] = useState("all");
  const [reportStatus, setReportStatus] = useState("all");
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ["admin-data"],
    queryFn: () => fetchAdminData(),
    enabled: isStaff,
  });

  const run = async (
    action: Action,
    targetId: string,
    note?: string,
    extra?: { reason?: string; evidenceUrl?: string },
  ) => {
    try {
      await staffAction({ data: { action, targetId, note, ...extra } });
      toast.success("Ação aplicada.");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro.");
    }
  };

  const saveUserProfile = async () => {
    if (!editingUserId) return;
    try {
      await updateUserProfileByAdmin({
        data: { userId: editingUserId, displayName: editName, username: editUsername },
      });
      toast.success("Perfil atualizado.");
      setEditingUserId(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível atualizar o perfil.");
    }
  };

  if (loading) return <PageLoader label="Preparando a central administrativa…" />;

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Shield className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta área é exclusiva para administradores e moderadores.
        </p>
      </div>
    );
  }

  const orders = data?.orders ?? [];
  const revenue = orders.filter((o) => o.status !== "pending").reduce((s, o) => s + o.fee_cents, 0);

  const pendingReports = (data?.reports ?? []).filter((r) => r.status === "open").length;
  const pendingKyc = (data?.verifications ?? []).filter((v) => v.status === "pending").length;
  const pendingWithdrawals = (data?.withdrawals ?? []).filter(
    (w) => w.status === "requested",
  ).length;
  const pendingAppeals = (data?.appeals ?? []).filter((a) => a.status === "pending").length;
  const filteredReportOrders = (() => {
    const since = reportPeriod === "all" ? 0 : Date.now() - Number(reportPeriod) * 86_400_000;
    return (data?.orders ?? []).filter((order) => {
      const inPeriod = since === 0 || new Date(order.created_at).getTime() >= since;
      const inStatus = reportStatus === "all" || order.status === reportStatus;
      return inPeriod && inStatus;
    });
  })();
  const reportStatusCounts = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "refunded",
    "cancelled",
  ].map((status) => ({
    status,
    count: filteredReportOrders.filter((order) => order.status === status).length,
  }));
  const maxReportCount = Math.max(1, ...reportStatusCounts.map((item) => item.count));
  const exportData = {
    users: (data?.users ?? []).map((u) => ({
      id: u.id,
      username: u.username,
      display_name: u.display_name,
      verified: u.verified,
      banned: u.banned,
      created_at: u.created_at,
    })),
    products: (data?.products ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      price_cents: p.price_cents,
      created_at: p.created_at,
    })),
    orders: filteredReportOrders.map((o) => ({
      id: o.id,
      status: o.status,
      amount_cents: o.amount_cents,
      fee_cents: o.fee_cents,
      created_at: o.created_at,
    })),
    reports: (data?.reports ?? []).map((r) => ({
      id: r.id,
      reason: r.reason,
      target_type: r.target_type,
      status: r.status,
      created_at: r.created_at,
    })),
    withdrawals: (data?.withdrawals ?? []).map((w) => ({
      id: w.id,
      amount_cents: w.amount_cents,
      status: w.status,
      created_at: w.created_at,
    })),
  };

  const NAV: {
    group: string;
    items: { value: string; label: string; icon: React.ReactNode; count?: number }[];
  }[] = [
    {
      group: "Moderação",
      items: [
        {
          value: "denuncias",
          label: "Denúncias",
          icon: <Flag className="h-4 w-4" />,
          count: pendingReports,
        },
        {
          value: "moderacao",
          label: "Chats em disputa",
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          value: "atendimento",
          label: "Atendimento",
          icon: <MessageSquare className="h-4 w-4" />,
          count: data?.supportChats?.length ?? 0,
        },
        {
          value: "apelacoes",
          label: "Apelações",
          icon: <Gavel className="h-4 w-4" />,
          count: pendingAppeals,
        },
      ],
    },
    {
      group: "Comunidade",
      items: [
        { value: "usuários", label: "Usuários", icon: <Users className="h-4 w-4" /> },
        { value: "anuncios", label: "Anúncios", icon: <Package className="h-4 w-4" /> },
        {
          value: "kyc",
          label: "Verificações",
          icon: <BadgeCheck className="h-4 w-4" />,
          count: pendingKyc,
        },
      ],
    },
    {
      group: "Financeiro e conteúdo",
      items: [
        {
          value: "saques",
          label: "Saques",
          icon: <Wallet className="h-4 w-4" />,
          count: pendingWithdrawals,
        },
        {
          value: "relatorios",
          label: "Relatórios e exportação",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        { value: "conteudo", label: "Conteúdo do site", icon: <LayoutGrid className="h-4 w-4" /> },
      ],
    },
  ];
  const activeItem = NAV.flatMap((group) => group.items).find((item) => item.value === activeTab);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-surface shadow-card">
        <div className="relative flex flex-wrap items-end justify-between gap-5 p-5 sm:p-7">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Shield className="h-6 w-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
                  <Activity className="h-3 w-3" /> Operação interna
                </Badge>
                <span className="text-xs text-muted-foreground">Acesso protegido</span>
              </div>
              <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                Central de administração
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Moderação, comunidade, financeiro e conteúdo organizados em um fluxo único de
                trabalho.
              </p>
            </div>
          </div>
          <div className="relative flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span>
              <strong>{pendingReports + pendingKyc + pendingWithdrawals + pendingAppeals}</strong>{" "}
              pendências prioritárias
            </span>
          </div>
        </div>
        <div className="grid border-t border-border/70 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setActiveTab("denuncias")}
            className="flex items-center gap-3 px-5 py-3 text-left transition hover:bg-accent/60 sm:px-7"
          >
            <Flag className="h-4 w-4 text-primary" />
            <span>
              <strong className="block text-sm">{pendingReports} denúncias</strong>
              <span className="text-xs text-muted-foreground">Requerem triagem</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kyc")}
            className="flex items-center gap-3 border-t border-border/70 px-5 py-3 text-left transition hover:bg-accent/60 sm:border-l sm:border-t-0 sm:px-7"
          >
            <BadgeCheck className="h-4 w-4 text-primary" />
            <span>
              <strong className="block text-sm">{pendingKyc} verificações</strong>
              <span className="text-xs text-muted-foreground">Aguardando análise</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saques")}
            className="flex items-center gap-3 border-t border-border/70 px-5 py-3 text-left transition hover:bg-accent/60 sm:border-l sm:border-t-0 sm:px-7"
          >
            <Wallet className="h-4 w-4 text-primary" />
            <span>
              <strong className="block text-sm">{pendingWithdrawals} saques</strong>
              <span className="text-xs text-muted-foreground">Aguardando decisão</span>
            </span>
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{(error as Error).message}</p>}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Usuários"
          value={isLoading ? "loading" : String(data?.users.length ?? 0)}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Anúncios"
          value={isLoading ? "loading" : String(data?.products.length ?? 0)}
          icon={<Package className="h-4 w-4" />}
        />
        <StatCard
          label="Denúncias abertas"
          value={isLoading ? "loading" : String(pendingReports)}
          icon={<Flag className="h-4 w-4" />}
        />
        <StatCard
          label="Receita em taxas"
          value={isLoading ? "loading" : formatPrice(revenue)}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="grid gap-6 lg:grid-cols-[248px_1fr] lg:items-start"
      >
        <TabsList className="grid h-auto w-full gap-4 rounded-2xl border border-border bg-card p-3 lg:sticky lg:top-24">
          {NAV.map((g) => (
            <div key={g.group} className="grid gap-1">
              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {g.group}
              </p>
              {g.items.map((it) => (
                <TabsTrigger
                  key={it.value}
                  value={it.value}
                  className="w-full justify-start gap-2 rounded-xl px-3 py-2 text-sm data-[state=active]:bg-accent"
                >
                  {it.icon}
                  <span className="flex-1 text-left">{it.label}</span>
                  {!!it.count && (
                    <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {it.count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </div>
          ))}
        </TabsList>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="min-w-0"
          >
            <div className="mb-1 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  {activeItem?.icon ?? <LayoutGrid className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{activeItem?.label ?? "Visão geral"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Área de trabalho administrativa
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <Clock3 className="h-3.5 w-3.5" /> Dados atualizados em tempo real
              </div>
            </div>
            <TabsContent value="denuncias" className="mt-6 grid gap-3">
              {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
              {(data?.reports ?? []).map((r) => (
                <Row key={r.id}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {r.reason}{" "}
                      <span className="text-xs text-muted-foreground">({r.target_type})</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.details || "Sem detalhes"} · {timeAgo(r.created_at)}
                    </p>
                  </div>
                  <Badge variant={r.status === "open" ? "outline" : "secondary"}>{r.status}</Badge>
                  {r.target_type === "product" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => run("block_product", r.target_id)}
                    >
                      Bloquear anúncio
                    </Button>
                  )}
                  {r.target_type === "user" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => run("ban_user", r.target_id)}
                    >
                      Banir
                    </Button>
                  )}
                  {r.target_type === "message" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => run("hide_message", r.target_id)}
                    >
                      Ocultar mensagem
                    </Button>
                  )}
                  <Button size="sm" onClick={() => run("resolve_report", r.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => run("dismiss_report", r.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </Row>
              ))}
              {!isLoading && !(data?.reports ?? []).length && (
                <p className="text-sm text-muted-foreground">Sem denúncias.</p>
              )}
            </TabsContent>

            <TabsContent value="usuários" className="mt-6 grid gap-3">
              {(data?.users ?? []).map((u) => (
                <Row key={u.id}>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 font-medium">
                      @{u.username} {u.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Saldo {formatPrice(u.balance_cents)} · registado {timeAgo(u.created_at)}
                    </p>
                  </div>
                  {u.banned && <Badge variant="destructive">Banido</Badge>}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => run(u.verified ? "unverify_user" : "verify_user", u.id)}
                  >
                    <BadgeCheck className="mr-1 h-4 w-4" /> {u.verified ? "Remover" : "Verificar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => run(u.banned ? "unban_user" : "ban_user", u.id)}
                  >
                    <Ban className="mr-1 h-4 w-4" /> {u.banned ? "Desbanir" : "Banir"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingUserId(u.id);
                      setEditName(u.display_name ?? "");
                      setEditUsername(u.username);
                    }}
                  >
                    Editar perfil
                  </Button>
                  {editingUserId === u.id && (
                    <div className="mt-3 grid w-full gap-2 rounded-xl border border-primary/30 bg-accent/30 p-3 sm:grid-cols-[1fr_1fr_auto_auto]">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nome completo"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">@</span>
                        <Input
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value.replace(/^@/, ""))}
                          placeholder="username"
                        />
                      </div>
                      <Button size="sm" onClick={saveUserProfile}>
                        Salvar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingUserId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </Row>
              ))}
            </TabsContent>

            <TabsContent value="anuncios" className="mt-6 grid gap-3">
              {(data?.products ?? []).map((p) => (
                <Row key={p.id}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      @{(p as { seller?: { username?: string } }).seller?.username} ·{" "}
                      {formatPrice(p.price_cents)}
                    </p>
                  </div>
                  <Badge variant={p.status === "active" ? "secondary" : "destructive"}>
                    {p.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      run(p.status === "active" ? "block_product" : "unblock_product", p.id)
                    }
                  >
                    {p.status === "active" ? "Bloquear" : "Reativar"}
                  </Button>
                </Row>
              ))}
            </TabsContent>

            <TabsContent value="kyc" className="mt-6 grid gap-3">
              {(data?.verifications ?? []).map((v) => (
                <Row key={v.id}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{v.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{(v as { user?: { username?: string } }).user?.username} · doc{" "}
                      {v.document_number}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {(v.document_path ?? v.document_url) && (
                        <button
                          type="button"
                          onClick={() => void openKycFile(v.document_path ?? v.document_url)}
                          className="text-xs text-primary hover:underline"
                        >
                          Ver documento
                        </button>
                      )}
                      {(v.selfie_path ?? v.selfie_url) && (
                        <button
                          type="button"
                          onClick={() => void openKycFile(v.selfie_path ?? v.selfie_url)}
                          className="text-xs text-primary hover:underline"
                        >
                          Ver selfie
                        </button>
                      )}
                    </div>
                  </div>
                  <Badge variant={v.status === "approved" ? "secondary" : "outline"}>
                    {v.status}
                  </Badge>
                  <Button size="sm" onClick={() => run("approve_kyc", v.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => run("reject_kyc", v.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </Row>
              ))}
              {!(data?.verifications ?? []).length && (
                <p className="text-sm text-muted-foreground">Sem pedidos.</p>
              )}
            </TabsContent>

            <TabsContent value="saques" className="mt-6 grid gap-3">
              {(data?.withdrawals ?? []).map((w) => {
                const rec = w as typeof w & {
                  reason?: string | null;
                  evidence_url?: string | null;
                  reviewed_at?: string | null;
                };
                return (
                  <Row key={w.id}>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{formatPrice(w.amount_cents)}</p>
                      <p className="text-xs text-muted-foreground">
                        @{(w as { seller?: { username?: string } }).seller?.username} · Pix{" "}
                        {w.pix_key} · {timeAgo(w.created_at)}
                      </p>
                      {w.note && (
                        <p className="mt-1 text-xs text-muted-foreground">Nota: {w.note}</p>
                      )}
                      {rec.reason && (
                        <p className="mt-1 text-xs text-muted-foreground">Motivo: {rec.reason}</p>
                      )}
                      {rec.evidence_url && (
                        <a
                          href={rec.evidence_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-xs text-primary underline"
                        >
                          Ver evidência
                        </a>
                      )}
                      {rec.reviewed_at && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Analisado {timeAgo(rec.reviewed_at)}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        w.status === "paid"
                          ? "secondary"
                          : w.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {w.status === "paid"
                        ? "Pago"
                        : w.status === "rejected"
                          ? "Recusado"
                          : "Aguardando análise"}
                    </Badge>
                    {w.status === "requested" && (
                      <>
                        <WithdrawalReviewDialog
                          mode="approve"
                          trigger={
                            <Button size="sm">
                              <Wallet className="mr-1 h-4 w-4" /> Aprovar e pagar
                            </Button>
                          }
                          onConfirm={(p) =>
                            run("pay_withdrawal", w.id, p.note, {
                              reason: p.reason,
                              evidenceUrl: p.evidenceUrl,
                            })
                          }
                        />
                        <WithdrawalReviewDialog
                          mode="reject"
                          trigger={
                            <Button size="sm" variant="ghost">
                              <X className="mr-1 h-4 w-4" /> Recusar
                            </Button>
                          }
                          onConfirm={(p) =>
                            run("reject_withdrawal", w.id, p.note, {
                              reason: p.reason,
                              evidenceUrl: p.evidenceUrl,
                            })
                          }
                        />
                      </>
                    )}
                  </Row>
                );
              })}

              {!(data?.withdrawals ?? []).length && (
                <p className="text-sm text-muted-foreground">Sem pedidos de saque.</p>
              )}
            </TabsContent>
            <TabsContent value="apelacoes" className="mt-6 grid gap-3">
              {(data?.appeals ?? []).map((a) => (
                <Row key={a.id}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      @{(a as { user?: { username?: string } }).user?.username ?? "usuário"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Motivo do ban:{" "}
                      {(a as { user?: { ban_reason?: string | null } }).user?.ban_reason ?? ""}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap rounded-xl bg-accent p-3 text-xs">
                      {a.message}
                    </p>
                    {a.staff_reply && (
                      <p className="mt-1 text-xs text-primary">Resposta: {a.staff_reply}</p>
                    )}
                  </div>
                  <Badge variant={a.status === "pending" ? "outline" : "secondary"}>
                    {a.status}
                  </Badge>
                  {a.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => run("accept_appeal", a.id)}>
                        <Check className="mr-1 h-4 w-4" /> Aceitar e desbanir
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => run("reject_appeal", a.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </Row>
              ))}
              {!(data?.appeals ?? []).length && (
                <p className="text-sm text-muted-foreground">Sem apelações.</p>
              )}
            </TabsContent>

            <TabsContent value="moderacao" className="mt-6">
              <ModerationChats
                chats={(data?.moderationChats ?? []) as ModerationChat[]}
                activeId={chatId}
                onSelect={setChatId}
              />
            </TabsContent>

            <TabsContent value="atendimento" className="mt-6">
              <SupportChats
                chats={(data?.supportChats ?? []) as SupportChat[]}
                activeId={supportChatId}
                onSelect={setSupportChatId}
              />
            </TabsContent>

            <TabsContent value="relatorios" className="mt-6 space-y-4">
              <Card className="rounded-3xl border-border shadow-sm">
                <CardContent className="flex flex-wrap items-end gap-3 p-4 sm:p-5">
                  <div className="min-w-[150px] flex-1">
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Período
                    </label>
                    <select
                      value={reportPeriod}
                      onChange={(event) => setReportPeriod(event.target.value)}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      <option value="all">Todo o período</option>
                      <option value="7">Últimos 7 dias</option>
                      <option value="30">Últimos 30 dias</option>
                      <option value="90">Últimos 90 dias</option>
                    </select>
                  </div>
                  <div className="min-w-[150px] flex-1">
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Status do pedido
                    </label>
                    <select
                      value={reportStatus}
                      onChange={(event) => setReportStatus(event.target.value)}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      <option value="all">Todos os status</option>
                      <option value="pending">Pendente</option>
                      <option value="paid">Pago</option>
                      <option value="delivered">Entregue</option>
                      <option value="refunded">Reembolsado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  <div className="rounded-xl bg-primary/5 px-4 py-2.5 text-sm">
                    <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                      Pedidos no filtro
                    </span>
                    <strong>{filteredReportOrders.length}</strong>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-primary" /> Distribuição por status
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Visualização baseada nos pedidos filtrados.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {reportStatusCounts.map((item) => (
                      <div key={item.status} className="rounded-2xl bg-accent/50 p-3">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="truncate capitalize text-muted-foreground">
                            {item.status}
                          </span>
                          <strong>{item.count}</strong>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full rounded-full bg-gradient-primary transition-all"
                            style={{
                              width: `${Math.max(item.count ? 8 : 0, (item.count / maxReportCount) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden rounded-3xl border-border shadow-card">
                <CardHeader className="bg-gradient-surface">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" /> Relatórios e exportação
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Exporte visões operacionais para análise, auditoria e acompanhamento da
                        plataforma.
                      </p>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" /> Sem documentos KYC
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
                  {[
                    {
                      key: "users",
                      title: "Usuários",
                      desc: `${exportData.users.length} registros`,
                      icon: <Users className="h-4 w-4" />,
                    },
                    {
                      key: "products",
                      title: "Anúncios",
                      desc: `${exportData.products.length} registros`,
                      icon: <Package className="h-4 w-4" />,
                    },
                    {
                      key: "orders",
                      title: "Pedidos e receita",
                      desc: `${exportData.orders.length} registros`,
                      icon: <DollarSign className="h-4 w-4" />,
                    },
                    {
                      key: "reports",
                      title: "Denúncias",
                      desc: `${exportData.reports.length} registros`,
                      icon: <Flag className="h-4 w-4" />,
                    },
                    {
                      key: "withdrawals",
                      title: "Saques",
                      desc: `${exportData.withdrawals.length} registros`,
                      icon: <Wallet className="h-4 w-4" />,
                    },
                  ].map((report) => (
                    <div
                      key={report.key}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        {report.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">{report.title}</p>
                        <p className="text-xs text-muted-foreground">{report.desc}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          title="Exportar CSV"
                          onClick={() =>
                            downloadCsv(
                              exportData[report.key as keyof typeof exportData],
                              `lynko-${report.key}.csv`,
                            )
                          }
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Exportar JSON"
                          onClick={() => {
                            downloadFile(
                              JSON.stringify(
                                exportData[report.key as keyof typeof exportData],
                                null,
                                2,
                              ),
                              `lynko-${report.key}.json`,
                              "application/json",
                            );
                            toast.success("Relatório JSON exportado.");
                          }}
                        >
                          <FileJson className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Pedidos processados"
                  value={String(exportData.orders.filter((o) => o.status !== "pending").length)}
                  icon={<Check className="h-4 w-4" />}
                />
                <StatCard
                  label="Taxas acumuladas"
                  value={formatPrice(revenue)}
                  icon={<DollarSign className="h-4 w-4" />}
                />
                <StatCard
                  label="Taxa de anúncios ativos"
                  value={`${exportData.products.length ? Math.round((exportData.products.filter((p) => p.status === "active").length / exportData.products.length) * 100) : 0}%`}
                  icon={<Activity className="h-4 w-4" />}
                />
              </div>
            </TabsContent>

            <TabsContent value="conteudo" className="mt-6">
              <AdminContent />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
      {children}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="border-border/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        {value === "loading" ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="text-2xl font-extrabold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}
