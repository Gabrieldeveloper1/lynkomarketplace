import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, CircleHelp, Lock, QrCode, ShieldCheck, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type InfoSection = {
  title: string;
  body?: string;
  items?: string[];
};

export function PublicInfoPage({
  eyebrow,
  title,
  description,
  sections,
  cta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: InfoSection[];
  cta?: { label: string; to: "/produtos" | "/auth" | "/ajuda" };
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <header className="max-w-3xl">
        <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/15">{eyebrow}</Badge>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
        {cta && (
          <Link to={cta.to} className="mt-7 inline-flex">
            <Button className="gap-2 bg-gradient-primary text-primary-foreground">
              {cta.label} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </header>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7"
          >
            <h2 className="text-lg font-bold">{section.title}</h2>
            {section.body && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            )}
            {section.items && (
              <ul className="mt-4 grid gap-3">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}

export const TRUST_POINTS = [
  {
    icon: QrCode,
    title: "Pix primeiro",
    text: "Pagamento instantâneo com QR Code e Pix copia e cola.",
  },
  {
    icon: Lock,
    title: "Custódia",
    text: "A proteção aplicável é exibida antes da confirmação da compra.",
  },
  {
    icon: ShieldCheck,
    title: "Reputação",
    text: "Avaliações, verificação e histórico ajudam a escolher melhor.",
  },
  {
    icon: Store,
    title: "Marketplace aberto",
    text: "Compradores e vendedores constroem a Lynko juntos.",
  },
  { icon: CircleHelp, title: "Suporte", text: "Pedidos, disputas e dúvidas têm canais próprios." },
];
