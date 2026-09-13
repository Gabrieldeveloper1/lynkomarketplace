import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { Search, SlidersHorizontal, Zap, BadgeCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      { title: "Marketplace de produtos digitais | LynkoMarketplace" },
      {
        name: "description",
        content:
          "Pesquise e filtre milhares de produtos digitais com entrega automática e vendedores verificados no LynkoMarketplace.",
      },
      { property: "og:title", content: "Marketplace de produtos digitais | LynkoMarketplace" },
      {
        property: "og:description",
        content: "Filtros avançados, entrega automática e vendedores verificados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Marketplace</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Carregando anúncios..." : `${data.length} anúncios encontrados`}
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch({ q });
        }}
        className="mb-6 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar..."
            className="pl-9"
          />
        </div>
        <Select value={search.cat} onValueChange={(v) => setSearch({ cat: v })}>
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={search.sort} onValueChange={(v) => setSearch({ sort: v as never })}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Mais recentes</SelectItem>
            <SelectItem value="vendidos">Mais vendidos</SelectItem>
            <SelectItem value="menor">Preço: menor</SelectItem>
            <SelectItem value="maior">Preço: maior</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="bg-gradient-primary text-primary-foreground">
          Pesquisar
        </Button>
      </form>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-primary" /> Filtros
          </h2>
          <div className="grid gap-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="f-auto" className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" /> Entrega automática
              </Label>
              <Switch id="f-auto" checked={auto} onCheckedChange={setAuto} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="f-ver" className="flex items-center gap-2 text-sm">
                <BadgeCheck className="h-4 w-4 text-primary" /> Só verificados
              </Label>
              <Switch id="f-ver" checked={verified} onCheckedChange={setVerified} />
            </div>
            <div>
              <Label className="text-sm">Preço máximo: {formatPrice(max)}</Label>
              <Slider
                className="mt-3"
                value={[max]}
                min={1000}
                max={500000}
                step={1000}
                onValueChange={([v]) => setMax(v)}
              />
            </div>
          </div>
        </aside>

        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : data.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              Nenhum anúncio corresponde à sua pesquisa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
