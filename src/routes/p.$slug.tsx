import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchSitePage, fetchSitePages } from "@/lib/marketplace";
import { ADMIN_SUPPORT_DISCORD_URL } from "@/lib/support";

export const Route = createFileRoute("/p/$slug")({
  head: ({ params }) => {
    const title = `${params.slug.replace(/-/g, " ")} | LynkoMarketplace`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: "Termos, políticas e informação legal da LynkoMarketplace.",
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Termos, políticas e informação legal da LynkoMarketplace.",
        },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: PaginaLegal,
});

/** Render simples e seguro de markdown básico (##, ###, listas, parágrafos). */
function Content({ text }: { text: string }) {
  const blocks = text.split("\n");
  return (
    <div className="space-y-3 break-words">
      {blocks.map((line, i) => {
        const t = line.trim();
        if (!t) return null;
        if (t.startsWith("### "))
          return (
            <h3 key={i} className="pt-3 text-base font-bold">
              {t.slice(4)}
            </h3>
          );
        if (t.startsWith("## "))
          return (
            <h2 key={i} className="pt-4 text-lg font-extrabold">
              {t.slice(3)}
            </h2>
          );
        if (t.startsWith("# "))
          return (
            <h2 key={i} className="pt-4 text-xl font-extrabold">
              {t.slice(2)}
            </h2>
          );
        if (t.startsWith("- "))
          return (
            <p key={i} className="flex gap-2 pl-2 text-sm text-muted-foreground">
              <span className="text-primary">•</span>
              {t.slice(2)}
            </p>
          );
        return (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            {t}
          </p>
        );
      })}
    </div>
  );
}

function PaginaLegal() {
  const { slug } = Route.useParams();

  const { data: page, isLoading } = useQuery({
    queryKey: ["site-page", slug],
    queryFn: async () => {
      const p = await fetchSitePage(slug);
      if (!p) throw notFound();
      return p;
    },
  });

  const { data: pages = [] } = useQuery({ queryKey: ["site-pages"], queryFn: fetchSitePages });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-8 sm:px-4 sm:py-12">
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }
  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-16 text-center sm:px-4 sm:py-20">
        <p className="text-muted-foreground">Página não encontrada.</p>
        <Button asChild className="mt-4">
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    );
  }

  const sections = page.content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("## ") || l.startsWith("# "))
    .map((l) => l.replace(/^#+\s*/, ""));

  return (
    <div className="pb-12">
      {/* Capa */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-3 py-7 sm:px-4 sm:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Início
          </Link>
          <div className="mt-4 flex items-start gap-3 sm:mt-5 sm:gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Documento oficial
              </p>
              <h1 className="mt-1 break-words text-2xl font-extrabold leading-tight sm:text-4xl">
                {page.title}
              </h1>
              {page.summary && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  {page.summary}
                </p>
              )}
              <p className="mt-3 text-[11px] text-muted-foreground">
                Atualizado em {new Date(page.updated_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 grid max-w-6xl gap-5 px-3 sm:mt-8 sm:gap-8 sm:px-4 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit min-w-0 space-y-4 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </p>
            <nav className="mt-3 flex max-w-full gap-1 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
              {pages.map((p) => (
                <Link
                  key={p.slug}
                  to="/p/$slug"
                  params={{ slug: p.slug }}
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm transition-colors lg:shrink ${
                    p.slug === slug
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p.title}
                </Link>
              ))}
            </nav>
          </div>

          {sections.length > 1 && (
            <div className="hidden rounded-2xl border border-border bg-card p-4 lg:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nesta página
              </p>
              <ul className="mt-3 grid gap-1.5 text-xs text-muted-foreground">
                {sections.map((s, i) => (
                  <li key={i} className="line-clamp-1">
                    {i + 1}. {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <article className="min-w-0 rounded-3xl border border-border bg-card p-4 shadow-card sm:p-8">
          <Content text={page.content} />
          <div className="mt-8 rounded-2xl bg-accent/60 p-4 text-xs text-muted-foreground">
            Ficou com dúvida sobre este documento? Fale com o suporte administrativo no Discord;
            para pedidos e mediação, use o chat da sua conta.
          </div>
        </article>
      </div>
    </div>
  );
}
