import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { $t as CircleCheck, D as ShieldCheck, It as FileImage, Yt as Clock3, Zt as CircleX, dt as LoaderCircle, u as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Input, et as Button, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verificacao-Cp7NXTVq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_FILE_SIZE = 10485760;
function formatCpf(value) {
	return value.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function validateFile(file, label) {
	if (!file) throw new Error(`Envie a ${label}.`);
	if (!["image/jpeg", "image/png"].includes(file.type)) throw new Error(`${label} deve estar em JPG ou PNG.`);
	if (file.size > MAX_FILE_SIZE) throw new Error(`${label} deve ter no máximo 10 MB.`);
}
function Verificacao() {
	const { user, profile } = useAuth();
	const [current, setCurrent] = (0, import_react.useState)(null);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [cpf, setCpf] = (0, import_react.useState)("");
	const [documentType, setDocumentType] = (0, import_react.useState)("rg");
	const [documentFile, setDocumentFile] = (0, import_react.useState)(null);
	const [selfieFile, setSelfieFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		if (!user) return;
		const { data, error } = await supabase.from("verifications").select("id, full_name, cpf, document_type, document_path, selfie_path, status, note").eq("user_id", user.id).maybeSingle();
		if (error) return toast.error(error.message);
		const row = data;
		setCurrent(row);
		if (row) {
			setFullName(row.full_name);
			setCpf(row.cpf ? formatCpf(row.cpf) : "");
			setDocumentType(row.document_type ?? "rg");
		}
	}, [user]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const submit = async (event) => {
		event.preventDefault();
		if (!user) return;
		const cpfDigits = cpf.replace(/\D/g, "");
		if (fullName.trim().length < 3) return toast.error("Informe seu nome completo como está no documento.");
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
			const documentPath = `${user.id}/${stamp}-documento.${documentFile.type === "image/png" ? "png" : "jpg"}`;
			const selfiePath = `${user.id}/${stamp}-selfie.${selfieFile.type === "image/png" ? "png" : "jpg"}`;
			const [documentUpload, selfieUpload] = await Promise.all([supabase.storage.from("kyc-documents").upload(documentPath, documentFile, { contentType: documentFile.type }), supabase.storage.from("kyc-documents").upload(selfiePath, selfieFile, { contentType: selfieFile.type })]);
			if (documentUpload.error) throw documentUpload.error;
			if (selfieUpload.error) throw selfieUpload.error;
			const { error } = await supabase.from("verifications").upsert({
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
				note: null
			}, { onConflict: "user_id" });
			if (error) throw error;
			toast.success("Verificação enviada para análise.");
			setDocumentFile(null);
			setSelfieFile(null);
			await load();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível enviar a verificação.");
		} finally {
			setBusy(false);
		}
	};
	const status = current?.status;
	const approved = status === "approved";
	const rejected = status === "rejected";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold",
					children: "Verificação de identidade"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Envie seus dados e documentos para análise da equipe."
				})] })]
			}),
			current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `mt-6 rounded-2xl border p-4 ${approved ? "border-emerald-500/30 bg-emerald-500/10" : rejected ? "border-destructive/30 bg-destructive/10" : "border-border bg-card"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-bold",
						children: [
							approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : rejected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-destructive" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-4 w-4 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: approved ? "Verificação aprovada" : rejected ? "Verificação reprovada" : "Verificação em análise" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: approved ? "secondary" : rejected ? "destructive" : "outline",
								children: current.status
							})
						]
					}),
					current.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: ["Motivo: ", current.note]
					}),
					!rejected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "A equipe analisará seus documentos antes de liberar os saques."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-6 grid gap-6 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "verification-name",
							children: "Nome completo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "verification-name",
							value: fullName,
							onChange: (e) => setFullName(e.target.value),
							placeholder: "Como está no documento",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "verification-cpf",
								children: "CPF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "verification-cpf",
								value: cpf,
								onChange: (e) => setCpf(formatCpf(e.target.value)),
								placeholder: "000.000.000-00",
								inputMode: "numeric",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-amber-600 dark:text-amber-400",
								children: "Atenção: você só poderá sacar valores para uma conta bancária cadastrada no mesmo CPF informado acima. Confira se o número está correto antes de enviar."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "verification-document-type",
							children: "Tipo de documento"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "verification-document-type",
							value: documentType,
							onChange: (e) => setDocumentType(e.target.value),
							className: "h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "rg",
								children: "RG Carteira de identidade"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cnh",
								children: "CNH Carteira de motorista"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePicker, {
						id: "verification-document",
						label: "Foto do documento",
						hint: "JPG ou PNG, até 10MB",
						file: documentFile,
						onChange: setDocumentFile
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePicker, {
						id: "verification-selfie",
						label: "Foto segurando o documento",
						hint: "Seu rosto e o documento devem estar visíveis",
						file: selfieFile,
						onChange: setSelfieFile
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: busy,
						className: "h-11 gap-2 bg-gradient-primary text-primary-foreground shadow-glow",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), busy ? "Enviando..." : current ? "Enviar nova verificação" : "Enviar para análise"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-xs text-muted-foreground",
				children: "Seus documentos ficam em armazenamento privado e só podem ser acessados pela equipe autorizada."
			})
		]
	});
}
function FilePicker({ id, label, hint, file, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: id,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor: id,
				className: "flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-background p-4 transition-colors hover:border-primary hover:bg-accent/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold",
								children: "Clique para enviar uma foto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: hint
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block truncate text-xs text-muted-foreground",
								children: file?.name ?? "Nenhum arquivo escolhido"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "h-5 w-5 text-muted-foreground" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				type: "file",
				accept: "image/jpeg,image/png",
				className: "sr-only",
				onChange: (e) => onChange(e.target.files?.[0] ?? null)
			})
		]
	});
}
//#endregion
export { Verificacao as component };
