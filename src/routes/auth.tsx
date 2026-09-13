import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  ShieldCheck,
  Zap,
  Lock,
  Star,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { slugify } from "@/lib/format";
import { ADMIN_SUPPORT_DISCORD_URL } from "@/lib/support";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta | LynkoMarketplace" },
      {
        name: "description",
        content:
          "Aceda à sua conta LynkoMarketplace para comprar, vender e gerir a sua loja digital com segurança.",
      },
      { property: "og:title", content: "Entrar ou criar conta | LynkoMarketplace" },
      {
        property: "og:description",
        content: "Login e registo seguro no marketplace LynkoMarketplace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const PILLARS = [
  {
    icon: <Zap className="h-4 w-4" />,
    t: "Entrega automática 24/7",
    d: "Pix confirmado, produto entregue em segundos no painel do comprador.",
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    t: "Identidade verificada",
    d: "KYC com documento e selfie, emblema de verificado e reputação pública.",
  },
  {
    icon: <Lock className="h-4 w-4" />,
    t: "Pagamento em custódia",
    d: "Processado pelo Efí Bank e liberado ao vendedor após a entrega.",
  },
];

function PasswordField({
  id,
  name,
  autoComplete,
  minLength,
  placeholder,
}: {
  id: string;
  name: string;
  autoComplete: string;
  minLength?: number;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        required
        minLength={minLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function strengthOf(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"tabs" | "recover">("tabs");
  const [recoverSent, setRecoverSent] = useState(false);
  const [signupSent, setSignupSent] = useState<string | null>(null);
  const [pw, setPw] = useState("");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: search.redirect ?? "/dashboard", replace: true });
  }, [user, loading, navigate, search.redirect]);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });
    setBusy(false);
    if (error) {
      const msg = /invalid login credentials/i.test(error.message)
        ? "E-mail ou senha incorretos."
        : /email not confirmed/i.test(error.message)
          ? "Confirme o seu e-mail antes de entrar."
          : error.message;
      return toast.error(msg);
    }
    toast.success("Bem-vindo de volta!");
    navigate({ to: search.redirect ?? "/dashboard" });
  };

  const recover = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setRecoverSent(true);
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = slugify(String(form.get("username")));
    const displayName = String(form.get("display_name") || "").trim();
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    if (displayName.length < 2) return toast.error("Informe o nome público da sua loja ou perfil.");
    if (username.length < 3) return toast.error("Nome de usuário inválido (mínimo 3 caracteres).");
    if (password.length < 6) return toast.error("A senha precisa de pelo menos 6 caracteres.");
    if (password !== String(form.get("confirm"))) return toast.error("As senhas não coincidem.");
    if (!accepted)
      return toast.error("É preciso aceitar os Termos de Uso e a Política de Privacidade.");

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username, display_name: displayName },
      },
    });
    setBusy(false);
    if (error) {
      const msg = /already registered/i.test(error.message)
        ? "Já existe uma conta com este e-mail. Tente entrar."
        : error.message;
      return toast.error(msg);
    }
    if (!data.session) {
      setSignupSent(email);
      return;
    }
    toast.success("Conta criada! Já pode começar a vender.");
    navigate({ to: search.redirect ?? "/dashboard" });
  };

  const score = strengthOf(pw);
  const scoreLabel = ["Muito fraca", "Fraca", "Razoável", "Boa", "Excelente"][score];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:py-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:py-20">
        <div className="flex items-center gap-3 lg:hidden">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-extrabold">LynkoMarketplace</p>
            <p className="text-xs text-muted-foreground">Digital com mais confiança</p>
          </div>
        </div>
        <div className="hidden flex-col justify-center lg:flex">
          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Star className="h-3 w-3 fill-current" /> Marketplace digital nº1 em confiança
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight xl:text-5xl">
            Compre e venda digital com{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              proteção total
            </span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Contas, chaves, gift cards e serviços digitais. Custódia do pagamento, entrega
            automática e mediação humana sempre que precisar.
          </p>

          <ul className="mt-8 grid gap-3">
            {PILLARS.map((p) => (
              <li
                key={p.t}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-xl"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  {p.icon}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{p.t}</span>
                  <span className="block text-xs text-muted-foreground">{p.d}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { v: "8%", l: "Taxa por venda" },
              { v: "R$ 3,50", l: "Saque mínimo" },
              { v: "Pix", l: "Aprovação automática" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-xl font-extrabold text-primary">{s.v}</p>
                <p className="text-[11px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-border bg-card/90 p-5 shadow-glow backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-center text-2xl font-extrabold tracking-tight">
              {mode === "recover" ? "Recuperar sua senha" : "Que bom ver você por aqui!"}
            </h2>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              {mode === "recover"
                ? "Enviaremos um link seguro para redefinir sua senha."
                : "Digite seu e-mail e senha para entrar no seu painel."}
            </p>
          </div>

          {signupSent ? (
            <div className="grid gap-4 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold">Confirme o seu e-mail</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enviámos um link de confirmação para <strong>{signupSent}</strong>. Abra a
                  mensagem para ativar a conta e depois volte aqui para entrar.
                </p>
              </div>
              <Button
                asChild
                className="gap-2 bg-gradient-primary text-primary-foreground shadow-glow"
              >
                <Link to="/dashboard">
                  <Plus className="h-4 w-4" /> Anunciar agora
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setSignupSent(null)}>
                Voltar ao início de sessão
              </Button>
            </div>
          ) : mode === "recover" ? (
            recoverSent ? (
              <div className="grid gap-4 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <p className="text-sm text-muted-foreground">
                  Se existir uma conta com esse e-mail, o link de recuperação já está a caminho.
                  Verifique também a pasta de spam.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRecoverSent(false);
                    setMode("tabs");
                  }}
                >
                  Voltar
                </Button>
              </div>
            ) : (
              <form onSubmit={recover} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rec-email">E-mail da conta</Label>
                  <Input id="rec-email" name="email" type="email" required autoComplete="email" />
                </div>
                <Button
                  disabled={busy}
                  className="gap-2 bg-gradient-primary text-primary-foreground shadow-glow"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <KeyRound className="h-4 w-4" aria-hidden />
                  )}
                  {busy ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode("tabs")}
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao início de sessão
                </button>
              </form>
            )
          ) : (
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="registo">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={signIn} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="login-email">E-mail</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="voce@email.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Senha</Label>
                      <button
                        type="button"
                        onClick={() => setMode("recover")}
                        className="text-xs text-primary hover:underline"
                      >
                        Esqueci a senha
                      </button>
                    </div>
                    <PasswordField
                      id="login-password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    disabled={busy}
                    className="gap-2 bg-gradient-primary text-primary-foreground shadow-glow"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    )}
                    {busy ? "Entrando..." : "Fazer login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="registo" className="mt-6">
                <form onSubmit={signUp} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="su-name">Nome público</Label>
                      <Input
                        id="su-name"
                        name="display_name"
                        required
                        minLength={2}
                        maxLength={40}
                        placeholder="Minha Loja Digital"
                        aria-describedby="su-name-hint"
                      />
                      <p id="su-name-hint" className="text-[11px] text-muted-foreground">
                        Aparece no topo do seu perfil.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="su-username">Usuário</Label>
                      <div className="flex items-center rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                        <span className="pl-3 text-sm font-semibold text-muted-foreground">@</span>
                        <Input
                          id="su-username"
                          name="username"
                          required
                          maxLength={30}
                          placeholder="minha-loja"
                          aria-describedby="su-user-hint"
                          className="border-0 bg-transparent focus-visible:ring-0"
                        />
                      </div>
                      <p id="su-user-hint" className="text-[11px] text-muted-foreground">
                        Será o link da sua loja.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="su-email">E-mail</Label>
                    <Input
                      id="su-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="voce@email.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="su-password">Senha</Label>
                    <div onChange={(e) => setPw((e.target as HTMLInputElement).value)}>
                      <PasswordField
                        id="su-password"
                        name="password"
                        minLength={6}
                        autoComplete="new-password"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-1.5 flex-1 gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className={`h-full flex-1 rounded-full ${
                              pw && i < score ? "bg-primary" : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="w-20 text-right text-[11px] text-muted-foreground">
                        {pw ? scoreLabel : ""}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="su-confirm">Confirmar senha</Label>
                    <PasswordField
                      id="su-confirm"
                      name="confirm"
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="Repita a senha"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted-foreground">
                    <Checkbox
                      checked={accepted}
                      onCheckedChange={(v) => setAccepted(v === true)}
                      className="mt-0.5"
                      aria-label="Aceito os termos"
                    />
                    <span>
                      Li e aceito os{" "}
                      <Link
                        to="/p/$slug"
                        params={{ slug: "termos" }}
                        className="text-primary hover:underline"
                      >
                        Termos de Uso
                      </Link>
                      ,{" "}
                      <Link
                        to="/p/$slug"
                        params={{ slug: "privacidade" }}
                        className="text-primary hover:underline"
                      >
                        a Política de Privacidade
                      </Link>{" "}
                      e as{" "}
                      <Link
                        to="/p/$slug"
                        params={{ slug: "regras-do-vendedor" }}
                        className="text-primary hover:underline"
                      >
                        Regras do Vendedor
                      </Link>
                      .
                    </span>
                  </label>

                  <Button
                    disabled={busy}
                    className="gap-2 bg-gradient-primary text-primary-foreground shadow-glow"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <ShieldCheck className="h-4 w-4" aria-hidden />
                    )}
                    {busy ? "Criando..." : "Criar conta"}
                  </Button>
                  <ul className="grid gap-2 rounded-xl border border-border bg-accent/30 p-3 text-[11px] text-muted-foreground">
                    <li>• Publique anúncios e receba por Pix com custódia.</li>
                    <li>
                      • Verificação de identidade em 3 níveis, você escolhe o quanto compartilha.
                    </li>
                    <li>• Notificações em tempo real de mensagens, pedidos e saques.</li>
                  </ul>
                </form>
              </TabsContent>
            </Tabs>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <strong className="block text-sm font-bold">Compra 100% garantida</strong>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                O pagamento fica protegido até a entrega. Se o produto não chegar, o dinheiro volta.
              </span>
            </span>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Precisa de ajuda?{" "}
            <a
              href={ADMIN_SUPPORT_DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Fale com o suporte no Discord
            </a>{" "}
            ou{" "}
            <Link
              to="/produtos"
              search={{ q: "", cat: "todas", sort: "recentes" }}
              className="text-primary hover:underline"
            >
              explore sem conta
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
