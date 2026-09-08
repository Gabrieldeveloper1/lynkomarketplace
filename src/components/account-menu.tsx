import { Link, useNavigate } from "@tanstack/react-router";
import { User, Heart, Shield, LogOut, Sun, Moon, SunMoon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";

export function AccountMenu() {
  const navigate = useNavigate();
  const { profile, user, isStaff, signOut } = useAuth();
  const { theme, toggle } = useTheme();

  const name = profile?.display_name || profile?.username || "Conta";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="ml-1 flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:bg-accent data-[state=open]:border-primary/50 data-[state=open]:bg-accent"
          aria-label="Menu da conta"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt="Perfil" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[9rem] truncate text-sm font-medium sm:inline">
            Olá, {name} <span aria-hidden>👋</span>
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-72 rounded-2xl p-2">
        <div className="flex items-center gap-3 px-2 py-2.5">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="gap-3 rounded-xl px-2 py-2.5 text-sm">
          <Link to="/dashboard">
            <User className="h-4 w-4 text-muted-foreground" /> Minha conta
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-3 rounded-xl px-2 py-2.5 text-sm">
          <Link to="/favoritos">
            <Heart className="h-4 w-4 text-muted-foreground" /> Meus favoritos
          </Link>
        </DropdownMenuItem>
        {isStaff && (
          <DropdownMenuItem asChild className="gap-3 rounded-xl px-2 py-2.5 text-sm">
            <Link to="/admin">
              <Shield className="h-4 w-4 text-muted-foreground" /> Administração
            </Link>
          </DropdownMenuItem>
        )}

        <div
          className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <SunMoon className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1">Tema</span>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-0.5">
            <button
              onClick={() => theme === "dark" && toggle()}
              aria-label="Tema claro"
              className={`grid h-6 w-7 place-items-center rounded-md transition-colors ${
                theme === "light" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => theme === "light" && toggle()}
              aria-label="Tema escuro"
              className={`grid h-6 w-7 place-items-center rounded-md transition-colors ${
                theme === "dark" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-3 rounded-xl px-2 py-2.5 text-sm font-medium text-destructive focus:text-destructive"
          onClick={() => {
            void signOut().then(() => navigate({ to: "/" }));
          }}
        >
          <LogOut className="h-4 w-4" /> Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
