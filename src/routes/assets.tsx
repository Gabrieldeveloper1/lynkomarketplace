import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/assets")({
  component: AssetsPage,
  head: () => ({
    meta: [
      { title: "Assets da marca | LynkoMarketplace" },
      {
        name: "description",
        content: "Logo, símbolo e favicon oficiais da identidade visual LynkoMarketplace.",
      },
    ],
  }),
});

function AssetCard({
  title,
  description,
  src,
  downloadName,
  dark = false,
}: {
  title: string;
  description: string;
  src: string;
  downloadName: string;
  dark?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div
        className={`flex min-h-64 items-center justify-center p-8 ${
          dark ? "bg-[#090d1c]" : "bg-gradient-surface"
        }`}
      >
        <img src={src} alt={title} className="max-h-40 max-w-full object-contain" />
      </div>
      <div className="p-5">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <a href={src} download={downloadName} className="mt-5 inline-flex">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Baixar asset
          </Button>
        </a>
      </div>
    </article>
  );
}

function AssetsPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,oklch(0.7_0.2_264_/_0.16),transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para a Lynko
        </Link>
        <div className="mt-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Identidade oficial
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Assets da Lynko</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            A nova identidade visual combina um símbolo de marketplace com setas de troca para
            representar compra, venda e circulação segura de produtos digitais.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2" aria-label="Assets principais">
          <AssetCard
            title="Logo principal"
            description="Versão horizontal para cabeçalho, rodapé, materiais institucionais e comunicações da plataforma."
            src="/lynko-marketplace-logo.png"
            downloadName="lynko-marketplace-logo.png"
            dark
          />
          <AssetCard
            title="Símbolo marketplace"
            description="Marca compacta para avatar, aplicativo, redes sociais, favicon e espaços reduzidos."
            src="/lynko-marketplace-mark.png"
            downloadName="lynko-marketplace-mark.png"
            dark
          />
          <AssetCard
            title="Favicon"
            description="Ícone padrão usado na aba do navegador e no atalho principal da aplicação."
            src="/favicon.png"
            downloadName="favicon.png"
            dark
          />
          <AssetCard
            title="Ícone instalável"
            description="Versão otimizada para instalação como aplicativo, disponível em 192px e 512px."
            src="/icon-512.png"
            downloadName="icon-512.png"
            dark
          />
        </section>

        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.06] p-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ImageIcon className="h-4 w-4 text-primary" /> Uso recomendado
          </div>
          <p className="mt-2 leading-relaxed">
            Prefira a logo principal em fundos escuros ou neutros. Para tamanhos pequenos, use o
            símbolo marketplace, que mantém a leitura mesmo em 16px.
          </p>
        </div>
      </div>
    </main>
  );
}

export default AssetsPage;
