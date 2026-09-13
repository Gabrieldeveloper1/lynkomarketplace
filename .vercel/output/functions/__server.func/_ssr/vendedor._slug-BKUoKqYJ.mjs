import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as stringType } from "../_libs/zod.mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as MessageSquare, D as ShieldCheck, Pt as Flag, Xt as Circle, Y as Package, _ as ThumbsDown, at as MapPin, c as UserPlus, dt as LoaderCircle, ft as Link, g as ThumbsUp, hn as BadgeCheck, l as UserCheck, ln as CalendarDays, o as Users, t as Zap, un as Building2, x as Star } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as fetchSellerByUsername, H as timeAgo, I as ratingOf, O as fetchProducts, Q as AvatarImage, X as Avatar, Z as AvatarFallback, et as Button, i as Route$6, j as fetchSellerReviews, tt as useAuth, x as fetchFollowerCount } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as ReportDialog, r as openConversation } from "./chat-panel-CZpycPMC.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { t as StarRating } from "./star-rating-Qt0Vbggm.mjs";
import { n as ProductCard } from "./product-card-CyWpl6s6.mjs";
import { n as publicVerificationLabel, t as SellerBadges } from "./seller-badges-BVdOl_T1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendedor._slug-BKUoKqYJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SOCIAL_NETWORKS = [
	{
		id: "instagram",
		label: "Instagram",
		domains: ["instagram.com", "instagr.am"],
		placeholder: "https://instagram.com/sualoja"
	},
	{
		id: "tiktok",
		label: "TikTok",
		domains: ["tiktok.com"],
		placeholder: "https://tiktok.com/@sualoja"
	},
	{
		id: "x",
		label: "X (Twitter)",
		domains: ["x.com", "twitter.com"],
		placeholder: "https://x.com/sualoja"
	},
	{
		id: "youtube",
		label: "YouTube",
		domains: ["youtube.com", "youtu.be"],
		placeholder: "https://youtube.com/@sualoja"
	},
	{
		id: "facebook",
		label: "Facebook",
		domains: ["facebook.com", "fb.com"],
		placeholder: "https://facebook.com/sualoja"
	},
	{
		id: "telegram",
		label: "Telegram",
		domains: ["t.me", "telegram.me"],
		placeholder: "https://t.me/sualoja"
	},
	{
		id: "discord",
		label: "Discord",
		domains: ["discord.gg", "discord.com"],
		placeholder: "https://discord.gg/suacomunidade"
	},
	{
		id: "linkedin",
		label: "LinkedIn",
		domains: ["linkedin.com"],
		placeholder: "https://linkedin.com/company/sualoja"
	}
];
function networkOf(id) {
	return SOCIAL_NETWORKS.find((n) => n.id === id) ?? null;
}
stringType().trim().min(5).max(200).refine((v) => /^https?:\/\//i.test(v) || /^[\w.-]+\.[a-z]{2,}/i.test(v), { message: "Endereço inválido." });
function SellerPage() {
	const { slug } = Route$6.useParams();
	const navigate = useNavigate();
	const { user, profile, loading: authLoading } = useAuth();
	const qc = useQueryClient();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [presenceOnline, setPresenceOnline] = (0, import_react.useState)(false);
	const { data: seller, isLoading, isError } = useQuery({
		queryKey: ["seller", slug],
		queryFn: () => fetchSellerByUsername(slug),
		enabled: !authLoading,
		refetchOnMount: "always",
		refetchInterval: 15e3,
		staleTime: 1e4,
		retry: 2
	});
	(0, import_react.useEffect)(() => {
		if (!seller?.id) return;
		if (seller.id === user?.id) {
			setPresenceOnline(true);
			return;
		}
		const channel = supabase.channel(`seller-presence:${seller.id}`, { config: { presence: { key: seller.id } } }).on("presence", { event: "sync" }, () => {
			setPresenceOnline(Object.keys(channel.presenceState()).length > 0);
		}).on("presence", { event: "join" }, () => setPresenceOnline(true)).on("presence", { event: "leave" }, () => {
			setPresenceOnline(Object.keys(channel.presenceState()).length > 0);
		});
		channel.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [seller?.id, user?.id]);
	const { data: products = [] } = useQuery({
		queryKey: ["seller-products", seller?.id],
		queryFn: () => fetchProducts({
			sellerId: seller.id,
			limit: 60
		}),
		enabled: !!seller,
		retry: 1
	});
	const { data: reviews = [] } = useQuery({
		queryKey: ["seller-reviews", seller?.id],
		queryFn: () => fetchSellerReviews(seller.id),
		enabled: !!seller
	});
	const { data: followers = 0 } = useQuery({
		queryKey: ["followers", seller?.id],
		queryFn: () => fetchFollowerCount(seller.id),
		enabled: !!seller
	});
	const { data: isFollowing = false } = useQuery({
		queryKey: [
			"following",
			seller?.id,
			user?.id
		],
		queryFn: async () => {
			const { data } = await supabase.from("follows").select("seller_id").eq("seller_id", seller.id).eq("follower_id", user.id).maybeSingle();
			return !!data;
		},
		enabled: !!seller && !!user && seller.id !== user.id
	});
	if (authLoading || isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-2xl" })
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Não foi possível carregar este perfil"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Atualize a página para tentar novamente."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-5",
				onClick: () => window.location.reload(),
				children: "Tentar novamente"
			})
		]
	});
	if (!seller) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl px-4 py-20 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Vendedor não encontrado"
		})
	});
	if (seller.banned) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Este perfil está banido por tempo indeterminado"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "Este vendedor não está disponível na área pública do marketplace."
		})]
	});
	const sellerUsername = seller.username?.trim() || slug;
	const sellerCreatedAt = seller.created_at || (/* @__PURE__ */ new Date()).toISOString();
	const rating = ratingOf(reviews);
	const positiveReviews = reviews.filter((review) => review.positive).length;
	const negativeReviews = reviews.filter((review) => !review.positive).length;
	const lastSeen = seller.last_seen_at ? new Date(seller.last_seen_at) : null;
	const lastSeenMs = lastSeen?.getTime() ?? NaN;
	const online = user?.id === seller.id || presenceOnline || Number.isFinite(lastSeenMs) && Date.now() - lastSeenMs < 3e5;
	const toggleFollow = async () => {
		if (!user) return navigate({
			to: "/auth",
			search: { redirect: `/vendedor/${slug}` }
		});
		if (user.id === seller.id) return toast.info("Não pode seguir a sua própria loja.");
		setBusy("follow");
		try {
			if (isFollowing) {
				const { error } = await supabase.from("follows").delete().eq("seller_id", seller.id).eq("follower_id", user.id);
				if (error) throw error;
				toast.success("Deixou de seguir esta loja.");
			} else {
				const add = () => supabase.from("follows").insert({
					seller_id: seller.id,
					follower_id: user.id
				});
				let { error } = await add();
				if (error?.code === "23503") {
					const { ensureMyProfile } = await import("../_libs/_.mjs").then((n) => n.n);
					await ensureMyProfile();
					({error} = await add());
				}
				if (error && error.code !== "23505") throw error;
				toast.success("Agora segue esta loja.");
			}
			await Promise.all([qc.invalidateQueries({ queryKey: [
				"following",
				seller.id,
				user.id
			] }), qc.invalidateQueries({ queryKey: ["followers", seller.id] })]);
		} catch (e) {
			console.error("[perfil] seguir falhou", {
				sellerId: seller.id,
				userId: user.id,
				error: e
			});
			toast.error(e instanceof Error && e.message ? `Não foi possível atualizar o seguimento: ${e.message}` : "Não foi possível atualizar o seguimento.");
		} finally {
			setBusy(null);
		}
	};
	const chat = async () => {
		if (!user) return navigate({
			to: "/auth",
			search: { redirect: `/vendedor/${slug}` }
		});
		if (user.id === seller.id) return toast.info("Este é o seu perfil.");
		setBusy("chat");
		try {
			const id = await openConversation({
				buyerId: user.id,
				sellerId: seller.id
			});
			navigate({
				to: "/mensagens",
				search: { c: id }
			});
		} catch (e) {
			console.error("[perfil] abrir conversa falhou", {
				sellerId: seller.id,
				userId: user.id,
				error: e
			});
			toast.error(e instanceof Error && e.message ? `Não foi possível abrir a conversa: ${e.message}` : "Não foi possível abrir a conversa.");
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-40 w-full overflow-hidden bg-gradient-hero sm:h-64",
			children: [seller.banner_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: seller.banner_url,
				alt: "",
				className: "h-full w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 -mt-12 rounded-3xl border border-border bg-card p-4 shadow-card sm:-mt-16 sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-5 sm:flex-row sm:items-start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "h-24 w-24 shrink-0 border-4 border-background ring-2 ring-primary/25 sm:h-28 sm:w-28",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: seller.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "text-2xl",
									children: sellerUsername.slice(0, 2).toUpperCase()
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "flex min-w-0 flex-wrap items-center gap-2 font-display text-2xl font-extrabold text-foreground sm:text-3xl",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "break-words",
											children: seller.display_name?.trim() || sellerUsername
										}), seller.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-5 w-5 shrink-0 text-primary" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground",
										children: ["@", sellerUsername]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `mt-2 inline-flex items-center gap-1.5 text-xs font-semibold ${online ? "text-emerald-500" : "text-muted-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: `h-2.5 w-2.5 fill-current ${online ? "" : "opacity-50"}` }), online ? "Online agora" : lastSeen ? `Offline ${timeAgo(seller.last_seen_at)}` : "Offline"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap items-center gap-2",
										children: [
											seller.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												className: "gap-1 bg-gradient-primary text-primary-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }),
													" ",
													publicVerificationLabel(seller.verified)
												]
											}),
											(seller.verif_city || seller.verif_country) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												className: "gap-1 text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }), [seller.verif_city, seller.verif_country].filter(Boolean).join(", ")]
											}),
											seller.verif_business && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												className: "gap-1 text-[11px]",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }),
													" ",
													seller.verif_business
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: "gap-1 text-[11px]",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3 w-3" }),
													" No site ",
													timeAgo(sellerCreatedAt)
												]
											}),
											seller.verif_social && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: seller.verif_social,
												target: "_blank",
												rel: "noopener noreferrer nofollow",
												className: "inline-flex items-center gap-1 text-[11px] text-primary underline",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														className: "h-3 w-3",
														"aria-hidden": true
													}),
													" ",
													networkOf(seller.verif_social_network)?.label ?? "Rede social"
												]
											})
										]
									}),
									seller.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground",
										children: seller.bio
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SellerBadges, {
											profile: seller,
											reviewCount: reviews.length,
											positiveReviews,
											hasAutomaticDelivery: products.some((product) => product.auto_delivery)
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 sm:flex-col sm:items-stretch",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: toggleFollow,
										disabled: busy === "follow",
										variant: isFollowing ? "secondary" : "default",
										className: "gap-2",
										children: [busy === "follow" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : isFollowing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), busy === "follow" ? "A processar…" : isFollowing ? "A seguir" : "Seguir"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: chat,
										disabled: busy === "chat",
										variant: "outline",
										className: "gap-2",
										children: [busy === "chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }), busy === "chat" ? "A abrir…" : "Mensagem"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportDialog, {
										targetType: "user",
										targetId: seller.id,
										trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											className: "gap-2 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4" }), " Denunciar"]
										})
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Seguidores",
								value: String(followers),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Anúncios",
								value: String(products.length),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Avaliações",
								value: String(reviews.length),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Reputação",
								value: rating === null ? "" : `${rating}%`,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-4 w-4" }),
								highlight: rating !== null && rating >= 80
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-extrabold text-emerald-500",
								children: positiveReviews
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Positivas"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-extrabold text-muted-foreground",
								children: "0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Neutras"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-extrabold text-destructive",
								children: negativeReviews
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Negativas"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-3",
					children: [
						{
							icon: ShieldCheck,
							title: "Pagamento protegido",
							text: "Valor retido até a entrega"
						},
						{
							icon: Zap,
							title: "Entrega automática",
							text: "Nos anúncios marcados com o raio"
						},
						{
							icon: MessageSquare,
							title: "Fale antes de comprar",
							text: "Chat direto com o vendedor"
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "anuncios",
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "anuncios",
								children: "Anúncios"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "avaliacoes",
								children: "Avaliações"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "linha",
								children: "Linha do tempo"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "anuncios",
							className: "mt-6",
							children: products.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
								children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Este vendedor ainda não publicou anúncios."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "avaliacoes",
							className: "mt-6",
							children: reviews.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3",
								children: reviews.map((r) => {
									const buyer = r.buyer;
									const name = buyer?.display_name || buyer?.username || "Cliente";
									const stars = r.rating;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card p-4",
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
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Sem avaliações ainda."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "linha",
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SellerTimeline, {
								createdAt: sellerCreatedAt,
								verifiedAt: seller.verified_at,
								products: products.map((p) => ({
									id: p.id,
									title: p.title,
									created_at: p.created_at
								})),
								reviews: reviews.map((r) => ({
									id: r.id,
									positive: r.positive,
									created_at: r.created_at
								}))
							})
						})
					]
				})
			]
		})]
	});
}
function SellerTimeline({ createdAt, verifiedAt, products, reviews }) {
	const events = [
		{
			id: "joined",
			at: createdAt,
			title: "Entrou no LynkoMarketplace",
			tone: "neutral"
		},
		...verifiedAt ? [{
			id: "verified",
			at: verifiedAt,
			title: `Identidade verificada — ${publicVerificationLabel(true)}`,
			tone: "good"
		}] : [],
		...products.slice(0, 12).map((p) => ({
			id: `p-${p.id}`,
			at: p.created_at,
			title: "Publicou um anúncio",
			detail: p.title,
			tone: "neutral"
		})),
		...reviews.slice(0, 12).map((r) => ({
			id: `r-${r.id}`,
			at: r.created_at,
			title: r.positive ? "Recebeu avaliação positiva" : "Recebeu avaliação negativa",
			tone: r.positive ? "good" : "bad"
		}))
	].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "relative max-w-2xl border-l border-border pl-6",
		children: events.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "relative pb-6 last:pb-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `absolute -left-[1.9rem] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-background ${ev.tone === "good" ? "bg-emerald-500" : ev.tone === "bad" ? "bg-destructive" : "bg-muted-foreground"}`,
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: ev.title
				}),
				ev.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: ev.detail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-muted-foreground",
					children: [
						new Date(ev.at).toLocaleDateString("pt-BR", {
							day: "2-digit",
							month: "long",
							year: "numeric"
						}),
						" ",
						"· ",
						timeAgo(ev.at)
					]
				})
			]
		}, ev.id))
	});
}
function Stat({ label, value, icon, highlight = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-secondary/40 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs text-muted-foreground",
			children: [
				icon,
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1 text-xl font-extrabold ${highlight ? "text-primary" : ""}`,
			children: value
		})]
	});
}
//#endregion
export { SellerPage as component };
