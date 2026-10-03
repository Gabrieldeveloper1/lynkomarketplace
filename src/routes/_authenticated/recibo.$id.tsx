import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { orderConversation, verifyPayment } from "@/lib/commerce.functions";
import {
  CheckCircle2,
  Clock,
  Copy,
  MessageCircleQuestion,
  Package,
  Receipt,
  ShieldCheck,
  ExternalLink,
  Loader2,
  LayoutDashboard,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/format";
import { fetchOrder } from "@/lib/marketplace";
import { protectionTier } from "@/lib/protection";
import { ORDER_STATUS_LABEL, orderStatusClass } from "@/lib/order-status";

export const Route = createFileRoute("/_authenticated/recibo/$id")({
  head: () => ({
    meta: [
      { title: "Compra concluída | LynkoMarketplace" },
      {
        name: "description",
        content:
          "Recibo da sua compra: estado do pedido, resumo do pagamento, entrega e canal de suporte.",
      },
      { property: "og:title", content: "Compra concluída | LynkoMarketplace" },
      { property: "og:description", content: "Recibo com resumo do pagamento e suporte direto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReciboPage,
});

const DATE = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function ReciboPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openingChat, setOpeningChat] = useState(false);

  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
    refetchOnWindowFocus: true,
    refetchInterval: (q) => {
      const s = (q.state.data as { status?: string } | undefined)?.status;
      return s && s !== "delivered" && s !== "cancelled" && s !== "refunded" ? 5000 : false;
    },
  });

  const live = order?.status === "pending";

  // Enquanto o Pix não compensa, consultamos o banco automaticamente e
  // atualizamos a tela sem o usuário precisar recarregar.
  useEffect(() => {
    if (!live) return;
    let stopped = false;
    const tick = async () => {
      try {
        const res = await verifyPayment({ data: { orderId: id } });
        if (!stopped && res.status !== "pending") {
          await queryClient.invalidateQueries({ queryKey: ["order", id] });
          toast.success("Pagamento confirmado!");
        }
      } catch {
        /* tentamos de novo no próximo ciclo */
      }
    };
    void tick();
    const t = setInterval(() => void tick(), 8000);
    return () => {
      stopped = true;
      clearInterval(t);
    };
  }, [live, id, queryClient]);

  // Atualização instantânea assim que o pedido muda no banco.
  useEffect(() => {
    const ch = supabase
      .channel(`order-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `id=eq.${id}` },
        () => void queryClient.invalidateQueries({ queryKey: ["order", id] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [id, queryClient]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }
  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Pedido não encontrado.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard">Voltar ao painel</Link>
        </Button>
      </div>
    );
  }

  const product = (order as { product?: { title: string; slug: string; images: string[] } })
    .product;
  const seller = (order as { seller?: { username: string; display_name: string } }).seller;
  const tier = protectionTier(order.protection);
  const base = order.base_price_cents || order.amount_cents - order.protection_fee_cents;
  const paid = order.status !== "pending" && order.status !== "cancelled";
  const isSeller = user?.id === order.seller_id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      {/* Cabeçalho de sucesso */}
      <section
        className={`overflow-hidden rounded-3xl border p-6 text-center sm:p-8 ${
          paid ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-card"
        }`}
      >
        <span
          className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
            paid ? "bg-emerald-500/15 text-emerald-500" : "bg-primary/10 text-primary"
          }`}
        >
          {paid ? (
            <CheckCircle2 className="h-8 w-8" />
          ) : (
            <Loader2 className="h-8 w-8 animate-spin" />
          )}
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {paid ? "Compra concluída!" : "Aguardando o seu pagamento"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {paid
            ? "O pagamento foi confirmado pela Efí Bank e a entrega ficou registrada no chat."
            : "Assim que o Pix for compensado, esta página atualiza sozinha e a entrega é liberada."}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Badge className={orderStatusClass(order.status)}>
            {ORDER_STATUS_LABEL[order.status] ?? order.status}
          </Badge>
          <Badge variant="outline" className="gap-1 font-mono text-[11px]">
            #{order.id.slice(0, 8)}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {DATE.format(new Date(order.paid_at ?? order.created_at))}
          </span>
        </div>
      </section>

      {/* Produto */}
      <section className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex gap-3 sm:gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-accent sm:h-20 sm:w-20">
            {product?.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="grid h-full place-items-center text-muted-foreground">
                <Package className="h-6 w-6" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-bold">
              {product?.title ?? "Produto"}
            </p>
            {order.variant_name && (
              <p className="truncate text-xs text-muted-foreground">{order.variant_name}</p>
            )}
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Vendedor: {seller?.display_name || `@${seller?.username ?? ""}`}
            </p>
            {product?.slug && (
              <Link
                to="/produto/$slug"
                params={{ slug: product.slug }}
                className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Ver anúncio <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Resumo do pagamento */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Receipt className="h-4 w-4 text-primary" /> Resumo do pagamento
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="min-w-0 text-muted-foreground">Produto</dt>
            <dd className="shrink-0">{formatPrice(base)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="min-w-0 text-muted-foreground">{tier.name}</dt>
            <dd className="shrink-0 text-primary">+{formatPrice(order.protection_fee_cents)}</dd>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between gap-4 text-base font-extrabold">
            <dt>Total</dt>
            <dd className="text-primary">{formatPrice(order.amount_cents)}</dd>
          </div>
          {isSeller && (
            <>
              <Separator className="my-2" />
              <div className="flex items-center justify-between gap-4 text-sm font-bold">
                <dt>Você recebe</dt>
                <dd className="text-emerald-500">{formatPrice(order.seller_amount_cents)}</dd>
              </div>
            </>
          )}
        </dl>
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-accent/50 p-3 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="min-w-0">
            Pago por Pix via Efí Bank{order.charge_id ? ` · cobrança ${order.charge_id}` : ""}. Em
            caso de mediação aprovada, o reembolso é solicitado automaticamente ao banco.
          </span>
        </div>
      </section>

      {/* Conteúdo entregue */}
      {order.delivered_content && (
        <section className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Conteúdo entregue
          </p>
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-accent p-3 text-xs">
            {order.delivered_content}
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full gap-2"
            onClick={() => {
              void navigator.clipboard.writeText(order.delivered_content!);
              toast.success("Copiado!");
            }}
          >
            <Copy className="h-4 w-4" /> Copiar conteúdo
          </Button>
        </section>
      )}

      {/* Ações */}
      <section className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button
          className="h-11 bg-gradient-primary text-primary-foreground"
          disabled={openingChat || !order}
          onClick={async () => {
            if (!order) return;
            setOpeningChat(true);
            try {
              const { conversationId } = await orderConversation({ data: { orderId: order.id } });
              navigate({ to: "/mensagens", search: { c: conversationId } });
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Não foi possível abrir o chat do vendedor.",
              );
            } finally {
              setOpeningChat(false);
            }
          }}
        >
          {openingChat ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MessageCircleQuestion className="mr-2 h-4 w-4" />
          )}{" "}
          Falar com o vendedor
        </Button>
        <Button asChild variant="outline" className="h-11">
          <Link to="/pedido/$id" params={{ id: order.id }}>
            <Package className="mr-2 h-4 w-4" /> Acompanhar pedido
          </Link>
        </Button>
        <Button asChild variant="ghost" className="h-11">
          <Link to="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Ir para o painel
          </Link>
        </Button>
        <Button variant="ghost" className="h-11" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Guardar recibo
        </Button>
      </section>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Recebeu algo diferente do combinado?{" "}
        <Link to="/protecao" className="text-primary hover:underline">
          Veja como funciona a proteção
        </Link>{" "}
        e abra a mediação pelo chat do pedido.
      </p>
    </div>
  );
}
