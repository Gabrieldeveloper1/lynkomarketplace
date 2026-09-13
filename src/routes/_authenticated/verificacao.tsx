import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileImage,
  Loader2,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/verificacao")({
  head: () => ({
    meta: [
      { title: "Verificação de identidade | LynkoMarketplace" },
      {
        name: "description",
        content: "Envie seus dados e documentos para análise da equipe LynkoMarketplace.",
      },
    ],
  }),
  component: Verificacao,
});

type Verification = {
  id: string;
  full_name: string;
  cpf: string | null;
  document_type: string | null;
  document_path: string | null;
  selfie_path: string | null;
  status: string;
  note: string | null;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function validateFile(file: File | null, label: string) {
  if (!file) throw new Error(`Envie a ${label}.`);
  if (!["image/jpeg", "image/png"].includes(file.type))
    throw new Error(`${label} deve estar em JPG ou PNG.`);
  if (file.size > MAX_FILE_SIZE) throw new Error(`${label} deve ter no máximo 10 MB.`);
}

function Verificacao() {
  const { user, profile } = useAuth();
  const [current, setCurrent] = useState<Verification | null>(null);
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [documentType, setDocumentType] = useState<"rg" | "cnh">("rg");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("verifications")
      .select("id, full_name, cpf, document_type, document_path, selfie_path, status, note")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) return toast.error(error.message);
    const row = data as Verification | null;
    setCurrent(row);
    if (row) {
      setFullName(row.full_name);
      setCpf(row.cpf ? formatCpf(row.cpf) : "");
      setDocumentType((row.document_type as "rg" | "cnh") ?? "rg");
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const cpfDigits = cpf.replace(/\D/g, "");
    if (fullName.trim().length < 3)
      return toast.error("Informe seu nome completo como está no documento.");
    if (cpfDigits.length !== 11) return toast.error("Informe um CPF válido com 11 números.");
    try {
      validateFile(documentFile, "foto do documento");
      validateFile(selfieFile, "foto segurando o documento");
    } catch (error) {
      return toast.error(error instanceof Error ? error.message : "Confira os arquivos enviados.");
    }

    setBusy(true);
    try {
      const stamp = crypto.randomUUID();
      const documentPath = `${user.id}/${stamp}-documento.${documentFile!.type === "image/png" ? "png" : "jpg"}`;
      const selfiePath = `${user.id}/${stamp}-selfie.${selfieFile!.type === "image/png" ? "png" : "jpg"}`;
      const [documentUpload, selfieUpload] = await Promise.all([
        supabase.storage
          .from("kyc-documents")
          .upload(documentPath, documentFile!, { contentType: documentFile!.type }),
        supabase.storage
          .from("kyc-documents")
          .upload(selfiePath, selfieFile!, { contentType: selfieFile!.type }),
      ]);
      if (documentUpload.error) throw documentUpload.error;
      if (selfieUpload.error) throw selfieUpload.error;

      const { error } = await supabase.from("verifications").upsert(
        {
          user_id: user.id,
          full_name: fullName.trim(),
          cpf: cpfDigits,
          document_type: documentType,
          document_number: cpfDigits,
          document_path: documentPath,
          selfie_path: selfiePath,
          document_url: documentPath,
          selfie_url: selfiePath,
          status: "pending",
          note: null,
        },
        { onConflict: "user_id" },
      );
      if (error) throw error;
      toast.success("Verificação enviada para análise.");
      setDocumentFile(null);
      setSelfieFile(null);
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível enviar a verificação.",
      );
    } finally {
      setBusy(false);
    }
  };

  const status = current?.status;
  const approved = status === "approved";
  const rejected = status === "rejected";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold">Verificação de identidade</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Envie seus dados e documentos para análise da equipe.
          </p>
        </div>
      </div>

      {current && (
        <div
          className={`mt-6 rounded-2xl border p-4 ${approved ? "border-emerald-500/30 bg-emerald-500/10" : rejected ? "border-destructive/30 bg-destructive/10" : "border-border bg-card"}`}
        >
          <div className="flex items-center gap-2 text-sm font-bold">
            {approved ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : rejected ? (
              <XCircle className="h-4 w-4 text-destructive" />
            ) : (
              <Clock3 className="h-4 w-4 text-primary" />
            )}
            <span>
              {approved
                ? "Verificação aprovada"
                : rejected
                  ? "Verificação reprovada"
                  : "Verificação em análise"}
            </span>
            <Badge variant={approved ? "secondary" : rejected ? "destructive" : "outline"}>
              {current.status}
            </Badge>
          </div>
          {current.note && (
            <p className="mt-2 text-sm text-muted-foreground">Motivo: {current.note}</p>
          )}
          {!rejected && (
            <p className="mt-2 text-xs text-muted-foreground">
              A equipe analisará seus documentos antes de liberar os saques.
            </p>
          )}
        </div>
      )}

      <form
        onSubmit={submit}
        className="mt-6 grid gap-6 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7"
      >
        <div className="grid gap-2">
          <Label htmlFor="verification-name">Nome completo</Label>
          <Input
            id="verification-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Como está no documento"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="verification-cpf">CPF</Label>
          <Input
            id="verification-cpf"
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            placeholder="000.000.000-00"
            inputMode="numeric"
            required
          />
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Atenção: você só poderá sacar valores para uma conta bancária cadastrada no mesmo CPF
            informado acima. Confira se o número está correto antes de enviar.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="verification-document-type">Tipo de documento</Label>
          <select
            id="verification-document-type"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as "rg" | "cnh")}
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="rg">RG Carteira de identidade</option>
            <option value="cnh">CNH Carteira de motorista</option>
          </select>
        </div>
        <FilePicker
          id="verification-document"
          label="Foto do documento"
          hint="JPG ou PNG, até 10MB"
          file={documentFile}
          onChange={setDocumentFile}
        />
        <FilePicker
          id="verification-selfie"
          label="Foto segurando o documento"
          hint="Seu rosto e o documento devem estar visíveis"
          file={selfieFile}
          onChange={setSelfieFile}
        />
        <Button
          disabled={busy}
          className="h-11 gap-2 bg-gradient-primary text-primary-foreground shadow-glow"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {busy ? "Enviando..." : current ? "Enviar nova verificação" : "Enviar para análise"}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Seus documentos ficam em armazenamento privado e só podem ser acessados pela equipe
        autorizada.
      </p>
    </div>
  );
}

function FilePicker({
  id,
  label,
  hint,
  file,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-background p-4 transition-colors hover:border-primary hover:bg-accent/40"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Upload className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Clique para enviar uma foto</span>
          <span className="block text-xs text-muted-foreground">{hint}</span>
          <span className="mt-1 block truncate text-xs text-muted-foreground">
            {file?.name ?? "Nenhum arquivo escolhido"}
          </span>
        </span>
        <FileImage className="h-5 w-5 text-muted-foreground" />
      </label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
