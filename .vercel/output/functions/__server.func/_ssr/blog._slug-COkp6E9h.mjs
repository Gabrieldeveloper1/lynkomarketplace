import { V as notFound, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { ln as CalendarDays, yn as ArrowLeft } from "../_libs/lucide-react.mjs";
import { N as fetchSitePage, c as Route$11, et as Button } from "./router-BVA3mZO7.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-COkp6E9h.js
var import_jsx_runtime = require_jsx_runtime();
function renderContent(text) {
	return text.split("\n").map((line, index) => {
		const value = line.trim();
		if (!value) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3" }, index);
		const image = value.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/);
		if (image) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: image[2],
			alt: image[1] || "Imagem do artigo",
			className: "my-5 max-h-[32rem] w-full rounded-2xl object-cover"
		}, index);
		if (value.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-2xl font-bold",
			children: value.slice(3)
		}, index);
		if (value.startsWith("# ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-8 font-display text-3xl font-extrabold",
			children: value.slice(2)
		}, index);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-muted-foreground sm:text-base",
			children: value
		}, index);
	});
}
function BlogPostPage() {
	const { slug } = Route$11.useParams();
	const { data: post, isLoading } = useQuery({
		queryKey: ["blog-post", slug],
		queryFn: async () => {
			const page = await fetchSitePage(slug);
			if (!page || !page.published || !page.slug.startsWith("blog-")) throw notFound();
			return page;
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-3xl" })
	});
	if (!post) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-8 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/blog",
				className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Voltar ao blog"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-6 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-10",
				children: [
					post.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: post.image_url,
						alt: `Capa: ${post.title}`,
						className: "mb-8 aspect-[16/7] w-full rounded-2xl object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }),
							" Atualizado em",
							" ",
							new Date(post.updated_at).toLocaleDateString("pt-BR")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl",
						children: post.title
					}),
					post.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base leading-relaxed text-muted-foreground",
						children: post.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-2",
						children: renderContent(post.content)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/blog",
					children: "Ver todos os artigos"
				})
			})
		]
	});
}
//#endregion
export { BlogPostPage as component };
