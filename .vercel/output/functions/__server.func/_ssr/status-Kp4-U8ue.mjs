import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $t as CircleCheck, Cn as Activity, R as RefreshCw, p as TriangleAlert } from "../_libs/lucide-react.mjs";
import { et as Button } from "./router-BVA3mZO7.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-Kp4-U8ue.js
var import_jsx_runtime = require_jsx_runtime();
async function timed(name, id, description, run) {
	const t0 = Date.now();
	try {
		await run();
		return {
			id,
			name,
			description,
			ok: true,
			ms: Date.now() - t0
		};
	} catch {
		return {
			id,
			name,
			description,
			ok: false,
			ms: Date.now() - t0
		};
	}
}
async function runChecks() {
	return Promise.all([
		timed("Catálogo de produtos", "catalogo", "Leitura de anúncios publicados", async () => {
			const { error } = await supabase.from("products").select("id", {
				head: true,
				count: "exact"
			}).limit(1);
			if (error) throw error;
		}),
		timed("Categorias e páginas", "cms", "Conteúdo institucional e categorias", async () => {
			const { error } = await supabase.from("categories").select("slug", {
				head: true,
				count: "exact"
			}).limit(1);
			if (error) throw error;
		}),
		timed("Contas e autenticação", "auth", "Login, registro e sessões", async () => {
			const { error } = await supabase.auth.getSession();
			if (error) throw error;
		}),
		timed("Pedidos e pagamentos", "pagamentos", "Criação e acompanhamento de pedidos", async () => {
			const { error } = await supabase.from("order_events").select("id", {
				head: true,
				count: "exact"
			}).limit(1);
			if (error) throw error;
		}),
		timed("Mídia e imagens", "midia", "Bucket público do Supabase para imagens permanentes", async () => {
			const { error } = await supabase.storage.from("media").list("", { limit: 1 });
			if (error) throw error;
		})
	]);
}
function StatusPage() {
	const { data, isLoading, refetch, isFetching, dataUpdatedAt } = useQuery({
		queryKey: ["platform-status"],
		queryFn: runChecks,
		refetchInterval: 6e4
	});
	const checks = data ?? [];
	const allOk = checks.length > 0 && checks.every((c) => c.ok);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-8 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-primary" }), " Status da plataforma"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-3xl font-extrabold tracking-tight",
				children: "Estamos no ar?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted-foreground",
				children: "Esta página verifica em tempo real os serviços que compradores e vendedores usam no LynkoMarketplace. Os testes rodam direto do seu navegador."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-6 flex flex-wrap items-center gap-3 rounded-2xl border p-5 ${isLoading ? "border-border bg-card" : allOk ? "border-emerald-500/30 bg-emerald-500/10" : "border-destructive/30 bg-destructive/10"}`,
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-56" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					allOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6 text-destructive" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold",
							children: allOk ? "Todos os sistemas operacionais" : "Instabilidade detectada em um ou mais serviços"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Última verificação:",
								" ",
								dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString("pt-BR") : ""
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => refetch(),
						disabled: isFetching,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}` }), " Verificar agora"]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3",
				children: isLoading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-xl" }, i)) : checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `h-2.5 w-2.5 shrink-0 rounded-full ${c.ok ? "bg-emerald-500" : "bg-destructive"}`,
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: c.description
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [c.ms, " ms"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-lg px-2 py-1 text-xs font-semibold ${c.ok ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}`,
							children: c.ok ? "Operacional" : "Indisponível"
						})
					]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs text-muted-foreground",
				children: "Pagamentos via Pix são processados por um provedor externo. Se um pagamento estiver pendente, use o botão “Verificar pagamento” no seu painel antes de abrir uma denúncia."
			})
		]
	});
}
//#endregion
export { StatusPage as component };
