import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Trash2,
  Upload,
  Image as ImageIcon,
  Shapes,
  Loader2,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CategoryVisual } from "@/components/category-icon";
import { useAuth } from "@/hooks/use-auth";
import { uploadMedia } from "@/lib/marketplace";
import { slugify } from "@/lib/format";
import {
  fetchContentAdmin,
  saveCategory,
  deleteCategory,
  saveSitePage,
  deleteSitePage,
} from "@/lib/commerce.functions";

type CategoryRow = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  image_url: string | null;
  display_mode: string;
  position: number;
};

type PageRow = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  published: boolean;
  position: number;
};

const ICONS = [
  "package",
  "user",
  "gamepad-2",
  "coins",
  "play",
  "app-window",
  "credit-card",
  "wrench",
  "at-sign",
  "music",
  "tv",
  "shield",
  "key",
  "gift",
  "bot",
  "smartphone",
  "globe",
];

const EMPTY_CAT: CategoryRow = {
  slug: "",
  name: "",
  description: "",
  icon: "package",
  image_url: null,
  display_mode: "icon",
  position: 0,
};

const EMPTY_PAGE: PageRow = {
  slug: "",
  title: "",
  summary: "",
  content: "",
  published: true,
  position: 0,
};

export function AdminContent() {
  const { user } = useAuth();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: () => fetchContentAdmin(),
  });

  const [cat, setCat] = useState<CategoryRow | null>(null);
  const [page, setPage] = useState<PageRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const upload = async (file: File) => {
    if (!user || !cat) return;
    setUploading(true);
    try {
      const url = await uploadMedia(user.id, file);
      setCat({ ...cat, image_url: url, display_mode: "image" });
      toast.success("Imagem carregada.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload.");
    } finally {
      setUploading(false);
    }
  };

  const submitCat = async () => {
    if (!cat) return;
    const slug = cat.slug || slugify(cat.name);
    if (!slug || !cat.name) return toast.error("Nome é obrigatório.");
    setSaving(true);
    try {
      await saveCategory({ data: { ...cat, slug } });
      toast.success("Categoria guardada.");
      setCat(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao guardar.");
    } finally {
      setSaving(false);
    }
  };

  const removeCat = async (slug: string) => {
    try {
      await deleteCategory({ data: { slug } });
      toast.success("Categoria removida.");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover.");
    }
  };

  const submitPage = async () => {
    if (!page) return;
    const slug = page.slug || slugify(page.title);
    if (!slug || !page.title) return toast.error("Título é obrigatório.");
    setSaving(true);
    try {
      await saveSitePage({ data: { ...page, slug } });
      toast.success("Página guardada.");
      setPage(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao guardar.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (p: PageRow) => {
    setSaving(true);
    try {
      await saveSitePage({ data: { ...p, published: !p.published } });
      toast.success(p.published ? "Página despublicada." : "Página publicada.");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar.");
    } finally {
      setSaving(false);
    }
  };

  const removePage = async (slug: string) => {
    try {
      await deleteSitePage({ data: { slug } });
      toast.success("Página removida.");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover.");
    }
  };

  return (
    <div className="grid gap-10">
      {/* CATEGORIAS */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Shapes className="h-5 w-5 text-primary" /> Categorias
            </h2>
            <p className="text-xs text-muted-foreground">
              Escolha entre ícone SVG ou imagem personalizada para cada categoria.
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setCat({ ...EMPTY_CAT })}>
            <Plus className="h-4 w-4" /> Nova categoria
          </Button>
        </div>

        {cat && (
          <div className="mb-5 rounded-2xl border border-primary/40 bg-card p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nome</Label>
                <Input
                  value={cat.name}
                  onChange={(e) => setCat({ ...cat, name: e.target.value })}
                  placeholder="Streaming"
                />
              </div>
              <div>
                <Label>Slug (URL)</Label>
                <Input
                  value={cat.slug}
                  onChange={(e) => setCat({ ...cat, slug: slugify(e.target.value) })}
                  placeholder="streaming"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Descrição</Label>
                <Input
                  value={cat.description}
                  onChange={(e) => setCat({ ...cat, description: e.target.value })}
                  placeholder="Contas de Netflix, Spotify, Disney+…"
                />
              </div>
              <div>
                <Label>Posição</Label>
                <Input
                  type="number"
                  value={cat.position}
                  onChange={(e) => setCat({ ...cat, position: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                  <Switch
                    checked={cat.display_mode === "image"}
                    onCheckedChange={(v) => setCat({ ...cat, display_mode: v ? "image" : "icon" })}
                  />
                  <span className="text-sm">
                    {cat.display_mode === "image" ? "Mostrar imagem" : "Mostrar ícone"}
                  </span>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/10 text-primary">
                  <CategoryVisual category={cat} className="h-5 w-5" />
                </span>
              </div>

              <div>
                <Label>Ícone SVG</Label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {ICONS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCat({ ...cat, icon: i })}
                      className={`grid h-9 w-9 place-items-center rounded-lg border transition ${
                        cat.icon === i
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border"
                      }`}
                    >
                      <CategoryVisual category={{ name: i, icon: i }} className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Imagem da categoria</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    value={cat.image_url ?? ""}
                    onChange={(e) => setCat({ ...cat, image_url: e.target.value || null })}
                    placeholder="https://…"
                  />
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={submitCat} disabled={saving} className="gap-1.5">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}{" "}
                Guardar
              </Button>
              <Button variant="ghost" onClick={() => setCat(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
        <div className="grid gap-2">
          {(data?.categories ?? []).map((c) => (
            <div
              key={c.slug}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/10 text-primary">
                <CategoryVisual category={c as CategoryRow} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  /{c.slug} · {c.description || "sem descrição"}
                </p>
              </div>
              <Badge variant="outline" className="gap-1">
                {c.display_mode === "image" ? (
                  <ImageIcon className="h-3 w-3" />
                ) : (
                  <Shapes className="h-3 w-3" />
                )}
                {c.display_mode === "image" ? "Imagem" : "Ícone"}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => setCat(c as CategoryRow)}>
                Editar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => removeCat(c.slug)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* PÁGINAS LEGAIS */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Termos e políticas</h2>
            <p className="text-xs text-muted-foreground">
              Estas páginas aparecem no menu e no rodapé do site.
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setPage({ ...EMPTY_PAGE })}>
            <Plus className="h-4 w-4" /> Nova página
          </Button>
        </div>

        {page && (
          <div className="mb-5 rounded-2xl border border-primary/40 bg-card p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Título</Label>
                <Input
                  value={page.title}
                  onChange={(e) => setPage({ ...page, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Slug (URL)</Label>
                <Input
                  value={page.slug}
                  onChange={(e) => setPage({ ...page, slug: slugify(e.target.value) })}
                  placeholder="termos"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Resumo</Label>
                <Input
                  value={page.summary}
                  onChange={(e) => setPage({ ...page, summary: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Conteúdo (suporta ## títulos e - listas)</Label>
                <Textarea
                  rows={12}
                  value={page.content}
                  onChange={(e) => setPage({ ...page, content: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={page.published}
                  onCheckedChange={(v) => setPage({ ...page, published: v })}
                />
                <span className="text-sm">{page.published ? "Publicada" : "Rascunho"}</span>
              </div>
              <div>
                <Label>Posição</Label>
                <Input
                  type="number"
                  value={page.position}
                  onChange={(e) => setPage({ ...page, position: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={submitPage} disabled={saving} className="gap-1.5">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}{" "}
                Guardar
              </Button>
              <Button
                variant="outline"
                className="gap-1.5"
                onClick={() => setShowPreview((v) => !v)}
              >
                <Eye className="h-4 w-4" />{" "}
                {showPreview ? "Ocultar pré-visualização" : "Pré-visualizar"}
              </Button>
              <Button variant="ghost" onClick={() => setPage(null)}>
                Cancelar
              </Button>
            </div>

            {showPreview && (
              <div className="mt-5 rounded-xl border border-border bg-background p-5">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Pré-visualização · /p/{page.slug || "slug"}
                </p>
                <h3 className="text-xl font-extrabold">{page.title || "Sem título"}</h3>
                {page.summary && (
                  <p className="mt-1 text-sm text-muted-foreground">{page.summary}</p>
                )}
                <div className="mt-4">
                  <PagePreview text={page.content} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-2">
          {(data?.pages ?? []).map((p) => (
            <div
              key={p.slug}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  /p/{p.slug} · {p.summary}
                </p>
              </div>
              <Badge variant={p.published ? "secondary" : "outline"}>
                {p.published ? "Publicada" : "Rascunho"}
              </Badge>
              <Button
                size="sm"
                variant={p.published ? "ghost" : "default"}
                className="gap-1.5"
                disabled={saving}
                onClick={() => togglePublish(p as PageRow)}
              >
                {p.published ? <EyeOff className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                {p.published ? "Despublicar" : "Publicar"}
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={`/p/${p.slug}`} target="_blank" rel="noreferrer">
                  Ver
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setPage(p as PageRow);
                  setShowPreview(true);
                }}
              >
                Editar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => removePage(p.slug)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Render de markdown básico igual ao usado em /p/$slug (pré-visualização admin). */
function PagePreview({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
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
