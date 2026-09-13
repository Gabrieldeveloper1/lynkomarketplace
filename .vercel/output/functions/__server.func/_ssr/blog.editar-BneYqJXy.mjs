import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as saveBlogPost, c as fetchBlogPostsForEditor, i as deleteBlogPost } from "./commerce.functions-BTItmHS8.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { F as Save, G as Plus, J as PenLine, Rt as Eye, St as ImagePlus, h as Trash2, r as X, yn as ArrowLeft, zt as EyeOff } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Input, R as uploadMedia, et as Button, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog.editar-BneYqJXy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function makeSlug(title) {
	return `blog-${title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}
function BlogEditorPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const canEdit = user?.email?.toLowerCase() === "gabrieljairo865@gmail.com";
	const { data: posts = [], refetch, error: postsError } = useQuery({
		queryKey: ["blog-posts", "editor"],
		queryFn: () => fetchBlogPostsForEditor(),
		enabled: canEdit
	});
	const [editingSlug, setEditingSlug] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [summary, setSummary] = (0, import_react.useState)("");
	const [imageUrl, setImageUrl] = (0, import_react.useState)(null);
	const [content, setContent] = (0, import_react.useState)("# Título\n\nEscreva o conteúdo do artigo aqui.\n\n## Uma seção\n\nAdicione informações úteis para a comunidade.");
	const [published, setPublished] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [uploadingImage, setUploadingImage] = (0, import_react.useState)(false);
	const resetForm = () => {
		setEditingSlug(null);
		setTitle("");
		setSummary("");
		setImageUrl(null);
		setContent("# Título\n\nEscreva o conteúdo do artigo aqui.\n\n## Uma seção\n\nAdicione informações úteis para a comunidade.");
		setPublished(true);
	};
	const editPost = (post) => {
		setEditingSlug(post.slug);
		setTitle(post.title);
		setSummary(post.summary);
		setImageUrl(post.image_url ?? null);
		setContent(post.content);
		setPublished(post.published);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const removePost = async (slug) => {
		if (!window.confirm("Excluir este artigo do blog?")) return;
		setBusy(true);
		try {
			await deleteBlogPost({ data: { slug } });
			if (editingSlug === slug) resetForm();
			await refetch();
			toast.success("Artigo excluído.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível excluir o artigo.");
		} finally {
			setBusy(false);
		}
	};
	if (!canEdit) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "Área restrita"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Somente o editor autorizado pode criar ou alterar artigos do blog."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/blog",
					children: "Voltar ao blog"
				})
			})
		]
	});
	const save = async (event) => {
		event.preventDefault();
		if (!title.trim() || !content.trim()) return toast.error("Preencha o título e o conteúdo.");
		setBusy(true);
		try {
			await saveBlogPost({ data: {
				slug: editingSlug ?? makeSlug(title),
				title: title.trim(),
				summary: summary.trim(),
				content,
				image_url: imageUrl,
				published,
				position: 0
			} });
			toast.success(published ? "Artigo publicado no blog." : "Rascunho salvo.");
			await refetch();
			resetForm();
			navigate({ to: "/blog" });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível salvar o artigo.");
		} finally {
			setBusy(false);
		}
	};
	const uploadCover = async (event) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file || !user) return;
		if (!file.type.startsWith("image/") || file.type === "image/gif") {
			toast.error("Escolha uma imagem PNG, JPG, WEBP, AVIF, SVG, BMP ou TIFF.");
			return;
		}
		if (file.size > 52428800) {
			toast.error("A imagem deve ter no máximo 50 MB.");
			return;
		}
		setUploadingImage(true);
		try {
			setImageUrl(await uploadMedia(user.id, file));
			toast.success("Imagem carregada.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível carregar a imagem.");
		} finally {
			setUploadingImage(false);
		}
	};
	const uploadInlineImage = async (event) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file || !user) return;
		if (!file.type.startsWith("image/") || file.type === "image/gif") {
			toast.error("Escolha uma imagem válida; GIF não é permitido.");
			return;
		}
		setUploadingImage(true);
		try {
			const url = await uploadMedia(user.id, file);
			setContent((current) => `${current.trim()}\n\n![Imagem do artigo](${url})\n`);
			toast.success("Imagem inserida no conteúdo.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Não foi possível carregar a imagem.");
		} finally {
			setUploadingImage(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-8 sm:py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/blog",
			className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Voltar ao blog"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Editor autorizado"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-2xl font-extrabold",
						children: editingSlug ? "Editar artigo" : "Novo artigo"
					})] })]
				}),
				postsError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive",
					children: [
						"Não foi possível carregar os artigos existentes.",
						" ",
						postsError instanceof Error ? postsError.message : "Atualize a página e tente novamente."
					]
				}),
				posts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 rounded-2xl border border-border bg-background/40 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold",
							children: "Artigos existentes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							onClick: resetForm,
							className: "gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2",
						children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 rounded-xl border border-border p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: post.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["/", post.slug]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: post.published ? "default" : "outline",
									className: "gap-1",
									children: [post.published ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3 w-3" }), post.published ? "Publicado" : "Rascunho"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									onClick: () => editPost(post),
									children: "Editar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "ghost",
									disabled: busy,
									onClick: () => removePost(post.slug),
									"aria-label": `Excluir ${post.title}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
								})
							]
						}, post.slug))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: save,
					className: "mt-7 grid gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "blog-title",
								children: "Título"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "blog-title",
								value: title,
								onChange: (event) => setTitle(event.target.value),
								placeholder: "Ex.: Como vender melhor produtos digitais",
								maxLength: 120
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "blog-summary",
								children: "Resumo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "blog-summary",
								value: summary,
								onChange: (event) => setSummary(event.target.value),
								placeholder: "Uma frase para apresentar o artigo",
								maxLength: 300
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "blog-cover",
									children: "Imagem de capa"
								}),
								imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative overflow-hidden rounded-2xl border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: imageUrl,
										alt: "Pré-visualização da capa",
										className: "max-h-72 w-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "secondary",
										size: "icon",
										className: "absolute right-3 top-3",
										onClick: () => setImageUrl(null),
										"aria-label": "Remover imagem de capa",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									htmlFor: "blog-cover",
									className: "flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-5 w-5 text-primary" }), uploadingImage ? "Carregando imagem…" : "Escolher imagem de capa"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "blog-cover",
									type: "file",
									accept: "image/png,image/jpeg,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff",
									className: "sr-only",
									onChange: uploadCover,
									disabled: uploadingImage
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "blog-content",
									children: "Conteúdo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "blog-content",
									value: content,
									onChange: (event) => setContent(event.target.value),
									rows: 18,
									className: "font-mono text-sm",
									placeholder: "Use # para título e ## para seções"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									htmlFor: "blog-inline-image",
									className: "flex w-fit cursor-pointer items-center gap-2 text-xs font-semibold text-primary hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-4 w-4" }), uploadingImage ? "Carregando imagem…" : "Inserir imagem no conteúdo"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "blog-inline-image",
									type: "file",
									accept: "image/png,image/jpeg,image/webp,image/avif,image/svg+xml,image/bmp,image/tiff",
									className: "sr-only",
									onChange: uploadInlineImage,
									disabled: uploadingImage
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: published,
								onCheckedChange: setPublished
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: published ? "Publicado no blog" : "Salvar como rascunho" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: busy,
							className: "w-fit gap-2 bg-gradient-primary text-primary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), busy ? "Salvando…" : editingSlug ? "Salvar alterações" : published ? "Publicar artigo" : "Salvar rascunho"]
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { BlogEditorPage as component };
