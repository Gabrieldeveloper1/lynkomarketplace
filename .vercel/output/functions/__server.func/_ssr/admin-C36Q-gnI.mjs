import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { C as updateUserProfileByAdmin, a as deleteCategory, b as staffAction, l as fetchContentAdmin, o as deleteSitePage, s as fetchAdminData, v as saveCategory, y as saveSitePage } from "./commerce.functions-BTItmHS8.mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { $ as MessageSquare, A as Shapes, At as Gavel, Cn as Activity, E as Shield, F as Save, G as Plus, Ht as DollarSign, Lt as FileBraces, Ot as Globe, Pt as Flag, Rt as Eye, Vt as Download, Y as Package, Yt as Clock3, a as Wallet, an as Check, cn as ChartColumn, dt as LoaderCircle, h as Trash2, hn as BadgeCheck, mn as Ban, mt as LayoutGrid, o as Users, p as TriangleAlert, r as X, u as Upload, xt as Image, zt as EyeOff } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Input, B as formatPrice, G as DialogDescription, H as timeAgo, J as DialogTitle, K as DialogFooter, R as uploadMedia, U as Dialog, V as slugify, W as DialogContent, Y as DialogTrigger, et as Button, m as CategoryVisual, q as DialogHeader, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as ChatPanel } from "./chat-panel-CZpycPMC.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as PageLoader } from "./loading-BKu-cbWF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-C36Q-gnI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = [
	"package",
	"user",
	"gamepad-2",
	"coins",
	"play",
	"app-window",
	"credit-card",
	"wrench",
	"at-sign",
	"music",
	"tv",
	"shield",
	"key",
	"gift",
	"bot",
	"smartphone",
	"globe"
];
var EMPTY_CAT = {
	slug: "",
	name: "",
	description: "",
	icon: "package",
	image_url: null,
	display_mode: "icon",
	position: 0
};
var EMPTY_PAGE = {
	slug: "",
	title: "",
	summary: "",
	content: "",
	published: true,
	position: 0
};
function AdminContent() {
	const { user } = useAuth();
	const { data, refetch, isLoading } = useQuery({
		queryKey: ["admin-content"],
		queryFn: () => fetchContentAdmin()
	});
	const [cat, setCat] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [showPreview, setShowPreview] = (0, import_react.useState)(true);
	const upload = async (file) => {
		if (!user || !cat) return;
		setUploading(true);
		try {
			const url = await uploadMedia(user.id, file);
			setCat({
				...cat,
				image_url: url,
				display_mode: "image"
			});
			toast.success("Imagem carregada.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro no upload.");
		} finally {
			setUploading(false);
		}
	};
	const submitCat = async () => {
		if (!cat) return;
		const slug = cat.slug || slugify(cat.name);
		if (!slug || !cat.name) return toast.error("Nome é obrigatório.");
		setSaving(true);
		try {
			await saveCategory({ data: {
				...cat,
				slug
			} });
			toast.success("Categoria guardada.");
			setCat(null);
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao guardar.");
		} finally {
			setSaving(false);
		}
	};
	const removeCat = async (slug) => {
		try {
			await deleteCategory({ data: { slug } });
			toast.success("Categoria removida.");
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao remover.");
		}
	};
	const submitPage = async () => {
		if (!page) return;
		const slug = page.slug || slugify(page.title);
		if (!slug || !page.title) return toast.error("Título é obrigatório.");
		setSaving(true);
		try {
			await saveSitePage({ data: {
				...page,
				slug
			} });
			toast.success("Página guardada.");
			setPage(null);
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao guardar.");
		} finally {
			setSaving(false);
		}
	};
	const togglePublish = async (p) => {
		setSaving(true);
		try {
			await saveSitePage({ data: {
				...p,
				published: !p.published
			} });
			toast.success(p.published ? "Página despublicada." : "Página publicada.");
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao atualizar.");
		} finally {
			setSaving(false);
		}
	};
	const removePage = async (slug) => {
		try {
			await deleteSitePage({ data: { slug } });
			toast.success("Página removida.");
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao remover.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 text-lg font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shapes, { className: "h-5 w-5 text-primary" }), " Categorias"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Escolha entre ícone SVG ou imagem personalizada para cada categoria."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "gap-1.5",
					onClick: () => setCat({ ...EMPTY_CAT }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Nova categoria"]
				})]
			}),
			cat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 rounded-2xl border border-primary/40 bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cat.name,
							onChange: (e) => setCat({
								...cat,
								name: e.target.value
							}),
							placeholder: "Streaming"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug (URL)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cat.slug,
							onChange: (e) => setCat({
								...cat,
								slug: slugify(e.target.value)
							}),
							placeholder: "streaming"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: cat.description,
								onChange: (e) => setCat({
									...cat,
									description: e.target.value
								}),
								placeholder: "Contas de Netflix, Spotify, Disney+…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Posição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: cat.position,
							onChange: (e) => setCat({
								...cat,
								position: Number(e.target.value) || 0
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-xl border border-border px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: cat.display_mode === "image",
									onCheckedChange: (v) => setCat({
										...cat,
										display_mode: v ? "image" : "icon"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: cat.display_mode === "image" ? "Mostrar imagem" : "Mostrar ícone"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryVisual, {
									category: cat,
									className: "h-5 w-5"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ícone SVG" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 flex flex-wrap gap-1.5",
							children: ICONS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCat({
									...cat,
									icon: i
								}),
								className: `grid h-9 w-9 place-items-center rounded-lg border transition ${cat.icon === i ? "border-primary bg-primary/10 text-primary" : "border-border"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryVisual, {
									category: {
										name: i,
										icon: i
									},
									className: "h-4 w-4"
								})
							}, i))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Imagem da categoria" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: cat.image_url ?? "",
								onChange: (e) => setCat({
									...cat,
									image_url: e.target.value || null
								}),
								placeholder: "https://…"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm",
								children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/jpeg,image/png,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff",
									className: "hidden",
									onChange: (e) => e.target.files?.[0] && upload(e.target.files[0])
								})]
							})]
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: submitCat,
						disabled: saving,
						className: "gap-1.5",
						children: [
							saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }),
							" ",
							"Guardar"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setCat(null),
						children: "Cancelar"
					})]
				})]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando..."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: (data?.categories ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-card p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryVisual, {
								category: c,
								className: "h-5 w-5"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: [
									"/",
									c.slug,
									" · ",
									c.description || "sem descrição"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "gap-1",
							children: [c.display_mode === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shapes, { className: "h-3 w-3" }), c.display_mode === "image" ? "Imagem" : "Ícone"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setCat(c),
							children: "Editar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => removeCat(c.slug),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
						})
					]
				}, c.slug))
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: "Termos e políticas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Estas páginas aparecem no menu e no rodapé do site."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "gap-1.5",
					onClick: () => setPage({ ...EMPTY_PAGE }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Nova página"]
				})]
			}),
			page && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 rounded-2xl border border-primary/40 bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Título" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: page.title,
								onChange: (e) => setPage({
									...page,
									title: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug (URL)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: page.slug,
								onChange: (e) => setPage({
									...page,
									slug: slugify(e.target.value)
								}),
								placeholder: "termos"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Resumo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: page.summary,
									onChange: (e) => setPage({
										...page,
										summary: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Conteúdo (suporta ## títulos e - listas)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 12,
									value: page.content,
									onChange: (e) => setPage({
										...page,
										content: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: page.published,
									onCheckedChange: (v) => setPage({
										...page,
										published: v
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: page.published ? "Publicada" : "Rascunho"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Posição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: page.position,
								onChange: (e) => setPage({
									...page,
									position: Number(e.target.value) || 0
								})
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: submitPage,
								disabled: saving,
								className: "gap-1.5",
								children: [
									saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }),
									" ",
									"Guardar"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "gap-1.5",
								onClick: () => setShowPreview((v) => !v),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }),
									" ",
									showPreview ? "Ocultar pré-visualização" : "Pré-visualizar"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setPage(null),
								children: "Cancelar"
							})
						]
					}),
					showPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 rounded-xl border border-border bg-background p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
								children: ["Pré-visualização · /p/", page.slug || "slug"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-extrabold",
								children: page.title || "Sem título"
							}),
							page.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: page.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagePreview, { text: page.content })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: (data?.pages ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: p.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: [
									"/p/",
									p.slug,
									" · ",
									p.summary
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: p.published ? "secondary" : "outline",
							children: p.published ? "Publicada" : "Rascunho"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: p.published ? "ghost" : "default",
							className: "gap-1.5",
							disabled: saving,
							onClick: () => togglePublish(p),
							children: [p.published ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" }), p.published ? "Despublicar" : "Publicar"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `/p/${p.slug}`,
								target: "_blank",
								rel: "noreferrer",
								children: "Ver"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								setPage(p);
								setShowPreview(true);
							},
							children: "Editar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => removePage(p.slug),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
						})
					]
				}, p.slug))
			})
		] })]
	});
}
/** Render de markdown básico igual ao usado em /p/$slug (pré-visualização admin). */
function PagePreview({ text }) {
	const lines = text.split("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: lines.map((line, i) => {
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
function WithdrawalReviewDialog({ mode, trigger, onConfirm }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [reason, setReason] = (0, import_react.useState)("");
	const [evidence, setEvidence] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const approving = mode === "approve";
	const submit = async () => {
		if (!approving && reason.trim().length < 4) return;
		setBusy(true);
		try {
			await onConfirm({
				reason: reason.trim() || void 0,
				evidenceUrl: evidence.trim() || void 0,
				note: note.trim() || void 0
			});
			setOpen(false);
			setReason("");
			setEvidence("");
			setNote("");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: approving ? "Aprovar e pagar saque" : "Recusar saque" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: approving ? "Registre o comprovante do Pix enviado. O usuário será notificado da mudança de status." : "Informe o motivo da recusa. O valor volta ao saldo do usuário e ele será notificado." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "wr-reason",
								children: approving ? "Motivo / observação" : "Motivo da recusa *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "wr-reason",
								value: reason,
								onChange: (e) => setReason(e.target.value),
								rows: 3,
								placeholder: approving ? "Ex.: Saldo verificado, pagamento efetuado." : "Ex.: Chave Pix divergente do titular."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "wr-evidence",
								children: "Evidência (link do comprovante ou print)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "wr-evidence",
								value: evidence,
								onChange: (e) => setEvidence(e.target.value),
								placeholder: "https://..."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "wr-note",
								children: "Mensagem para o usuário (opcional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "wr-note",
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Resposta da equipe"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setOpen(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || !approving && reason.trim().length < 4,
					onClick: submit,
					children: approving ? "Confirmar pagamento" : "Confirmar recusa"
				})] })
			]
		})]
	});
}
function downloadFile(content, filename, type) {
	const blob = new Blob([content], { type });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}
function downloadCsv(rows, filename) {
	if (!rows.length) return toast.info("Não há dados para exportar.");
	const keys = Object.keys(rows[0]);
	const quote = (value) => `"${String(value ?? "").replace(/"/g, "\"\"")}"`;
	downloadFile(`\ufeff${[keys.join(","), ...rows.map((row) => keys.map((key) => quote(row[key])).join(","))].join("\n")}`, filename, "text/csv;charset=utf-8");
	toast.success("Relatório CSV exportado.");
}
async function openKycFile(path) {
	if (!path) return;
	const { data, error } = await supabase.storage.from("kyc-documents").createSignedUrl(path, 300);
	if (error) return toast.error("Não foi possível abrir o documento.");
	window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}
function ModerationChats({ chats, activeId, onSelect }) {
	if (!chats.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Nenhuma conversa pediu moderação."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[300px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "h-fit max-h-[600px] overflow-y-auto rounded-2xl border border-border bg-card p-2",
			children: chats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onSelect(c.id),
				className: `w-full rounded-xl p-3 text-left text-sm transition ${activeId === c.id ? "bg-accent" : "hover:bg-accent/60"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate font-medium",
					children: [
						"@",
						c.buyer?.username ?? "comprador",
						" ↔ @",
						c.seller?.username ?? "vendedor"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: timeAgo(c.last_message_at)
				})]
			}, c.id))
		}), activeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {
			conversationId: activeId,
			moderatorMode: true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-[600px] place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground",
			children: "Seleciona uma conversa para entrar como moderador"
		})]
	});
}
function SupportChats({ chats, activeId, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[300px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "h-fit max-h-[600px] overflow-y-auto rounded-2xl border border-border bg-card p-2",
			children: chats.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-4 text-sm text-muted-foreground",
				children: "Nenhum atendimento aberto."
			}) : chats.map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onSelect(chat.id),
				className: `w-full rounded-xl p-3 text-left text-sm transition ${activeId === chat.id ? "bg-accent" : "hover:bg-accent/60"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-medium",
					children: chat.buyer?.display_name || `@${chat.buyer?.username ?? "cliente"}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: timeAgo(chat.last_message_at)
				})]
			}, chat.id))
		}), activeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, { conversationId: activeId }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-[600px] place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground",
			children: "Selecione um atendimento para responder"
		})]
	});
}
function Admin() {
	const { isStaff, loading } = useAuth();
	const [chatId, setChatId] = (0, import_react.useState)(null);
	const [supportChatId, setSupportChatId] = (0, import_react.useState)(null);
	const [editingUserId, setEditingUserId] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editUsername, setEditUsername] = (0, import_react.useState)("");
	const [activeTab, setActiveTab] = (0, import_react.useState)("denuncias");
	const [reportPeriod, setReportPeriod] = (0, import_react.useState)("all");
	const [reportStatus, setReportStatus] = (0, import_react.useState)("all");
	const { data, refetch, isLoading, error } = useQuery({
		queryKey: ["admin-data"],
		queryFn: () => fetchAdminData(),
		enabled: isStaff
	});
	const run = async (action, targetId, note, extra) => {
		try {
			await staffAction({ data: {
				action,
				targetId,
				note,
				...extra
			} });
			toast.success("Ação aplicada.");
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro.");
		}
	};
	const saveUserProfile = async () => {
		if (!editingUserId) return;
		try {
			await updateUserProfileByAdmin({ data: {
				userId: editingUserId,
				displayName: editName,
				username: editUsername
			} });
			toast.success("Perfil atualizado.");
			setEditingUserId(null);
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Não foi possível atualizar o perfil.");
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageLoader, { label: "Preparando a central administrativa…" });
	if (!isStaff) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mx-auto h-10 w-10 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-2xl font-bold",
				children: "Acesso restrito"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Esta área é exclusiva para administradores e moderadores."
			})
		]
	});
	const revenue = (data?.orders ?? []).filter((o) => o.status !== "pending").reduce((s, o) => s + o.fee_cents, 0);
	const pendingReports = (data?.reports ?? []).filter((r) => r.status === "open").length;
	const pendingKyc = (data?.verifications ?? []).filter((v) => v.status === "pending").length;
	const pendingWithdrawals = (data?.withdrawals ?? []).filter((w) => w.status === "requested").length;
	const pendingAppeals = (data?.appeals ?? []).filter((a) => a.status === "pending").length;
	const filteredReportOrders = (() => {
		const since = reportPeriod === "all" ? 0 : Date.now() - Number(reportPeriod) * 864e5;
		return (data?.orders ?? []).filter((order) => {
			const inPeriod = since === 0 || new Date(order.created_at).getTime() >= since;
			const inStatus = reportStatus === "all" || order.status === reportStatus;
			return inPeriod && inStatus;
		});
	})();
	const reportStatusCounts = [
		"pending",
		"paid",
		"shipped",
		"delivered",
		"refunded",
		"cancelled"
	].map((status) => ({
		status,
		count: filteredReportOrders.filter((order) => order.status === status).length
	}));
	const maxReportCount = Math.max(1, ...reportStatusCounts.map((item) => item.count));
	const exportData = {
		users: (data?.users ?? []).map((u) => ({
			id: u.id,
			username: u.username,
			display_name: u.display_name,
			verified: u.verified,
			banned: u.banned,
			created_at: u.created_at
		})),
		products: (data?.products ?? []).map((p) => ({
			id: p.id,
			title: p.title,
			status: p.status,
			price_cents: p.price_cents,
			created_at: p.created_at
		})),
		orders: filteredReportOrders.map((o) => ({
			id: o.id,
			status: o.status,
			amount_cents: o.amount_cents,
			fee_cents: o.fee_cents,
			created_at: o.created_at
		})),
		reports: (data?.reports ?? []).map((r) => ({
			id: r.id,
			reason: r.reason,
			target_type: r.target_type,
			status: r.status,
			created_at: r.created_at
		})),
		withdrawals: (data?.withdrawals ?? []).map((w) => ({
			id: w.id,
			amount_cents: w.amount_cents,
			status: w.status,
			created_at: w.created_at
		}))
	};
	const NAV = [
		{
			group: "Moderação",
			items: [
				{
					value: "denuncias",
					label: "Denúncias",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4" }),
					count: pendingReports
				},
				{
					value: "moderacao",
					label: "Chats em disputa",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" })
				},
				{
					value: "atendimento",
					label: "Atendimento",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }),
					count: data?.supportChats?.length ?? 0
				},
				{
					value: "apelacoes",
					label: "Apelações",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gavel, { className: "h-4 w-4" }),
					count: pendingAppeals
				}
			]
		},
		{
			group: "Comunidade",
			items: [
				{
					value: "usuários",
					label: "Usuários",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
				},
				{
					value: "anuncios",
					label: "Anúncios",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
				},
				{
					value: "kyc",
					label: "Verificações",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4" }),
					count: pendingKyc
				}
			]
		},
		{
			group: "Financeiro e conteúdo",
			items: [
				{
					value: "saques",
					label: "Saques",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
					count: pendingWithdrawals
				},
				{
					value: "relatorios",
					label: "Relatórios e exportação",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" })
				},
				{
					value: "conteudo",
					label: "Conteúdo do site",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" })
				}
			]
		}
	];
	const activeItem = NAV.flatMap((group) => group.items).find((item) => item.value === activeTab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-surface shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-wrap items-end justify-between gap-5 p-5 sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "gap-1 border-primary/30 text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3" }), " Operação interna"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Acesso protegido"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl",
									children: "Central de administração"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-2xl text-sm text-muted-foreground",
									children: "Moderação, comunidade, financeiro e conteúdo organizados em um fluxo único de trabalho."
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: pendingReports + pendingKyc + pendingWithdrawals + pendingAppeals }),
								" ",
								"pendências prioritárias"
							] })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid border-t border-border/70 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveTab("denuncias"),
							className: "flex items-center gap-3 px-5 py-3 text-left transition hover:bg-accent/60 sm:px-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-sm",
								children: [pendingReports, " denúncias"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Requerem triagem"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveTab("kyc"),
							className: "flex items-center gap-3 border-t border-border/70 px-5 py-3 text-left transition hover:bg-accent/60 sm:border-l sm:border-t-0 sm:px-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-sm",
								children: [pendingKyc, " verificações"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Aguardando análise"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveTab("saques"),
							className: "flex items-center gap-3 border-t border-border/70 px-5 py-3 text-left transition hover:bg-accent/60 sm:border-l sm:border-t-0 sm:px-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-sm",
								children: [pendingWithdrawals, " saques"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Aguardando decisão"
							})] })]
						})
					]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-destructive",
				children: error.message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Usuários",
						value: isLoading ? "loading" : String(data?.users.length ?? 0),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Anúncios",
						value: isLoading ? "loading" : String(data?.products.length ?? 0),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Denúncias abertas",
						value: isLoading ? "loading" : String(pendingReports),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Receita em taxas",
						value: isLoading ? "loading" : formatPrice(revenue),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: setActiveTab,
				className: "grid gap-6 lg:grid-cols-[248px_1fr] lg:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "grid h-auto w-full gap-4 rounded-2xl border border-border bg-card p-3 lg:sticky lg:top-24",
					children: NAV.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
							children: g.group
						}), g.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: it.value,
							className: "w-full justify-start gap-2 rounded-xl px-3 py-2 text-sm data-[state=active]:bg-accent",
							children: [
								it.icon,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-left",
									children: it.label
								}),
								!!it.count && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground",
									children: it.count
								})
							]
						}, it.value))]
					}, g.group))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					initial: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -6
						},
						transition: {
							duration: .18,
							ease: "easeOut"
						},
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm sm:px-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
										children: activeItem?.icon ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-bold",
											children: activeItem?.label ?? "Visão geral"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: "Área de trabalho administrativa"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-3.5 w-3.5" }), " Dados atualizados em tempo real"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "denuncias",
								className: "mt-6 grid gap-3",
								children: [
									isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Carregando..."
									}),
									(data?.reports ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-medium",
												children: [
													r.reason,
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-muted-foreground",
														children: [
															"(",
															r.target_type,
															")"
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													r.details || "Sem detalhes",
													" · ",
													timeAgo(r.created_at)
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: r.status === "open" ? "outline" : "secondary",
											children: r.status
										}),
										r.target_type === "product" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => run("block_product", r.target_id),
											children: "Bloquear anúncio"
										}),
										r.target_type === "user" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => run("ban_user", r.target_id),
											children: "Banir"
										}),
										r.target_type === "message" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => run("hide_message", r.target_id),
											children: "Ocultar mensagem"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											onClick: () => run("resolve_report", r.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => run("dismiss_report", r.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
										})
									] }, r.id)),
									!isLoading && !(data?.reports ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Sem denúncias."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "usuários",
								className: "mt-6 grid gap-3",
								children: (data?.users ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1 font-medium",
											children: [
												"@",
												u.username,
												" ",
												u.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4 text-primary" })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Saldo ",
												formatPrice(u.balance_cents),
												" · registado ",
												timeAgo(u.created_at)
											]
										})]
									}),
									u.banned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										children: "Banido"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => run(u.verified ? "unverify_user" : "verify_user", u.id),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "mr-1 h-4 w-4" }),
											" ",
											u.verified ? "Remover" : "Verificar"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => run(u.banned ? "unban_user" : "ban_user", u.id),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "mr-1 h-4 w-4" }),
											" ",
											u.banned ? "Desbanir" : "Banir"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => {
											setEditingUserId(u.id);
											setEditName(u.display_name ?? "");
											setEditUsername(u.username);
										},
										children: "Editar perfil"
									}),
									editingUserId === u.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 grid w-full gap-2 rounded-xl border border-primary/30 bg-accent/30 p-3 sm:grid-cols-[1fr_1fr_auto_auto]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: editName,
												onChange: (e) => setEditName(e.target.value),
												placeholder: "Nome completo"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm text-muted-foreground",
													children: "@"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: editUsername,
													onChange: (e) => setEditUsername(e.target.value.replace(/^@/, "")),
													placeholder: "username"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												onClick: saveUserProfile,
												children: "Salvar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => setEditingUserId(null),
												children: "Cancelar"
											})
										]
									})
								] }, u.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "anuncios",
								className: "mt-6 grid gap-3",
								children: (data?.products ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-medium",
											children: p.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"@",
												p.seller?.username,
												" ·",
												" ",
												formatPrice(p.price_cents)
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: p.status === "active" ? "secondary" : "destructive",
										children: p.status
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => run(p.status === "active" ? "block_product" : "unblock_product", p.id),
										children: p.status === "active" ? "Bloquear" : "Reativar"
									})
								] }, p.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "kyc",
								className: "mt-6 grid gap-3",
								children: [(data?.verifications ?? []).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: v.full_name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													"@",
													v.user?.username,
													" · doc",
													" ",
													v.document_number
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex gap-2",
												children: [(v.document_path ?? v.document_url) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => void openKycFile(v.document_path ?? v.document_url),
													className: "text-xs text-primary hover:underline",
													children: "Ver documento"
												}), (v.selfie_path ?? v.selfie_url) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => void openKycFile(v.selfie_path ?? v.selfie_url),
													className: "text-xs text-primary hover:underline",
													children: "Ver selfie"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: v.status === "approved" ? "secondary" : "outline",
										children: v.status
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: () => run("approve_kyc", v.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => run("reject_kyc", v.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
									})
								] }, v.id)), !(data?.verifications ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Sem pedidos."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "saques",
								className: "mt-6 grid gap-3",
								children: [(data?.withdrawals ?? []).map((w) => {
									const rec = w;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium",
													children: formatPrice(w.amount_cents)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground",
													children: [
														"@",
														w.seller?.username,
														" · Pix",
														" ",
														w.pix_key,
														" · ",
														timeAgo(w.created_at)
													]
												}),
												w.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-xs text-muted-foreground",
													children: ["Nota: ", w.note]
												}),
												rec.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-xs text-muted-foreground",
													children: ["Motivo: ", rec.reason]
												}),
												rec.evidence_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: rec.evidence_url,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "mt-1 inline-block text-xs text-primary underline",
													children: "Ver evidência"
												}),
												rec.reviewed_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-[11px] text-muted-foreground",
													children: ["Analisado ", timeAgo(rec.reviewed_at)]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: w.status === "paid" ? "secondary" : w.status === "rejected" ? "destructive" : "outline",
											children: w.status === "paid" ? "Pago" : w.status === "rejected" ? "Recusado" : "Aguardando análise"
										}),
										w.status === "requested" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WithdrawalReviewDialog, {
											mode: "approve",
											trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mr-1 h-4 w-4" }), " Aprovar e pagar"]
											}),
											onConfirm: (p) => run("pay_withdrawal", w.id, p.note, {
												reason: p.reason,
												evidenceUrl: p.evidenceUrl
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WithdrawalReviewDialog, {
											mode: "reject",
											trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "ghost",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1 h-4 w-4" }), " Recusar"]
											}),
											onConfirm: (p) => run("reject_withdrawal", w.id, p.note, {
												reason: p.reason,
												evidenceUrl: p.evidenceUrl
											})
										})] })
									] }, w.id);
								}), !(data?.withdrawals ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Sem pedidos de saque."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "apelacoes",
								className: "mt-6 grid gap-3",
								children: [(data?.appeals ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-medium",
												children: ["@", a.user?.username ?? "usuário"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													"Motivo do ban:",
													" ",
													a.user?.ban_reason ?? ""
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 whitespace-pre-wrap rounded-xl bg-accent p-3 text-xs",
												children: a.message
											}),
											a.staff_reply && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-xs text-primary",
												children: ["Resposta: ", a.staff_reply]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: a.status === "pending" ? "outline" : "secondary",
										children: a.status
									}),
									a.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: () => run("accept_appeal", a.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 h-4 w-4" }), " Aceitar e desbanir"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => run("reject_appeal", a.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
									})] })
								] }, a.id)), !(data?.appeals ?? []).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Sem apelações."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "moderacao",
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModerationChats, {
									chats: data?.moderationChats ?? [],
									activeId: chatId,
									onSelect: setChatId
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "atendimento",
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportChats, {
									chats: data?.supportChats ?? [],
									activeId: supportChatId,
									onSelect: setSupportChatId
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "relatorios",
								className: "mt-6 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "rounded-3xl border-border shadow-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "flex flex-wrap items-end gap-3 p-4 sm:p-5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-[150px] flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
														children: "Período"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: reportPeriod,
														onChange: (event) => setReportPeriod(event.target.value),
														className: "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "all",
																children: "Todo o período"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "7",
																children: "Últimos 7 dias"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "30",
																children: "Últimos 30 dias"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "90",
																children: "Últimos 90 dias"
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-[150px] flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
														children: "Status do pedido"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: reportStatus,
														onChange: (event) => setReportStatus(event.target.value),
														className: "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "all",
																children: "Todos os status"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "pending",
																children: "Pendente"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "paid",
																children: "Pago"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "delivered",
																children: "Entregue"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "refunded",
																children: "Reembolsado"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "cancelled",
																children: "Cancelado"
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-xl bg-primary/5 px-4 py-2.5 text-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block text-[10px] uppercase tracking-wider text-muted-foreground",
														children: "Pedidos no filtro"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: filteredReportOrders.length })]
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "rounded-3xl border-border shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "flex items-center gap-2 text-base",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4 text-primary" }), " Distribuição por status"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Visualização baseada nos pedidos filtrados."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid gap-3 sm:grid-cols-3 lg:grid-cols-6",
											children: reportStatusCounts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-2xl bg-accent/50 p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate capitalize text-muted-foreground",
														children: item.status
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.count })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-3 h-2 overflow-hidden rounded-full bg-border",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-full rounded-full bg-gradient-primary transition-all",
														style: { width: `${Math.max(item.count ? 8 : 0, item.count / maxReportCount * 100)}%` }
													})
												})]
											}, item.status))
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "overflow-hidden rounded-3xl border-border shadow-card",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
											className: "bg-gradient-surface",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-start justify-between gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5 text-primary" }), " Relatórios e exportação"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-sm text-muted-foreground",
													children: "Exporte visões operacionais para análise, auditoria e acompanhamento da plataforma."
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: "gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }), " Sem documentos KYC"]
												})]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
											className: "grid gap-3 p-5 sm:grid-cols-2",
											children: [
												{
													key: "users",
													title: "Usuários",
													desc: `${exportData.users.length} registros`,
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
												},
												{
													key: "products",
													title: "Anúncios",
													desc: `${exportData.products.length} registros`,
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
												},
												{
													key: "orders",
													title: "Pedidos e receita",
													desc: `${exportData.orders.length} registros`,
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4" })
												},
												{
													key: "reports",
													title: "Denúncias",
													desc: `${exportData.reports.length} registros`,
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4" })
												},
												{
													key: "withdrawals",
													title: "Saques",
													desc: `${exportData.withdrawals.length} registros`,
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
												}
											].map((report) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
														children: report.icon
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0 flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm font-bold",
															children: report.title
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs text-muted-foreground",
															children: report.desc
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "outline",
															title: "Exportar CSV",
															onClick: () => downloadCsv(exportData[report.key], `lynko-${report.key}.csv`),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "ghost",
															title: "Exportar JSON",
															onClick: () => {
																downloadFile(JSON.stringify(exportData[report.key], null, 2), `lynko-${report.key}.json`, "application/json");
																toast.success("Relatório JSON exportado.");
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, { className: "h-3.5 w-3.5" })
														})]
													})
												]
											}, report.key))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
												label: "Pedidos processados",
												value: String(exportData.orders.filter((o) => o.status !== "pending").length),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
												label: "Taxas acumuladas",
												value: formatPrice(revenue),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
												label: "Taxa de anúncios ativos",
												value: `${exportData.products.length ? Math.round(exportData.products.filter((p) => p.status === "active").length / exportData.products.length * 100) : 0}%`,
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "conteudo",
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminContent, {})
							})
						]
					}, activeTab)
				})]
			})
		]
	});
}
function Row({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4",
		children
	});
}
function StatCard({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between space-y-0 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-sm font-medium text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary",
				children: icon
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: value === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-20" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-2xl font-extrabold",
			children: value
		}) })]
	});
}
//#endregion
export { Admin as component };
