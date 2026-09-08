import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Smartphone } from "lucide-react";
import { pushPermission, requestPushPermission } from "@/lib/push";
import {
  Bell,
  CheckCheck,
  Inbox,
  MessageSquare,
  Package,
  ShieldCheck,
  Wallet,
  Flag,
  Megaphone,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/notificacoes")({
  head: () => ({
    meta: [
      { title: "Central de notificações | LynkoMarketplace" },
      {
        name: "description",
        content:
          "Acompanhe mensagens, pedidos, saques e verificações em um só lugar e escolha o que quer receber.",
      },
      { property: "og:title", content: "Central de notificações | LynkoMarketplace" },
      { property: "og:description", content: "Tudo o que acontece na sua conta, em tempo real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Notificacoes,
});

type Notification = {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

const KINDS = [
  { id: "todas", label: "Todas", icon: Bell },
  { id: "message", label: "Mensagens", icon: MessageSquare },
  { id: "order", label: "Pedidos", icon: Package },
  { id: "withdrawal", label: "Saques", icon: Wallet },
  { id: "verification", label: "Verificação", icon: ShieldCheck },
  { id: "report", label: "Denúncias", icon: Flag },
];

const PREFS = [
  { key: "messages", label: "Mensagens no chat", hint: "Avisos de novas mensagens de clientes e vendedores.", icon: MessageSquare },
  { key: "orders", label: "Pedidos e vendas", hint: "Mudanças de status, pagamento aprovado e entrega.", icon: Package },
  { key: "withdrawals", label: "Saques", hint: "Aprovações, recusas e comprovantes da equipe.", icon: Wallet },
  { key: "verification", label: "Verificação de identidade", hint: "Resultado da análise dos seus documentos.", icon: ShieldCheck },
  { key: "reports", label: "Denúncias e apelações", hint: "Respostas da moderação nos seus casos.", icon: Flag },
  { key: "marketing", label: "Novidades da plataforma", hint: "Recursos novos e comunicados gerais.", icon: Megaphone },
] as const;

type PrefKey = (typeof PREFS)[number]["key"];
type Prefs = Record<PrefKey, boolean>;

const DEFAULT_PREFS: Prefs = {
  messages: true,
  orders: true,
  withdrawals: true,
  verification: true,
  reports: true,
  marketing: true,
};

function iconFor(kind: string) {
  return KINDS.find((k) => k.id === kind)?.icon ?? Bell;
}

function Notificacoes() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [kind, setKind] = useState("todas");
  const [onlyUnread, setOnlyUnread] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, kind, title, body, link, read_at, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as Notification[];
    },
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notifications-page-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ["notifications", user.id] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, qc]);

  const filtered = useMemo(
    () =>
      items.filter(
        (n) =>
          (kind === "todas" || n.kind === kind || (kind === "report" && n.kind === "appeal")) &&
          (!onlyUnread || !n.read_at),
      ),
    [items, kind, onlyUnread],
  );

  const unread = items.filter((n) => !n.read_at).length;
  const refresh = () => qc.invalidateQueries({ queryKey: ["notifications", user?.id] });

  const markAllRead = async () => {
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null)
      .eq("user_id", user!.id);
    refresh();
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    refresh();
  };

  const remove = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    refresh();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Bell className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold">Central de notificações</h1>
          <p className="text-sm text-muted-foreground">
            {unread > 0 ? `${unread} não lida(s)` : "Tudo em dia por aqui."}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" className="ml-auto gap-2" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" aria-hidden /> Marcar todas como lidas
          </Button>
        )}
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section aria-label="Caixa de notificações">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar notificações">
            {KINDS.map((k) => (
              <Button
                key={k.id}
                size="pill"
                variant={kind === k.id ? "default" : "outline"}
                onClick={() => setKind(k.id)}
                aria-pressed={kind === k.id}
                className="gap-1.5 text-xs"
              >
                <k.icon className="h-3.5 w-3.5" aria-hidden /> {k.label}
              </Button>
            ))}
            <Button
              size="pill"
              variant={onlyUnread ? "default" : "outline"}
              onClick={() => setOnlyUnread((v) => !v)}
              aria-pressed={onlyUnread}
              className="text-xs"
            >
              Só não lidas
            </Button>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
            {isLoading ? (
              <div className="grid gap-2 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="grid place-items-center gap-2 px-4 py-16 text-center text-sm text-muted-foreground">
                <Inbox className="h-7 w-7" aria-hidden />
                Nenhuma notificação nesta caixa.
              </div>
            ) : (
              <ul>
                {filtered.map((n) => {
                  const Icon = iconFor(n.kind);
                  return (
                    <li
                      key={n.id}
                      className={`flex items-start gap-3 border-b border-border/60 p-4 last:border-0 ${
                        n.read_at ? "" : "bg-accent/40"
                      }`}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{n.title}</p>
                        {n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}
                        <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</p>
                        {n.link && (
                          <Link
                            to={n.link as "/dashboard"}
                            onClick={() => markRead(n.id)}
                            className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                          >
                            Abrir
                          </Link>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {!n.read_at && (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Marcar como lida"
                            onClick={() => markRead(n.id)}
                          >
                            <CheckCheck className="h-4 w-4" aria-hidden />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Excluir notificação"
                          onClick={() => remove(n.id)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <div className="grid gap-4">
          <PreferencesPanel />
          <DevicePushPanel />
        </div>
      </div>
    </div>
  );
}

function PreferencesPanel() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notification_preferences")
      .select("messages, orders, withdrawals, verification, reports, marketing")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setPrefs(data as Prefs);
        setLoaded(true);
      });
  }, [user]);

  const update = async (key: PrefKey, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    const { error } = await supabase
      .from("notification_preferences")
      .upsert({ user_id: user!.id, ...next }, { onConflict: "user_id" });
    if (error) {
      setPrefs(prefs);
      toast.error(error.message);
      return;
    }
    toast.success("Preferências atualizadas.");
  };

  return (
    <aside className="h-fit rounded-2xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden /> Preferências de notificação
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Escolha o que quer receber. Avisos críticos de segurança continuam sendo enviados.
      </p>

      <div className="mt-4 grid gap-4">
        {PREFS.map((p) => (
          <div key={p.key} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Label htmlFor={`pref-${p.key}`} className="flex items-center gap-2 text-sm">
                <p.icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden /> {p.label}
              </Label>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{p.hint}</p>
            </div>
            <Switch
              id={`pref-${p.key}`}
              checked={prefs[p.key]}
              disabled={!loaded}
              onCheckedChange={(v) => update(p.key, v)}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}

function DevicePushPanel() {
  const { user } = useAuth();
  const [perm, setPerm] = useState<string>("default");
  const [sales, setSales] = useState(true);
  const [mediation, setMediation] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPerm(pushPermission());
    if (!user) return;
    supabase
      .from("notification_preferences")
      .select("push_sales, push_mediation")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSales(data.push_sales ?? true);
          setMediation(data.push_mediation ?? true);
        }
        setLoaded(true);
      });
  }, [user]);

  const save = async (patch: { push_sales?: boolean; push_mediation?: boolean }) => {
    if (patch.push_sales !== undefined) setSales(patch.push_sales);
    if (patch.push_mediation !== undefined) setMediation(patch.push_mediation);
    const { error } = await supabase
      .from("notification_preferences")
      .upsert({ user_id: user!.id, ...patch }, { onConflict: "user_id" });
    if (error) toast.error(error.message);
  };

  const enable = async () => {
    const ok = await requestPushPermission();
    setPerm(pushPermission());
    if (ok) toast.success("Avisos ativados neste aparelho.");
    else toast.error("Permissão negada nas configurações do aparelho.");
  };

  return (
    <aside className="h-fit rounded-2xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Smartphone className="h-4 w-4 text-primary" aria-hidden /> Avisos no aparelho
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Receba um alerta na tela do celular ou do computador quando algo importante acontecer.
      </p>

      {perm === "unsupported" ? (
        <p className="mt-4 text-xs text-muted-foreground">Este aparelho não suporta avisos.</p>
      ) : perm === "granted" ? (
        <div className="mt-4 grid gap-4">
          <p className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-500">
            ✅ Avisos ativados neste aparelho
          </p>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Label htmlFor="push-sales" className="text-sm">Vendas</Label>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Aviso na hora em que alguém compra.</p>
            </div>
            <Switch id="push-sales" checked={sales} disabled={!loaded} onCheckedChange={(v) => save({ push_sales: v })} />
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Label htmlFor="push-med" className="text-sm">Mediações</Label>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Aviso quando uma mediação for aberta.</p>
            </div>
            <Switch id="push-med" checked={mediation} disabled={!loaded} onCheckedChange={(v) => save({ push_mediation: v })} />
          </div>
        </div>
      ) : (
        <Button size="sm" className="mt-4 gap-2 bg-gradient-primary text-primary-foreground" onClick={enable}>
          <Smartphone className="h-4 w-4" /> Ativar avisos
        </Button>
      )}
    </aside>
  );
}
