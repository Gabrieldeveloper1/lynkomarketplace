import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type WithdrawalReviewPayload = { note?: string; reason?: string; evidenceUrl?: string };

export function WithdrawalReviewDialog({
  mode,
  trigger,
  onConfirm,
}: {
  mode: "approve" | "reject";
  trigger: React.ReactNode;
  onConfirm: (payload: WithdrawalReviewPayload) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const approving = mode === "approve";

  const submit = async () => {
    if (!approving && reason.trim().length < 4) return;
    setBusy(true);
    try {
      await onConfirm({
        reason: reason.trim() || undefined,
        evidenceUrl: evidence.trim() || undefined,
        note: note.trim() || undefined,
      });
      setOpen(false);
      setReason("");
      setEvidence("");
      setNote("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{approving ? "Aprovar e pagar saque" : "Recusar saque"}</DialogTitle>
          <DialogDescription>
            {approving
              ? "Registre o comprovante do Pix enviado. O usuário será notificado da mudança de status."
              : "Informe o motivo da recusa. O valor volta ao saldo do usuário e ele será notificado."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="wr-reason">
              {approving ? "Motivo / observação" : "Motivo da recusa *"}
            </Label>
            <Textarea
              id="wr-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={
                approving
                  ? "Ex.: Saldo verificado, pagamento efetuado."
                  : "Ex.: Chave Pix divergente do titular."
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wr-evidence">Evidência (link do comprovante ou print)</Label>
            <Input
              id="wr-evidence"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wr-note">Mensagem para o usuário (opcional)</Label>
            <Input
              id="wr-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Resposta da equipe"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button disabled={busy || (!approving && reason.trim().length < 4)} onClick={submit}>
            {approving ? "Confirmar pagamento" : "Confirmar recusa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
