import {
  User,
  Gamepad2,
  Coins,
  Play,
  AppWindow,
  CreditCard,
  Wrench,
  AtSign,
  Package,
  Music,
  Tv,
  Shield,
  Key,
  Gift,
  Bot,
  Smartphone,
  Globe,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  user: User,
  "gamepad-2": Gamepad2,
  gamepad: Gamepad2,
  coins: Coins,
  play: Play,
  "app-window": AppWindow,
  "credit-card": CreditCard,
  wrench: Wrench,
  "at-sign": AtSign,
  package: Package,
  music: Music,
  tv: Tv,
  shield: Shield,
  key: Key,
  gift: Gift,
  bot: Bot,
  smartphone: Smartphone,
  globe: Globe,
};

export function CategoryIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Package;
  return <Icon className={className} />;
}

type CategoryLike = {
  name: string;
  icon: string;
  image_url?: string | null;
  display_mode?: string | null;
};

/** Mostra a imagem da categoria quando definida, senão o ícone SVG. */
export function CategoryVisual({
  category,
  className = "h-6 w-6",
  imageClassName = "h-full w-full object-cover",
}: {
  category: CategoryLike;
  className?: string;
  imageClassName?: string;
}) {
  if (category.display_mode === "image" && category.image_url) {
    return (
      <img
        src={category.image_url}
        alt={category.name}
        loading="lazy"
        className={imageClassName}
      />
    );
  }
  return <CategoryIcon name={category.icon} className={className} />;
}
