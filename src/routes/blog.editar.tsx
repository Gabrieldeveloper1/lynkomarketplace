import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PenLine, ArrowLeft, Save, Plus, Trash2, Eye, EyeOff, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { fetchBlogPostsForEditor, deleteBlogPost, saveBlogPost } from "@/lib/commerce.functions";
import { uploadMedia } from "@/lib/marketplace";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/editar")({
  head: () => ({ meta: [{ title: "Gerenciar blog | LynkoMarketplace" }] }),
  component: BlogEditorPage,
});

function makeSlug(title: string) {
  return `blog-${title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

function BlogEditorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canEdit = user?.email?.toLowerCase() === "gabrieljairo865@gmail.com";
  const {
    data: posts = [],
    refetch,
    error: postsError,
  } = useQuery({
    queryKey: ["blog-posts", "editor"],
    queryFn: () => fetchBlogPostsForEditor(),
    enabled: canEdit,
  });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [content, setContent] = useState(
    "# Título\n\nEscreva o conteúdo do artigo aqui.\n\n## Uma seção\n\nAdicione informações úteis para a comunidade.",
  );
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const resetForm = () => {
    setEditingSlug(null);
    setTitle("");
    setSummary("");
    setImageUrl(null);
    setContent(
      "# Título\n\nEscreva o conteúdo do artigo aqui.\n\n## Uma seção\n\nAdicione informações úteis para a comunidade.",
    );
    setPublished(true);
  };

  const editPost = (post: (typeof posts)[number]) => {
    setEditingSlug(post.slug);
    setTitle(post.title);
    setSummary(post.summary);
    setImageUrl(post.image_url ?? null);
    setContent(post.content);
    setPublished(post.published);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removePost = async (slug: string) => {
    if (!window.confirm("Excluir este artigo do blog?")) return;
    setBusy(true);
    try {
      await deleteBlogPost({ data: { slug } });
      if (editingSlug === slug) resetForm();
      await refetch();
      toast.success("Artigo excluído.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o artigo.");
    } finally {
      setBusy(false);
    }
  };

  if (!canEdit) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-extrabold">Área restrita</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Somente o editor autorizado pode criar ou alterar artigos do blog.
        </p>
        <Button asChild className="mt-5">
          <Link to="/blog">Voltar ao blog</Link>
        </Button>
      </div>
    );
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return toast.error("Preencha o título e o conteúdo.");
    setBusy(true);
    try {
      await saveBlogPost({
        data: {
          slug: editingSlug ?? makeSlug(title),
          title: title.trim(),
          summary: summary.trim(),
          content,
          image_url: imageUrl,
          published,
          position: 0,
        },
      });
      toast.success(published ? "Artigo publicado no blog." : "Rascunho salvo.");
      await refetch();
      resetForm();
      navigate({ to: "/blog" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o artigo.");
    } finally {
      setBusy(false);
    }
  };

  const uploadCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      toast.error("Escolha uma imagem PNG, JPG, WEBP, AVIF, SVG, BMP ou TIFF.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 50 MB.");
      return;
    }
    setUploadingImage(true);
    try {
      setImageUrl(await uploadMedia(user.id, file));
      toast.success("Imagem carregada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível carregar a imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadInlineImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      toast.error("Escolha uma imagem válida; GIF não é permitido.");
      return;
    }
    setUploadingImage(true);
    try {
      const url = await uploadMedia(user.id, file);
      setContent((current) => `${current.trim()}\n\n![Imagem do artigo](${url})\n`);
      toast.success("Imagem inserida no conteúdo.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível carregar a imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao blog
      </Link>
      <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <PenLine className="h-5 w-5" />
          </span>
          <div>
            <Badge variant="secondary">Editor autorizado</Badge>
            <h1 className="mt-1 font-display text-2xl font-extrabold">
              {editingSlug ? "Editar artigo" : "Novo artigo"}
            </h1>
          </div>
        </div>
        {postsError && (
          <div className="mt-7 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            Não foi possível carregar os artigos existentes.{" "}
            {postsError instanceof Error
              ? postsError.message
              : "Atualize a página e tente novamente."}
          </div>
        )}
        {posts.length > 0 && (
          <div className="mt-7 rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold">Artigos existentes</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={resetForm}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" /> Novo
              </Button>
            </div>
            <div className="mt-3 grid gap-2">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{post.title}</p>
                    <p className="text-xs text-muted-foreground">/{post.slug}</p>
                  </div>
                  <Badge variant={post.published ? "default" : "outline"} className="gap-1">
                    {post.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {post.published ? "Publicado" : "Rascunho"}
                  </Badge>
                  <Button type="button" size="sm" variant="outline" onClick={() => editPost(post)}>
                    Editar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => removePost(post.slug)}
                    aria-label={`Excluir ${post.title}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={save} className="mt-7 grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="blog-title">Título</Label>
            <Input
              id="blog-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Como vender melhor produtos digitais"
              maxLength={120}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="blog-summary">Resumo</Label>
            <Input
              id="blog-summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Uma frase para apresentar o artigo"
              maxLength={300}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="blog-cover">Imagem de capa</Label>
            {imageUrl ? (
              <div className="relative overflow-hidden rounded-2xl border border-border">
                <img
                  src={imageUrl}
                  alt="Pré-visualização da capa"
                  className="max-h-72 w-full object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-3"
                  onClick={() => setImageUrl(null)}
                  aria-label="Remover imagem de capa"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="blog-cover"
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
              >
                <ImagePlus className="h-5 w-5 text-primary" />
                {uploadingImage ? "Carregando imagem…" : "Escolher imagem de capa"}
              </label>
            )}
            <Input
              id="blog-cover"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff"
              className="sr-only"
              onChange={uploadCover}
              disabled={uploadingImage}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="blog-content">Conteúdo</Label>
            <Textarea
              id="blog-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={18}
              className="font-mono text-sm"
              placeholder="Use # para título e ## para seções"
            />
            <label
              htmlFor="blog-inline-image"
              className="flex w-fit cursor-pointer items-center gap-2 text-xs font-semibold text-primary hover:underline"
            >
              <ImagePlus className="h-4 w-4" />
              {uploadingImage ? "Carregando imagem…" : "Inserir imagem no conteúdo"}
            </label>
            <Input
              id="blog-inline-image"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff"
              className="sr-only"
              onChange={uploadInlineImage}
              disabled={uploadingImage}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={published} onCheckedChange={setPublished} />
            <Label>{published ? "Publicado no blog" : "Salvar como rascunho"}</Label>
          </div>
          <Button
            disabled={busy}
            className="w-fit gap-2 bg-gradient-primary text-primary-foreground"
          >
            <Save className="h-4 w-4" />
            {busy
              ? "Salvando…"
              : editingSlug
                ? "Salvar alterações"
                : published
                  ? "Publicar artigo"
                  : "Salvar rascunho"}
          </Button>
        </form>
      </div>
    </div>
  );
}
