import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { slugify } from "@/lib/format";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Entrar — LynkoMarket" },
      { name: "description", content: "Acesse ou crie sua conta LynkoMarket." },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "recover";

function PasswordField({
  id,
  name,
  autoComplete,
  placeholder,
  onChange,
}: {
  id: string;
  name: string;
  autoComplete: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-11 rounded-xl pr-11"
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground"
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate({ to: search.redirect ?? "/dashboard", replace: true });
  }, [user, loading, navigate, search.redirect]);

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });
    setBusy(false);
    if (error)
      return toast.error(
        /invalid login credentials/i.test(error.message)
          ? "E-mail ou senha incorretos."
          : error.message,
      );
    toast.success("Bem-vindo de volta!");
    navigate({ to: search.redirect ?? "/dashboard" });
  };
  const submitSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = slugify(String(form.get("username")));
    const displayName = String(form.get("display_name") || "").trim();
    const email = String(form.get("email")).trim();
    const pass = String(form.get("password"));
    if (displayName.length < 2) return toast.error("Informe o nome público da sua loja ou perfil.");
    if (username.length < 3) return toast.error("Nome de usuário inválido.");
    if (pass.length < 6) return toast.error("A senha precisa de pelo menos 6 caracteres.");
    if (pass !== String(form.get("confirm"))) return toast.error("As senhas não coincidem.");
    if (!accepted) return toast.error("Aceite os termos para continuar.");
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username, display_name: displayName },
      },
    });
    setBusy(false);
    if (error)
      return toast.error(
        /already registered/i.test(error.message)
          ? "Já existe uma conta com este e-mail."
          : error.message,
      );
    if (!data.session) {
      setSent(email);
      return;
    }
    toast.success("Conta criada!");
    navigate({ to: search.redirect ?? "/dashboard" });
  };
  const submitRecover = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email")).trim();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(email);
  };

  return (
    <div className="auth-shell lynko-page">
      <div className="lynko-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="lynko-orb lynko-orb-purple -left-24 top-12 h-72 w-72" />
      <div className="lynko-orb lynko-orb-pink right-0 top-1/3 h-72 w-72" />
      <div className="lynko-shell relative grid gap-8 py-8 sm:py-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="hidden lg:block">
          <span className="eyebrow">Sua operação começa aqui</span>
          <h1 className="mt-6 max-w-xl text-6xl font-black leading-[.92] tracking-[-.08em]">
            Mais controle.
            <br />
            <span className="gradient-text">Mais confiança.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            Uma conta para comprar, vender, acompanhar entregas e construir reputação no ecossistema
            Lynko.
          </p>
          <div className="mt-10 grid gap-3">
            {[
              {
                icon: ShieldCheck,
                title: "Pagamento protegido",
                text: "Custódia e rastreabilidade em cada compra.",
              },
              {
                icon: Zap,
                title: "Entrega sem atrito",
                text: "Automação para você receber no ritmo do digital.",
              },
              {
                icon: Sparkles,
                title: "Perfil que cresce",
                text: "Reputação, métricas e comunidade no mesmo lugar.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="surface-card-soft flex items-center gap-3 p-3.5">
                <span className="icon-tile h-10 w-10 rounded-xl">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-5 text-xs font-semibold text-muted-foreground">
            <span>
              <strong className="text-foreground">8k+</strong> produtos
            </span>
            <span>
              <strong className="text-foreground">4.9/5</strong> avaliação
            </span>
            <span>
              <strong className="text-foreground">24/7</strong> proteção
            </span>
          </div>
        </div>
        <div className="auth-panel mx-auto w-full max-w-[29rem] p-5 sm:p-8">
          <div className="mb-7 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/lynko-marketplace-logo.png" alt="Lynko Market" className="h-9 w-auto" />
            </Link>
            <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">
              secure access
            </span>
          </div>
          {sent ? (
            <div className="py-8 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Mail className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-2xl font-black">Confira seu e-mail</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Enviamos as instruções para <strong className="text-foreground">{sent}</strong>.
                Quando terminar, volte para continuar.
              </p>
              <Button
                variant="outline"
                className="mt-7 w-full rounded-xl"
                onClick={() => {
                  setSent(null);
                  setMode("login");
                }}
              >
                Voltar para entrar
              </Button>
            </div>
          ) : (
            <>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">
                  {mode === "recover"
                    ? "Recuperação"
                    : mode === "signup"
                      ? "Primeiro acesso"
                      : "Bem-vindo de volta"}
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-.06em]">
                  {mode === "recover"
                    ? "Recupere sua conta."
                    : mode === "signup"
                      ? "Crie seu espaço."
                      : "Entre no seu ritmo."}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {mode === "recover"
                    ? "Um link seguro chega em poucos instantes."
                    : mode === "signup"
                      ? "Comece a comprar ou publicar em minutos."
                      : "Acesse seu painel e continue de onde parou."}
                </p>
              </div>
              {mode !== "recover" && (
                <div className="mt-7 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`rounded-lg py-2.5 text-xs font-extrabold transition ${mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={`rounded-lg py-2.5 text-xs font-extrabold transition ${mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Criar conta
                  </button>
                </div>
              )}
              {mode === "login" && (
                <form onSubmit={submitLogin} className="mt-6 grid gap-4">
                  <Field label="E-mail" id="login-email">
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="voce@email.com"
                      className="h-11 rounded-xl"
                    />
                  </Field>
                  <Field label="Senha" id="login-password">
                    <PasswordField
                      id="login-password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="Sua senha"
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => setMode("recover")}
                    className="-mt-1 justify-self-end text-xs font-bold text-primary hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                  <Button
                    disabled={busy}
                    className="h-11 gap-2 rounded-xl bg-gradient-primary font-extrabold text-primary-foreground shadow-glow"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    {busy ? "Entrando..." : "Entrar na conta"}
                  </Button>
                </form>
              )}
              {mode === "signup" && (
                <form onSubmit={submitSignup} className="mt-6 grid gap-3.5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nome público" id="display-name">
                      <Input
                        id="display-name"
                        name="display_name"
                        required
                        placeholder="Sua marca"
                        className="h-11 rounded-xl"
                      />
                    </Field>
                    <Field label="Username" id="username">
                      <Input
                        id="username"
                        name="username"
                        required
                        placeholder="sua-loja"
                        className="h-11 rounded-xl"
                      />
                    </Field>
                  </div>
                  <Field label="E-mail" id="signup-email">
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="voce@email.com"
                      className="h-11 rounded-xl"
                    />
                  </Field>
                  <Field label="Senha" id="signup-password">
                    <PasswordField
                      id="signup-password"
                      name="password"
                      autoComplete="new-password"
                      placeholder="Mínimo 6 caracteres"
                      onChange={setPassword}
                    />
                  </Field>
                  {password && (
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((item) => (
                        <span
                          key={item}
                          className={`h-1.5 flex-1 rounded-full ${item < Math.min(4, Math.ceil(password.length / 3)) ? "bg-primary" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  )}
                  <Field label="Confirmar senha" id="confirm-password">
                    <PasswordField
                      id="confirm-password"
                      name="confirm"
                      autoComplete="new-password"
                      placeholder="Repita a senha"
                    />
                  </Field>
                  <label className="mt-1 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                    <Checkbox
                      checked={accepted}
                      onCheckedChange={(value) => setAccepted(value === true)}
                      className="mt-0.5"
                    />{" "}
                    <span>
                      Li e aceito os{" "}
                      <Link
                        to="/p/$slug"
                        params={{ slug: "termos" }}
                        className="font-bold text-primary hover:underline"
                      >
                        Termos de uso
                      </Link>{" "}
                      e a política de privacidade.
                    </span>
                  </label>
                  <Button
                    disabled={busy}
                    className="h-11 gap-2 rounded-xl bg-gradient-primary font-extrabold text-primary-foreground shadow-glow"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserRound className="h-4 w-4" />
                    )}
                    {busy ? "Criando..." : "Criar minha conta"}
                  </Button>
                </form>
              )}
              {mode === "recover" && (
                <form onSubmit={submitRecover} className="mt-7 grid gap-4">
                  <Field label="E-mail da conta" id="recover-email">
                    <Input
                      id="recover-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="voce@email.com"
                      className="h-11 rounded-xl"
                    />
                  </Field>
                  <Button
                    disabled={busy}
                    className="h-11 gap-2 rounded-xl bg-gradient-primary font-extrabold text-primary-foreground shadow-glow"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="h-4 w-4" />
                    )}
                    {busy ? "Enviando..." : "Enviar link seguro"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Voltar para entrar
                  </button>
                </form>
              )}
            </>
          )}
          <div className="mt-7 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
            <LockKeyhole className="h-3.5 w-3.5 text-primary" /> Seus dados são protegidos por
            conexão segura
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-bold">
        {label}
      </Label>
      {children}
    </div>
  );
}
