import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, MessageCircle, ShieldCheck } from "lucide-react";
import { fetchSitePages } from "@/lib/marketplace";
import { useTheme } from "@/components/theme-provider";
import { ADMIN_SUPPORT_DISCORD_URL } from "@/lib/support";

const BRAND_LOGO_URL = "https://i.ibb.co/DDk11nFh/lynko-market-logo.png";

export function SiteFooter() {
  const { theme } = useTheme();
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
            <img
              src={BRAND_LOGO_URL}
              alt="Lynko Market"
              className="h-9 w-auto"
              style={theme === "light" ? { filter: "invert(1)" } : undefined}
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Plataforma para comprar e vender contas, itens digitais e serviços com intermédio
              seguro, suporte administrativo pelo Discord e acompanhamento de entrega.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">
              Andrey Jairo dos Santos Silva
            </p>
            <p className="text-sm text-muted-foreground">CNPJ: 63.003.956/0001-67</p>
            <a
              href={ADMIN_SUPPORT_DISCORD_URL}
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
                <Link
                  to="/p/$slug"
                  params={{ slug: "regras-do-vendedor" }}
                  className="transition-colors hover:text-foreground"
                >
                  Regras do vendedor
                </Link>
              </li>
              <li>
                <Link to="/protecao" className="transition-colors hover:text-foreground">
                  Como funciona a proteção
                </Link>
              </li>
              <li>
                <Link to="/status" className="transition-colors hover:text-foreground">
                  Status
                </Link>
              </li>
              <li>
                <a
                  href={ADMIN_SUPPORT_DISCORD_URL}
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
                  <Link
                    to="/p/$slug"
                    params={{ slug: pg.slug }}
                    className="transition-colors hover:text-foreground"
                  >
                    {pg.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-primary" /> Advertências e responsabilidade
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Advertências aparecem no painel quando identificamos descumprimento das regras.
              Reincidências podem limitar anúncios, saques ou acesso à conta. Consulte as regras e
              fale com o suporte administrativo no Discord se precisar contestar uma decisão.
            </p>
            <Link
              to="/p/$slug"
              params={{ slug: "regras-do-vendedor" }}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Ver regras atualizadas
            </Link>
          </div>
        </div>

        <section className="border-t border-border py-8" aria-labelledby="footer-seals-title">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="footer-seals-title" className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="h-4 w-4 text-primary" /> Selos da comunidade
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Passe o mouse nos selos dos vendedores para entender como cada um é conquistado.
              </p>
            </div>
            <Link to="/vendedores" className="text-xs font-semibold text-primary hover:underline">
              Ver vendedores →
            </Link>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Funcionário Lynko", "Perfil pertencente a um funcionário autorizado da equipe."],
              ["Identidade verificada", "Documentos analisados e aprovados no nível indicado."],
              ["Excelente", "Pelo menos 5 avaliações e reputação mínima de 90% positiva."],
              [
                "Prestígio",
                "Histórico consistente, com pelo menos 10 avaliações e ótima reputação.",
              ],
              ["Entrega veloz", "Possui anúncios com entrega automática pelo chat do pedido."],
            ].map(([name, explanation]) => (
              <div
                key={name}
                title={explanation}
                className="cursor-help rounded-xl border border-border bg-background/50 p-3"
              >
                <p className="text-xs font-semibold">{name}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  {explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-2 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © LynkoMarketplace {new Date().getFullYear()}</p>
          <p className="hidden lg:block">Hospedado na nuvem com segurança</p>
          <p>Mercado digital com foco em segurança e praticidade.</p>
        </div>
      </div>
    </footer>
  );
}
