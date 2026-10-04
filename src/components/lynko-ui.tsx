import { useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";

/** Cartão com brilho que acompanha o cursor. */
export function SpotlightCard({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "rounded-[1.25rem] border border-border bg-card transition-colors hover:border-white/20",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Fundo decorativo: aurora + grade com máscara radial. */
export function AuroraBackdrop({ className, grid = true }: { className?: string; grid?: boolean }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="aurora" />
      {grid && (
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_30%,transparent_75%)]" />
      )}
    </div>
  );
}

/** Cabeçalho de página/aba: eyebrow, título, descrição e ações. */
export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  actions,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="flex min-w-0 items-start gap-4">
        {icon && (
          <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-full bg-[#262524] text-foreground sm:grid">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="eyebrow">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 font-display text-3xl font-light tracking-tight sm:text-[2.4rem]">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/** Título de seção dentro de um painel. */
export function SectionTitle({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {icon && (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#262524] text-muted-foreground">{icon}</span>
        )}
        <div className="min-w-0">
          <h3 className="truncate font-sans text-[0.95rem] font-semibold">{title}</h3>
          {hint && <p className="truncate text-[11px] text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/** Painel padrão (card de conteúdo). */
export function Panel({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <section className={cn("rounded-[1.25rem] border border-border bg-card p-5 sm:p-6", className)} {...rest}>
      {children}
    </section>
  );
}

type Tone = "violet" | "green" | "amber" | "pink";
const TONES: Record<Tone, string> = {
  violet: "bg-[#262524] text-foreground",
  green: "bg-[#262524] text-foreground",
  amber: "bg-[#262524] text-foreground",
  pink: "bg-[#262524] text-foreground",
};

/** Cartão de métrica com ícone e microdetalhe decorativo. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "violet",
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: ReactNode;
  tone?: Tone;
  delay?: number;
}) {
  const style: CSSProperties = { animationDelay: `${delay}ms` };
  return (
    <SpotlightCard className="animate-rise overflow-hidden p-5" style={style}>
      
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className={cn("grid h-8 w-8 place-items-center rounded-full bg-[#262524] text-muted-foreground", "")}>{icon}</span>
      </div>
      <div className="relative mt-3 font-display text-4xl font-light leading-none tracking-tight">{value}</div>
      {hint && <p className="relative mt-2 text-[11px] leading-snug text-muted-foreground">{hint}</p>}
    </SpotlightCard>
  );
}

/** Estado vazio ilustrado. */
export function EmptyState({
  icon,
  title,
  text,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] border border-dashed border-primary/30 bg-card/50 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(circle_at_center,#000,transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#262524] text-foreground">
        <span className="relative">{icon ?? <Icon.Sparkles className="h-7 w-7" />}</span>
      </div>
      <p className="relative mt-5 font-display text-lg font-bold">{title}</p>
      {text && <p className="relative mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="relative mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Selo pequeno (pílula) com ícone. */
export function Pill({
  children,
  icon,
  tone = "violet",
  className,
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
