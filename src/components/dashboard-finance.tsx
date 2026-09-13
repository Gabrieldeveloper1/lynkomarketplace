import { ArrowDownLeft, ArrowUpRight, BarChart3, ReceiptText, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, timeAgo } from "@/lib/format";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Sale = {
  id: string;
  status: string;
  seller_amount_cents: number;
  created_at: string;
  product?: { title?: string | null } | null;
};

type Withdrawal = {
  id: string;
  amount_cents: number;
  status: string;
  created_at: string;
  note?: string | null;
  reason?: string | null;
};

type Product = { id: string; title: string; sales_count: number; price_cents: number };

export function StatementTab({ sales, withdrawals }: { sales: Sale[]; withdrawals: Withdrawal[] }) {
  const rows = [
    ...sales.map((sale) => ({
      id: `sale-${sale.id}`,
      title: sale.product?.title ?? "Venda",
      amount: sale.seller_amount_cents,
      date: sale.created_at,
      status: sale.status,
      positive: true,
    })),
    ...withdrawals.map((withdrawal) => ({
      id: `withdrawal-${withdrawal.id}`,
      title: "Saque",
      amount: withdrawal.amount_cents,
      date: withdrawal.created_at,
      status: withdrawal.status,
      positive: false,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalIn = sales
    .filter((s) => ["paid", "shipped", "delivered", "completed"].includes(s.status))
    .reduce((sum, s) => sum + s.seller_amount_cents, 0);
  const totalOut = withdrawals
    .filter((w) => w.status === "paid")
    .reduce((sum, w) => sum + w.amount_cents, 0);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Entradas confirmadas</p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-500">{formatPrice(totalIn)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Saques pagos</p>
          <p className="mt-2 text-2xl font-extrabold">{formatPrice(totalOut)}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-primary" />
          <h2 className="font-bold">Extrato financeiro</h2>
        </div>
        {!rows.length ? (
          <p className="mt-5 text-sm text-muted-foreground">Ainda não há movimentações.</p>
        ) : (
          <div className="mt-4 grid gap-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${row.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"}`}
                >
                  {row.positive ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{row.title}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(row.date)}</p>
                </div>
                <Badge variant="outline">{row.status}</Badge>
                <p
                  className={`text-sm font-bold ${row.positive ? "text-emerald-500" : "text-foreground"}`}
                >
                  {row.positive ? "+" : "-"}
                  {formatPrice(row.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function MetricsTab({ sales, products }: { sales: Sale[]; products: Product[] }) {
  const paid = sales.filter((s) =>
    ["paid", "shipped", "delivered", "completed"].includes(s.status),
  );
  const chart = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", ""),
      sales: paid.filter((s) => s.created_at.slice(0, 10) === key).length,
      revenue: paid
        .filter((s) => s.created_at.slice(0, 10) === key)
        .reduce((sum, sale) => sum + sale.seller_amount_cents, 0),
    };
  });
  const best = [...products].sort((a, b) => b.sales_count - a.sales_count).slice(0, 5);
  const revenue = paid.reduce((sum, sale) => sum + sale.seller_amount_cents, 0);
  const average = paid.length ? Math.round(revenue / paid.length) : 0;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-bold">Métricas da sua loja</h2>
            <p className="text-xs text-muted-foreground">
              Acompanhe faturamento, conversão e desempenho dos anúncios.
            </p>
          </div>
        </div>
        <Badge variant="outline">Últimos 7 dias</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Vendas confirmadas" value={String(paid.length)} />
        <Metric label="Receita líquida" value={formatPrice(revenue)} />
        <Metric label="Produtos publicados" value={String(products.length)} />
        <Metric label="Ticket médio" value={formatPrice(average)} />
      </div>
      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Desempenho no período</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Receita líquida e quantidade de vendas por dia.
            </p>
          </div>
          <div className="flex gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-primary" /> Receita
            </span>
            <span className="flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-cyan-400" /> Vendas
            </span>
          </div>
        </div>
        <div className="mt-5 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart} margin={{ top: 10, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="revenue"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$${(value / 100).toFixed(0)}`}
              />
              <YAxis yAxisId="sales" orientation="right" hide />
              <Tooltip
                formatter={(value, name) => [
                  name === "revenue" ? formatPrice(Number(value)) : value,
                  name === "revenue" ? "Receita" : "Vendas",
                ]}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="sales"
                type="monotone"
                dataKey="sales"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold">Produtos com melhor desempenho</h3>
        {best.length ? (
          <div className="mt-4 grid gap-3">
            {best.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">{product.title}</span>
                <span className="text-xs text-muted-foreground">
                  {product.sales_count} venda(s)
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Publique produtos para ver seu desempenho.
          </p>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </div>
  );
}
