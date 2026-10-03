import { Link, useNavigate } from "@tanstack/react-router";

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
import { Icon } from "@/components/icons";
import { formatPrice } from "@/lib/format";

export function AccountMenu() {
  const navigate = useNavigate();
  const { profile, user, isStaff, signOut } = useAuth();
  const { theme, toggle } = useTheme();

  const name = profile?.display_name || profile?.username || "Conta";
  const initials = name.slice(0, 2).toUpperCase();

  const links = [
    { to: "/dashboard", label: "Meu painel", icon: <Icon.Dashboard className="h-4 w-4" /> },
    { to: "/favoritos", label: "Meus favoritos", icon: <Icon.Heart className="h-4 w-4" /> },
    { to: "/verificacao", label: "Verificação", icon: <Icon.ShieldCheck className="h-4 w-4" /> },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group ml-1 flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 pl-1 pr-2.5 backdrop-blur transition-all hover:border-primary/50 hover:shadow-glow data-[state=open]:border-primary/60 sm:pr-3"
          aria-label="Menu da conta"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt="Perfil" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[8rem] truncate text-sm font-semibold sm:inline">{name}</span>
          <Icon.ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground transition group-data-[state=open]:rotate-180 sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-80 rounded-3xl p-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-4 text-primary-foreground">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-white/50">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-white/20">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate text-sm font-bold">
                {name}
                {profile?.verified && <Icon.Verified className="h-4 w-4 shrink-0" />}
              </p>
              <p className="truncate text-xs opacity-80">{user?.email}</p>
            </div>
          </div>
          <div className="relative mt-3 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 backdrop-blur">
            <span className="flex items-center gap-1.5 text-[11px] font-medium opacity-90">
              <Icon.Wallet className="h-3.5 w-3.5" /> Saldo
            </span>
            <span className="text-sm font-extrabold">{formatPrice(profile?.balance_cents ?? 0)}</span>
          </div>
        </div>

        <div className="mt-2 grid gap-0.5">
          {links.map((l) => (
            <DropdownMenuItem key={l.to} asChild className="group gap-3 rounded-xl px-2.5 py-2.5 text-sm">
              <Link to={l.to}>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground transition group-hover:bg-primary/15 group-hover:text-primary">
                  {l.icon}
                </span>
                <span className="flex-1">{l.label}</span>
                <Icon.ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
              </Link>
            </DropdownMenuItem>
          ))}
          {profile?.username && (
            <DropdownMenuItem asChild className="group gap-3 rounded-xl px-2.5 py-2.5 text-sm">
              <Link to="/vendedor/$slug" params={{ slug: profile.username }}>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground transition group-hover:bg-primary/15 group-hover:text-primary">
                  <Icon.Store className="h-4 w-4" />
                </span>
                <span className="flex-1">Minha loja pública</span>
                <Icon.ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
              </Link>
            </DropdownMenuItem>
          )}
          {isStaff && (
            <DropdownMenuItem asChild className="group gap-3 rounded-xl px-2.5 py-2.5 text-sm">
              <Link to="/admin">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Icon.Shield className="h-4 w-4" />
                </span>
                <span className="flex-1">Administração</span>
              </Link>
            </DropdownMenuItem>
          )}
        </div>

        <div
          className="mt-1 flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Icon.Sparkles className="h-4 w-4" />
          </span>
          <span className="flex-1">Tema</span>
          <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/60 p-0.5">
            <button
              onClick={() => theme === "dark" && toggle()}
              aria-label="Tema claro"
              className={`grid h-7 w-8 place-items-center rounded-lg transition-colors ${
                theme === "light" ? "bg-card text-primary shadow-card" : "text-muted-foreground"
              }`}
            >
              <Icon.Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => theme === "light" && toggle()}
              aria-label="Tema escuro"
              className={`grid h-7 w-8 place-items-center rounded-lg transition-colors ${
                theme === "dark" ? "bg-card text-primary shadow-card" : "text-muted-foreground"
              }`}
            >
              <Icon.Moon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={() => {
            void signOut().then(() => navigate({ to: "/" }));
          }}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10">
            <Icon.Logout className="h-4 w-4" />
          </span>
          Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
