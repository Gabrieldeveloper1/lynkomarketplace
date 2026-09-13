import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { J as PenLine, fn as BookOpen, ln as CalendarDays, vn as ArrowRight } from "../_libs/lucide-react.mjs";
import { _ as fetchBlogPosts, et as Button, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog-Q9-88MMI.js
var import_jsx_runtime = require_jsx_runtime();
function BlogPage() {
	const { user } = useAuth();
	const { data: posts = [], isLoading } = useQuery({
		queryKey: ["blog-posts"],
		queryFn: fetchBlogPosts
	});
	const canEdit = user?.email?.toLowerCase() === "gabrieljairo865@gmail.com";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col justify-between gap-5 rounded-3xl border border-border bg-gradient-hero p-6 sm:flex-row sm:items-end sm:p-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "secondary",
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5 text-primary" }), " Conteúdo Lynko"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl",
					children: "Blog"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base",
					children: "Novidades da plataforma, dicas para comprar e vender melhor e histórias da nossa comunidade."
				})
			] }), canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "gap-2 bg-gradient-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/blog/editar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" }), " Postar artigo"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/blog/editar",
						children: "Gerenciar blog"
					})
				})]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
			children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-2xl" }, i))
		}) : posts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
			children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow",
				children: [
					post.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: post.image_url,
						alt: `Capa: ${post.title}`,
						className: "-mx-5 -mt-5 mb-5 aspect-[16/9] w-[calc(100%+2.5rem)] rounded-t-2xl object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }),
							" ",
							new Date(post.updated_at).toLocaleDateString("pt-BR")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-xl font-bold group-hover:text-primary",
						children: post.title
					}),
					post.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground",
						children: post.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/blog/$slug",
						params: { slug: post.slug },
						className: "mt-auto pt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary",
						children: ["Ler artigo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				]
			}, post.slug))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground",
			children: "Em breve teremos novidades, guias e conteúdos para a comunidade."
		})]
	});
}
//#endregion
export { BlogPage as component };
