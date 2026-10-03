import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Check,
  Instagram,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { fetchSitePages } from "@/lib/marketplace";
import { ADMIN_SUPPORT_DISCORD_URL } from "@/lib/support";

export function SiteFooter() {
  const { data: pages = [] } = useQuery({ queryKey: ["site-pages"], queryFn: fetchSitePages });
  const legalLinks =
    pages.length > 0
      ? pages.map((page) => ({ slug: page.slug, title: page.title }))
      : [
          { slug: "termos", title: "Termos de uso" },
          { slug: "privacidade", title: "Privacidade" },
          { slug: "reembolso", title: "Reembolso" },
        ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-card/40">
      <div className="pointer-events-none absolute -right-32 -top-36 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="lynko-shell relative py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.55fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src="/lynko-marketplace-logo.png" alt="Lynko Market" className="h-9 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              O marketplace brasileiro para descobrir, vender e receber produtos digitais com uma
              camada de confiança em cada etapa.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={ADMIN_SUPPORT_DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" /> Comunidade Lynko{" "}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <Link
                to="/status"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-bold transition hover:border-primary/50 hover:bg-accent"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Sistemas online
              </Link>
            </div>
          </div>
          <FooterColumn
            title="Explorar"
            links={[
              { label: "Marketplace", to: "/produtos" },
              { label: "Ofertas", to: "/ofertas" },
              { label: "Vendedores", to: "/vendedores" },
              { label: "Como funciona", to: "/como-funciona" },
            ]}
          />
          <FooterColumn
            title="Vender"
            links={[
              { label: "Publicar anúncio", to: "/dashboard" },
              { label: "Taxas transparentes", to: "/taxas" },
              { label: "Proteção Lynko", to: "/protecao" },
              { label: "Central de ajuda", to: "/ajuda" },
            ]}
          />
          <FooterColumn
            title="Institucional"
            links={legalLinks.map((link) => ({
              label: link.title,
              to: "/p/$slug",
              params: { slug: link.slug },
            }))}
          />
        </div>

        <div className="mt-14 grid gap-3 border-y border-border py-5 sm:grid-cols-3">
          {[
            { icon: LockKeyhole, title: "Pagamento protegido", text: "Custódia em cada compra" },
            {
              icon: ShieldCheck,
              title: "Vendedores verificados",
              text: "Reputação que você pode ver",
            },
            { icon: Check, title: "Entrega acompanhada", text: "Do Pix ao produto entregue" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="icon-tile h-9 w-9 rounded-lg">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold">{title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LynkoMarket. Feito para o digital.</p>
          <div className="flex items-center gap-4">
            <span>Ambiente seguro</span>
            <span className="flex items-center gap-1.5">
              <Instagram className="h-3.5 w-3.5" /> @lynkomarket
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string; params?: Record<string, string> }[];
}) {
  return (
    <nav aria-label={title}>
      <p className="text-xs font-extrabold uppercase tracking-[.14em] text-foreground">{title}</p>
      <ul className="mt-5 grid gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              params={link.params}
              className="text-sm text-muted-foreground transition hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
