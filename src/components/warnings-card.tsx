import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchMyWarnings } from "@/lib/marketplace";
import { useAuth } from "@/hooks/use-auth";

const SEVERITY: Record<string, { label: string; emoji: string; cls: string }> = {
  low: { label: "Leve", emoji: "🟡", cls: "bg-primary/10 text-primary" },
  medium: { label: "Média", emoji: "🟠", cls: "bg-primary/15 text-primary" },
  high: { label: "Grave", emoji: "🔴", cls: "bg-destructive/15 text-destructive" },
};

export function WarningsCard() {
  const { user } = useAuth();
  const { data = [], isLoading } = useQuery({
    queryKey: ["warnings", user?.id],
    queryFn: () => fetchMyWarnings(user!.id),
    enabled: !!user,
  });

  const active = data.filter((w) => w.active);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
            active.length ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          }`}
        >
          {active.length ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold">Advertências</h3>
          <p className="truncate text-xs text-muted-foreground">
            {isLoading
              ? "Verificando…"
              : active.length
                ? "Regularize para não perder a sua conta."
                : "Nenhuma advertência ativa. Continue assim! 🎉"}
          </p>
        </div>
        <Badge variant={active.length ? "destructive" : "secondary"} className="shrink-0">
          {active.length}
        </Badge>
      </header>

      {active.length > 0 && (
        <ul className="mt-4 grid gap-3">
          {active.map((w) => {
            const s = SEVERITY[w.severity] ?? SEVERITY.low;
            return (
              <li key={w.id} className="rounded-xl border border-border bg-background/60 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.cls}`}>
                    {s.emoji} {s.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(w.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold">{w.reason}</p>
                {w.details && <p className="mt-1 text-xs text-muted-foreground">{w.details}</p>}
              </li>
            );
          })}
        </ul>
      )}

      {data.length > active.length && (
        <p className="mt-3 text-xs text-muted-foreground">
          {data.length - active.length} advertência(s) já resolvida(s) pela equipe.
        </p>
      )}
    </section>
  );
}
