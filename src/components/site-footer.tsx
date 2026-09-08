import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { fetchSitePages } from "@/lib/marketplace";
import logoAsset from "@/assets/lynko-market-logo.png.asset.json";

export function SiteFooter() {
  const { data: pages = [] } = useQuery({ queryKey: ["site-pages"], queryFn: fetchSitePages });

  const FALLBACK_LEGAL = [
    { slug: "termos", title: "Termos de uso" },
    { slug: "privacidade", title: "Privacidade" },
    { slug: "reembolso", title: "Reembolso" },
  ];
  const legalLinks: { slug: string; title: string }[] =
    pages.length > 0 ? pages.map((p) => ({ slug: p.slug, title: p.title })) : FALLBACK_LEGAL;

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src={logoAsset.url} alt="Lynko Market" className="h-9 w-auto invert dark:invert-0" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Plataforma para comprar e vender contas, itens digitais e serviços com intermédio
              seguro, suporte e acompanhamento de entrega.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">CNPJ: 00.000.000/0001-00</p>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Comunidade no Discord
            </a>
          </div>

          <nav aria-label="Acesso rápido">
            <p className="text-sm font-semibold text-foreground">Acesso rápido</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/dashboard" className="transition-colors hover:text-foreground">
                  Anunciar
                </Link>
              </li>
              <li>
                <Link
                  to="/produtos"
                  search={{ q: "", cat: "todas", sort: "recentes" }}
                  className="transition-colors hover:text-foreground"
                >
                  Categorias
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="transition-colors hover:text-foreground">
                  Favoritos
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Suporte">
            <p className="text-sm font-semibold text-foreground">Suporte</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/status" className="transition-colors hover:text-foreground">
                  Status
                </Link>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Discord
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Institucional">
            <p className="text-sm font-semibold text-foreground">Institucional</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              {legalLinks.map((pg) => (
                <li key={pg.slug}>
                  <Link to="/p/$slug" params={{ slug: pg.slug }} className="transition-colors hover:text-foreground">
                    {pg.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © LynkoMarketplace {new Date().getFullYear()}</p>
          <p className="hidden lg:block">Hospedado na nuvem com segurança</p>
          <p>Mercado digital com foco em segurança e praticidade.</p>
        </div>
      </div>
    </footer>
  );
}
