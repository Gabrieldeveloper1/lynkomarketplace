import { useEffect, useState } from "react";
import { Cookie, Settings2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const CONSENT_KEY = "lynko-cookie-consent";

type Consent = { essential: true; analytics: boolean };

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (stored) setConsent(JSON.parse(stored) as Consent);
    } catch {
      /* mantém o aviso visível se o armazenamento estiver indisponível */
    }
  }, []);

  if (consent) return null;

  const save = (value: Consent) => {
    setConsent(value);
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    document.cookie = `lynko_cookie_consent=${value.analytics ? "all" : "essential"}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-4 shadow-glow backdrop-blur-xl sm:inset-x-6 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Cookie className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">Sua privacidade importa</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Usamos cookies essenciais para manter a sessão e melhorar a experiência. Cookies
            analíticos são opcionais. Consulte a{" "}
            <Link
              to="/p/$slug"
              params={{ slug: "privacidade" }}
              className="text-primary hover:underline"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
      {customizing && (
        <div className="mt-4 rounded-2xl border border-border bg-accent/40 p-3 text-xs">
          <label className="flex items-center justify-between gap-3">
            <span>
              <strong className="block">Cookies essenciais</strong>
              <span className="text-muted-foreground">
                Necessários para login, carrinho e segurança.
              </span>
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </label>
          <label className="mt-3 flex items-center justify-between gap-3">
            <span>
              <strong className="block">Cookies analíticos</strong>
              <span className="text-muted-foreground">Ajudam a entender o uso da plataforma.</span>
            </span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
          </label>
        </div>
      )}
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setCustomizing((value) => !value)}>
          <Settings2 className="mr-1.5 h-4 w-4" /> Personalizar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => save({ essential: true, analytics: false })}
        >
          Apenas essenciais
        </Button>
        <Button
          size="sm"
          className="bg-gradient-primary text-primary-foreground"
          onClick={() => save({ essential: true, analytics: customizing ? analytics : true })}
        >
          Aceitar todos
        </Button>
        {customizing && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => save({ essential: true, analytics })}
          >
            Salvar preferências
          </Button>
        )}
      </div>
    </div>
  );
}
