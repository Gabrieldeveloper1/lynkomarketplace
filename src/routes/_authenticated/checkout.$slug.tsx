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
} from "lucide-react";
import { toast } from "sonner";
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

export const Route = createFileRoute("/_authenticated/checkout/$slug")({
  validateSearch: (s: Record<string, unknown>) => ({
    variant: typeof s.variant === "string" ? s.variant : undefined,
    qty: Math.max(1, Math.min(20, Number(s.qty) || 1)),
  }),

  head: () => ({
    meta: [
      { title: "Checkout seguro | LynkoMarketplace" },
      { name: "description", content: "Escolha o seu nível de proteção e finalize a compra com pagamento em custódia." },
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
  const [payerName, setPayerName] = useState("");
  const [payerCpf, setPayerCpf] = useState("");
  const [payerPhone, setPayerPhone] = useState("");

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
    if (payerName.trim().length < 3) return toast.error("Informe o seu nome completo.");
    if (payerCpf.replace(/\D/g, "").length !== 11) return toast.error("CPF inválido.");
    const digits = payerPhone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) return toast.error("Telefone inválido.");
    setBuying(true);
    try {
      const res = await createCheckout({
        data: {
          productId: product.id,
          variantId: variant?.id ?? null,
          quantity,
          protection,
          payerName: payerName.trim(),
          payerCpf,
          payerPhone,
        },
      });
      if (res.pixCode) {
        toast.success("QR Code Pix gerado! Pague para receber automaticamente.");
      } else if (res.paymentUrl) {
        window.open(res.paymentUrl, "_blank", "noopener");
        toast.success("Pedido criado! Conclua o pagamento na janela aberta.");
      } else {
        toast.info(res.message ?? "Pedido criado.");
      }
      navigate({ to: "/pedido/$id", params: { id: res.orderId } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível iniciar a compra.");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 lg:pb-8">
      <Link
        to="/produto/$slug"
        params={{ slug }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao anúncio
      </Link>

      <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">Checkout seguro</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Escolha a variação e o nível de proteção. O valor fica em custódia até à entrega.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {variants.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-5">
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
                        selected ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{v.name}</span>
                        <span className="text-sm font-bold text-primary">{formatPrice(v.price_cents)}</span>
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

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {variants.length > 0 ? "2" : "1"} · Nível de proteção
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Taxa fixa em centavos — igual para qualquer valor de compra. Somos justos em todos os níveis.
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
                      <ShieldCheck className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-bold">{t.name}</span>
                    </div>
                    <p className="mt-1 text-lg font-extrabold text-primary">+{formatPrice(t.feeCents)}</p>
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

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {variants.length > 0 ? "3" : "2"} · Dados para o Pix
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Exigido pelo banco para emitir o QR Code Pix em seu nome.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="payer-name">Nome completo</Label>
                <Input
                  id="payer-name"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="Como no documento"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="payer-cpf">CPF</Label>
                <Input
                  id="payer-cpf"
                  inputMode="numeric"
                  value={payerCpf}
                  onChange={(e) => setPayerCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="payer-phone">Telefone</Label>
                <Input
                  id="payer-phone"
                  inputMode="numeric"
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="mt-1.5"
                />
              </div>
            </div>
          </section>
        </div>


        <aside className="h-fit lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Receipt className="h-4 w-4 text-primary" /> Recibo da compra
            </div>

            <div className="mt-4 flex gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-accent">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{product.title}</p>
                {variant && <Badge variant="secondary" className="mt-1">{variant.name}</Badge>}
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
              {buying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
              {isOwn ? "Este anúncio é seu" : "Gerar QR Code Pix"}
            </Button>

            <div className="mt-4 space-y-2 text-[11px] text-muted-foreground">
              <p className="flex gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                Pagamento em custódia — só libertamos ao vendedor após a entrega.
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
            {buying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
            {isOwn ? "Anúncio seu" : "Gerar Pix"}
          </Button>
        </div>
      </div>
    </div>

  );
}
