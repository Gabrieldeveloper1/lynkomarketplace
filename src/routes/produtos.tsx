import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { fetchCategories, fetchProducts } from "@/lib/marketplace";
import { formatPrice } from "@/lib/format";

const searchSchema = z.object({
  q: z.string().catch(""),
  cat: z.string().catch("todas"),
  sort: z.enum(["recentes", "menor", "maior", "vendidos"]).catch("recentes"),
});
export const Route = createFileRoute("/produtos")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Marketplace — LynkoMarket" },
      {
        name: "description",
        content: "Encontre produtos digitais com entrega automática e vendedores verificados.",
      },
    ],
  }),
  component: Produtos,
});

function Produtos() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [q, setQ] = useState(search.q);
  const [auto, setAuto] = useState(false);
  const [verified, setVerified] = useState(false);
  const [max, setMax] = useState(100000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const { data = [], isLoading } = useQuery({
    queryKey: ["products", search, auto, verified, max],
    queryFn: () =>
      fetchProducts({
        q: search.q,
        category: search.cat,
        sort: search.sort,
        auto,
        verified,
        max,
        promotedFirst: true,
      }),
  });
  const setSearch = (patch: Partial<z.infer<typeof searchSchema>>) =>
    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, ...patch }) });
  return (
    <main className="lynko-page">
      <div className="lynko-shell py-8 sm:py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">Descubra o digital</span>
            <h1 className="mt-3 text-4xl font-black tracking-[-.07em] sm:text-5xl">
              Marketplace<span className="text-primary">.</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLoading
                ? "Carregando anúncios..."
                : `${data.length} anúncios disponíveis para você`}
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 rounded-xl sm:hidden"
            onClick={() => setFiltersOpen((value) => !value)}
          >
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSearch({ q });
          }}
          className="surface-card mt-8 flex flex-col gap-2 p-2 lg:flex-row"
        >
          <div className="relative flex min-w-0 flex-1 items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Buscar por produto, categoria ou vendedor"
              className="h-11 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
            <SelectLike
              value={
                search.cat === "todas"
                  ? "Todas as categorias"
                  : (categories.find((category) => category.slug === search.cat)?.name ??
                    search.cat)
              }
              onChange={(value) => setSearch({ cat: value })}
              options={[
                { value: "todas", label: "Todas as categorias" },
                ...categories.map((category) => ({ value: category.slug, label: category.name })),
              ]}
            />
            <SelectLike
              value={sortLabel(search.sort)}
              onChange={(value) =>
                setSearch({ sort: value as z.infer<typeof searchSchema>["sort"] })
              }
              options={[
                { value: "recentes", label: "Mais recentes" },
                { value: "vendidos", label: "Mais vendidos" },
                { value: "menor", label: "Menor preço" },
                { value: "maior", label: "Maior preço" },
              ]}
            />
            <Button
              type="submit"
              className="h-11 gap-2 rounded-xl bg-gradient-primary font-bold text-primary-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Buscar</span>
            </Button>
          </div>
        </form>
        <div className="mt-8 grid gap-7 lg:grid-cols-[230px_1fr]">
          <aside
            className={`${filtersOpen ? "block" : "hidden"} h-fit lg:sticky lg:top-24 lg:block`}
          >
            <div className="surface-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-extrabold">
                  <SlidersHorizontal className="h-4 w-4 text-primary" /> Refinar busca
                </h2>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                  live
                </span>
              </div>
              <div className="mt-6 grid gap-5">
                <FilterRow
                  icon={<Zap className="h-4 w-4 text-primary" />}
                  label="Entrega automática"
                >
                  <Switch checked={auto} onCheckedChange={setAuto} />
                </FilterRow>
                <FilterRow
                  icon={<BadgeCheck className="h-4 w-4 text-primary" />}
                  label="Vendedores verificados"
                >
                  <Switch checked={verified} onCheckedChange={setVerified} />
                </FilterRow>
                <div>
                  <Label className="text-xs font-bold">
                    Preço máximo <span className="text-primary">{formatPrice(max)}</span>
                  </Label>
                  <Slider
                    className="mt-4"
                    value={[max]}
                    min={1000}
                    max={500000}
                    step={1000}
                    onValueChange={([value]) => setMax(value)}
                  />
                </div>
              </div>
            </div>
            <div className="surface-card-soft mt-3 p-4">
              <p className="flex items-center gap-2 text-xs font-extrabold">
                <Sparkles className="h-4 w-4 text-primary" /> Compra protegida
              </p>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                Cada anúncio tem sinais claros de entrega, reputação e suporte.
              </p>
            </div>
          </aside>
          <section>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-80 rounded-[1.35rem]" />
                ))}
              </div>
            ) : data.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="surface-card grid min-h-80 place-items-center p-12 text-center">
                <div>
                  <span className="icon-tile mx-auto">
                    <Search className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-black">Nada encontrado por aqui</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tente outra busca ou remova algum filtro.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
function FilterRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="flex items-center gap-2 text-xs font-bold">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}
function sortLabel(value: string) {
  return (
    (
      {
        recentes: "Mais recentes",
        vendidos: "Mais vendidos",
        menor: "Menor preço",
        maior: "Maior preço",
      } as Record<string, string>
    )[value] ?? "Mais recentes"
  );
}
function SelectLike({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative flex h-11 min-w-0 items-center rounded-xl border border-border bg-card/70 px-3 text-xs font-bold">
      <span className="sr-only">Selecionar</span>
      <select
        value={
          options.find((option) => option.label === value || option.value === value)?.value ?? value
        }
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 appearance-none bg-transparent pr-5 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-muted-foreground" />
    </label>
  );
}
