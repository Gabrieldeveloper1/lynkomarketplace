import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Send,
  Flag,
  Reply,
  X,
  ShieldAlert,
  ShieldCheck,
  Check,
  CheckCheck,
  Loader2,
  AlertCircle,
  RotateCcw,
  ArrowDown,
  MessagesSquare,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { ReportDialog } from "@/components/report-dialog";
import {
  requestModeration,
  cancelModeration,
  respondModeration,
  joinConversationAsModerator,
  markConversationRead,
} from "@/lib/commerce.functions";

export async function openConversation(params: {
  buyerId: string;
  sellerId: string;
  productId?: string | null;
}) {
  let existingQuery = supabase
    .from("conversations")
    .select("id")
    .or(
      `and(buyer_id.eq.${params.buyerId},seller_id.eq.${params.sellerId}),and(buyer_id.eq.${params.sellerId},seller_id.eq.${params.buyerId})`,
    );
  existingQuery = params.productId
    ? existingQuery.eq("product_id", params.productId)
    : existingQuery.is("product_id", null);
  const { data: existing } = await existingQuery
    .order("last_message_at", { ascending: false })
    .limit(1);
  if (existing && existing.length > 0) return existing[0].id;

  const insert = () =>
    supabase
      .from("conversations")
      .insert({
        buyer_id: params.buyerId,
        seller_id: params.sellerId,
        product_id: params.productId ?? null,
      })
      .select("id")
      .single();

  let { data, error } = await insert();
  if (error?.code === "23503") {
    // Conta ainda sem perfil público: cria e tenta de novo.
    const { ensureMyProfile } = await import("@/lib/profile.functions");
    await ensureMyProfile();
    ({ data, error } = await insert());
  }
  if (error) throw error;
  return data!.id;
}

type ChatMessage = {
  id: string;
  sender_id: string;
  body: string;
  hidden: boolean;
  created_at: string;
  read_at: string | null;
  reply_to_id?: string | null;
  kind?: string | null;
};

type PendingMessage = {
  tempId: string;
  body: string;
  replyToId: string | null;
  createdAt: string;
  failed: boolean;
};

const DAY = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" });
const HOUR = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 864e5);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return "Hoje";
  if (same(d, yesterday)) return "Ontem";
  return DAY.format(d);
}

export function ChatPanel({
  conversationId,
  moderatorMode = false,
}: {
  conversationId: string;
  moderatorMode?: boolean;
}) {
  const { user, isStaff, profile } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [atBottom, setAtBottom] = useState(true);
  const [moderationOpen, setModerationOpen] = useState(false);
  const [moderationProductId, setModerationProductId] = useState("");
  const [moderationReason, setModerationReason] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: conversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          "*, buyer:profiles!conversations_buyer_id_fkey(username, display_name, avatar_url, verified), seller:profiles!conversations_seller_id_fkey(username, display_name, avatar_url, verified)",
        )
        .eq("id", conversationId)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as {
        buyer_id: string;
        seller_id: string;
        product_id: string | null;
        moderation_requested: boolean | null;
        moderation_status: string | null;
        moderation_requested_by: string | null;
        moderation_cancelled_at: string | null;
        moderator_id: string | null;
        buyer?: {
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          verified?: boolean;
        };
        seller?: {
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          verified?: boolean;
        };
      } | null;
    },
  });

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data, error: e } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at");
      if (e) throw e;
      return data as unknown as ChatMessage[];
    },
    retry: 2,
  });

  const byId = useMemo(() => new Map(messages.map((m) => [m.id, m])), [messages]);
  const other = conversation?.buyer_id === user?.id ? conversation?.seller : conversation?.buyer;
  const otherName = other?.display_name || `@${other?.username ?? "usuário"}`;

  const { data: purchasedProducts = [], isLoading: purchasedProductsLoading } = useQuery({
    queryKey: ["moderation-products", user?.id, conversation?.seller_id],
    enabled: !!user && !!conversation?.seller_id && conversation.buyer_id === user.id,
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("product_id, products:products!orders_product_id_fkey(id, title)")
        .eq("buyer_id", user!.id)
        .eq("seller_id", conversation!.seller_id)
        .in("status", ["paid", "delivered", "disputed"]);
      if (error) throw error;
      return (orders ?? []).map((order) => {
        const product = Array.isArray(order.products) ? order.products[0] : order.products;
        return { id: order.product_id, title: product?.title ?? "Produto comprado" };
      });
    },
  });

  // Remove otimistas já confirmados pelo servidor
  useEffect(() => {
    if (pending.length === 0) return;
    const bodies = new Set(messages.filter((m) => m.sender_id === user?.id).map((m) => m.body));
    setPending((prev) => prev.filter((p) => p.failed || !bodies.has(p.body)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Tempo real
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => void qc.invalidateQueries({ queryKey: ["messages", conversationId] }),
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversationId}`,
        },
        () => void qc.invalidateQueries({ queryKey: ["conversation", conversationId] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, qc]);

  useEffect(() => {
    if (!user || isLoading || isError) return;
    const readAt = new Date().toISOString();
    // Atualiza o badge local imediatamente, sem esperar o refetch do banco.
    qc.setQueriesData({ queryKey: ["conversation-previews", user.id] }, (current) => {
      if (!Array.isArray(current)) return current;
      return current.map((message) =>
        message?.conversation_id === conversationId && message?.sender_id !== user.id
          ? { ...message, read_at: message.read_at ?? readAt }
          : message,
      );
    });
    void markConversationRead({ data: { conversationId } })
      .then(() => {
        qc.setQueryData<ChatMessage[]>(["messages", conversationId], (current) =>
          current?.map((message) =>
            message.sender_id !== user.id && !message.read_at
              ? { ...message, read_at: readAt }
              : message,
          ),
        );
        void qc.invalidateQueries({ queryKey: ["conversation-previews"] });
      })
      .catch((error) => console.error("[chat] não foi possível persistir leitura", error));
  }, [conversationId, isError, isLoading, messages.length, qc, user]);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  useLayoutEffect(() => {
    if (atBottom) scrollToBottom(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, pending.length, conversationId]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  const doSend = useCallback(
    async (body: string, replyToId: string | null) => {
      if (moderatorMode) {
        await joinConversationAsModerator({ data: { conversationId, message: body } });
        return;
      }
      const { error: e } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user!.id,
        body,
        reply_to_id: replyToId,
      } as never);
      if (e) throw e;
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    },
    [conversationId, moderatorMode, user],
  );

  const send = useMutation({
    mutationFn: async (p: PendingMessage) => {
      await doSend(p.body, p.replyToId);
      return p.tempId;
    },
    onSuccess: (tempId) => {
      setPending((prev) => prev.filter((p) => p.tempId !== tempId));
      void qc.invalidateQueries({ queryKey: ["messages", conversationId] });
      void qc.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (_e, p) => {
      setPending((prev) => prev.map((x) => (x.tempId === p.tempId ? { ...x, failed: true } : x)));
      toast.error("Não foi possível enviar. Toque em tentar novamente.");
    },
  });

  const submit = () => {
    const body = text.trim();
    if (!body || !user) return;
    const p: PendingMessage = {
      tempId: `t-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      body,
      replyToId: replyTo?.id ?? null,
      createdAt: new Date().toISOString(),
      failed: false,
    };
    setPending((prev) => [...prev, p]);
    setText("");
    setReplyTo(null);
    setAtBottom(true);
    send.mutate(p);
    inputRef.current?.focus();
  };

  const retry = (p: PendingMessage) => {
    setPending((prev) => prev.map((x) => (x.tempId === p.tempId ? { ...x, failed: false } : x)));
    send.mutate({ ...p, failed: false });
  };

  const modStatus =
    (conversation as { moderation_status?: string } | null | undefined)?.moderation_status ??
    (conversation?.moderation_requested ? "requested" : "none");

  // Só quem pediu a mediação pode cancelá-la.
  const isModerationRequester =
    !!user &&
    !!conversation?.moderation_requested_by &&
    conversation.moderation_requested_by === user.id;

  const refreshMod = () => {
    void qc.invalidateQueries({ queryKey: ["messages", conversationId] });
    void qc.invalidateQueries({ queryKey: ["conversation", conversationId] });
    void qc.invalidateQueries({ queryKey: ["conversations"] });
    void qc.invalidateQueries({ queryKey: ["admin-data"] });
  };

  const cancelModerator = useMutation({
    mutationFn: () => cancelModeration({ data: { conversationId } }),
    onSuccess: () => {
      toast.success("Pedido de mediação cancelado.");
      refreshMod();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const decide = useMutation({
    mutationFn: (decision: "accept" | "decline") =>
      respondModeration({ data: { conversationId, decision } }),
    onSuccess: (_r, decision) => {
      toast.success(decision === "accept" ? "Mediação aceita." : "Mediação recusada.");
      refreshMod();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const callModerator = useMutation({
    mutationFn: (input: { productId: string; reason: string }) =>
      requestModeration({ data: { conversationId, ...input } }),
    onSuccess: () => {
      toast.success("Mediação aberta. Um administrador analisará o caso em até 24 horas.");
      void qc.invalidateQueries({ queryKey: ["messages", conversationId] });
      void qc.invalidateQueries({ queryKey: ["conversation", conversationId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const submitModeration = () => {
    const reason = moderationReason.trim();
    if (!moderationProductId) return toast.error("Selecione qual produto você quer reclamar.");
    if (reason.length < 10) return toast.error("Informe um motivo com pelo menos 10 caracteres.");
    callModerator.mutate(
      { productId: moderationProductId, reason },
      {
        onSuccess: () => {
          setModerationOpen(false);
          setModerationReason("");
        },
      },
    );
  };

  const banned = !!profile?.banned;

  // agrupa por dia
  const groups = useMemo(() => {
    const out: { day: string; items: ChatMessage[] }[] = [];
    for (const m of messages) {
      const d = dayLabel(m.created_at);
      const last = out[out.length - 1];
      if (last && last.day === d) last.items.push(m);
      else out.push({ day: d, items: [m] });
    }
    return out;
  }, [messages]);

  return (
    <div className="flex h-[70vh] min-h-[420px] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:h-[640px]">
      {/* Cabeçalho */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-gradient-hero px-3 py-3 sm:px-4">
        <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/30">
          <AvatarImage src={other?.avatar_url ?? undefined} />
          <AvatarFallback>{(other?.username ?? "U").slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate text-sm font-semibold">
            <span className="truncate">{otherName}</span>
            {other?.verified && <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            Conversa protegida · mediação Lynko disponível
          </p>
        </div>
        {modStatus === "accepted" ? (
          <Badge variant="secondary" className="shrink-0 gap-1 text-[10px]">
            <ShieldCheck className="h-3 w-3" />{" "}
            <span className="hidden sm:inline">Reembolso aprovado pela Efí</span>
          </Badge>
        ) : modStatus === "requested" ? (
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <ShieldAlert className="h-3 w-3" />{" "}
              <span className="hidden sm:inline">Mediação pedida</span>
            </Badge>
            {moderatorMode ? (
              <>
                <Button
                  size="sm"
                  className="gap-1"
                  disabled={decide.isPending}
                  onClick={() => decide.mutate("accept")}
                >
                  <Check className="h-3.5 w-3.5" /> Aceitar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={decide.isPending}
                  onClick={() => decide.mutate("decline")}
                >
                  <X className="h-3.5 w-3.5" /> Recusar
                </Button>
              </>
            ) : (
              isModerationRequester && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={cancelModerator.isPending}
                  onClick={() => cancelModerator.mutate()}
                >
                  {cancelModerator.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">Cancelar mediação</span>
                  <span className="sm:hidden">Cancelar</span>
                </Button>
              )
            )}
          </div>
        ) : modStatus === "declined" ? (
          <Badge variant="outline" className="shrink-0 gap-1 text-[10px]">
            <X className="h-3 w-3" />
            <span className="hidden sm:inline">Mediação recusada</span>
          </Badge>
        ) : (
          !moderatorMode && (
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 gap-1"
              disabled={callModerator.isPending}
              onClick={() => {
                if (!purchasedProducts.length && !purchasedProductsLoading) {
                  toast.error("Você não tem compras registradas com este vendedor.");
                  return;
                }
                setModerationProductId(conversation?.product_id ?? purchasedProducts[0]?.id ?? "");
                setModerationOpen(true);
              }}
            >
              {callModerator.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShieldAlert className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Chamar moderador</span>
              <span className="sm:hidden">Ajuda</span>
            </Button>
          )
        )}
      </div>

      <Dialog open={moderationOpen} onOpenChange={setModerationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar moderação</DialogTitle>
            <DialogDescription>
              Selecione a compra relacionada e explique o motivo da reclamação. A equipe analisará o
              caso.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Selecione qual produto você quer fazer a reclamação</Label>
              <Select value={moderationProductId} onValueChange={setModerationProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto comprado" />
                </SelectTrigger>
                <SelectContent>
                  {purchasedProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`moderation-reason-${conversationId}`}>Motivo da reclamação</Label>
              <Textarea
                id={`moderation-reason-${conversationId}`}
                value={moderationReason}
                onChange={(event) => setModerationReason(event.target.value)}
                minLength={10}
                maxLength={1000}
                rows={5}
                placeholder="Explique o que aconteceu (mínimo de 10 caracteres)."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModerationOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={submitModeration}
              disabled={callModerator.isPending || !purchasedProducts.length}
            >
              {callModerator.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar para moderação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mensagens */}
      <div className="relative flex-1 overflow-hidden bg-background/40">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="h-full overflow-y-auto px-3 py-4 sm:px-4"
        >
          {isLoading && (
            <div className="grid gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className={i % 2 ? "flex justify-end" : "flex"}>
                  <Skeleton className={`h-12 rounded-2xl ${i % 2 ? "w-48" : "w-56"}`} />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="mx-auto max-w-sm rounded-2xl border border-destructive/40 bg-destructive/5 p-5 text-center">
              <AlertCircle className="mx-auto h-6 w-6 text-destructive" />
              <p className="mt-2 text-sm font-semibold">Não foi possível carregar as mensagens</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {error instanceof Error ? error.message : "Verifique sua conexão."}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 gap-2"
                onClick={() => void refetch()}
              >
                {isRefetching ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5" />
                )}
                Tentar novamente
              </Button>
            </div>
          )}

          {!isLoading && !isError && messages.length === 0 && pending.length === 0 && (
            <div className="grid place-items-center py-12 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <MessagesSquare className="h-7 w-7" />
              </span>
              <p className="mt-3 text-sm font-semibold">Comece a conversa</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Combine os detalhes por aqui. Todo o histórico fica guardado e pode ser usado numa
                disputa.
              </p>
            </div>
          )}

          <div className="grid gap-3">
            {groups.map((g) => (
              <div key={g.day} className="grid gap-3">
                <div className="flex justify-center">
                  <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {g.day}
                  </span>
                </div>
                {g.items.map((m) => {
                  if (m.kind === "system") {
                    return (
                      <div key={m.id} className="flex justify-center">
                        <span className="max-w-[85%] rounded-full bg-accent px-3 py-1 text-center text-[11px] text-muted-foreground">
                          {m.body}
                        </span>
                      </div>
                    );
                  }
                  const isModerator = m.kind === "moderator";
                  const mine = m.sender_id === user?.id;
                  const parent = m.reply_to_id ? byId.get(m.reply_to_id) : null;

                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className="group max-w-[85%] sm:max-w-[75%]">
                        {isModerator && (
                          <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                            <ShieldCheck className="h-3 w-3" /> Moderação LynkoMarketplace
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-sm sm:px-4 ${
                            isModerator
                              ? "border border-primary/40 bg-primary/10 text-foreground"
                              : mine
                                ? "rounded-br-md bg-gradient-primary text-primary-foreground"
                                : "rounded-bl-md bg-accent text-accent-foreground"
                          }`}
                        >
                          {parent && (
                            <div
                              className={`mb-2 truncate rounded-lg border-l-2 px-2 py-1 text-[11px] ${
                                mine
                                  ? "border-primary-foreground/50 bg-primary-foreground/10"
                                  : "border-primary/60 bg-background/60"
                              }`}
                            >
                              {parent.hidden ? "Mensagem removida" : parent.body}
                            </div>
                          )}
                          {m.hidden ? (
                            <em className="opacity-70">Mensagem removida pela moderação</em>
                          ) : (
                            <span className="whitespace-pre-wrap break-words">{m.body}</span>
                          )}
                        </div>
                        <div
                          className={`mt-1 flex items-center gap-2 text-[11px] text-muted-foreground ${
                            mine ? "justify-end" : ""
                          }`}
                        >
                          <span>{HOUR.format(new Date(m.created_at))}</span>
                          {mine &&
                            (m.read_at ? (
                              <CheckCheck
                                className="h-3 w-3 text-primary"
                                aria-label="Visualizada"
                              />
                            ) : (
                              <Check className="h-3 w-3" aria-label="Enviada" />
                            ))}
                          {!m.hidden && (
                            <button
                              onClick={() => {
                                setReplyTo(m);
                                inputRef.current?.focus();
                              }}
                              className="flex items-center gap-1 transition hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
                            >
                              <Reply className="h-3 w-3" /> Responder
                            </button>
                          )}
                          {!mine && (
                            <ReportDialog
                              targetType="message"
                              targetId={m.id}
                              trigger={
                                <button className="flex items-center gap-1 transition hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100">
                                  <Flag className="h-3 w-3" /> Denunciar
                                </button>
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Mensagens em envio */}
            {pending.map((p) => (
              <div key={p.tempId} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%]">
                  <div
                    className={`rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm sm:px-4 ${
                      p.failed
                        ? "border border-destructive/50 bg-destructive/10 text-foreground"
                        : "bg-gradient-primary text-primary-foreground opacity-70"
                    }`}
                  >
                    <span className="whitespace-pre-wrap break-words">{p.body}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
                    {p.failed ? (
                      <>
                        <span className="text-destructive">Falha ao enviar</span>
                        <button
                          onClick={() => retry(p)}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          <RotateCcw className="h-3 w-3" /> Tentar novamente
                        </button>
                        <button
                          onClick={() =>
                            setPending((prev) => prev.filter((x) => x.tempId !== p.tempId))
                          }
                          className="hover:text-foreground"
                        >
                          Descartar
                        </button>
                      </>
                    ) : (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" /> A enviar…
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!atBottom && (
          <button
            onClick={() => scrollToBottom()}
            aria-label="Ir para a última mensagem"
            className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground shadow-card transition hover:bg-accent"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {replyTo && (
        <div className="flex items-center gap-2 border-t border-border bg-accent/50 px-3 py-2 text-xs sm:px-4">
          <Reply className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate text-muted-foreground">{replyTo.body}</span>
          <button
            onClick={() => setReplyTo(null)}
            aria-label="Cancelar resposta"
            className="shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {banned && !isStaff ? (
        <div className="border-t border-border p-4 text-center text-xs text-muted-foreground">
          A sua conta está suspensa não pode enviar mensagens. Pode apenas enviar uma apelação no
          painel.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-end gap-2 border-t border-border p-2.5 sm:p-3"
        >
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder={moderatorMode ? "Escrever como moderador…" : "Escreva a sua mensagem…"}
            aria-label="Mensagem"
            className="max-h-32 min-h-10 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!text.trim()}
            aria-label="Enviar"
            className="h-10 w-10 shrink-0 bg-gradient-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
