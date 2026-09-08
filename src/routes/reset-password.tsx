import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Definir nova senha | LynkoMarketplace" },
      { name: "description", content: "Crie uma nova senha para a sua conta LynkoMarketplace com segurança." },
      { property: "og:title", content: "Definir nova senha | LynkoMarketplace" },
      { property: "og:description", content: "Recuperação de acesso à conta LynkoMarketplace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setReady(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) return toast.error("As senhas não coincidem.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada com sucesso.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto grid max-w-md gap-6 px-4 py-16">
      <div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <KeyRound className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Definir nova senha</h1>
        <p className="text-sm text-muted-foreground">
          {ready
            ? "Escolha uma nova senha para voltar a acessar a sua conta."
            : "Abra esta página pelo link enviado no e-mail de recuperação."}
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-2">
          <Label htmlFor="rp-pass">Nova senha</Label>
          <Input id="rp-pass" name="password" type="password" required minLength={6} autoComplete="new-password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rp-confirm">Confirmar senha</Label>
          <Input id="rp-confirm" name="confirm" type="password" required minLength={6} autoComplete="new-password" />
        </div>
        <Button disabled={busy || !ready} className="gap-2">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ShieldCheck className="h-4 w-4" aria-hidden />}
          {busy ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
}
