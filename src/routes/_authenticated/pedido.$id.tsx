import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ShieldCheck,
  Package,
  CreditCard,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Receipt,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice, timeAgo } from "@/lib/format";
import { fetchOrder, fetchOrderEvents } from "@/lib/marketplace";
import { protectionTier } from "@/lib/protection";
import { verifyPayment } from "@/lib/commerce.functions";
import { ORDER_STATUS_LABEL, orderStatusClass, orderStepIndex } from "@/lib/order-status";


export const Route = createFileRoute("/_authenticated/pedido/$id")({
  head: () => ({
    meta: [
      { title: "Rastreamento do pedido | LynkoMarketplace" },
      { name: "description", content: "Acompanhe o estado do seu pedido em tempo real e veja o recibo detalhado." },
      { property: "og:title", content: "Rastreamento do pedido | LynkoMarketplace" },
      { property: "og:description", content: "Estado em tempo real, recibo de taxas e entrega automática." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PedidoPage,
});

const STEPS = [
  { key: "pending", label: "Aguardando pagamento", icon: CreditCard },
  { key: "paid", label: "Pagamento confirmado", icon: ShieldCheck },
  { key: "shipped", label: "Enviado", icon: Package },
  { key: "delivered", label: "Entregue", icon: CheckCircle2 },
];

const stepIndex = orderStepIndex;

const STATUS_LABEL = ORDER_STATUS_LABEL;


function PedidoPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
    refetchInterval: (q) => ((q.state.data as { status?: string } | undefined)?.status === "pending" ? 10000 : false),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["order-events", id],
    queryFn: () => fetchOrderEvents(id),
  });

  // Estado em tempo real
  useEffect(() => {
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `id=eq.${id}` },
        () => {
          void qc.invalidateQueries({ queryKey: ["order", id] });
          void qc.invalidateQueries({ queryKey: ["order-events", id] });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_events", filter: `order_id=eq.${id}` },
        () => void qc.invalidateQueries({ queryKey: ["order-events", id] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [id, qc]);

  // Automatização: confirma pagamento junto do Efí enquanto estiver pendente
  useEffect(() => {
    if (order?.status !== "pending") return;
    const tick = async () => {
      try {
        const res = await verifyPayment({ data: { orderId: id } });
        if (res.status !== "pending") {
          void qc.invalidateQueries({ queryKey: ["order", id] });
          void qc.invalidateQueries({ queryKey: ["order-events", id] });
          void qc.invalidateQueries({ queryKey: ["conversations"] });
          toast.success("Pagamento confirmado!");
          navigate({ to: "/recibo/$id", params: { id } });
        }

      } catch {
        /* ignora */
      }
    };
    void tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, [order?.status, id, qc, navigate]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }
  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Pedido não encontrado.</p>
        <Button asChild className="mt-4"><Link to="/dashboard">Voltar à dashboard</Link></Button>
      </div>
    );
  }

  const product = (order as { product?: { title: string; slug: string; images: string[] } }).product;
  const seller = (order as { seller?: { username: string; display_name: string } }).seller;
  const isSeller = user?.id === order.seller_id;
  const tier = protectionTier(order.protection);
  const base = order.base_price_cents || order.amount_cents - order.protection_fee_cents;
  const platformFee = order.fee_cents - order.protection_fee_cents;
  const current = stepIndex(order.status);
  const live = order.status === "pending";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Pedido #{order.id.slice(0, 8)}</h1>
        <Badge className={orderStatusClass(order.status)}>

          {live && <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-current" />}
          {STATUS_LABEL[order.status] ?? order.status}
        </Badge>
        {live && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 animate-spin" /> a atualizar em tempo real
          </span>
        )}
      </div>

      {/* Rastreamento */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Rastreamento</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-4">
          {STEPS.map((s, i) => {
            const done = i <= current;
            const Icon = s.icon;
            return (
              <li key={s.key} className="relative flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                {i < STEPS.length - 1 && (
                  <span
                    className={`absolute left-4 top-9 h-[calc(100%+0.75rem)] w-0.5 sm:left-auto sm:top-4 sm:h-0.5 sm:w-full sm:translate-x-1/2 ${
                      i < current ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${
                    done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className={`text-xs font-medium ${done ? "" : "text-muted-foreground"}`}>{s.label}</span>
              </li>
            );
          })}
        </ol>

        {events.length > 0 && (
          <div className="mt-8 space-y-2 border-t border-border pt-4">
            {events.map((e) => (
              <div key={e.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="font-medium text-foreground">{STATUS_LABEL[e.status] ?? e.status}</span>
                <span>· {e.label}</span>
                <span className="ml-auto">{timeAgo(e.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Recibo */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Receipt className="h-4 w-4 text-primary" /> Recibo da taxa
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Produto{order.variant_name ? ` · ${order.variant_name}` : ""}</span>
              <span>{formatPrice(base)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tier.name}</span>
              <span className="text-primary">+{formatPrice(order.protection_fee_cents)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total pago</span>
              <span className="text-primary">{formatPrice(order.amount_cents)}</span>
            </div>
            {isSeller && (
              <>
                <Separator className="my-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Taxa da plataforma (8%)</span>
                  <span>-{formatPrice(platformFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span>Você recebe</span>
                  <span className="text-emerald-500">{formatPrice(order.seller_amount_cents)}</span>
                </div>
              </>
            )}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Pagamento processado via Efí Bank · {order.charge_id ? `cobrança ${order.charge_id}` : "aguardando cobrança"}
          </p>
        </section>

        {/* Produto / entrega */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-accent">
              {product?.images?.[0] && <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">{product?.title ?? "Produto"}</p>
              <p className="text-xs text-muted-foreground">Vendedor: @{seller?.username ?? "—"}</p>
              {product?.slug && (
                <Link to="/produto/$slug" params={{ slug: product.slug }} className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                  Ver anúncio <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {order.status === "pending" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Assim que o pagamento for confirmado pelo Efí Bank, o estado atualiza-se aqui automaticamente.
              </p>
              {order.pix_copy_paste && order.pix_copy_paste.startsWith("http") && (
                <div className="space-y-2">
                  <Button asChild className="w-full bg-gradient-primary text-primary-foreground">
                    <a href={order.pix_copy_paste} target="_blank" rel="noopener noreferrer">
                      Pagar com Pix na Efí <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    O QR Code e o copia e cola são apresentados na página segura da Efí. Volta aqui depois de
                    pagar — a entrega é automática.
                  </p>
                </div>
              )}
              {order.pix_copy_paste && !order.pix_copy_paste.startsWith("http") && (
                <div className="rounded-2xl border border-border bg-accent/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Pague com Pix
                  </p>
                  <div className="mt-3 flex justify-center">
                    <div className="rounded-xl bg-white p-3">
                      {order.pix_qrcode ? (
                        <img src={order.pix_qrcode} alt="QR Code Pix do pedido" className="h-44 w-44" />
                      ) : (
                        <QRCodeSVG value={order.pix_copy_paste} size={176} />
                      )}
                    </div>
                  </div>
                  <p className="mt-3 break-all rounded-lg bg-background p-2 text-[10px] text-muted-foreground">
                    {order.pix_copy_paste}
                  </p>
                  <Button
                    className="mt-2 w-full gap-2 bg-gradient-primary text-primary-foreground"
                    onClick={() => {
                      void navigator.clipboard.writeText(order.pix_copy_paste!);
                      toast.success("Código Pix copiado!");
                    }}
                  >
                    <Copy className="h-4 w-4" /> Copiar código Pix
                  </Button>
                </div>
              )}
            </div>
          ) : order.delivered_content ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conteúdo entregue</p>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-xl bg-accent p-3 text-xs">
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
                <Copy className="h-4 w-4" /> Copiar
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Pagamento confirmado. O vendedor vai entregar em breve — fale com ele nas mensagens se precisar.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
