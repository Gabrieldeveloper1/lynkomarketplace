import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileTabBar } from "@/components/mobile-tabbar";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { Icon, LogoMark, Orb } from "@/components/icons";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="aurora" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000,transparent)]" aria-hidden="true" />
      <Orb className="animate-float absolute left-[12%] top-[18%] h-20 w-20 opacity-80" />
      <Orb className="animate-float-slow absolute bottom-[16%] right-[14%] h-14 w-14 opacity-70" />
      <div className="relative z-10 max-w-md text-center">
        <LogoMark className="mx-auto h-14 w-14 drop-shadow-[0_10px_24px_rgba(124,58,237,0.6)]" />
        <h1 className="mt-6 font-display text-8xl font-extrabold tracking-tighter text-gradient">404</h1>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-7">
          <Link
            to="/"
            className="btn-sheen inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
          >
            <Icon.Home className="h-4 w-4" /> Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="aurora" aria-hidden="true" />
      <div className="relative z-10 max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/15 text-destructive">
          <Icon.Alert className="h-8 w-8" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado por aqui. Tente atualizar a página ou volte para o início.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-sheen inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
          >
            <Icon.Refresh className="h-4 w-4" /> Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card/60 px-5 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0b0b0c" },
      { title: "Lynko Marketplace — Produtos Digitais" },
      {
        name: "description",
        content:
          "Marketplace de produtos digitais com entrega automática, vendedores verificados e pagamento em custódia.",
      },
      { property: "og:title", content: "Lynko Marketplace — Produtos Digitais" },
      {
        property: "og:description",
        content: "Entrega automática, vendedores verificados e pagamento protegido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isDashboard = pathname === "/dashboard";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="relative flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
              <div className="aurora opacity-50" />
              <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_20%,transparent_70%)]" />
            </div>
            <SiteHeader />
            <main className="min-w-0 flex-1 overflow-x-hidden pb-24 md:pb-0">
              {/* Required: nested routes render here. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="min-w-0"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
            {!isDashboard && <SiteFooter />}
            <MobileTabBar />
            <CookieConsent />
          </div>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
