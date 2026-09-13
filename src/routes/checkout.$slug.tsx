import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Loader2,
  ArrowLeft,
  Check,
  Zap,
  Receipt,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/format";
import { fetchProductBySlug, fetchVariants } from "@/lib/marketplace";
import { createCheckout } from "@/lib/commerce.functions";
import { PROTECTION_TIERS, protectionTier, type ProtectionLevel } from "@/lib/protection";

export const Route = createFileRoute("/checkout/$slug")({
  validateSearch: (s: Record<string, unknown>) => ({
    variant: typeof s.variant === "string" ? s.variant : undefined,
    qty: Math.max(1, Math.min(20, Number(s.qty) || 1)),
  }),

  head: () => ({
    meta: [
      { title: "Checkout seguro | LynkoMarketplace" },
      {
        name: "description",
        content: "Escolha o seu nível de proteção e finalize a compra com pagamento em custódia.",
      },
      { property: "og:title", content: "Checkout seguro | LynkoMarketplace" },
      { property: "og:description", content: "Pagamento protegido e entrega automática." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [protection, setProtection] = useState<ProtectionLevel>("basica");
  const [variantId, setVariantId] = useState<string | undefined>(search.variant);
  const quantity = Math.max(1, Math.min(20, search.qty ?? 1));
  const [buying, setBuying] = useState(false);
  const [email, setEmail] = useState(user?.email ?? "");
  const [payment, setPayment] = useState<{
    pixCode: string;
    pixQrcodeImage?: string | null;
    orderId: string;
  } | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
  });

  const { data: variants = [] } = useQuery({
    queryKey: ["variants", product?.id],
    queryFn: () => fetchVariants(product!.id),
    enabled: !!product,
  });

  const variant = useMemo(
    () => variants.find((v) => v.id === variantId) ?? (variants.length ? variants[0] : null),
    [variants, variantId],
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Anúncio não encontrado.</p>
        <Button asChild className="mt-4">
          <Link to="/produtos">Voltar ao marketplace</Link>
        </Button>
      </div>
    );
  }

  const unit = variant ? variant.price_cents : product.price_cents;
  const base = unit * quantity;
  const tier = protectionTier(protection);
  const total = base + tier.feeCents;
  const isOwn = user?.id === product.seller_id;

  const confirm = async () => {
    const buyerEmail = email.trim().toLowerCase();
    if (buyerEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(buyerEmail)) {
      toast.error("Informe um e-mail válido ou deixe o campo em branco.");
      return;
    }
    setBuying(true);
    try {
      const res = await createCheckout({
        data: {
          productId: product.id,
          variantId: variant?.id ?? null,
          quantity,
          protection,
          email: buyerEmail || undefined,
        },
      });
      if (res.pixCode) {
        toast.success("QR Code Pix gerado! Pague para receber automaticamente.");
      } else if (res.message) {
        toast.info(res.message);
      }
      if (res.pixCode || res.pixQrcodeImage) {
        sessionStorage.setItem(
          `efi-payment:${res.orderId}`,
          JSON.stringify({
            pix_copy_paste: res.pixCode,
            pix_qrcode: res.pixQrcodeImage,
          }),
        );
      }
      if (user) {
        navigate({ to: "/pedido/$id", params: { id: res.orderId } });
      } else {
        setPayment({
          pixCode: res.pixCode!,
          pixQrcodeImage: res.pixQrcodeImage,
          orderId: res.orderId,
        });
        toast.success(
          buyerEmail
            ? "Compra registrada. Confira também a pasta de spam do seu e-mail."
            : "Compra registrada. O pedido pode aparecer na parte de spam se você informou um e-mail.",
        );
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível iniciar a compra.");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-6 pb-28 sm:py-8 lg:pb-8">
      <Link
        to="/produto/$slug"
        params={{ slug }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao anúncio
      </Link>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Lock className="h-3.5 w-3.5" /> Compra protegida
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Finalize sua compra
          </h1>
        </div>
        <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" /> Ambiente seguro
        </Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Escolha a variação e o nível de proteção. O valor fica em custódia até à entrega.
      </p>

      <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card p-1 text-center text-[11px] sm:text-xs">
        <div className="rounded-xl bg-primary px-2 py-2.5 font-bold text-primary-foreground">
          <span className="block text-[10px] opacity-75">01</span>Configurar
        </div>
        <div className="px-2 py-2.5 text-muted-foreground">
          <span className="block text-[10px]">02</span>Pagamento
        </div>
        <div className="px-2 py-2.5 text-muted-foreground">
          <span className="block text-[10px]">03</span>Entrega
        </div>
      </div>

      <section className="mt-6 rounded-3xl border border-primary/20 bg-gradient-surface p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold">Onde receber as informações</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Usaremos o e-mail apenas para comprovante, status e entrega quando aplicável.
            </p>
          </div>
        </div>
        <Label htmlFor="checkout-email" className="font-bold">
          E-mail para receber o produto e o comprovante
        </Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Não é obrigatório informar um e-mail. Se deixar em branco, acompanhe o pedido pela sua
          conta; se informar um e-mail, confira também a pasta de spam.
        </p>
        <Input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          autoComplete="email"
          className="mt-3 max-w-xl bg-background"
        />
      </section>

      {payment && (
        <section className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <h2 className="font-bold text-emerald-600">Pedido registrado</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pedido <strong>{payment.orderId.slice(0, 8)}</strong>. Pague com o código Pix abaixo; a
            confirmação e a entrega serão enviadas para o seu e-mail.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              {payment.pixQrcodeImage ? (
                <img
                  src={payment.pixQrcodeImage}
                  alt="QR Code Pix do pedido"
                  className="h-52 w-52"
                />
              ) : (
                <QRCodeSVG value={payment.pixCode} size={208} includeMargin />
              )}
            </div>
          </div>
          <p className="mt-3 text-center text-xs font-semibold text-emerald-700">
            Aponte a câmera do aplicativo do seu banco para pagar.
          </p>
          <p className="mt-3 text-xs font-semibold text-foreground">Pix copia e cola</p>
          <p className="mt-3 break-all rounded-xl bg-background p-3 font-mono text-xs">
            {payment.pixCode}
          </p>
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={() => {
              void navigator.clipboard.writeText(payment.pixCode);
              toast.success("Código Pix copiado!");
            }}
          >
            Copiar código Pix
          </Button>
        </section>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {variants.length > 0 && (
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                1 · Variação do produto
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {variants.map((v) => {
                  const selected = variant?.id === v.id;
                  const out = product.auto_delivery && v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={out}
                      onClick={() => setVariantId(v.id)}
                      className={`rounded-xl border p-3 text-left transition disabled:opacity-40 ${
                        selected
                          ? "border-primary bg-primary/5 shadow-glow"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{v.name}</span>
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(v.price_cents)}
                        </span>
                      </span>
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        {out ? "Esgotado" : v.description || `${v.stock} disponíveis`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {variants.length > 0 ? "2" : "1"} · Nível de proteção
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Taxa fixa em centavos igual para qualquer valor de compra. Somos justos em todos os
              níveis.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {PROTECTION_TIERS.map((t) => {
                const selected = protection === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setProtection(t.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span className="text-sm font-bold">{t.name}</span>
                    </div>
                    <p className="mt-1 text-lg font-extrabold text-primary">
                      +{formatPrice(t.feeCents)}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{t.tagline}</p>
                    <ul className="mt-3 space-y-1.5">
                      {t.benefits.map((b) => (
                        <li key={b} className="flex gap-1.5 text-[11px] text-muted-foreground">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-20">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Receipt className="h-4 w-4 text-primary" /> Recibo da compra
            </div>

            <div className="mt-4 flex gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-accent">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{product.title}</p>
                {variant && (
                  <Badge variant="secondary" className="mt-1">
                    {variant.name}
                  </Badge>
                )}
                {quantity > 1 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {quantity} × {formatPrice(unit)}
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Produto</dt>
                <dd>{formatPrice(base)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{tier.name}</dt>
                <dd className="text-primary">+{formatPrice(tier.feeCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Taxa do comprador</dt>
                <dd className="text-emerald-500">Grátis</dd>
              </div>
            </dl>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total a pagar</span>
              <span className="text-2xl font-extrabold text-primary">{formatPrice(total)}</span>
            </div>

            <Button
              onClick={confirm}
              disabled={buying || isOwn}
              size="lg"
              className="mt-4 w-full bg-gradient-primary text-primary-foreground shadow-glow"
            >
              {buying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              {isOwn ? "Este anúncio é seu" : "Gerar QR Code Pix"}
            </Button>

            <div className="mt-4 space-y-2 text-[11px] text-muted-foreground">
              <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-foreground">
                O pagamento pode demorar até 1 minuto para ser confirmado!
              </p>
              <p className="flex gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                Pagamento em custódia só libertamos ao vendedor após a entrega.
              </p>
              {product.auto_delivery && (
                <p className="flex gap-1.5">
                  <Zap className="h-3.5 w-3.5 shrink-0 text-primary" />
                  Entrega automática assim que o pagamento for confirmado.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Barra fixa no celular */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Total a pagar</p>
            <p className="truncate text-lg font-extrabold text-primary">{formatPrice(total)}</p>
          </div>
          <Button
            onClick={confirm}
            disabled={buying || isOwn}
            className="ml-auto h-11 flex-1 bg-gradient-primary text-primary-foreground shadow-glow"
          >
            {buying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            {isOwn ? "Anúncio seu" : "Gerar Pix"}
          </Button>
        </div>
      </div>
    </div>
  );
}
