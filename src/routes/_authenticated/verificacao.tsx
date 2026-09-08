import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, ShieldCheck, Lock, Clock3, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { levelOf } from "@/lib/verification";
import { DiditKycCard } from "@/components/didit-kyc-card";

export const Route = createFileRoute("/_authenticated/verificacao")({
  validateSearch: (search: Record<string, unknown>): { kyc?: "1" } =>
    search["kyc"] === "1" || search["kyc"] === 1 ? { kyc: "1" } : {},
  head: () => ({
    meta: [
      { title: "Verificação de identidade | LynkoMarketplace" },
      {
        name: "description",
        content:
          "Verifique a sua identidade em minutos com documento e selfie. A análise é automática e o resultado aparece no seu perfil.",
      },
      { property: "og:title", content: "Verificação de identidade | LynkoMarketplace" },
      {
        property: "og:description",
        content: "Verificação automática de documento e selfie, sem formulários manuais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Verificacao,
});

const STEPS = [
  {
    icon: Fingerprint,
    title: "1 · Abrir a verificação",
    text: "Clique no botão e será levado ao ambiente seguro do nosso parceiro de identidade.",
  },
  {
    icon: ShieldCheck,
    title: "2 · Documento e selfie",
    text: "Fotografe o documento e faça a selfie pelo celular ou webcam. Leva cerca de 2 minutos.",
  },
  {
    icon: Clock3,
    title: "3 · Resultado automático",
    text: "A decisão volta sozinha para o site e o selo aparece no seu perfil — sem espera manual.",
  },
];

function Verificacao() {
  const { kyc } = Route.useSearch();
  const { profile } = useAuth();
  const current = levelOf(profile?.verification_level);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold sm:text-2xl">Verificação de identidade</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tudo é conferido automaticamente. Você não precisa preencher formulários nem esperar por
            análise manual.
          </p>
        </div>
      </div>

      {profile?.verified ? (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-500">
            <BadgeCheck className="h-4 w-4" /> ✅ Conta verificada{current ? ` — nível ${current.short}` : ""}
          </p>
          <p className="mt-1 text-xs text-emerald-500/90">
            Sua identidade foi confirmada — você ganha mais confiança nas negociações.
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <p className="flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="h-4 w-4 text-primary" /> ⏳ Conta ainda não verificada
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Verifique a sua identidade para ganhar o selo e passar mais confiança nas negociações.
          </p>
        </div>
      )}

      <DiditKycCard justReturned={kyc === "1"} />


      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.title} className="rounded-2xl border border-border bg-card p-5">
            <s.icon className="h-5 w-5 text-primary" aria-hidden />
            <p className="mt-3 text-sm font-bold">{s.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Lock className="h-4 w-4 text-primary" aria-hidden /> Privacidade
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Documento e selfie ficam com o serviço de verificação e nunca aparecem no seu perfil. Aqui
          guardamos apenas o resultado (aprovado, recusado ou em análise).
        </p>
      </div>
    </div>
  );
}
