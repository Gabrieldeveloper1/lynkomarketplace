import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_SUPPORT_DISCORD_URL } from "@/lib/support";

export const Route = createFileRoute("/_authenticated/suporte")({
  head: () => ({
    meta: [
      { title: "Suporte administrativo | LynkoMarketplace" },
      {
        name: "description",
        content: "Suporte administrativo oficial da LynkoMarketplace pelo Discord.",
      },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <section className="rounded-3xl border border-border bg-gradient-hero p-6 text-center shadow-card sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Headphones className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold sm:text-3xl">Suporte administrativo</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Todo suporte relacionado ao site, à conta e aos administradores da LynkoMarketplace
          acontece pelo nosso Discord oficial. Entre no servidor para falar com a equipe.
        </p>
        <Button asChild className="mt-6 gap-2 bg-gradient-primary text-primary-foreground">
          <a href={ADMIN_SUPPORT_DISCORD_URL} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            Abrir suporte no Discord
          </a>
        </Button>
        <p className="mt-5 text-xs text-muted-foreground">
          Para pedidos, entregas, mensagens comprador-vendedor e mediação, continue usando os
          recursos dentro do site.
        </p>
      </section>
    </main>
  );
}
