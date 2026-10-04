import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { NotificationsMenu } from "@/components/notifications-menu";
import { AccountMenu } from "@/components/account-menu";
import { Icon, Sparkle } from "@/components/icons";

import { fetchCategories, fetchProducts, fetchSitePages } from "@/lib/marketplace";
import { PROTECTION_TIERS } from "@/lib/protection";
import { formatPrice } from "@/lib/format";
import { CategoryVisual } from "@/components/category-icon";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex shrink-0 items-center" aria-label="Lynko — início">
      <span className="transition-transform duration-300 group-hover:scale-[1.03]">
        <span className="flex items-baseline gap-2 font-display text-[1.6rem] font-normal tracking-tight text-foreground">Lynko{!compact && <span className="font-sans text-[11px] text-muted-foreground">marketplace</span>}</span>
      </span>
    </Link>
  );
}

export function AdminBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground ${className}`}
    >
      <Icon.Crown className="h-3 w-3" /> Admin
    </span>
  );
}

const NAV = [
  { label: "Marketplace", to: "/produtos", search: { q: "", cat: "todas", sort: "recentes" } },
  { label: "Mais vendidos", to: "/produtos", search: { q: "", cat: "todas", sort: "vendidos" } },
  { label: "Vendedores", to: "/vendedores" },
  { label: "Como funciona", to: "/como-funciona" },
] as const;

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const { user } = useAuth();
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: sitePages = [] } = useQuery({ queryKey: ["site-pages"], queryFn: fetchSitePages });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-2xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-3 px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
              <Icon.Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[22rem] overflow-y-auto border-r border-primary/20 p-0">
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

        <nav className="pill-nav ml-3 hidden xl:inline-flex" aria-label="Principal">
          {NAV.map((item) => {
            const active =
              item.label === "Marketplace"
                ? pathname.startsWith("/produto")
                : pathname.startsWith(item.to);
            return (
              <Link
                key={item.label}
                to={item.to}
                search={("search" in item ? item.search : undefined) as never}
                data-status={active && item.label !== "Mais vendidos" ? "active" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative mx-auto hidden w-full max-w-xl flex-1 md:block">
          <form onSubmit={submit}>
            <div className="flex h-11 items-center gap-1 rounded-full border border-border bg-[#0b0b0c] pl-4 pr-1.5 transition-all focus-within:border-white/25">
              <Icon.Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setSuggestOpen(true)}
                onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                placeholder="Pesquisar produtos, categorias ou vendedores"
                className="h-full min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Pesquisar"
              />
              <kbd className="pointer-events-none hidden shrink-0 select-none items-center gap-0.5 rounded-md border border-border bg-[#262524] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:flex">
                Ctrl K
              </kbd>
              <CategoriesMenu categories={categories} activeCat={activeCat} inline />
            </div>
          </form>

          {suggestOpen && q.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-3xl border border-border bg-popover p-2 backdrop-blur-2xl">
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
                    className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-accent"
                  >
                    <span className="h-10 w-14 shrink-0 overflow-hidden rounded-xl bg-accent">
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
                className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#262524] px-3 py-2.5 text-xs font-medium text-foreground transition hover:bg-[#393836]"
              >
                Ver todos os resultados para "{q}" <Icon.ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-full lg:inline-flex"
            onClick={toggle}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Icon.Sun className="h-5 w-5" /> : <Icon.Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <>
              <Link to="/dashboard" className="hidden lg:block">
                <Button variant="soft" size="sm" className="mr-1 gap-1.5 rounded-full">
                  <Icon.Plus className="h-3.5 w-3.5" /> Anunciar
                </Button>
              </Link>
              <Link to="/mensagens" className="hidden sm:block">
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Mensagens">
                  <Icon.Message className="h-5 w-5" />
                </Button>
              </Link>
              <NotificationsMenu />
              <AccountMenu />
            </>
          ) : (
            <Link to="/auth" search={{ redirect: "/dashboard" }}>
              <Button variant="default" size="pill" className="gap-2">
                <Icon.Login className="h-4 w-4" /> Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-border/50 px-4 pb-3 pt-2 md:hidden">
        <form
          onSubmit={submit}
          className="flex h-11 items-center gap-2 rounded-2xl border border-border bg-card/70 px-3 focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/15"
        >
          <Icon.Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produtos e categorias"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Buscar produtos e categorias"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
          >
            Buscar
          </button>
        </form>
      </div>
      <div className="line-flow absolute inset-x-0 bottom-0 opacity-60" aria-hidden="true" />
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
          type="button"
          variant="ghost"
          size="pill"
          className={
            inline
              ? "h-8 shrink-0 gap-1.5 rounded-full bg-primary/12 px-3.5 text-sm font-semibold text-primary hover:bg-primary/20"
              : "gap-1 text-sm"
          }
        >
          {active ? active.name : "Categorias"}
          <Icon.ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden rounded-3xl p-0">
        <DialogHeader className="relative flex-row items-center justify-between gap-4 border-b border-border px-6 py-5 pr-14">
          <div className="aurora opacity-60" aria-hidden="true" />
          <DialogTitle className="relative z-10 flex items-center gap-2 font-display text-lg font-bold">
            <Icon.Layers className="h-5 w-5 text-primary" /> Categorias
          </DialogTitle>
          <div className="relative z-10 w-full max-w-xs">
            <Icon.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
          {(["populares", "todas"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`-mb-px border-b-2 py-3 text-sm transition-colors ${
                view === v
                  ? "border-primary font-semibold text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "populares" ? "Populares" : "Todas (A–Z)"}
            </button>
          ))}
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
              className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all ${
                c.slug === activeCat
                  ? "border-primary/60 bg-accent shadow-glow"
                  : "border-border bg-card/40 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent"
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/12 text-primary">
                <CategoryVisual category={c} className="h-5 w-5" />
              </span>
              <span className="flex-1 truncate text-sm font-medium">{c.name}</span>
              <Icon.ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
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
      <div className="relative flex items-center justify-between overflow-hidden border-b border-border p-5">
        <div className="aurora" aria-hidden="true" />
        <div className="relative z-10">
          <Logo />
        </div>
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="relative z-10" aria-label="Fechar menu">
            <Icon.X className="h-5 w-5" />
          </Button>
        </SheetClose>
      </div>

      <div className="p-5">
        {user ? (
          <Link
            to="/dashboard"
            onClick={onNavigate}
            className="gradient-border flex items-center gap-3 rounded-2xl p-3"
          >
            <Avatar className="h-11 w-11">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback>{(profile?.username ?? "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{profile?.display_name || profile?.username}</p>
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
            <Button className="w-full gap-2">
              <Icon.Login className="h-4 w-4" /> Entrar ou criar conta
            </Button>
          </Link>
        )}

        <DrawerSection title="Descobrir">
          <DrawerLink to="/produtos" search={{ q: "", cat: "todas", sort: "recentes" }} icon={<Icon.Store className="h-4 w-4" />} onNavigate={onNavigate}>
            Marketplace
          </DrawerLink>
          <DrawerLink to="/produtos" search={{ q: "", cat: "todas", sort: "vendidos" }} icon={<Icon.Flame className="h-4 w-4" />} onNavigate={onNavigate}>
            Mais vendidos
          </DrawerLink>
          <DrawerLink to="/vendedores" icon={<Icon.Users className="h-4 w-4" />} onNavigate={onNavigate}>
            Vendedores verificados
          </DrawerLink>
        </DrawerSection>

        <DrawerSection title="Minha conta">
          <DrawerLink to="/dashboard" icon={<Icon.Dashboard className="h-4 w-4" />} onNavigate={onNavigate}>
            Painel
          </DrawerLink>
          <DrawerLink to="/mensagens" icon={<Icon.Message className="h-4 w-4" />} onNavigate={onNavigate}>
            Mensagens
          </DrawerLink>
          <DrawerLink to="/notificacoes" icon={<Icon.Bell className="h-4 w-4" />} onNavigate={onNavigate}>
            Notificações
          </DrawerLink>
          <DrawerLink to="/dashboard" icon={<Icon.Wallet className="h-4 w-4" />} onNavigate={onNavigate}>
            Carteira e saques
          </DrawerLink>
          <DrawerLink to="/verificacao" icon={<Icon.Verified className="h-4 w-4" />} onNavigate={onNavigate}>
            Verificação de identidade
          </DrawerLink>
          {isStaff && (
            <DrawerLink to="/admin" icon={<Icon.Shield className="h-4 w-4 text-primary" />} onNavigate={onNavigate}>
              Painel administrativo
            </DrawerLink>
          )}
        </DrawerSection>

        <DrawerSection title="Categorias">
          <div className="relative mb-2 px-1 pt-1">
            <Icon.Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={catTerm}
              onChange={(e) => setCatTerm(e.target.value)}
              placeholder="Buscar categoria..."
              className="h-9 pl-9"
              aria-label="Buscar categoria"
            />
          </div>
          <Link
            to="/produtos"
            search={{ q: "", cat: "todas", sort: "recentes" }}
            onClick={onNavigate}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              activeCat === "todas" ? "bg-accent text-primary" : "hover:bg-accent"
            }`}
          >
            <Icon.Sparkles className="h-4 w-4 text-primary" /> Todas as categorias
          </Link>
          <div className="grid grid-cols-2 gap-1.5 p-1">
            {filteredCats.map((c) => (
              <Link
                key={c.slug}
                to="/produtos"
                search={{ q: "", cat: c.slug, sort: "recentes" }}
                onClick={onNavigate}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-xs transition ${
                  c.slug === activeCat
                    ? "border-primary/60 bg-accent font-semibold"
                    : "border-border bg-card/60 font-medium hover:border-primary/50"
                }`}
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded text-primary">
                  <CategoryVisual category={c} className="h-4 w-4 text-primary" />
                </span>
                <span className="truncate">{c.name}</span>
              </Link>
            ))}
          </div>
          {filteredCats.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">Nenhuma categoria encontrada.</p>
          )}
        </DrawerSection>

        <DrawerSection title="Taxa de serviço">
          <div className="grid gap-2 p-1">
            {PROTECTION_TIERS.map((t) => (
              <div key={t.id} className="rounded-xl border border-border bg-card/60 p-3">
                <p className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Icon.ShieldCheck className="h-3.5 w-3.5 text-primary" /> {t.name}
                  </span>
                  <span className="text-primary">+{formatPrice(t.feeCents)}</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{t.tagline}</p>
              </div>
            ))}
          </div>
        </DrawerSection>

        <DrawerSection title="Plataforma">
          <div className="grid gap-0.5 p-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-2 px-2 py-1.5">
              <Icon.Zap className="h-4 w-4 text-primary" /> Entrega automática 24/7
            </span>
            <span className="flex items-center gap-2 px-2 py-1.5">
              <Icon.Lock className="h-4 w-4 text-primary" /> Pagamento em custódia
            </span>
            <span className="flex items-center gap-2 px-2 py-1.5">
              <Icon.Lifebuoy className="h-4 w-4 text-primary" /> Suporte com mediação
            </span>
          </div>
        </DrawerSection>

        <DrawerSection title="Termos e políticas">
          <div className="grid gap-0.5 p-1">
            {sitePages.map((pg) => (
              <Link
                key={pg.slug}
                to="/p/$slug"
                params={{ slug: pg.slug }}
                onClick={onNavigate}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon.Doc className="h-4 w-4 text-primary" /> {pg.title}
              </Link>
            ))}
          </div>
        </DrawerSection>

        <button
          onClick={toggle}
          className="mt-6 flex w-full items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-3 text-sm transition hover:border-primary/50"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? <Icon.Sun className="h-4 w-4" /> : <Icon.Moon className="h-4 w-4" />}
            Tema {theme === "dark" ? "claro" : "escuro"}
          </span>
          <Sparkle className="h-4 w-4 text-primary" />
        </button>

        <div className="mt-6 flex items-center justify-center gap-4 border-t border-border pt-5 text-muted-foreground">
          <Icon.Instagram className="h-4 w-4" />
          <Icon.Discord className="h-4 w-4" />
          <Icon.Globe className="h-4 w-4" />
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Lynko Marketplace
        </p>
      </div>
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <div className="mb-2 flex items-center gap-3">
        <p className="eyebrow">{title}</p>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-1 rounded-2xl border border-border bg-card/70 p-1.5">{children}</div>
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
      className="group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors hover:bg-accent"
      activeProps={{ className: "bg-accent font-medium text-primary" }}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
        {icon}
      </span>
      <span className="flex-1 truncate">{children}</span>
      <Icon.ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
}
