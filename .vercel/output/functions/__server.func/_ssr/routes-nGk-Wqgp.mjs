import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as ShieldCheck, H as Quote, Jt as Clock, N as Search, Nt as Flame, Qt as CircleQuestionMark, R as RefreshCw, S as Sparkles, U as QrCode, Y as Package, _ as ThumbsDown, an as Check, b as Store, g as ThumbsUp, hn as BadgeCheck, m as TrendingUp, o as Users, sn as ChartLine, t as Zap, vn as ArrowRight, x as Star } from "../_libs/lucide-react.mjs";
import { B as formatPrice, O as fetchProducts, Q as AvatarImage, X as Avatar, Z as AvatarFallback, et as Button, h as PROTECTION_TIERS, k as fetchRecentReviews, m as CategoryVisual, tt as useAuth, v as fetchCategories } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-uwqhymWC.mjs";
import { n as ProductCard } from "./product-card-CyWpl6s6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-nGk-Wqgp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function timeAgo(date) {
	const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1e3);
	for (const unit of [
		{
			label: "ano",
			seconds: 31536e3
		},
		{
			label: "mês",
			seconds: 2592e3
		},
		{
			label: "semana",
			seconds: 604800
		},
		{
			label: "dia",
			seconds: 86400
		},
		{
			label: "hora",
			seconds: 3600
		},
		{
			label: "minuto",
			seconds: 60
		}
	]) {
		const value = Math.floor(seconds / unit.seconds);
		if (value >= 1) return `há ${value} ${unit.label}${value > 1 ? "s" : ""}`;
	}
	return "agora";
}
function ReviewCard({ r }) {
	const name = r.buyer?.display_name || `@${r.buyer?.username ?? "comprador"}`;
	const stars = r.rating ?? (r.positive ? 5 : 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "relative w-[300px] shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:w-[360px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "absolute right-4 top-4 h-8 w-8 rotate-6 text-primary/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "h-10 w-10 ring-2 ring-primary/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: r.buyer?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-primary/10 text-xs font-bold text-primary",
							children: (r.buyer?.username ?? "U").slice(0, 2).toUpperCase()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-bold",
							children: name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1",
							children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3.5 w-3.5 ${i < stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}` }, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 rounded-full bg-primary/10 p-1.5 text-primary",
						children: r.positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground",
				children: [
					"“",
					r.comment || (r.positive ? "Compra tranquila, entrega rápida." : "A compra não correu como esperado."),
					"”"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-3",
				children: [r.product?.slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/produto/$slug",
					params: { slug: r.product.slug },
					className: "group/link flex min-w-0 items-center gap-2 text-xs font-medium text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate group-hover/link:underline",
						children: r.product.title
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Avaliação de compra"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-xs text-muted-foreground/80",
					children: timeAgo(r.created_at)
				})]
			})
		]
	});
}
function ReviewSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-4 overflow-hidden",
		children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "h-[180px] w-[300px] shrink-0 animate-pulse rounded-2xl border border-border/60 bg-card p-5 sm:w-[360px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 rounded-full bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-24 rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-20 rounded bg-muted" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-full rounded bg-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-full rounded bg-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-2/3 rounded bg-muted" })
				]
			})]
		}, i))
	});
}
function ReviewsCarousel() {
	const { data = [], isLoading } = useQuery({
		queryKey: ["reviews", "recent"],
		queryFn: () => fetchRecentReviews(12)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewSkeleton, {});
	const reviews = data;
	if (!reviews.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground",
		children: "Ainda não há avaliações. As primeiras compras vão aparecer aqui."
	});
	const loop = reviews.length >= 4 ? [
		...reviews,
		...reviews,
		...reviews
	] : reviews;
	const duration = Math.max(20, reviews.length * 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "group relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex w-max gap-4 animate-[review-marquee_linear_infinite] group-hover:[animation-play-state:paused]",
			style: { animationDuration: `${duration}s` },
			children: loop.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewCard, { r }, `${r.id}-${i}`))
		})
	});
}
/** Slide animado com os anúncios publicados mais recentes. */
function HeroMarquee() {
	const { data: products = [] } = useQuery({
		queryKey: ["products", "recent"],
		queryFn: () => fetchProducts({
			sort: "recentes",
			limit: 8,
			promotedFirst: true
		})
	});
	if (!products.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-64 place-items-center rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground backdrop-blur-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-8 w-8 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3",
			children: "Ainda não há anúncios publicados. Seja o primeiro a vender na Lynko!"
		})] })
	});
	const loop = [...products, ...products];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-3xl border border-border bg-card/60 p-4 backdrop-blur-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-card to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
				children: "Publicados recentemente"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "marquee-mask flex gap-3 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "animate-marquee flex shrink-0 gap-3",
					children: loop.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/produto/$slug",
						params: { slug: p.slug },
						className: "group flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-background transition hover:border-primary/50 hover:shadow-glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-28 w-full overflow-hidden bg-accent",
							children: [p.images?.[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.images[0],
								alt: p.title,
								loading: "lazy",
								className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-full w-full place-items-center text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
							}), p.auto_delivery && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3" }), " Automático"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: p.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-extrabold text-primary",
								children: formatPrice(p.price_cents)
							})]
						})]
					}, `${p.id}-${i}`))
				})
			})
		]
	});
}
var FAQ_GROUPS = [
	{
		id: "compra",
		label: "Processo de compra",
		items: [
			{
				q: "Passo a passo: como comprar na Lynko?",
				a: "1) Escolha o anúncio e a variação. 2) No checkout, selecione o nível de proteção. 3) Pague via Pix com QR Code ou copia e cola. 4) O pagamento é confirmado automaticamente. 5) A entrega aparece no chat do pedido e você acompanha cada etapa em tempo real."
			},
			{
				q: "Como funciona a entrega automática?",
				a: "Quando o anúncio tem entrega automática, o vendedor carrega o estoque (chaves, contas, códigos) na dashboard. Assim que o pagamento é confirmado, o conteúdo é enviado no chat do pedido em segundos, sem intervenção humana."
			},
			{
				q: "O meu dinheiro fica protegido?",
				a: "Sim. Todo o pagamento fica em custódia. O valor só é liberado ao vendedor depois de a entrega ser confirmada. Se algo der errado, abra uma disputa no chat e a equipe Lynko medeia."
			},
			{
				q: "Como acompanho o meu pedido?",
				a: "Cada pedido tem uma página de rastreamento com estado em tempo real, histórico de eventos e recibo detalhado das taxas cobradas."
			}
		]
	},
	{
		id: "venda",
		label: "Processo de venda",
		items: [
			{
				q: "Passo a passo: como vender na Lynko?",
				a: "1) Crie a conta e abra a dashboard. 2) Publique o anúncio com fotos, descrição e variações. 3) Carregue o estoque de entrega automática. 4) A cada venda, a Lynko entrega e credita o valor no seu saldo. 5) Peça o saque via Pix e a equipe aprova a transferência."
			},
			{
				q: "Um anúncio pode ter várias opções?",
				a: "Pode. Um anúncio pode ter variações como \"Netflix 1 dia\", \"Netflix 2 dias\" ou \"Netflix 3 dias\", cada uma com preço e estoque próprios. O comprador escolhe a variação antes de pagar."
			},
			{
				q: "Quanto custa vender na Lynko?",
				a: "Publicar é grátis. Cobramos 8% sobre o valor da venda, descontado automaticamente. O restante vai para o seu saldo e você saca por Pix na dashboard."
			},
			{
				q: "Como recebo o dinheiro das minhas vendas?",
				a: "O saldo aparece na aba Carteira da dashboard. Você pode pedir saque de qualquer valor positivo disponível com a sua chave Pix; a taxa da plataforma é descontada automaticamente e o status aparece no histórico."
			}
		]
	},
	{
		id: "verificacao",
		label: "Verificação e taxas",
		items: [
			{
				q: "Quais são os níveis de verificação?",
				a: "Há dois níveis: Básico, para contas com e-mail confirmado, e Máximo, para identidade confirmada com documento e selfie."
			},
			{
				q: "Quais dados aparecem no meu perfil público?",
				a: "Apenas o selo de conta verificada e informações não sensíveis que você informou (país, cidade, nome comercial e rede social). Foto do documento, selfie, número do documento e telefone nunca são públicos."
			},
			{
				q: "O que é o nível de proteção e por que aparece no checkout?",
				a: "É a nossa taxa de serviço. Escolha no checkout entre Proteção Básica (+R$ 0,10), Proteção Média (+R$ 0,50) ou Proteção Máxima (+R$ 2,00). O valor é fixo em centavos, independentemente do preço do produto; muda apenas a rapidez da mediação e a cobertura de reembolso."
			}
		]
	}
];
function Section({ title, subtitle, icon, children, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-7 sm:gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 text-xl font-bold sm:text-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary",
					children: icon
				}), title]
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: subtitle
			})] }), action]
		}), children]
	});
}
function Grid({ loading, items }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
		children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-2xl" }, i))
	});
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground",
		children: ["Ainda não há anúncios publicados aqui. Seja o primeiro a vender!", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "bg-gradient-primary text-primary-foreground",
					children: "Publicar anúncio"
				})
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
		children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
	});
}
var steps = [
	{
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5" }),
		t: "1. O vendedor anuncia, você escolhe",
		d: "Quem vende publica o anúncio; quem compra filtra por categoria, preço e reputação do vendedor."
	},
	{
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" }),
		t: "2. O pagamento fica com o marketplace",
		d: "A Lynko guarda o valor em custódia: o comprador paga com segurança e o vendedor só recebe depois da entrega."
	},
	{
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5" }),
		t: "3. Entrega confirmada, dinheiro liberado",
		d: "O comprador recebe o produto no painel e o valor entra no saldo do vendedor para saque via Pix."
	}
];
function Home() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [heroSearch, setHeroSearch] = (0, import_react.useState)("");
	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		staleTime: 3e5
	});
	const categories = categoriesQuery.data ?? [];
	const recent = useQuery({
		queryKey: ["products", "recent"],
		queryFn: () => fetchProducts({
			sort: "recentes",
			limit: 8,
			promotedFirst: true
		}),
		staleTime: 6e4
	});
	const promoted = useQuery({
		queryKey: ["products", "promoted"],
		queryFn: () => fetchProducts({
			sort: "vendidos",
			limit: 4,
			promotedFirst: true
		}),
		staleTime: 6e4
	});
	const mostWanted = useQuery({
		queryKey: ["products", "most-wanted"],
		queryFn: () => fetchProducts({
			sort: "vendidos",
			limit: 8
		}),
		staleTime: 6e4
	});
	const newAndHot = recent;
	const subscriptions = useQuery({
		queryKey: ["products", "subscriptions"],
		queryFn: () => fetchProducts({
			category: "assinaturas",
			sort: "vendidos",
			limit: 8
		}),
		staleTime: 6e4
	});
	const profileCtas = [
		{
			title: "Quero comprar",
			desc: "Encontre o produto, pague por Pix e receba na hora.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5" }),
			points: [
				"Entrega automática na página do pedido",
				"Pagamento em custódia até a entrega",
				"Chat direto com o vendedor"
			],
			link: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "w-full bg-gradient-primary text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/produtos",
					children: ["Ver anúncios ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
				})
			})
		},
		{
			title: "Quero vender",
			desc: "Publique grátis, venda no automático e saque por Pix.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-5 w-5" }),
			points: [
				"Variações com preço e estoque próprios",
				"Saldo na carteira a cada venda",
				"Saque de qualquer valor positivo disponível"
			],
			link: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: user ? "/dashboard" : "/auth",
					children: [
						user ? "Abrir minha dashboard" : "Criar conta de vendedor",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })
					]
				})
			})
		},
		{
			title: "Quero mais confiança",
			desc: "Escolha o nível de verificação que combina com você.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" }),
			points: ["Básico com e-mail confirmado", "Máximo com documento e selfie"],
			link: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: user ? "/verificacao" : "/auth",
					children: ["Verificação de conta ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
				})
			})
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: "LynkoMarketplace",
				url: "https://www.lynkomarketplace.online/",
				description: "Marketplace de produtos digitais com entrega automática e pagamento protegido.",
				potentialAction: {
					"@type": "SearchAction",
					target: "https://www.lynkomarketplace.online/produtos?q={search_term_string}",
					"query-input": "required name=search_term_string"
				}
			}) }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-hero opacity-80" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute left-1/2 -top-56 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "mb-6 gap-1 bg-primary/15 text-primary hover:bg-primary/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-3 w-3" }), " Compre via Pix. Receba com segurança."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "max-w-4xl font-display text-[2rem] font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl",
							children: [
								"Compre produtos digitais",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hero-shimmer-text bg-gradient-primary bg-clip-text text-transparent",
									children: "com segurança."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-2xl text-sm text-muted-foreground sm:mt-5 sm:text-lg",
							children: "Encontre produtos, compare vendedores e pague via Pix. A Lynko protege a compra e acompanha a entrega do início ao fim."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-7 flex max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-card sm:flex-row",
							onSubmit: (event) => {
								event.preventDefault();
								navigate({
									to: "/produtos",
									search: {
										q: heroSearch,
										cat: "todas",
										sort: "recentes"
									}
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 flex-1 items-center gap-2 px-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: heroSearch,
									onChange: (event) => setHeroSearch(event.target.value),
									placeholder: "Procure por jogos, gift cards, IA, software, serviços...",
									"aria-label": "O que você está procurando?",
									className: "h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "lg",
								className: "gap-2 bg-gradient-primary text-primary-foreground",
								children: ["Buscar ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-7 grid gap-3 sm:flex sm:flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/produtos",
								search: {
									q: "",
									cat: "todas",
									sort: "recentes"
								},
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									className: "w-full gap-2 bg-gradient-primary text-primary-foreground shadow-glow sm:w-auto",
									children: ["Explorar ofertas ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									variant: "outline",
									className: "w-full gap-2 sm:w-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }), " Começar a vender"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-9 grid max-w-2xl grid-cols-3 gap-3 sm:mt-12 sm:gap-4",
							children: [
								{
									v: "Pix",
									l: "Pagamento simples"
								},
								{
									v: "100%",
									l: "Compra acompanhada"
								},
								{
									v: "24/7",
									l: "Entrega automática"
								}
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-extrabold text-primary sm:text-3xl",
								children: s.v
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: s.l
							})] }, s.l))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative hidden lg:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -inset-8 rounded-[3rem] bg-primary/10 blur-3xl",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative overflow-hidden rounded-[2rem] border border-border bg-card/80 p-5 shadow-glow backdrop-blur-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
										children: "Experiência Lynko"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-lg font-bold",
										children: "Uma compra sem incerteza"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-5 grid gap-3",
									children: [
										[
											"01",
											"Escolha com contexto",
											"Filtros, reputação e avaliações em um só lugar."
										],
										[
											"02",
											"Pague protegido",
											"O valor fica em custódia até a entrega."
										],
										[
											"03",
											"Receba no ritmo certo",
											"Entrega automática ou acompanhamento pelo chat."
										]
									].map(([number, title, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3 rounded-2xl border border-border/70 bg-background/70 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-primary",
											children: number
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-bold",
											children: title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs leading-relaxed text-muted-foreground",
											children: text
										})] })]
									}, number))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center gap-2 rounded-2xl bg-primary/10 p-3 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary" }), " Suporte humano quando você precisar."]
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative border-t border-border/60 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroMarquee, {})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border bg-card/60",
			"aria-label": "Por que comprar na Lynko",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					[QrCode, "Pagamento via Pix"],
					[ShieldCheck, "Compra protegida"],
					[BadgeCheck, "Vendedores avaliados"],
					[Zap, "Entrega rápida"],
					[Users, "Suporte da Lynko"]
				].map(([Icon, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					}), label]
				}, label))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Categorias do marketplace",
			subtitle: "Escolha uma categoria para comprar ou para descobrir onde anunciar o seu produto.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
				children: categoriesQuery.isLoading ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 rounded-2xl" }, i)) : categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/produtos",
					search: {
						q: "",
						cat: c.slug,
						sort: "recentes"
					},
					className: "group overflow-hidden rounded-2xl border border-border bg-card text-center text-sm font-medium transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow",
					children: [c.display_mode === "image" && c.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block aspect-[4/3] w-full overflow-hidden bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryVisual, {
							category: c,
							imageClassName: "h-full w-full object-cover transition duration-300 group-hover:scale-105"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-auto mt-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryVisual, {
							category: c,
							className: "h-5 w-5"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: c.name
						}), c.product_count ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-xs text-muted-foreground",
							children: [
								c.product_count,
								" ",
								c.product_count === 1 ? "produto" : "produtos"
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-[11px] leading-tight text-muted-foreground",
							children: "Seja o primeiro vendedor"
						})]
					})]
				}, c.slug))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 py-4 sm:py-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/[0.06] p-6 sm:p-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "mb-4 gap-1 bg-primary text-primary-foreground hover:bg-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " Programa Lynko Founders"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "max-w-2xl text-2xl font-extrabold sm:text-4xl",
							children: "Seja um dos primeiros vendedores da Lynko."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base",
							children: "Estamos abrindo espaço para quem quer construir sua loja desde o começo. Publique gratuitamente, ganhe destaque inicial e ajude a formar o marketplace brasileiro de produtos digitais."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground",
							children: [
								"Publicação gratuita",
								"Destaque inicial",
								"Selo Vendedor Fundador"
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-border bg-background/70 px-3 py-1.5",
								children: item
							}, item))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: user ? "/dashboard" : "/auth",
							className: "mt-7 inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								className: "gap-2 bg-gradient-primary text-primary-foreground shadow-glow",
								children: [
									user ? "Abrir minha loja" : "Começar a vender",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
								]
							})
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/80 p-5 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground",
							children: "O que vem primeiro"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-3",
							children: [
								"Publique seu produto",
								"Construa sua reputação",
								"Venda e receba via Pix"
							].map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-xl bg-background/70 p-3 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-7 w-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground",
									children: index + 1
								}), item]
							}, item))
						})]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Em Destaque",
			subtitle: "Seleção especial de produtos impulsionados e bem avaliados.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4" }),
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/produtos",
				search: {
					q: "",
					cat: "todas",
					sort: "vendidos"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "gap-1 text-sm",
					children: ["Ver todos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
				loading: promoted.isLoading,
				items: promoted.data ?? []
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Mais Procurados da Semana",
			subtitle: "Os anúncios com maior procura e mais vendas na plataforma.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/produtos",
				search: {
					q: "",
					cat: "todas",
					sort: "vendidos"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "gap-1 text-sm",
					children: ["Ver mais ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
				loading: mostWanted.isLoading,
				items: mostWanted.data ?? []
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Novos & Bombando",
			subtitle: "Produtos recém-publicados que já estão chamando atenção.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
				loading: newAndHot.isLoading,
				items: newAndHot.data ?? []
			})
		}),
		!!subscriptions.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Assinaturas",
			subtitle: "Planos e acessos recorrentes para você encontrar tudo em um só lugar.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }),
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/produtos",
				search: {
					q: "",
					cat: "assinaturas",
					sort: "vendidos"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "gap-1 text-sm",
					children: ["Ver assinaturas ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
				loading: subscriptions.isLoading,
				items: subscriptions.data ?? []
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Anúncios publicados recentemente",
			subtitle: "Os últimos produtos colocados à venda pelos vendedores.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/produtos",
				search: {
					q: "",
					cat: "todas",
					sort: "recentes"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "gap-1 text-sm",
					children: ["Ver todos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
				loading: recent.isLoading,
				items: recent.data ?? []
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Como funciona o LynkoMarketplace",
			subtitle: "Conectamos quem compra e quem vende a negociação é entre vocês, a proteção é nossa.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative rounded-2xl border border-border bg-card p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-5 top-5 text-4xl font-black text-primary/10",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary",
							children: s.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base font-bold",
							children: s.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: s.d
						})
					]
				}, s.t))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Taxa de serviço justa",
			subtitle: "Taxa fixa em centavos, igual para qualquer valor de compra. Somos justos em todos os níveis.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: PROTECTION_TIERS.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `relative rounded-2xl border bg-card p-6 transition hover:-translate-y-0.5 ${i === 1 ? "border-primary/60 shadow-glow" : "border-border"}`,
					children: [
						i === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "absolute -top-3 left-6 bg-gradient-primary text-primary-foreground",
							children: "Mais escolhida"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: t.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-3xl font-extrabold text-primary",
							children: [
								"+",
								formatPrice(t.feeCents),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-xs font-medium text-muted-foreground",
									children: "por compra"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: t.tagline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 grid gap-2 text-sm",
							children: t.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: b
								})]
							}, b))
						})
					]
				}, t.id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-10 sm:py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-extrabold sm:text-3xl",
					children: "Avaliações recentes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "O que os compradores estão dizendo agora mesmo na Lynko."
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsCarousel, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 pb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-hero opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "mb-4 gap-1 bg-primary/15 text-primary hover:bg-primary/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-3 w-3" }), " Para vendedores"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-extrabold sm:text-4xl",
							children: "Venda 24 horas por dia, mesmo dormindo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl text-sm text-muted-foreground sm:text-base",
							children: "Cadastre o estoque de chaves uma vez e a Lynko entrega automaticamente a cada venda. Acompanhe saldo, avaliações e seguidores no painel e saque via Pix quando quiser."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid gap-3 sm:flex sm:flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									className: "w-full gap-2 bg-gradient-primary text-primary-foreground shadow-glow sm:w-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }), " Abrir minha loja"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/vendedores",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									variant: "outline",
									className: "w-full gap-2 sm:w-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Ver vendedores"]
								})
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3",
						children: [
							"Estoque automático de chaves e contas",
							"Anúncios impulsionados aparecem em primeiro",
							"Perfil com banner, seguidores e avaliações",
							"Saque via Pix direto no painel"
						].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 shrink-0 text-primary" }), b]
						}, b))
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Qual é o seu perfil?",
			subtitle: "Somos o marketplace no meio: cada lado tem um caminho pronto para começar.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: profileCtas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col rounded-2xl border border-border bg-card p-5 sm:p-6 transition hover:-translate-y-0.5 hover:border-primary/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary",
							children: c.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base font-bold",
							children: c.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 flex-1 text-sm text-muted-foreground",
							children: c.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 grid gap-2 text-sm text-muted-foreground",
							children: c.points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
									" ",
									p
								]
							}, p))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: c.link
						})
					]
				}, c.title))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "FAQ do processo",
			subtitle: "Passo a passo de compra, de venda e das verificações sem letras miúdas.",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-3xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: FAQ_GROUPS[0].id,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
						className: "flex w-full flex-wrap justify-start gap-1 h-auto",
						children: FAQ_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: g.id,
							children: g.label
						}, g.id))
					}), FAQ_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: g.id,
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
							type: "single",
							collapsible: true,
							className: "w-full",
							children: g.items.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: `${g.id}-${i}`,
								className: "border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
									className: "text-left text-sm font-semibold hover:no-underline",
									children: f.q
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
									className: "text-sm leading-relaxed text-muted-foreground",
									children: f.a
								})]
							}, f.q))
						})
					}, g.id))]
				})
			})
		})
	] });
}
//#endregion
export { Home as component };
