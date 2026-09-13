import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Search, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchSellers } from "@/lib/marketplace";
import { publicVerificationLabel } from "@/lib/verification";
import { SellerBadges } from "@/components/seller-badges";

export const Route = createFileRoute("/vendedores")({
  head: () => ({
    meta: [
      { title: "Vendedores verificados | LynkoMarketplace" },
      {
        name: "description",
        content:
          "Conheça os vendedores do LynkoMarketplace, com verificação de identidade e reputação pública.",
      },
      { property: "og:title", content: "Vendedores verificados | LynkoMarketplace" },
      { property: "og:description", content: "Perfis, reputação e anúncios dos vendedores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Vendedores,
});

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "verificados", label: "Somente verificados" },
];

function Vendedores() {
  const { data = [], isLoading } = useQuery({ queryKey: ["sellers"], queryFn: fetchSellers });
  const [filter, setFilter] = useState("todos");
  const [term, setTerm] = useState("");

  const sellers = useMemo(() => {
    const q = term.trim().toLowerCase();
    return data.filter((s) => {
      const matchTerm =
        !q ||
        s.username.toLowerCase().includes(q) ||
        (s.display_name ?? "").toLowerCase().includes(q);
      const matchFilter =
        filter === "todos"
          ? true
          : filter === "verificados"
            ? !!s.verified
            : s.verified && s.verification_level === filter;
      return matchTerm && matchFilter;
    });
  }, [data, filter, term]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Vendedores</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Perfis públicos da comunidade LynkoMarketplace, com documentos verificados e reputação
        pública.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar vendedor"
            aria-label="Buscar vendedor pelo nome ou usuário"
            className="pl-9"
          />
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar por nível de verificação"
        >
          {FILTERS.map((f) => (
            <Button
              key={f.id}
              size="pill"
              variant={filter === f.id ? "default" : "outline"}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className="text-xs"
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : sellers.length ? (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {sellers.map((s) => (
            <li key={s.id}>
              <Link
                to="/vendedor/$slug"
                params={{ slug: s.username }}
                className="block rounded-2xl border border-border bg-card p-5 text-center transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="mx-auto h-16 w-16">
                  <AvatarImage src={s.avatar_url ?? undefined} alt="" />
                  <AvatarFallback>
                    {(s.display_name || s.username).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-3 flex items-center justify-center gap-1 font-semibold">
                  {s.display_name || s.username}
                  {s.verified && (
                    <BadgeCheck className="h-4 w-4 text-primary" aria-label="Vendedor verificado" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">@{s.username}</p>
                <div className="mt-3 flex justify-center">
                  <SellerBadges profile={s} compact />
                </div>
                <p className="mt-3 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" aria-hidden />
                  {publicVerificationLabel(s.verified)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-sm text-muted-foreground">
          Nenhum vendedor encontrado com esse filtro.
        </p>
      )}
    </div>
  );
}
