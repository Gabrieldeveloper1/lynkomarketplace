import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
}

/** Tela de carregamento usada enquanto uma página é preparada. */
export function PageLoader({ label = "Carregando…" }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] w-full place-items-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="relative grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <span className="absolute inset-2 rounded-full bg-primary/10" />
          <Loader2 className="relative h-7 w-7 animate-spin text-primary" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/** Barra fina de progresso no topo, para trocas rápidas de página. */
export function TopProgress({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-transparent">
      <div className="h-full w-1/3 animate-[loading-slide_1s_ease-in-out_infinite] bg-gradient-primary" />
    </div>
  );
}

export function CardsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-2xl border border-border bg-card"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}
