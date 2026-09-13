import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/labs")({
  head: () => ({
    meta: [
      { title: "Lynko Labs | LynkoMarketplace" },
      {
        name: "description",
        content: "Novidades e experiências que a Lynko está testando com a comunidade.",
      },
    ],
  }),
  component: LabsPage,
});
function LabsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/15">
        <FlaskConical className="h-3 w-3" /> Lynko Labs
      </Badge>
      <h1 className="mt-5 text-3xl font-extrabold sm:text-5xl">Novidades que estamos testando.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Um espaço para experimentar ferramentas, automações e recursos para vendedores sem confundir
        teste com promessa de produto final.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          [
            "Assistente de anúncio",
            "Em pesquisa",
            "Ajudar vendedores a revisar título, descrição e categoria antes da publicação.",
          ],
          [
            "Alertas de preço",
            "Planejado",
            "Avisar compradores quando um produto chegar ao valor desejado.",
          ],
          [
            "Campanhas de fundadores",
            "Em desenvolvimento",
            "Dar visibilidade a vendedores que estão ajudando a construir a oferta inicial.",
          ],
        ].map(([title, status, body]) => (
          <article key={title} className="rounded-3xl border border-border bg-card p-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="mt-4 font-bold">{title}</p>
            <Badge variant="outline" className="mt-2">
              {status}
            </Badge>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
