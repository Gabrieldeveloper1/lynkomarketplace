import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSitePage } from "@/lib/marketplace";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/^blog-/, "")} | LynkoMarketplace` }],
  }),
  component: BlogPostPage,
});

function renderContent(text: string) {
  return text.split("\n").map((line, index) => {
    const value = line.trim();
    if (!value) return <div key={index} className="h-3" />;
    const image = value.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/);
    if (image)
      return (
        <img
          key={index}
          src={image[2]}
          alt={image[1] || "Imagem do artigo"}
          className="my-5 max-h-[32rem] w-full rounded-2xl object-cover"
        />
      );
    if (value.startsWith("## "))
      return (
        <h2 key={index} className="mt-8 font-display text-2xl font-bold">
          {value.slice(3)}
        </h2>
      );
    if (value.startsWith("# "))
      return (
        <h1 key={index} className="mt-8 font-display text-3xl font-extrabold">
          {value.slice(2)}
        </h1>
      );
    return (
      <p key={index} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
        {value}
      </p>
    );
  });
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const page = await fetchSitePage(slug);
      if (!page || !page.published || !page.slug.startsWith("blog-")) throw notFound();
      return page;
    },
  });

  if (isLoading)
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  if (!post) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao blog
      </Link>
      <article className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-10">
        {post.image_url && (
          <img
            src={post.image_url}
            alt={`Capa: ${post.title}`}
            className="mb-8 aspect-[16/7] w-full rounded-2xl object-cover"
          />
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> Atualizado em{" "}
          {new Date(post.updated_at).toLocaleDateString("pt-BR")}
        </div>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        {post.summary && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{post.summary}</p>
        )}
        <div className="mt-8 grid gap-2">{renderContent(post.content)}</div>
      </article>
      <Button asChild variant="outline" className="mt-5">
        <Link to="/blog">Ver todos os artigos</Link>
      </Button>
    </div>
  );
}
