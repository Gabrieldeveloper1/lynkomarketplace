import { AdminContent } from "@/components/admin-content";
import { WithdrawalReviewDialog } from "@/components/withdrawal-review-dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice, timeAgo } from "@/lib/format";
import { fetchAdminData, staffAction } from "@/lib/commerce.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administração | LynkoMarketplace" },
      { name: "description", content: "Painel de administração: moderação, denúncias, KYC e saques." },
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

function Admin() {
  const { isStaff, loading } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
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

  if (loading) return <div className="p-10 text-center text-sm text-muted-foreground">Carregando...</div>;

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
  const pendingWithdrawals = (data?.withdrawals ?? []).filter((w) => w.status === "requested").length;
  const pendingAppeals = (data?.appeals ?? []).filter((a) => a.status === "pending").length;

  const NAV: { group: string; items: { value: string; label: string; icon: React.ReactNode; count?: number }[] }[] = [
    {
      group: "Moderação",
      items: [
        { value: "denuncias", label: "Denúncias", icon: <Flag className="h-4 w-4" />, count: pendingReports },
        { value: "moderacao", label: "Chats em disputa", icon: <MessageSquare className="h-4 w-4" /> },
        { value: "apelacoes", label: "Apelações", icon: <Gavel className="h-4 w-4" />, count: pendingAppeals },
      ],
    },
    {
      group: "Comunidade",
      items: [
        { value: "usuários", label: "Usuários", icon: <Users className="h-4 w-4" /> },
        { value: "anuncios", label: "Anúncios", icon: <Package className="h-4 w-4" /> },
        { value: "kyc", label: "Verificações", icon: <BadgeCheck className="h-4 w-4" />, count: pendingKyc },
      ],
    },
    {
      group: "Financeiro e conteúdo",
      items: [
        { value: "saques", label: "Saques", icon: <Wallet className="h-4 w-4" />, count: pendingWithdrawals },
        { value: "conteudo", label: "Conteúdo do site", icon: <LayoutGrid className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-gradient-surface p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold">Central de administração</h1>
            <p className="text-sm text-muted-foreground">
              Moderação, comunidade, financeiro e conteúdo da LynkoMarketplace em um só lugar.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          {pendingReports + pendingKyc + pendingWithdrawals + pendingAppeals} itens aguardando ação
        </Badge>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{(error as Error).message}</p>}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Usuários" value={String(data?.users.length ?? 0)} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Anúncios" value={String(data?.products.length ?? 0)} icon={<Package className="h-4 w-4" />} />
        <StatCard label="Denúncias abertas" value={String(pendingReports)} icon={<Flag className="h-4 w-4" />} />
        <StatCard label="Receita em taxas" value={formatPrice(revenue)} icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="denuncias" className="grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
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

        <div className="min-w-0">


        <TabsContent value="denuncias" className="mt-6 grid gap-3">
          {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
          {(data?.reports ?? []).map((r) => (
            <Row key={r.id}>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {r.reason} <span className="text-xs text-muted-foreground">({r.target_type})</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.details || "Sem detalhes"} · {timeAgo(r.created_at)}
                </p>
              </div>
              <Badge variant={r.status === "open" ? "outline" : "secondary"}>{r.status}</Badge>
              {r.target_type === "product" && (
                <Button size="sm" variant="outline" onClick={() => run("block_product", r.target_id)}>
                  Bloquear anúncio
                </Button>
              )}
              {r.target_type === "user" && (
                <Button size="sm" variant="outline" onClick={() => run("ban_user", r.target_id)}>
                  Banir
                </Button>
              )}
              {r.target_type === "message" && (
                <Button size="sm" variant="outline" onClick={() => run("hide_message", r.target_id)}>
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
              <Button size="sm" variant="outline" onClick={() => run(u.verified ? "unverify_user" : "verify_user", u.id)}>
                <BadgeCheck className="mr-1 h-4 w-4" /> {u.verified ? "Remover" : "Verificar"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => run(u.banned ? "unban_user" : "ban_user", u.id)}>
                <Ban className="mr-1 h-4 w-4" /> {u.banned ? "Desbanir" : "Banir"}
              </Button>
            </Row>
          ))}
        </TabsContent>

        <TabsContent value="anuncios" className="mt-6 grid gap-3">
          {(data?.products ?? []).map((p) => (
            <Row key={p.id}>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  @{(p as { seller?: { username?: string } }).seller?.username} · {formatPrice(p.price_cents)}
                </p>
              </div>
              <Badge variant={p.status === "active" ? "secondary" : "destructive"}>{p.status}</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => run(p.status === "active" ? "block_product" : "unblock_product", p.id)}
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
                  @{(v as { user?: { username?: string } }).user?.username} · doc {v.document_number}
                </p>
                <div className="mt-2 flex gap-2">
                  {v.document_url && (
                    <a href={v.document_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary">
                      Ver documento
                    </a>
                  )}
                  {v.selfie_url && (
                    <a href={v.selfie_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary">
                      Ver selfie
                    </a>
                  )}
                </div>
              </div>
              <Badge variant={v.status === "approved" ? "secondary" : "outline"}>{v.status}</Badge>
              <Button size="sm" onClick={() => run("approve_kyc", v.id)}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => run("reject_kyc", v.id)}>
                <X className="h-4 w-4" />
              </Button>
            </Row>
          ))}
          {!(data?.verifications ?? []).length && <p className="text-sm text-muted-foreground">Sem pedidos.</p>}
        </TabsContent>

        <TabsContent value="saques" className="mt-6 grid gap-3">
          {(data?.withdrawals ?? []).map((w) => {
            const rec = w as typeof w & { reason?: string | null; evidence_url?: string | null; reviewed_at?: string | null };
            return (
            <Row key={w.id}>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{formatPrice(w.amount_cents)}</p>
                <p className="text-xs text-muted-foreground">
                  @{(w as { seller?: { username?: string } }).seller?.username} · Pix {w.pix_key} · {timeAgo(w.created_at)}
                </p>
                {w.note && <p className="mt-1 text-xs text-muted-foreground">Nota: {w.note}</p>}
                {rec.reason && <p className="mt-1 text-xs text-muted-foreground">Motivo: {rec.reason}</p>}
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
                  <p className="mt-1 text-[11px] text-muted-foreground">Analisado {timeAgo(rec.reviewed_at)}</p>
                )}
              </div>
              <Badge variant={w.status === "paid" ? "secondary" : w.status === "rejected" ? "destructive" : "outline"}>
                {w.status === "paid" ? "Pago" : w.status === "rejected" ? "Recusado" : "Aguardando análise"}
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
                    onConfirm={(p) => run("pay_withdrawal", w.id, p.note, { reason: p.reason, evidenceUrl: p.evidenceUrl })}
                  />
                  <WithdrawalReviewDialog
                    mode="reject"
                    trigger={
                      <Button size="sm" variant="ghost">
                        <X className="mr-1 h-4 w-4" /> Recusar
                      </Button>
                    }
                    onConfirm={(p) =>
                      run("reject_withdrawal", w.id, p.note, { reason: p.reason, evidenceUrl: p.evidenceUrl })
                    }
                  />
                </>
              )}
            </Row>
            );
          })}


          {!(data?.withdrawals ?? []).length && <p className="text-sm text-muted-foreground">Sem pedidos de saque.</p>}
        </TabsContent>
        <TabsContent value="apelacoes" className="mt-6 grid gap-3">
          {(data?.appeals ?? []).map((a) => (
            <Row key={a.id}>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  @{(a as { user?: { username?: string } }).user?.username ?? "usuário"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Motivo do ban: {(a as { user?: { ban_reason?: string | null } }).user?.ban_reason ?? "—"}
                </p>
                <p className="mt-2 whitespace-pre-wrap rounded-xl bg-accent p-3 text-xs">{a.message}</p>
                {a.staff_reply && (
                  <p className="mt-1 text-xs text-primary">Resposta: {a.staff_reply}</p>
                )}
              </div>
              <Badge variant={a.status === "pending" ? "outline" : "secondary"}>{a.status}</Badge>
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
          {!(data?.appeals ?? []).length && <p className="text-sm text-muted-foreground">Sem apelações.</p>}
        </TabsContent>

        <TabsContent value="moderacao" className="mt-6">
          <ModerationChats
            chats={(data?.moderationChats ?? []) as ModerationChat[]}
            activeId={chatId}
            onSelect={setChatId}
          />
        </TabsContent>

        <TabsContent value="conteudo" className="mt-6">
          <AdminContent />
        </TabsContent>
        </div>
      </Tabs>

    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">{children}</div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <span className="text-primary">{icon}</span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-extrabold">{value}</p>
      </CardContent>
    </Card>
  );
}
