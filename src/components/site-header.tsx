import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Search, Sun, Moon, MessageSquare, LogIn, ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { NotificationsMenu } from "@/components/notifications-menu";
import { AccountMenu } from "@/components/account-menu";

const BRAND_LOGO_URL = "/lynko-marketplace-logo.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex shrink-0 items-center" aria-label="Lynko Market início">
      <img
        src={BRAND_LOGO_URL}
        alt="Lynko Market"
        className={compact ? "h-8 w-auto" : "h-9 w-auto"}
      />
    </Link>
  );
}

export function AdminBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-primary ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Admin
    </span>
  );
}

const navItems = [
  { label: "Marketplace", to: "/produtos" as const },
  { label: "Ofertas", to: "/ofertas" as const },
  { label: "Vendedores", to: "/vendedores" as const },
];

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate({ to: "/produtos", search: { q, cat: "todas", sort: "recentes" } });
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-2xl">
      <div className="lynko-shell flex h-[4.65rem] items-center gap-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[20rem] border-r border-border bg-background/95 p-0 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-5">
              <Logo />
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
            <div className="grid gap-2 p-5">
              <p className="eyebrow mb-2">Navegue</p>
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  search={
                    item.to === "/produtos" ? { q: "", cat: "todas", sort: "recentes" } : undefined
                  }
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-border px-4 py-3 text-sm font-bold transition hover:border-primary/50 hover:bg-accent"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/como-funciona"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-border px-4 py-3 text-sm font-bold transition hover:border-primary/50 hover:bg-accent"
              >
                Como funciona
              </Link>
              <div className="my-3 h-px bg-border" />
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-gradient-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground"
                >
                  Abrir meu painel
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-gradient-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground"
                >
                  Criar conta
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                search={
                  item.to === "/produtos" ? { q: "", cat: "todas", sort: "recentes" } : undefined
                }
                data-active={active}
                className="nav-link rounded-lg px-3 py-2 hover:bg-accent/70"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form
          onSubmit={submit}
          className="relative ml-auto hidden min-w-0 max-w-[29rem] flex-1 md:block"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Buscar produtos, categorias..."
            className="h-10 w-full rounded-xl border border-border bg-card/60 pl-10 pr-14 text-xs font-medium outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
            aria-label="Pesquisar no marketplace"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-1 text-[10px] font-bold text-muted-foreground lg:block">
            ⌘ K
          </kbd>
        </form>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-xl sm:inline-flex"
            onClick={toggle}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <>
              <Link to="/mensagens" className="hidden sm:block">
                <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Mensagens">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </Link>
              <NotificationsMenu />
              <AccountMenu />
            </>
          ) : (
            <Link to="/auth" search={{ redirect: "/dashboard" }}>
              <Button
                size="sm"
                className="gap-2 rounded-xl bg-gradient-primary px-4 font-bold text-primary-foreground shadow-glow"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="border-t border-border/50 px-3 py-2.5 md:hidden">
        <form onSubmit={submit} className="relative lynko-shell">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Buscar no marketplace"
            className="h-10 w-full rounded-xl border border-border bg-card/60 pl-10 pr-20 text-xs outline-none focus:border-primary/60"
            aria-label="Buscar no marketplace"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground"
          >
            Buscar
          </button>
        </form>
      </div>
      {isAdmin && profile && (
        <div className="hidden border-t border-primary/15 bg-primary/[.04] py-1.5 text-center text-[10px] font-semibold text-muted-foreground lg:block">
          Você está no modo operacional <AdminBadge className="ml-1" />
        </div>
      )}
    </header>
  );
}
