import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CalendarDays, PenLine, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { fetchBlogPosts } from "@/lib/marketplace";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | LynkoMarketplace" },
      {
        name: "description",
        content: "Novidades, dicas e informações da comunidade LynkoMarketplace.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { user } = useAuth();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
  });
  const canEdit = user?.email?.toLowerCase() === "gabrieljairo865@gmail.com";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <header className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-gradient-hero p-6 sm:flex-row sm:items-end sm:p-10">
        <div>
          <Badge variant="secondary" className="gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-primary" /> Conteúdo Lynko
          </Badge>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Blog
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Novidades da plataforma, dicas para comprar e vender melhor e histórias da nossa
            comunidade.
          </p>
        </div>
        {canEdit && (
          <div className="flex flex-wrap gap-2">
            <Button asChild className="gap-2 bg-gradient-primary text-primary-foreground">
              <Link to="/blog/editar">
                <PenLine className="h-4 w-4" /> Postar artigo
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/blog/editar">Gerenciar blog</Link>
            </Button>
          </div>
        )}
      </header>

      {isLoading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : posts.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={`Capa: ${post.title}`}
                  className="-mx-5 -mt-5 mb-5 aspect-[16/9] w-[calc(100%+2.5rem)] rounded-t-2xl object-cover"
                />
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />{" "}
                {new Date(post.updated_at).toLocaleDateString("pt-BR")}
              </div>
              <h2 className="mt-4 font-display text-xl font-bold group-hover:text-primary">
                {post.title}
              </h2>
              {post.summary && (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {post.summary}
                </p>
              )}
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="mt-auto pt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Ler artigo <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Em breve teremos novidades, guias e conteúdos para a comunidade.
        </div>
      )}
    </div>
  );
}
