import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Search, Inbox, MailOpen, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChatPanel } from "@/components/chat-panel";
import { useAuth } from "@/hooks/use-auth";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/mensagens")({
  validateSearch: (search: Record<string, unknown>): { c?: string } =>
    typeof search['c'] === "string" ? { c: search['c'] } : {},
  head: () => ({
    meta: [
      { title: "Caixa de mensagens | LynkoMarketplace" },
      {
        name: "description",
        content:
          "Sua caixa de mensagens: converse em tempo real com compradores e vendedores, veja não lidas e acione a moderação.",
      },
      { property: "og:title", content: "Caixa de mensagens | LynkoMarketplace" },
      { property: "og:description", content: "Chat seguro entre cliente e vendedor com moderação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mensagens,
});

type Peer = { username?: string; display_name?: string | null; avatar_url?: string | null };

function Mensagens() {
  const { user } = useAuth();
  const { c: focusId } = Route.useSearch();
  const [activeId, setActiveId] = useState<string | null>(focusId ?? null);

  useEffect(() => {
    if (focusId) setActiveId(focusId);
  }, [focusId]);
  const [term, setTerm] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);

  const { data: conversations = [], refetch } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          "*, buyer:profiles!conversations_buyer_id_fkey(username, display_name, avatar_url), seller:profiles!conversations_seller_id_fkey(username, display_name, avatar_url)",
        )
        .order("last_message_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Última mensagem + não lidas de cada conversa
  const { data: recent = [] } = useQuery({
    queryKey: ["conversation-previews", user?.id, conversations.length],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, body, kind, read_at, created_at")
        .order("created_at", { ascending: false })
        .limit(400);
      if (error) throw error;
      return data;
    },
    enabled: !!user && conversations.length > 0,
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("inbox-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        refetch();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  const meta = useMemo(() => {
    const map = new Map<string, { last?: string; unread: number }>();
    for (const m of recent) {
      const entry = map.get(m.conversation_id) ?? { unread: 0 };
      if (!entry.last) entry.last = m.kind === "system" ? "Aviso da moderação" : m.body;
      if (!m.read_at && m.sender_id !== user?.id) entry.unread += 1;
      map.set(m.conversation_id, entry);
    }
    return map;
  }, [recent, user?.id]);

  const list = useMemo(() => {
    const q = term.trim().toLowerCase();
    return conversations.filter((c) => {
      const other = (c.buyer_id === user?.id ? c.seller : c.buyer) as Peer | undefined;
      const name = `${other?.display_name ?? ""} ${other?.username ?? ""}`.toLowerCase();
      const info = meta.get(c.id);
      if (onlyUnread && !(info?.unread ?? 0)) return false;
      if (!q) return true;
      return name.includes(q) || (info?.last ?? "").toLowerCase().includes(q);
    });
  }, [conversations, term, onlyUnread, meta, user?.id]);

  const current = activeId ?? list[0]?.id ?? null;
  const mobileOpen = !!activeId;
  const totalUnread = [...meta.values()].reduce((a, b) => a + b.unread, 0);


  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MessageSquare className="h-6 w-6" aria-hidden />
        </span>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">Caixa de mensagens</h1>
          <p className="text-sm text-muted-foreground">
            Converse com compradores e vendedores. Pode responder mensagens específicas, denunciar abusos ou
            chamar a moderação a qualquer momento.
          </p>
        </div>
        {totalUnread > 0 && (
          <Badge className="h-7 gap-1 px-3">{totalUnread} não lida{totalUnread > 1 ? "s" : ""}</Badge>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside
          className={`h-fit max-h-[600px] flex-col rounded-2xl border border-border bg-card ${
            mobileOpen ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="space-y-2 border-b border-border p-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Procurar conversa"
                aria-label="Procurar conversa"
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <FilterChip active={!onlyUnread} onClick={() => setOnlyUnread(false)} icon={<Inbox className="h-3.5 w-3.5" />}>
                Todas
              </FilterChip>
              <FilterChip active={onlyUnread} onClick={() => setOnlyUnread(true)} icon={<MailOpen className="h-3.5 w-3.5" />}>
                Não lidas
              </FilterChip>
            </div>
          </div>

          <div className="overflow-y-auto p-2">
            {list.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                {conversations.length ? "Nenhuma conversa neste filtro." : "Sem conversas ainda."}
              </p>
            )}
            {list.map((c) => {
              const other = (c.buyer_id === user?.id ? c.seller : c.buyer) as Peer | undefined;
              const info = meta.get(c.id);
              const name = other?.display_name || `@${other?.username ?? "usuário"}`;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  aria-current={current === c.id}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                    current === c.id ? "bg-accent" : "hover:bg-accent/60"
                  }`}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={other?.avatar_url ?? undefined} />
                    <AvatarFallback>{(other?.username ?? "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{name}</p>
                      <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                        {timeAgo(c.last_message_at)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{info?.last ?? "Sem mensagens"}</p>
                    {c.moderation_requested && (
                      <span className="mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        Moderação acionada
                      </span>
                    )}
                  </div>
                  {(info?.unread ?? 0) > 0 && (
                    <span className="mt-1 grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {info!.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {current ? (
          <div className={`min-w-0 ${mobileOpen ? "" : "hidden lg:block"}`}>
            {mobileOpen && (
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground lg:hidden"
              >
                <ChevronLeft className="h-4 w-4" /> Todas as conversas
              </button>
            )}
            <ChatPanel conversationId={current} />
          </div>
        ) : (
          <div className="hidden h-[520px] place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground lg:grid">
            Selecione uma conversa
          </div>
        )}

      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:bg-accent"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
