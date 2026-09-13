import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { V as notFound, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as MessageSquare, D as ShieldCheck, Jt as Clock, Pt as Flag, S as Sparkles, T as ShoppingBag, Tt as Headset, Y as Package, _ as ThumbsDown, dt as LoaderCircle, g as ThumbsUp, gt as Layers, hn as BadgeCheck, k as Share2, nn as ChevronRight, rn as ChevronLeft, t as Zap, ut as Lock, x as Star, z as RefreshCcw } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as formatPrice, D as fetchProductReviews, E as fetchProductBySlug, F as fetchVariants, H as timeAgo, I as ratingOf, O as fetchProducts, Q as AvatarImage, X as Avatar, Z as AvatarFallback, a as Route$7, et as Button, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as ReportDialog, r as openConversation } from "./chat-panel-CZpycPMC.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { t as StarRating } from "./star-rating-Qt0Vbggm.mjs";
import { n as ProductCard, t as FavoriteButton } from "./product-card-CyWpl6s6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/produto._slug-BBTelvCQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function inline(text) {
	const parts = [];
	const pattern = /(\*\*(.+?)\*\*|\*([^*]+?)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))/g;
	let last = 0;
	let match;
	while (match = pattern.exec(text)) {
		if (match.index > last) parts.push(text.slice(last, match.index));
		if (match[2]) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: match[2] }, `${match.index}-b`));
		else if (match[3]) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: match[3] }, `${match.index}-i`));
		else if (match[4]) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]",
			children: match[4]
		}, `${match.index}-c`));
		else if (match[5] && match[6]) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: match[6],
			target: "_blank",
			rel: "noopener noreferrer",
			className: "text-primary underline underline-offset-2",
			children: match[5]
		}, `${match.index}-a`));
		last = match.index + match[0].length;
	}
	if (last < text.length) parts.push(text.slice(last));
	return parts;
}
function MarkdownContent({ text, className = "" }) {
	const lines = text.replace(/\r\n/g, "\n").split("\n");
	const blocks = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i].trim();
		if (!line) {
			i++;
			continue;
		}
		if (line.startsWith("```")) {
			const code = [];
			i++;
			while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
			i++;
			blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "overflow-x-auto rounded-xl bg-muted p-3 text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code.join("\n") })
			}, `code-${i}`));
			continue;
		}
		if (/^\|.*\|$/.test(line) && i + 1 < lines.length && /^\|?\s*:?-{3,}/.test(lines[i + 1].trim())) {
			const headers = line.split("|").slice(1, -1).map((v) => v.trim());
			i += 2;
			const rows = [];
			while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) rows.push(lines[i++].trim().split("|").slice(1, -1).map((v) => v.trim()));
			blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: headers.map((h, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "border-b border-border px-2 py-2 font-semibold",
						children: inline(h)
					}, n)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row, r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: headers.map((_, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "border-b border-border/60 px-2 py-2",
						children: inline(row[c] ?? "")
					}, c)) }, r)) })]
				})
			}, `table-${i}`));
			continue;
		}
		if (/^#{1,3}\s/.test(line)) {
			const level = line.match(/^#+/)?.[0].length ?? 1;
			const Heading = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
			blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
				className: "font-bold",
				children: inline(line.replace(/^#{1,3}\s+/, ""))
			}, `heading-${i}`));
			i++;
			continue;
		}
		if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
			const ordered = /^\d+\.\s+/.test(line);
			const items = [];
			while (i < lines.length && (ordered ? /^\d+\.\s+/.test(lines[i].trim()) : /^[-*]\s+/.test(lines[i].trim()))) items.push(lines[i++].trim().replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, ""));
			const List = ordered ? "ol" : "ul";
			blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
				className: `${ordered ? "list-decimal" : "list-disc"} space-y-1 pl-5`,
				children: items.map((item, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(item) }, n))
			}, `list-${i}`));
			continue;
		}
		const paragraph = [line];
		i++;
		while (i < lines.length && lines[i].trim() && !/^#{1,3}\s|^[-*]\s+|^\d+\.\s+|^```|^\|.*\|$/.test(lines[i].trim())) paragraph.push(lines[i++].trim());
		blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "leading-relaxed",
			children: inline(paragraph.join(" "))
		}, `p-${i}`));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `space-y-3 ${className}`,
		children: blocks
	});
}
function ProdutoPage() {
	const { slug } = Route$7.useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [active, setActive] = (0, import_react.useState)(0);
	const [buying, setBuying] = (0, import_react.useState)(false);
	const [variantId, setVariantId] = (0, import_react.useState)(void 0);
	const [quantity, setQuantity] = (0, import_react.useState)(1);
	const { data: product, isLoading } = useQuery({
		queryKey: ["product", slug],
		queryFn: async () => {
			const p = await fetchProductBySlug(slug);
			if (!p) throw notFound();
			return p;
		},
		staleTime: 12e4
	});
	const { data: variants = [] } = useQuery({
		queryKey: ["variants", product?.id],
		queryFn: () => fetchVariants(product.id),
		enabled: !!product,
		staleTime: 12e4
	});
	const { data: reviews = [] } = useQuery({
		queryKey: ["product-reviews", product?.id],
		queryFn: () => fetchProductReviews(product.id),
		enabled: !!product,
		staleTime: 6e4
	});
	const { data: related = [] } = useQuery({
		queryKey: ["related", product?.category_slug],
		queryFn: () => fetchProducts({
			category: product.category_slug,
			limit: 5
		}),
		enabled: !!product,
		staleTime: 12e4
	});
	const selectedVariant = (0, import_react.useMemo)(() => variants.find((v) => v.id === variantId) ?? (variants.length ? variants[0] : null), [variants, variantId]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[1fr_380px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-[16/10] w-full rounded-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 w-full rounded-3xl" })]
		})
	});
	if (!product) return null;
	const rating = ratingOf(reviews);
	const displayPrice = selectedVariant ? selectedVariant.price_cents : product.price_cents;
	const displayStock = selectedVariant ? selectedVariant.stock : product.stock;
	const soldOut = product.auto_delivery && displayStock <= 0;
	const maxQty = Math.max(1, Math.min(20, product.auto_delivery ? displayStock : 20));
	const buy = async () => {
		setBuying(true);
		try {
			await navigate({
				to: "/checkout/$slug",
				params: { slug },
				search: {
					variant: selectedVariant?.id,
					qty: quantity
				}
			});
		} finally {
			setBuying(false);
		}
	};
	const chat = async () => {
		if (!user) {
			navigate({
				to: "/auth",
				search: { redirect: `/produto/${slug}` }
			});
			return;
		}
		if (user.id === product.seller_id) return toast.info("Este anúncio é seu.");
		try {
			const conversationId = await openConversation({
				buyerId: user.id,
				sellerId: product.seller_id,
				productId: product.id
			});
			navigate({
				to: "/mensagens",
				search: { c: conversationId }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao abrir conversa.");
		}
	};
	const share = async () => {
		const url = window.location.href;
		try {
			if (navigator.share) await navigator.share({
				title: product.title,
				url
			});
			else {
				await navigator.clipboard.writeText(url);
				toast.success("Link copiado!");
			}
		} catch {}
	};
	const siteUrl = "https://www.lynkomarketplace.online";
	const productJsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.title,
		...product.description ? { description: product.description } : {},
		...product.images?.length ? { image: product.images } : {},
		url: `${siteUrl}/produto/${slug}`,
		offers: {
			"@type": "Offer",
			price: (displayPrice / 100).toFixed(2),
			priceCurrency: "BRL",
			url: `${siteUrl}/produto/${slug}`,
			availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
		},
		...reviews.length > 0 && rating != null ? { aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: Number(rating).toFixed(1),
			reviewCount: reviews.length
		} } : {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-w-0 max-w-7xl overflow-x-hidden px-3 pb-28 pt-4 sm:px-4 sm:pb-24 sm:pt-6 lg:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(productJsonLd) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				"aria-label": "Trilha",
				className: "flex flex-wrap items-center gap-1 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "transition-colors hover:text-foreground",
						children: "Início"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/produtos",
						search: {
							q: "",
							cat: "todas",
							sort: "recentes"
						},
						className: "transition-colors hover:text-foreground",
						children: "Marketplace"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/produtos",
						search: {
							q: "",
							cat: product.category_slug,
							sort: "recentes"
						},
						className: "transition-colors hover:text-foreground",
						children: product.category_slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-medium text-foreground",
						children: product.title
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid min-w-0 gap-5 sm:mt-5 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs sm:px-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 font-semibold text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), " Compra protegida pela Lynko"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Entrega e suporte acompanhados"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row-reverse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1 overflow-hidden rounded-3xl border border-border bg-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "aspect-[4/3] bg-accent sm:aspect-[16/10]",
										children: product.images?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: product.images[active],
											alt: `${product.title} imagem ${active + 1}`,
											className: "h-full w-full object-cover",
											fetchPriority: active === 0 ? "high" : "auto",
											decoding: "async"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-full place-items-center text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-10 w-10" })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute left-3 top-3 flex flex-wrap gap-1.5",
										children: [product.promoted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-gradient-primary text-primary-foreground shadow-glow",
											children: "Destaque"
										}), product.auto_delivery && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											className: "gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3" }), " Entrega automática"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										size: "icon",
										onClick: share,
										"aria-label": "Partilhar anúncio",
										className: "absolute right-3 top-3 rounded-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4" })
									}),
									product.images?.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Imagem anterior",
											onClick: () => setActive((i) => (i - 1 + product.images.length) % product.images.length),
											className: "absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Próxima imagem",
											onClick: () => setActive((i) => (i + 1) % product.images.length),
											className: "absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur",
											children: [
												active + 1,
												"/",
												product.images.length
											]
										})
									] })
								]
							}), product.images?.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2 overflow-x-auto pb-1 sm:w-24 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0",
								children: product.images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setActive(i),
									"aria-label": `Imagem ${i + 1}`,
									"aria-current": i === active,
									className: `h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-16 sm:w-24 ${i === active ? "border-primary shadow-glow" : "border-border opacity-70 hover:opacity-100"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img,
										alt: "",
										className: "h-full w-full object-cover",
										loading: "lazy",
										decoding: "async",
										width: 96,
										height: 64
									})
								}, img))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded-3xl border border-border bg-gradient-surface p-5 shadow-sm sm:p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold leading-tight sm:text-3xl",
								children: product.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 text-primary" }),
											rating !== null ? `${rating}% positivas` : "Sem avaliações ainda",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground/70",
												children: [
													"(",
													reviews.length,
													")"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" }), product.auto_delivery ? `${displayStock} em estoque` : "Entrega manual"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
											" Publicado ",
											timeAgo(product.created_at)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: product.category_slug
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 grid gap-2 sm:grid-cols-3",
							children: [
								{
									icon: Lock,
									title: "Pagamento protegido",
									text: "O valor só é liberado após a entrega"
								},
								{
									icon: Zap,
									title: product.auto_delivery ? "Entrega imediata" : "Entrega acompanhada",
									text: product.auto_delivery ? "Receba assim que pagar" : "Suporte durante todo o pedido"
								},
								{
									icon: ShieldCheck,
									title: "Suporte e disputa",
									text: "Abra uma denúncia se algo falhar"
								}
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2.5 rounded-2xl border border-border bg-card p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs font-semibold",
										children: f.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[11px] leading-snug text-muted-foreground",
										children: f.text
									})]
								})]
							}, f.title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-6 grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-4 sm:p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-sm font-bold",
									children: "Detalhes do anúncio"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "mt-3 grid gap-2 text-xs",
									children: [
										["Categoria", product.category_slug],
										["Tipo de entrega", product.auto_delivery ? "Automática (imediata)" : "Manual pelo vendedor"],
										["Disponibilidade", product.auto_delivery ? `${displayStock} unidade(s) em estoque` : "Sob combinação"],
										["Vendas concluídas", String(product.sales_count ?? 0)],
										["Publicado", timeAgo(product.created_at)],
										...selectedVariant ? [["Variação escolhida", selectedVariant.name]] : []
									].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3 border-b border-border/60 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "shrink-0 text-muted-foreground",
											children: k
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "min-w-0 break-words text-right font-medium",
											children: v
										})]
									}, k))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-4 sm:p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-sm font-bold",
										children: "Benefícios de comprar aqui"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 grid gap-3",
										children: [
											{
												icon: Lock,
												title: "Pagamento processado pela Efí",
												text: "O pagamento é processado pela Efí Bank e o pedido fica registrado no chat."
											},
											{
												icon: Sparkles,
												title: product.auto_delivery ? "Recebe em segundos" : "Prazo acompanhado",
												text: product.auto_delivery ? "A entrega cai no chat assim que o Pix é aprovado." : "Acompanhamos o prazo combinado com o vendedor."
											},
											{
												icon: RefreshCcw,
												title: "Reembolso em caso de falha",
												text: "Se a mediação for aprovada, a Efí Bank processa automaticamente o reembolso aos titulares."
											},
											{
												icon: Headset,
												title: "Suporte com histórico",
												text: "A moderação entra no chat e analisa as duas versões."
											}
										].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.icon, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-xs font-semibold",
													children: b.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-[11px] leading-snug text-muted-foreground",
													children: b.text
												})]
											})]
										}, b.title))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/protecao",
										className: "mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
										children: ["Como funciona a proteção ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: "descricao",
							className: "mt-6 sm:mt-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "h-auto w-full justify-start gap-1 overflow-x-auto p-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "descricao",
											children: "Descrição"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "avaliacoes",
											children: [
												"Avaliações (",
												reviews.length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "entrega",
											children: "Entrega e proteção"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "descricao",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-2xl border border-border bg-card p-4 sm:p-5",
										children: product.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownContent, {
											text: product.description,
											className: "text-sm text-muted-foreground"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm leading-relaxed text-muted-foreground",
											children: "O vendedor não adicionou uma descrição para este anúncio."
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "avaliacoes",
									children: reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground sm:p-8",
										children: "Este produto ainda não tem avaliações."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-3",
										children: reviews.map((r) => {
											const buyer = r.buyer;
											const name = buyer?.display_name || buyer?.username || "Cliente";
											const stars = r.rating;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-2xl border border-border bg-card p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-3",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
															className: "h-8 w-8",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: buyer?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: name.slice(0, 2).toUpperCase() })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "min-w-0",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "truncate text-sm font-medium",
																children: name
															}), buyer?.username && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "truncate text-xs text-muted-foreground",
																children: ["@", buyer.username]
															})]
														}),
														stars ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRating, { value: stars }) : r.positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-4 w-4 text-destructive" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-auto text-xs text-muted-foreground",
															children: timeAgo(r.created_at)
														})
													]
												}), r.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-sm text-muted-foreground",
													children: r.comment
												})]
											}, r.id);
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "entrega",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground sm:p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Como recebe: "
											}), product.auto_delivery ? "o conteúdo é entregue automaticamente no seu painel logo após a confirmação do pagamento." : "o vendedor entrega manualmente pelo chat, dentro do prazo combinado."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Pagamento: "
											}), "Pix instantâneo. O valor fica retido até a entrega ser confirmada."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Problemas? "
											}), "Fale primeiro com o vendedor pelo chat. Se não resolver, abra uma denúncia e a nossa equipa analisa o caso."] })
										]
									})
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit lg:sticky lg:top-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:max-w-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border bg-gradient-surface p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-wider text-muted-foreground",
									children: "Preço final"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-4xl font-extrabold text-primary",
									children: formatPrice(displayPrice * quantity)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: product.auto_delivery ? `${displayStock} em estoque · entrega imediata` : "Entrega manual pelo vendedor"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 sm:p-5",
							children: [
								variants.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Escolha a variação"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 grid gap-2",
										children: variants.map((v) => {
											const selected = selectedVariant?.id === v.id;
											const out = product.auto_delivery && v.stock <= 0;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: out,
												onClick: () => setVariantId(v.id),
												className: `rounded-2xl border p-3 text-left transition disabled:opacity-40 ${selected ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/40"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center justify-between gap-2 text-sm font-semibold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: `h-4 w-4 ${selected ? "text-primary" : "text-muted-foreground"}` }), v.name]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-primary",
														children: formatPrice(v.price_cents)
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-1 block text-[11px] text-muted-foreground",
													children: out ? "Esgotado" : v.description || `${v.stock} disponíveis`
												})]
											}, v.id);
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FavoriteButton, {
										productId: product.id,
										variant: "full",
										className: "h-11 flex-1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex h-11 items-center rounded-md border border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "Diminuir quantidade",
												onClick: () => setQuantity((q) => Math.max(1, q - 1)),
												disabled: quantity <= 1,
												className: "grid h-full w-10 place-items-center rounded-l-md text-lg font-bold transition hover:bg-accent disabled:opacity-40",
												children: "−"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-9 text-center text-sm font-bold tabular-nums",
												children: quantity
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "Aumentar quantidade",
												onClick: () => setQuantity((q) => Math.min(maxQty, q + 1)),
												disabled: quantity >= maxQty,
												className: "grid h-full w-10 place-items-center rounded-r-md text-lg font-bold transition hover:bg-accent disabled:opacity-40",
												children: "+"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: buy,
									disabled: buying || soldOut,
									className: "w-full bg-gradient-primary text-primary-foreground shadow-glow",
									size: "lg",
									children: [buying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, soldOut ? "Esgotado" : `Comprar agora${quantity > 1 ? ` · ${formatPrice(displayPrice * quantity)}` : ""}`]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: chat,
									variant: "outline",
									className: "mt-2 w-full gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }), " Falar com o vendedor"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-start gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }), "Entrega garantida. Se o produto não for entregue, o dinheiro volta."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-start gap-2 rounded-2xl bg-accent/60 p-3 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
										"Pagamento protegido. Escolhe o nível de proteção no checkout a partir de +",
										formatPrice(10),
										"."
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-3xl border border-border bg-card p-4 sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Vendido por"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/vendedor/$slug",
								params: { slug: product.seller?.username ?? "" },
								className: "mt-3 flex items-center gap-3 rounded-2xl border border-transparent p-1 transition-colors hover:border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
										className: "h-11 w-11",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: product.seller?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: (product.seller?.username ?? "U").slice(0, 2).toUpperCase() })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1 truncate font-semibold",
											children: [product.seller?.display_name || product.seller?.username, product.seller?.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4 shrink-0 text-primary" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: ["@", product.seller?.username]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportDialog, {
								targetType: "product",
								targetId: product.id,
								trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "mt-3 w-full gap-2 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4" }), " Denunciar anúncio"]
								})
							})
						]
					})]
				})]
			}),
			related.filter((p) => p.id !== product.id).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 font-display text-xl font-bold",
					children: "Anúncios relacionados"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
					children: related.filter((p) => p.id !== product.id).slice(0, 4).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-16 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl md:bottom-0 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "Preço final"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-display text-lg font-extrabold text-primary",
							children: formatPrice(displayPrice * quantity)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: buy,
						disabled: buying || soldOut,
						className: "ml-auto h-11 flex-1 bg-gradient-primary text-primary-foreground shadow-glow",
						children: [buying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, soldOut ? "Esgotado" : "Comprar agora"]
					})]
				})
			})
		]
	});
}
//#endregion
export { ProdutoPage as component };
