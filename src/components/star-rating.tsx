import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = "sm",
  className,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const dim = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className={cn("flex items-center gap-0.5", className)} role={onChange ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        const icon = (
          <Star
            className={cn(dim, active ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
          />
        );
        if (!onChange) return <span key={n}>{icon}</span>;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
            onClick={() => onChange(n)}
            className="rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
