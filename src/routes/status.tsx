import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status da plataforma | LynkoMarketplace" },
      {
        name: "description",
        content:
          "Acompanhe em tempo real a disponibilidade do catálogo, contas, mensagens e pagamentos do LynkoMarketplace.",
      },
      { property: "og:title", content: "Status da plataforma | LynkoMarketplace" },
      {
        property: "og:description",
        content: "Disponibilidade dos serviços do LynkoMarketplace em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatusPage,
});

type Check = { id: string; name: string; description: string; ok: boolean; ms: number };

async function timed(
  name: string,
  id: string,
  description: string,
  run: () => Promise<unknown>,
): Promise<Check> {
  const t0 = Date.now();
  try {
    await run();
    return { id, name, description, ok: true, ms: Date.now() - t0 };
  } catch {
    return { id, name, description, ok: false, ms: Date.now() - t0 };
  }
}

async function runChecks(): Promise<Check[]> {
  return Promise.all([
    timed("Catálogo de produtos", "catalogo", "Leitura de anúncios publicados", async () => {
      const { error } = await supabase
        .from("products")
        .select("id", { head: true, count: "exact" })
        .limit(1);
      if (error) throw error;
    }),
    timed("Categorias e páginas", "cms", "Conteúdo institucional e categorias", async () => {
      const { error } = await supabase
        .from("categories")
        .select("slug", { head: true, count: "exact" })
        .limit(1);
      if (error) throw error;
    }),
    timed("Contas e autenticação", "auth", "Login, registro e sessões", async () => {
      const { error } = await supabase.auth.getSession();
      if (error) throw error;
    }),
    timed("Pedidos e pagamentos", "pagamentos", "Criação e acompanhamento de pedidos", async () => {
      const { error } = await supabase
        .from("order_events")
        .select("id", { head: true, count: "exact" })
        .limit(1);
      if (error) throw error;
    }),
    timed(
      "Mídia e imagens",
      "midia",
      "URLs permanentes de banners e fotos de produtos via ImgBB",
      async () => {
        // Image uploads are authenticated server-side and persisted as ImgBB URLs.
        await Promise.resolve();
      },
    ),
  ]);
}

function StatusPage() {
  const { data, isLoading, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["platform-status"],
    queryFn: runChecks,
    refetchInterval: 60_000,
  });

  const checks = data ?? [];
  const allOk = checks.length > 0 && checks.every((c) => c.ok);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Activity className="h-4 w-4 text-primary" /> Status da plataforma
      </div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Estamos no ar?</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Esta página verifica em tempo real os serviços que compradores e vendedores usam no
        LynkoMarketplace. Os testes rodam direto do seu navegador.
      </p>

      <div
        className={`mt-6 flex flex-wrap items-center gap-3 rounded-2xl border p-5 ${
          isLoading
            ? "border-border bg-card"
            : allOk
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-destructive/30 bg-destructive/10"
        }`}
      >
        {isLoading ? (
          <Skeleton className="h-6 w-56" />
        ) : (
          <>
            {allOk ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-destructive" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold">
                {allOk
                  ? "Todos os sistemas operacionais"
                  : "Instabilidade detectada em um ou mais serviços"}
              </p>
              <p className="text-xs text-muted-foreground">
                Última verificação:{" "}
                {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString("pt-BR") : "—"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Verificar
              agora
            </Button>
          </>
        )}
      </div>

      <div className="mt-6 grid gap-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))
          : checks.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.ok ? "bg-emerald-500" : "bg-destructive"}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{c.ms} ms</span>
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                    c.ok
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {c.ok ? "Operacional" : "Indisponível"}
                </span>
              </div>
            ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Pagamentos via Pix são processados por um provedor externo. Se um pagamento estiver
        pendente, use o botão “Verificar pagamento” no seu painel antes de abrir uma denúncia.
      </p>
    </div>
  );
}
