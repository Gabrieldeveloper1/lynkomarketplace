import { V as notFound, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Ft as FileText, yn as ArrowLeft } from "../_libs/lucide-react.mjs";
import { N as fetchSitePage, P as fetchSitePages, et as Button, o as Route$8 } from "./router-BVA3mZO7.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._slug-DPKdFEMB.js
var import_jsx_runtime = require_jsx_runtime();
/** Render simples e seguro de markdown básico (##, ###, listas, parágrafos). */
function Content({ text }) {
	const blocks = text.split("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3 break-words",
		children: blocks.map((line, i) => {
			const t = line.trim();
			if (!t) return null;
			if (t.startsWith("### ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "pt-3 text-base font-bold",
				children: t.slice(4)
			}, i);
			if (t.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "pt-4 text-lg font-extrabold",
				children: t.slice(3)
			}, i);
			if (t.startsWith("# ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "pt-4 text-xl font-extrabold",
				children: t.slice(2)
			}, i);
			if (t.startsWith("- ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex gap-2 pl-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary",
					children: "•"
				}), t.slice(2)]
			}, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: t
			}, i);
		})
	});
}
function PaginaLegal() {
	const { slug } = Route$8.useParams();
	const { data: page, isLoading } = useQuery({
		queryKey: ["site-page", slug],
		queryFn: async () => {
			const p = await fetchSitePage(slug);
			if (!p) throw notFound();
			return p;
		}
	});
	const { data: pages = [] } = useQuery({
		queryKey: ["site-pages"],
		queryFn: fetchSitePages
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-3 py-8 sm:px-4 sm:py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 w-full rounded-2xl" })
	});
	if (!page) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-3 py-16 text-center sm:px-4 sm:py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Página não encontrada."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Voltar ao início"
			})
		})]
	});
	const sections = page.content.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("## ") || l.startsWith("# ")).map((l) => l.replace(/^#+\s*/, ""));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden border-b border-border bg-gradient-hero",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-6xl px-3 py-7 sm:px-4 sm:py-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Início"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-start gap-3 sm:mt-5 sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-primary",
								children: "Documento oficial"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 break-words text-2xl font-extrabold leading-tight sm:text-4xl",
								children: page.title
							}),
							page.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base",
								children: page.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-[11px] text-muted-foreground",
								children: ["Atualizado em ", new Date(page.updated_at).toLocaleDateString("pt-BR")]
							})
						]
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-5 grid max-w-6xl gap-5 px-3 sm:mt-8 sm:gap-8 sm:px-4 lg:grid-cols-[240px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit min-w-0 space-y-4 lg:sticky lg:top-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Legal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-3 flex max-w-full gap-1 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0",
						children: pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/p/$slug",
							params: { slug: p.slug },
							className: `shrink-0 rounded-lg px-3 py-2 text-sm transition-colors lg:shrink ${p.slug === slug ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-accent"}`,
							children: p.title
						}, p.slug))
					})]
				}), sections.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden rounded-2xl border border-border bg-card p-4 lg:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Nesta página"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid gap-1.5 text-xs text-muted-foreground",
						children: sections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "line-clamp-1",
							children: [
								i + 1,
								". ",
								s
							]
						}, i))
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "min-w-0 rounded-3xl border border-border bg-card p-4 shadow-card sm:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, { text: page.content }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 rounded-2xl bg-accent/60 p-4 text-xs text-muted-foreground",
					children: "Ficou com dúvida sobre este documento? Fale com o suporte administrativo no Discord; para pedidos e mediação, use o chat da sua conta."
				})]
			})]
		})]
	});
}
//#endregion
export { PaginaLegal as component };
