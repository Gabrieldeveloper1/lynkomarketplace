import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, MessageCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

type Item = {
  label: string;
  icon: typeof Home;
  to: string;
  match: (p: string) => boolean;
  search?: Record<string, unknown>;
};

const items: Item[] = [
  { label: "Início", icon: Home, to: "/", match: (p) => p === "/" },
  {
    label: "Buscar",
    icon: Search,
    to: "/produtos",
    search: { q: "", cat: "todas", sort: "recentes" },
    match: (p) => p.startsWith("/produtos") || p.startsWith("/produto/"),
  },
  { label: "Favoritos", icon: Heart, to: "/favoritos", match: (p) => p.startsWith("/favoritos") },
  { label: "Mensagens", icon: MessageCircle, to: "/mensagens", match: (p) => p.startsWith("/mensagens") },
  { label: "Painel", icon: LayoutDashboard, to: "/dashboard", match: (p) => p.startsWith("/dashboard") },
];

export function MobileTabBar() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Navegação do celular"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          const needsAuth = item.to !== "/" && item.to !== "/produtos" && !user;
          return (
            <li key={item.label}>
              <Link
                to={needsAuth ? "/auth" : (item.to as never)}
                search={(item.search as never) ?? undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium transition",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-12 place-items-center rounded-full transition",
                    active && "bg-primary/12",
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px] transition", active && "scale-110")} />
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
