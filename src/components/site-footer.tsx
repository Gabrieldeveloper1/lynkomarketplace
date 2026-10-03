import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchSitePages } from "@/lib/marketplace";
import { ADMIN_SUPPORT_DISCORD_URL } from "@/lib/support";
import { Icon, LogoFull, Rings, Sparkle } from "@/components/icons";

const SEALS: [string, string, keyof typeof Icon][] = [
  ["Funcionário Lynko", "Perfil pertencente a um funcionário autorizado da equipe.", "Shield"],
  ["Identidade verificada", "Documentos analisados e aprovados no nível indicado.", "Verified"],
  ["Excelente", "Pelo menos 5 avaliações e reputação mínima de 90% positiva.", "Star"],
  ["Prestígio", "Histórico consistente, com pelo menos 10 avaliações e ótima reputação.", "Crown"],
  ["Entrega veloz", "Possui anúncios com entrega automática pelo chat do pedido.", "Zap"],
];

const linkCls = "inline-flex items-center gap-1.5 transition-colors hover:text-primary";

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
    <footer className="relative mt-24 overflow-hidden border-t border-primary/15 bg-card/40">
      <div className="aurora opacity-70" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" aria-hidden="true" />
      <Rings className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 text-primary opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Faixa de chamada */}
        <div className="gradient-border -mt-12 flex flex-col items-start justify-between gap-4 rounded-3xl bg-card p-6 shadow-glow sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="eyebrow">
              <Sparkle className="h-3 w-3" /> Comece agora
            </p>
            <p className="mt-1 font-display text-xl font-extrabold sm:text-2xl">
              Venda produtos digitais com <span className="text-gradient">pagamento protegido</span>
            </p>
          </div>
          <Link
            to="/dashboard"
            className="btn-sheen inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
          >
            <Icon.Rocket className="h-4 w-4" /> Criar anúncio
          </Link>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <LogoFull />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Plataforma para comprar e vender contas, itens digitais e serviços com intermédio seguro,
              suporte administrativo pelo Discord e acompanhamento de entrega.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">Andrey Jairo dos Santos Silva</p>
            <p className="text-sm text-muted-foreground">CNPJ: 63.003.956/0001-67</p>
            <a
              href={ADMIN_SUPPORT_DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground hover:shadow-glow"
            >
              <Icon.Discord className="h-4 w-4" /> Comunidade no Discord
            </a>
          </div>

          <nav aria-label="Acesso rápido">
            <p className="eyebrow">Acesso rápido</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className={linkCls}>Anunciar</Link></li>
              <li>
                <Link to="/produtos" search={{ q: "", cat: "todas", sort: "recentes" }} className={linkCls}>
                  Categorias
                </Link>
              </li>
              <li><Link to="/favoritos" className={linkCls}>Favoritos</Link></li>
              <li><Link to="/ofertas" className={linkCls}>Ofertas</Link></li>
              <li><Link to="/roadmap" className={linkCls}>Roadmap público</Link></li>
            </ul>
          </nav>

          <nav aria-label="Suporte">
            <p className="eyebrow">Suporte</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              <li><Link to="/p/$slug" params={{ slug: "regras-do-vendedor" }} className={linkCls}>Regras do vendedor</Link></li>
              <li><Link to="/protecao" className={linkCls}>Como funciona a proteção</Link></li>
              <li><Link to="/ajuda" className={linkCls}>Central de ajuda</Link></li>
              <li><Link to="/seguranca" className={linkCls}>Segurança</Link></li>
              <li><Link to="/taxas" className={linkCls}>Taxas transparentes</Link></li>
              <li><Link to="/como-funciona" className={linkCls}>Como funciona</Link></li>
              <li><Link to="/assets" className={linkCls}>Assets da marca</Link></li>
              <li><Link to="/status" className={linkCls}>Status</Link></li>
              <li>
                <a href={ADMIN_SUPPORT_DISCORD_URL} target="_blank" rel="noreferrer" className={linkCls}>
                  Discord
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Institucional">
            <p className="eyebrow">Institucional</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              {legalLinks.map((pg) => (
                <li key={pg.slug}>
                  <Link to="/p/$slug" params={{ slug: pg.slug }} className={linkCls}>
                    {pg.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-border bg-background/50 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Icon.Alert className="h-4 w-4 text-primary" /> Advertências
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Reincidências podem limitar anúncios, saques ou acesso à conta. Consulte as regras e fale
                com o suporte no Discord para contestar uma decisão.
              </p>
              <Link
                to="/p/$slug"
                params={{ slug: "regras-do-vendedor" }}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Icon.ShieldCheck className="h-3.5 w-3.5" /> Ver regras atualizadas
              </Link>
            </div>
          </nav>
        </div>

        <section className="border-t border-border py-8" aria-labelledby="footer-seals-title">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="footer-seals-title" className="flex items-center gap-2 font-display text-sm font-bold">
                <Icon.Verified className="h-4 w-4 text-primary" /> Selos da comunidade
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Passe o mouse nos selos dos vendedores para entender como cada um é conquistado.
              </p>
            </div>
            <Link to="/vendedores" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Ver vendedores <Icon.ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {SEALS.map(([name, explanation, ic]) => {
              const C = Icon[ic];
              return (
                <div
                  key={name}
                  title={explanation}
                  className="group cursor-help rounded-2xl border border-border bg-background/50 p-3.5 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/12 text-primary transition group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    <C className="h-4 w-4" />
                  </span>
                  <p className="mt-2.5 text-xs font-semibold">{name}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{explanation}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col gap-2 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © Lynko Marketplace {new Date().getFullYear()}</p>
          <p className="hidden items-center gap-1.5 lg:flex">
            <Icon.Lock className="h-3 w-3" /> Hospedado na nuvem com segurança
          </p>
          <p>Mercado digital com foco em segurança e praticidade.</p>
        </div>
      </div>
    </footer>
  );
}
