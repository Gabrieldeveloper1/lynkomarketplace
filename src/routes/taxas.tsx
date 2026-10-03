import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PublicInfoPage } from "@/components/public-info-page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice, FEE_RATE } from "@/lib/format";

export const Route = createFileRoute("/taxas")({
  head: () => ({
    meta: [
      { title: "Taxas | LynkoMarketplace" },
      {
        name: "description",
        content: "Veja como funcionam as taxas da Lynko e calcule o valor líquido da venda.",
      },
    ],
  }),
  component: FeesPage,
});
function FeesPage() {
  const [value, setValue] = useState("100");
  const calc = useMemo(() => {
    const cents = Math.max(0, Number(value.replace(",", ".")) * 100 || 0);
    const fee = Math.round(cents * FEE_RATE);
    return { cents, fee, net: cents - fee };
  }, [value]);
  return (
    <>
      <PublicInfoPage
        eyebrow="Transparência financeira"
        title="Saiba quanto você recebe"
        description="A Lynko exibe as regras financeiras antes da venda. Não escondemos a taxa no checkout."
        sections={[
          {
            title: "Calculadora",
            body: "Digite o preço da venda para ver a taxa da plataforma e o valor líquido estimado.",
          },
          {
            title: "Publicação",
            body: "Criar um anúncio não exige pagamento. A taxa de serviço é aplicada conforme as regras da venda.",
          },
          {
            title: "Proteção no checkout",
            body: "O nível de proteção escolhido pelo comprador é apresentado separadamente no resumo do pedido.",
          },
        ]}
      />
      <section className="mx-auto mb-16 max-w-xl rounded-3xl border border-border bg-card p-6 shadow-card">
        <Label htmlFor="fee-price">Preço da venda</Label>
        <Input
          id="fee-price"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2"
          placeholder="100,00"
        />
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between">
            <span>Preço</span>
            <strong>{formatPrice(calc.cents)}</strong>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Taxa ({Math.round(FEE_RATE * 100)}%)</span>
            <span>- {formatPrice(calc.fee)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base">
            <strong>Valor líquido</strong>
            <strong className="text-primary">{formatPrice(calc.net)}</strong>
          </div>
        </div>
      </section>
    </>
  );
}
