import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Icon, type IconProps } from "@/components/icons";
import type { ComponentType } from "react";

type Item = {
  label: string;
  icon: ComponentType<IconProps>;
  to: string;
  match: (p: string) => boolean;
  search?: Record<string, unknown>;
};

const items: Item[] = [
  { label: "Início", icon: Icon.Home, to: "/", match: (p) => p === "/" },
  {
    label: "Buscar",
    icon: Icon.Search,
    to: "/produtos",
    search: { q: "", cat: "todas", sort: "recentes" },
    match: (p) => p.startsWith("/produtos") || p.startsWith("/produto/"),
  },
  { label: "Favoritos", icon: Icon.Heart, to: "/favoritos", match: (p) => p.startsWith("/favoritos") },
  { label: "Mensagens", icon: Icon.Message, to: "/mensagens", match: (p) => p.startsWith("/mensagens") },
  { label: "Painel", icon: Icon.Dashboard, to: "/dashboard", match: (p) => p.startsWith("/dashboard") },
];

export function MobileTabBar() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Navegação do celular"
      className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-primary/25 bg-background/80 pb-[env(safe-area-inset-bottom)] shadow-[0_18px_50px_-12px_oklch(0.55_0.26_295/0.6)] backdrop-blur-2xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.match(pathname);
          const IconC = item.icon;
          const needsAuth = item.to !== "/" && item.to !== "/produtos" && !user;
          return (
            <li key={item.label}>
              <Link
                to={needsAuth ? "/auth" : (item.to as never)}
                search={(item.search as never) ?? undefined}
                className={cn(
                  "relative flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold transition active:scale-95",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-12 place-items-center rounded-full transition-all",
                    active && "bg-gradient-primary text-primary-foreground shadow-glow",
                  )}
                >
                  <IconC className="h-[18px] w-[18px]" />
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
