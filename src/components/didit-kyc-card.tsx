import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { BadgeCheck, Fingerprint, Loader2, RefreshCw, ShieldAlert, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getKycState, startKyc } from "@/lib/kyc.functions";

const LABELS: Record<string, string> = {
  "Not Started": "Não iniciada",
  "In Progress": "Em andamento",
  "Awaiting User": "Aguardando você",
  "In Review": "Em análise",
  Approved: "Aprovada",
  Declined: "Recusada",
  Resubmitted: "Reenviada",
  Abandoned: "Abandonada",
  Expired: "Expirada",
  "Kyc Expired": "Expirada",
};

export function DiditKycCard({ justReturned = false }: { justReturned?: boolean }) {
  const fetchState = useServerFn(getKycState);
  const start = useServerFn(startKyc);
  const [busy, setBusy] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["kyc-state"],
    queryFn: () => fetchState({ data: undefined as never }),
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (justReturned) void refetch();
  }, [justReturned, refetch]);

  const status = data?.status ?? "Not Started";
  const approved = status === "Approved";
  const declined = status === "Declined";
  const pending = status === "In Review" || status === "Resubmitted";

  const begin = async () => {
    setBusy(true);
    try {
      const res = await start({ data: { origin: window.location.origin } });
      if (!res.configured || !res.url) {
        toast.error("Verificação de identidade indisponível no momento.");
        return;
      }
      window.location.href = res.url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível abrir a verificação.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Fingerprint className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-base font-bold">Verificação de identidade automática</p>
            {approved && (
              <Badge className="gap-1 bg-gradient-primary text-primary-foreground">
                <BadgeCheck className="h-3 w-3" /> Aprovada
              </Badge>
            )}
            {declined && (
              <Badge variant="destructive" className="gap-1">
                <ShieldAlert className="h-3 w-3" /> Recusada
              </Badge>
            )}
            {pending && (
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" /> Em análise
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Documento e selfie são conferidos na hora por um serviço independente. O resultado é
            automático — nós apenas recebemos a decisão.
          </p>

          {isLoading ? (
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> A carregar estado…
            </p>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              Estado atual: <span className="font-semibold text-foreground">{LABELS[status] ?? status}</span>
              {data?.reason ? ` — ${data.reason}` : ""}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {!approved && (
              <Button onClick={begin} disabled={busy} className="bg-gradient-primary text-primary-foreground">
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                {declined || status === "Expired" || status === "Kyc Expired"
                  ? "Tentar novamente"
                  : status === "Not Started"
                    ? "Verificar identidade agora"
                    : "Continuar verificação"}
              </Button>
            )}
            <Button variant="outline" onClick={() => void refetch()} disabled={isRefetching}>
              {isRefetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Atualizar resultado
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
