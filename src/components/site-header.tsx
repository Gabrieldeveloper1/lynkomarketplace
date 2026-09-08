import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Search,
  Sun,
  Moon,
  Bell,
  Menu,
  ChevronDown,
  LayoutDashboard,
  Shield,
  Store,
  LogOut,
  BadgeCheck,
  MessageSquare,
  Wallet,
  LogIn,
  Zap,
  ShieldCheck,
  Sparkles,
  Users,
  Flame,
  X,
  Instagram,
  Twitter,
  Youtube,
  LifeBuoy,
  FileText,
  Lock,
  ChevronRight,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { NotificationsMenu } from "@/components/notifications-menu";
import { AccountMenu } from "@/components/account-menu";

import { fetchCategories, fetchProducts, fetchSitePages } from "@/lib/marketplace";
import { PROTECTION_TIERS } from "@/lib/protection";
import { formatPrice } from "@/lib/format";
import { CategoryVisual } from "@/components/category-icon";
import logoAsset from "@/assets/lynko-market-logo.png.asset.json";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center" aria-label="Lynko Market — início">
      <img
        src={logoAsset.url}
        alt="Lynko Market"
        className={`invert dark:invert-0 ${compact ? "h-8 w-10 object-cover object-left" : "h-8 w-auto sm:h-9"}`}
      />
    </Link>
  );
}

export function AdminBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-glow ${className}`}
    >
      <Zap className="h-3 w-3 fill-current" /> Admin Poderoso
    </span>
  );
}

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const { user, profile, isStaff, isAdmin, signOut } = useAuth();
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: sitePages = [] } = useQuery({ queryKey: ["site-pages"], queryFn: fetchSitePages });
  const activeCat = useRouterState({
    select: (s) => (s.location.search as { cat?: string })?.cat ?? "todas",
  });


  const { data: suggestions = [], isFetching: searching } = useQuery({
    queryKey: ["search-suggest", q],
    queryFn: () => fetchProducts({ q, limit: 6, sort: "recentes" }),
    enabled: q.trim().length >= 2,
  });

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSuggestOpen(false);
    navigate({ to: "/produtos", search: { q, cat: "todas", sort: "recentes" } });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        {/* Drawer menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[22rem] overflow-y-auto border-r border-border p-0">
            <DrawerContent
              categories={categories}
              activeCat={activeCat}
              sitePages={sitePages}
              onNavigate={() => setOpen(false)}
              theme={theme}
              toggle={toggle}
            />

          </SheetContent>
        </Sheet>

        <Logo />

        <nav className="hidden items-center gap-1 xl:flex">
          <Link to="/produtos" search={{ q: "", cat: "todas", sort: "recentes" }}>
            <Button variant="ghost" size="pill" className="text-sm">
              Marketplace
            </Button>
          </Link>
          <Link to="/vendedores">
            <Button variant="ghost" size="pill" className="text-sm">
              Vendedores
            </Button>
          </Link>
        </nav>


        <div className="relative mx-auto hidden w-full max-w-xl flex-1 md:block">
          <form onSubmit={submit}>
            <div className="flex h-11 items-center gap-1 rounded-full border border-border bg-card/60 pl-4 pr-1.5 transition-colors focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setSuggestOpen(true)}
                onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                placeholder="Pesquisar categorias, produtos ou usuários"
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Pesquisar"
              />
              <kbd className="pointer-events-none hidden shrink-0 select-none items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:flex">
                ⌘K
              </kbd>
              <CategoriesMenu categories={categories} activeCat={activeCat} inline />
            </div>
          </form>

          {suggestOpen && q.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-card">
              {suggestions.length === 0 ? (
                <p className="px-3 py-4 text-sm text-muted-foreground">
                  {searching ? "Buscando..." : "Sem resultados para esta pesquisa."}
                </p>
              ) : (
                suggestions.map((p) => (
                  <Link
                    key={p.id}
                    to="/produto/$slug"
                    params={{ slug: p.slug }}
                    onClick={() => setSuggestOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-accent"
                  >
                    <span className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-accent">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.title}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {p.auto_delivery ? "Entrega automática" : "Entrega manual"}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-primary">{formatPrice(p.price_cents)}</span>
                  </Link>
                ))
              )}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={submit}
                className="mt-1 w-full rounded-xl bg-accent/60 px-3 py-2 text-xs font-medium text-primary"
              >
                Ver todos os resultados para "{q}"
              </button>
            </div>
          )}
        </div>


        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={toggle}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <>
              <Link to="/mensagens" className="hidden sm:block">
                <Button variant="ghost" size="icon" aria-label="Mensagens">
                  <MessageSquare className="h-5 w-5" aria-hidden />
                </Button>
              </Link>
              <NotificationsMenu />

              <AccountMenu />

            </>
          ) : (
            <Link to="/auth" search={{ redirect: "/dashboard" }}>
              <Button variant="mono" size="pill" className="gap-2">
                <LogIn className="h-4 w-4" /> Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

type CategoryLite = {
  slug: string;
  name: string;
  icon: string;
  image_url?: string | null;
  display_mode?: string | null;
};

function CategoriesMenu({
  categories,
  activeCat,
  inline = false,
}: {
  categories: CategoryLite[];
  activeCat: string;
  inline?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [view, setView] = useState<"populares" | "todas">("populares");
  const active = categories.find((c) => c.slug === activeCat);

  const base =
    view === "todas"
      ? [...categories].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
      : categories.slice(0, 12);
  const list = base.filter((c) => c.name.toLowerCase().includes(term.trim().toLowerCase()));

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setTerm("");
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="pill"
          className={
            inline
              ? "h-8 shrink-0 gap-1.5 rounded-full bg-secondary px-3.5 text-sm font-semibold hover:bg-accent data-[state=open]:bg-accent"
              : "gap-1 border border-transparent text-sm transition-colors hover:border-border hover:bg-accent data-[state=open]:border-border data-[state=open]:bg-accent"
          }
        >
          {active ? active.name : "Categorias"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl gap-0 rounded-3xl p-0">
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-border px-6 py-5 pr-14">
          <DialogTitle className="font-display text-lg font-bold">Categorias</DialogTitle>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Filtrar categorias"
              className="h-9 rounded-full pl-9"
              aria-label="Filtrar categorias"
            />
          </div>
        </DialogHeader>

        <div className="flex items-center gap-5 border-b border-border px-6">
          <button
            type="button"
            onClick={() => setView("populares")}
            className={`-mb-px border-b-2 py-3 text-sm transition-colors ${
              view === "populares"
                ? "border-foreground font-semibold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Populares
          </button>
          <button
            type="button"
            onClick={() => setView("todas")}
            className={`-mb-px border-b-2 py-3 text-sm transition-colors ${
              view === "todas"
                ? "border-foreground font-semibold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Todas (A–Z)
          </button>
        </div>

        <div className="grid max-h-[26rem] grid-cols-1 gap-2.5 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.length === 0 && (
            <p className="col-span-full px-2 py-8 text-center text-sm text-muted-foreground">
              Nenhuma categoria encontrada.
            </p>
          )}
          {list.map((c) => (
            <Link
              key={c.slug}
              to="/produtos"
              search={{ q: "", cat: c.slug, sort: "recentes" }}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                c.slug === activeCat
                  ? "border-primary/60 bg-accent"
                  : "border-border bg-card/40 hover:border-foreground/20 hover:bg-accent"
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary text-foreground">
                <CategoryVisual category={c} className="h-5 w-5" />
              </span>
              <span className="truncate text-sm font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DrawerContent({
  categories,
  activeCat,
  sitePages,
  onNavigate,
  theme,
  toggle,
}: {
  categories: CategoryLite[];
  activeCat: string;
  sitePages: { slug: string; title: string }[];
  onNavigate: () => void;
  theme: string;
  toggle: () => void;
}) {
  const { user, profile, isStaff, isAdmin } = useAuth();
  const [catTerm, setCatTerm] = useState("");
  const filteredCats = categories.filter((c) =>
    c.name.toLowerCase().includes(catTerm.trim().toLowerCase()),
  );


  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center justify-between border-b border-border bg-gradient-hero p-5">
        <Logo />
        <SheetClose asChild>
          <Button variant="ghost" size="icon" aria-label="Fechar menu">
            <X className="h-5 w-5" />
          </Button>
        </SheetClose>
      </div>

      <div className="p-5">
        {user ? (
          <Link
            to="/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <Avatar className="h-11 w-11">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback>{(profile?.username ?? "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {profile?.display_name || profile?.username}
              </p>
              {isAdmin ? (
                <AdminBadge className="mt-1" />
              ) : (
                <p className="truncate text-xs text-muted-foreground">
                  Saldo {formatPrice(profile?.balance_cents ?? 0)}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <Link to="/auth" search={{ redirect: "/dashboard" }} onClick={onNavigate}>
            <Button className="w-full gap-2 bg-gradient-primary text-primary-foreground shadow-glow">
              <LogIn className="h-4 w-4" /> Entrar ou criar conta
            </Button>
          </Link>
        )}

        <DrawerSection title="Descobrir">
          <DrawerLink to="/produtos" search={{ q: "", cat: "todas", sort: "recentes" }} icon={<Store className="h-4 w-4" />} onNavigate={onNavigate}>
            Marketplace
          </DrawerLink>
          <DrawerLink to="/produtos" search={{ q: "", cat: "todas", sort: "vendidos" }} icon={<Flame className="h-4 w-4" />} onNavigate={onNavigate}>
            Mais vendidos
          </DrawerLink>
          <DrawerLink to="/vendedores" icon={<Users className="h-4 w-4" />} onNavigate={onNavigate}>
            Vendedores verificados
          </DrawerLink>
        </DrawerSection>

        <DrawerSection title="Minha conta">
          <DrawerLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} onNavigate={onNavigate}>
            Painel
          </DrawerLink>
          <DrawerLink to="/mensagens" icon={<MessageSquare className="h-4 w-4" />} onNavigate={onNavigate}>
            Mensagens
          </DrawerLink>
          <DrawerLink to="/notificacoes" icon={<Bell className="h-4 w-4" />} onNavigate={onNavigate}>
            Notificações
          </DrawerLink>
          <DrawerLink to="/dashboard" icon={<Wallet className="h-4 w-4" />} onNavigate={onNavigate}>
            Carteira e saques
          </DrawerLink>
          <DrawerLink to="/verificacao" icon={<BadgeCheck className="h-4 w-4" />} onNavigate={onNavigate}>
            Verificação de identidade
          </DrawerLink>
          {isStaff && (
            <DrawerLink to="/admin" icon={<Shield className="h-4 w-4 text-primary" />} onNavigate={onNavigate}>
              Painel administrativo
            </DrawerLink>
          )}
        </DrawerSection>

        <DrawerSection title="Categorias">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={catTerm}
              onChange={(e) => setCatTerm(e.target.value)}
              placeholder="Buscar categoria..."
              className="h-9 pl-9"
              aria-label="Buscar categoria"
            />
          </div>
          <div className="grid gap-2">
            <Link
              to="/produtos"
              search={{ q: "", cat: "todas", sort: "recentes" }}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                activeCat === "todas" ? "border-primary/60 bg-accent" : "border-border bg-card"
              }`}
            >
              <Sparkles className="h-4 w-4 text-primary" /> Todas as categorias
            </Link>
            <div className="grid grid-cols-2 gap-2">
              {filteredCats.map((c) => {
                const isActive = c.slug === activeCat;
                return (
                  <Link
                    key={c.slug}
                    to="/produtos"
                    search={{ q: "", cat: c.slug, sort: "recentes" }}
                    onClick={onNavigate}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
                      isActive
                        ? "border-primary/60 bg-accent font-semibold"
                        : "border-border bg-card font-medium hover:border-primary/50"
                    }`}
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded text-primary">
                      <CategoryVisual category={c} className="h-4 w-4 text-primary" />
                    </span>
                    <span className="truncate">{c.name}</span>
                  </Link>
                );
              })}
            </div>
            {filteredCats.length === 0 && (
              <p className="px-1 py-2 text-xs text-muted-foreground">Nenhuma categoria encontrada.</p>
            )}
          </div>
        </DrawerSection>


        <DrawerSection title="Taxa de serviço">
          <div className="grid gap-2">
            {PROTECTION_TIERS.map((t) => (
              <div key={t.id} className="rounded-xl border border-border bg-card p-3">
                <p className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> {t.name}
                  </span>
                  <span className="text-primary">+{formatPrice(t.feeCents)}</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{t.tagline}</p>
              </div>
            ))}
          </div>
        </DrawerSection>

        <DrawerSection title="Plataforma">
          <div className="grid gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-2 px-1 py-1.5">
              <Zap className="h-4 w-4 text-primary" /> Entrega automática 24/7
            </span>
            <span className="flex items-center gap-2 px-1 py-1.5">
              <Lock className="h-4 w-4 text-primary" /> Pagamento em custódia
            </span>
            <span className="flex items-center gap-2 px-1 py-1.5">
              <LifeBuoy className="h-4 w-4 text-primary" /> Suporte com mediação
            </span>
          </div>
        </DrawerSection>

        <DrawerSection title="Termos e políticas">
          <div className="grid gap-1">
            {sitePages.map((pg) => (
              <Link
                key={pg.slug}
                to="/p/$slug"
                params={{ slug: pg.slug }}
                onClick={onNavigate}
                className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <FileText className="h-4 w-4 text-primary" /> {pg.title}
              </Link>
            ))}
          </div>
        </DrawerSection>

        <button
          onClick={toggle}
          className="mt-6 flex w-full items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            Tema {theme === "dark" ? "claro" : "escuro"}
          </span>
          <Sparkles className="h-4 w-4 text-primary" />
        </button>

        <div className="mt-6 flex items-center justify-center gap-3 border-t border-border pt-5 text-muted-foreground">
          <Instagram className="h-4 w-4" />
          <Twitter className="h-4 w-4" />
          <Youtube className="h-4 w-4" />
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} LynkoMarketplace
        </p>
      </div>
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <div className="mb-2 flex items-center gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </p>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-1 rounded-2xl border border-border bg-card p-1.5">{children}</div>
    </div>
  );
}

function DrawerLink({
  to,
  search,
  icon,
  children,
  onNavigate,
}: {
  to: string;
  search?: Record<string, string>;
  icon: React.ReactNode;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search={search as any}
      onClick={onNavigate}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent"
      activeProps={{ className: "bg-accent font-medium text-primary" }}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        {icon}
      </span>
      <span className="flex-1 truncate">{children}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
}

