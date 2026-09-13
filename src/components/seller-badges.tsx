import { BadgeCheck, Crown, ShieldCheck, Star, Zap } from "lucide-react";
import type { Profile } from "@/lib/marketplace";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SellerBadge = {
  key: string;
  label: string;
  explanation: string;
  icon: typeof BadgeCheck;
  className: string;
};

export function SellerBadges({
  profile,
  reviewCount = 0,
  positiveReviews = 0,
  hasAutomaticDelivery = false,
  compact = false,
}: {
  profile: Pick<Profile, "verified" | "verification_level" | "staff_badge">;
  reviewCount?: number;
  positiveReviews?: number;
  hasAutomaticDelivery?: boolean;
  compact?: boolean;
}) {
  const positiveRate = reviewCount ? (positiveReviews / reviewCount) * 100 : 0;
  const badges: SellerBadge[] = [];

  if (profile.staff_badge) {
    badges.push({
      key: "staff",
      label: "Funcionário Lynko",
      explanation: "Este perfil pertence a um funcionário autorizado da equipe Lynko.",
      icon: ShieldCheck,
      className: "border-primary/40 bg-primary/10 text-primary",
    });
  }
  if (profile.verified) {
    badges.push({
      key: "verified",
      label: "Identidade verificada",
      explanation: `A identidade foi aprovada pela Lynko no nível ${profile.verification_level || "verificado"}.`,
      icon: BadgeCheck,
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
    });
  }
  if (reviewCount >= 5 && positiveRate >= 90) {
    badges.push({
      key: "excellent",
      label: "Excelente",
      explanation: `O vendedor recebeu ${positiveRate.toFixed(0)}% de avaliações positivas em pelo menos 5 compras concluídas.`,
      icon: Star,
      className: "border-amber-500/30 bg-amber-500/10 text-amber-500",
    });
  }
  if (reviewCount >= 10 && positiveRate >= 90) {
    badges.push({
      key: "prestige",
      label: "Prestígio",
      explanation:
        "Selo de destaque para vendedores com histórico consistente e excelente reputação.",
      icon: Crown,
      className: "border-violet-500/30 bg-violet-500/10 text-violet-500",
    });
  }
  if (hasAutomaticDelivery) {
    badges.push({
      key: "fast-delivery",
      label: "Entrega veloz",
      explanation: "Este vendedor possui anúncios com entrega automática pelo chat do pedido.",
      icon: Zap,
      className: "border-sky-500/30 bg-sky-500/10 text-sky-500",
    });
  }

  if (!badges.length) return null;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-wrap items-center gap-1.5">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <Tooltip key={badge.key}>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`cursor-help gap-1 ${compact ? "px-1.5 text-[10px]" : "text-[11px]"} ${badge.className}`}
                >
                  <Icon className="h-3 w-3" /> {badge.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-64 text-center">{badge.explanation}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
