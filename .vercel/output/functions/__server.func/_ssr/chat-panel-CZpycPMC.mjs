import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { d as markConversationRead, g as respondModeration, m as requestModeration, t as cancelModeration, u as joinConversationAsModerator } from "./commerce.functions-BTItmHS8.mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as ShieldCheck, I as RotateCcw, L as Reply, M as Send, O as ShieldAlert, Pt as Flag, an as Check, bn as ArrowDown, dt as LoaderCircle, en as CircleAlert, et as MessagesSquare, on as CheckCheck, r as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { G as DialogDescription, J as DialogTitle, K as DialogFooter, Q as AvatarImage, U as Dialog, W as DialogContent, X as Avatar, Y as DialogTrigger, Z as AvatarFallback, et as Button, q as DialogHeader, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-panel-CZpycPMC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REASONS = [
	"Fraude ou golpe",
	"Produto falso ou não entregue",
	"Conteúdo proibido",
	"Assédio ou linguagem ofensiva",
	"Spam / publicidade",
	"Outro motivo"
];
function ReportDialog({ targetType, targetId, trigger }) {
	const { user } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [reason, setReason] = (0, import_react.useState)(REASONS[0]);
	const [details, setDetails] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async () => {
		if (!user) return toast.error("Precisa de iniciar sessão para denunciar.");
		setBusy(true);
		const { error } = await supabase.from("reports").insert({
			reporter_id: user.id,
			target_type: targetType,
			target_id: targetId,
			reason,
			details
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Denúncia enviada para a moderação.");
		setOpen(false);
		setDetails("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Denunciar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "A nossa equipe de moderação analisa todas as denúncias em até 24h." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Motivo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: reason,
						onValueChange: setReason,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: r
						}, r)) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "report-details",
						children: "Detalhes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "report-details",
						value: details,
						onChange: (e) => setDetails(e.target.value),
						rows: 4,
						maxLength: 1e3,
						placeholder: "Descreva o que aconteceu..."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setOpen(false),
				children: "Cancelar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				disabled: busy,
				className: "bg-gradient-primary text-primary-foreground",
				children: "Enviar denúncia"
			})] })
		] })]
	});
}
async function openConversation(params) {
	let existingQuery = supabase.from("conversations").select("id").or(`and(buyer_id.eq.${params.buyerId},seller_id.eq.${params.sellerId}),and(buyer_id.eq.${params.sellerId},seller_id.eq.${params.buyerId})`);
	existingQuery = params.productId ? existingQuery.eq("product_id", params.productId) : existingQuery.is("product_id", null);
	const { data: existing } = await existingQuery.order("last_message_at", { ascending: false }).limit(1);
	if (existing && existing.length > 0) return existing[0].id;
	const insert = () => supabase.from("conversations").insert({
		buyer_id: params.buyerId,
		seller_id: params.sellerId,
		product_id: params.productId ?? null
	}).select("id").single();
	let { data, error } = await insert();
	if (error?.code === "23503") {
		const { ensureMyProfile } = await import("../_libs/_.mjs").then((n) => n.n);
		await ensureMyProfile();
		({data, error} = await insert());
	}
	if (error) throw error;
	return data.id;
}
var DAY = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "long"
});
var HOUR = new Intl.DateTimeFormat("pt-BR", {
	hour: "2-digit",
	minute: "2-digit"
});
function dayLabel(iso) {
	const d = new Date(iso);
	const today = /* @__PURE__ */ new Date();
	const yesterday = /* @__PURE__ */ new Date(Date.now() - 864e5);
	const same = (a, b) => a.toDateString() === b.toDateString();
	if (same(d, today)) return "Hoje";
	if (same(d, yesterday)) return "Ontem";
	return DAY.format(d);
}
function ChatPanel({ conversationId, moderatorMode = false }) {
	const { user, isStaff, profile } = useAuth();
	const qc = useQueryClient();
	const [text, setText] = (0, import_react.useState)("");
	const [replyTo, setReplyTo] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)([]);
	const [atBottom, setAtBottom] = (0, import_react.useState)(true);
	const [moderationOpen, setModerationOpen] = (0, import_react.useState)(false);
	const [moderationProductId, setModerationProductId] = (0, import_react.useState)("");
	const [moderationReason, setModerationReason] = (0, import_react.useState)("");
	const scrollRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const { data: conversation } = useQuery({
		queryKey: ["conversation", conversationId],
		queryFn: async () => {
			const { data, error } = await supabase.from("conversations").select("*, buyer:profiles!conversations_buyer_id_fkey(username, display_name, avatar_url, verified), seller:profiles!conversations_seller_id_fkey(username, display_name, avatar_url, verified)").eq("id", conversationId).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const { data: messages = [], isLoading, isError, error, refetch, isRefetching } = useQuery({
		queryKey: ["messages", conversationId],
		queryFn: async () => {
			const { data, error: e } = await supabase.from("messages").select("*").eq("conversation_id", conversationId).order("created_at");
			if (e) throw e;
			return data;
		},
		retry: 2
	});
	const byId = (0, import_react.useMemo)(() => new Map(messages.map((m) => [m.id, m])), [messages]);
	const other = conversation?.buyer_id === user?.id ? conversation?.seller : conversation?.buyer;
	const otherName = other?.display_name || `@${other?.username ?? "usuário"}`;
	const { data: purchasedProducts = [], isLoading: purchasedProductsLoading } = useQuery({
		queryKey: [
			"moderation-products",
			user?.id,
			conversation?.seller_id
		],
		enabled: !!user && !!conversation?.seller_id && conversation.buyer_id === user.id,
		queryFn: async () => {
			const { data: orders, error } = await supabase.from("orders").select("product_id, products:products!orders_product_id_fkey(id, title)").eq("buyer_id", user.id).eq("seller_id", conversation.seller_id).in("status", [
				"paid",
				"delivered",
				"disputed"
			]);
			if (error) throw error;
			return (orders ?? []).map((order) => {
				const product = Array.isArray(order.products) ? order.products[0] : order.products;
				return {
					id: order.product_id,
					title: product?.title ?? "Produto comprado"
				};
			});
		}
	});
	(0, import_react.useEffect)(() => {
		if (pending.length === 0) return;
		const bodies = new Set(messages.filter((m) => m.sender_id === user?.id).map((m) => m.body));
		setPending((prev) => prev.filter((p) => p.failed || !bodies.has(p.body)));
	}, [messages]);
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(`chat-${conversationId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "messages",
			filter: `conversation_id=eq.${conversationId}`
		}, () => void qc.invalidateQueries({ queryKey: ["messages", conversationId] })).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "conversations",
			filter: `id=eq.${conversationId}`
		}, () => void qc.invalidateQueries({ queryKey: ["conversation", conversationId] })).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [conversationId, qc]);
	(0, import_react.useEffect)(() => {
		if (!user || isLoading || isError) return;
		const readAt = (/* @__PURE__ */ new Date()).toISOString();
		qc.setQueriesData({ queryKey: ["conversation-previews", user.id] }, (current) => {
			if (!Array.isArray(current)) return current;
			return current.map((message) => message?.conversation_id === conversationId && message?.sender_id !== user.id ? {
				...message,
				read_at: message.read_at ?? readAt
			} : message);
		});
		markConversationRead({ data: { conversationId } }).then(() => {
			qc.setQueryData(["messages", conversationId], (current) => current?.map((message) => message.sender_id !== user.id && !message.read_at ? {
				...message,
				read_at: readAt
			} : message));
			qc.invalidateQueries({ queryKey: ["conversation-previews"] });
		}).catch((error) => console.error("[chat] não foi possível persistir leitura", error));
	}, [
		conversationId,
		isError,
		isLoading,
		messages.length,
		qc,
		user
	]);
	const scrollToBottom = (0, import_react.useCallback)((smooth = true) => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollTo({
			top: el.scrollHeight,
			behavior: smooth ? "smooth" : "auto"
		});
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		if (atBottom) scrollToBottom(false);
	}, [
		messages.length,
		pending.length,
		conversationId
	]);
	const onScroll = () => {
		const el = scrollRef.current;
		if (!el) return;
		setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
	};
	const doSend = (0, import_react.useCallback)(async (body, replyToId) => {
		if (moderatorMode) {
			await joinConversationAsModerator({ data: {
				conversationId,
				message: body
			} });
			return;
		}
		const { error: e } = await supabase.from("messages").insert({
			conversation_id: conversationId,
			sender_id: user.id,
			body,
			reply_to_id: replyToId
		});
		if (e) throw e;
		await supabase.from("conversations").update({ last_message_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", conversationId);
	}, [
		conversationId,
		moderatorMode,
		user
	]);
	const send = useMutation({
		mutationFn: async (p) => {
			await doSend(p.body, p.replyToId);
			return p.tempId;
		},
		onSuccess: (tempId) => {
			setPending((prev) => prev.filter((p) => p.tempId !== tempId));
			qc.invalidateQueries({ queryKey: ["messages", conversationId] });
			qc.invalidateQueries({ queryKey: ["conversations"] });
		},
		onError: (_e, p) => {
			setPending((prev) => prev.map((x) => x.tempId === p.tempId ? {
				...x,
				failed: true
			} : x));
			toast.error("Não foi possível enviar. Toque em tentar novamente.");
		}
	});
	const submit = () => {
		const body = text.trim();
		if (!body || !user) return;
		const p = {
			tempId: `t-${Date.now()}-${Math.random().toString(16).slice(2)}`,
			body,
			replyToId: replyTo?.id ?? null,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			failed: false
		};
		setPending((prev) => [...prev, p]);
		setText("");
		setReplyTo(null);
		setAtBottom(true);
		send.mutate(p);
		inputRef.current?.focus();
	};
	const retry = (p) => {
		setPending((prev) => prev.map((x) => x.tempId === p.tempId ? {
			...x,
			failed: false
		} : x));
		send.mutate({
			...p,
			failed: false
		});
	};
	const modStatus = conversation?.moderation_status ?? (conversation?.moderation_requested ? "requested" : "none");
	const isModerationRequester = !!user && !!conversation?.moderation_requested_by && conversation.moderation_requested_by === user.id;
	const refreshMod = () => {
		qc.invalidateQueries({ queryKey: ["messages", conversationId] });
		qc.invalidateQueries({ queryKey: ["conversation", conversationId] });
		qc.invalidateQueries({ queryKey: ["conversations"] });
		qc.invalidateQueries({ queryKey: ["admin-data"] });
	};
	const cancelModerator = useMutation({
		mutationFn: () => cancelModeration({ data: { conversationId } }),
		onSuccess: () => {
			toast.success("Pedido de mediação cancelado.");
			refreshMod();
		},
		onError: (e) => toast.error(e.message)
	});
	const decide = useMutation({
		mutationFn: (decision) => respondModeration({ data: {
			conversationId,
			decision
		} }),
		onSuccess: (_r, decision) => {
			toast.success(decision === "accept" ? "Mediação aceita." : "Mediação recusada.");
			refreshMod();
		},
		onError: (e) => toast.error(e.message)
	});
	const callModerator = useMutation({
		mutationFn: (input) => requestModeration({ data: {
			conversationId,
			...input
		} }),
		onSuccess: () => {
			toast.success("Mediação aberta. Um administrador analisará o caso em até 24 horas.");
			qc.invalidateQueries({ queryKey: ["messages", conversationId] });
			qc.invalidateQueries({ queryKey: ["conversation", conversationId] });
		},
		onError: (e) => toast.error(e.message)
	});
	const submitModeration = () => {
		const reason = moderationReason.trim();
		if (!moderationProductId) return toast.error("Selecione qual produto você quer reclamar.");
		if (reason.length < 10) return toast.error("Informe um motivo com pelo menos 10 caracteres.");
		callModerator.mutate({
			productId: moderationProductId,
			reason
		}, { onSuccess: () => {
			setModerationOpen(false);
			setModerationReason("");
		} });
	};
	const banned = !!profile?.banned;
	const groups = (0, import_react.useMemo)(() => {
		const out = [];
		for (const m of messages) {
			const d = dayLabel(m.created_at);
			const last = out[out.length - 1];
			if (last && last.day === d) last.items.push(m);
			else out.push({
				day: d,
				items: [m]
			});
		}
		return out;
	}, [messages]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[70vh] min-h-[420px] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card lg:h-[640px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-gradient-hero px-3 py-3 sm:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "h-10 w-10 shrink-0 ring-2 ring-primary/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: other?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: (other?.username ?? "U").slice(0, 2).toUpperCase() })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1 truncate text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: otherName
							}), other?.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0 text-primary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] text-muted-foreground",
							children: "Conversa protegida · mediação Lynko disponível"
						})]
					}),
					modStatus === "accepted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "shrink-0 gap-1 text-[10px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Reembolso aprovado pela Efí"
							})
						]
					}) : modStatus === "requested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "gap-1 text-[10px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3 w-3" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Mediação pedida"
								})
							]
						}), moderatorMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "gap-1",
							disabled: decide.isPending,
							onClick: () => decide.mutate("accept"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Aceitar"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "gap-1",
							disabled: decide.isPending,
							onClick: () => decide.mutate("decline"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), " Recusar"]
						})] }) : isModerationRequester && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "gap-1",
							disabled: cancelModerator.isPending,
							onClick: () => cancelModerator.mutate(),
							children: [
								cancelModerator.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Cancelar mediação"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sm:hidden",
									children: "Cancelar"
								})
							]
						})]
					}) : modStatus === "declined" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "shrink-0 gap-1 text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Mediação recusada"
						})]
					}) : !moderatorMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "shrink-0 gap-1",
						disabled: callModerator.isPending,
						onClick: () => {
							if (!purchasedProducts.length && !purchasedProductsLoading) {
								toast.error("Você não tem compras registradas com este vendedor.");
								return;
							}
							setModerationProductId(conversation?.product_id ?? purchasedProducts[0]?.id ?? "");
							setModerationOpen(true);
						},
						children: [
							callModerator.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3.5 w-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Chamar moderador"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: "Ajuda"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: moderationOpen,
				onOpenChange: setModerationOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Solicitar moderação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Selecione a compra relacionada e explique o motivo da reclamação. A equipe analisará o caso." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Selecione qual produto você quer fazer a reclamação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: moderationProductId,
								onValueChange: setModerationProductId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um produto comprado" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: purchasedProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: product.id,
									children: product.title
								}, product.id)) })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `moderation-reason-${conversationId}`,
								children: "Motivo da reclamação"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: `moderation-reason-${conversationId}`,
								value: moderationReason,
								onChange: (event) => setModerationReason(event.target.value),
								minLength: 10,
								maxLength: 1e3,
								rows: 5,
								placeholder: "Explique o que aconteceu (mínimo de 10 caracteres)."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setModerationOpen(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: submitModeration,
						disabled: callModerator.isPending || !purchasedProducts.length,
						children: [callModerator.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Enviar para moderação"]
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 overflow-hidden bg-background/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: scrollRef,
					onScroll,
					className: "h-full overflow-y-auto px-3 py-4 sm:px-4",
					children: [
						isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3",
							children: [
								0,
								1,
								2
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: i % 2 ? "flex justify-end" : "flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: `h-12 rounded-2xl ${i % 2 ? "w-48" : "w-56"}` })
							}, i))
						}),
						isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-sm rounded-2xl border border-destructive/40 bg-destructive/5 p-5 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mx-auto h-6 w-6 text-destructive" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm font-semibold",
									children: "Não foi possível carregar as mensagens"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: error instanceof Error ? error.message : "Verifique sua conexão."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "mt-3 gap-2",
									onClick: () => void refetch(),
									children: [isRefetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Tentar novamente"]
								})
							]
						}),
						!isLoading && !isError && messages.length === 0 && pending.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid place-items-center py-12 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesSquare, { className: "h-7 w-7" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm font-semibold",
									children: "Comece a conversa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 max-w-xs text-xs text-muted-foreground",
									children: "Combine os detalhes por aqui. Todo o histórico fica guardado e pode ser usado numa disputa."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3",
							children: [groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-accent px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
										children: g.day
									})
								}), g.items.map((m) => {
									if (m.kind === "system") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "max-w-[85%] rounded-full bg-accent px-3 py-1 text-center text-[11px] text-muted-foreground",
											children: m.body
										})
									}, m.id);
									const isModerator = m.kind === "moderator";
									const mine = m.sender_id === user?.id;
									const parent = m.reply_to_id ? byId.get(m.reply_to_id) : null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex ${mine ? "justify-end" : "justify-start"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "group max-w-[85%] sm:max-w-[75%]",
											children: [
												isModerator && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Moderação LynkoMarketplace"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `rounded-2xl px-3.5 py-2.5 text-sm shadow-sm sm:px-4 ${isModerator ? "border border-primary/40 bg-primary/10 text-foreground" : mine ? "rounded-br-md bg-gradient-primary text-primary-foreground" : "rounded-bl-md bg-accent text-accent-foreground"}`,
													children: [parent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `mb-2 truncate rounded-lg border-l-2 px-2 py-1 text-[11px] ${mine ? "border-primary-foreground/50 bg-primary-foreground/10" : "border-primary/60 bg-background/60"}`,
														children: parent.hidden ? "Mensagem removida" : parent.body
													}), m.hidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
														className: "opacity-70",
														children: "Mensagem removida pela moderação"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "whitespace-pre-wrap break-words",
														children: m.body
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `mt-1 flex items-center gap-2 text-[11px] text-muted-foreground ${mine ? "justify-end" : ""}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: HOUR.format(new Date(m.created_at)) }),
														mine && (m.read_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, {
															className: "h-3 w-3 text-primary",
															"aria-label": "Visualizada"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
															className: "h-3 w-3",
															"aria-label": "Enviada"
														})),
														!m.hidden && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															onClick: () => {
																setReplyTo(m);
																inputRef.current?.focus();
															},
															className: "flex items-center gap-1 transition hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "h-3 w-3" }), " Responder"]
														}),
														!mine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportDialog, {
															targetType: "message",
															targetId: m.id,
															trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																className: "flex items-center gap-1 transition hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-3 w-3" }), " Denunciar"]
															})
														})
													]
												})
											]
										})
									}, m.id);
								})]
							}, g.day)), pending.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-w-[85%] sm:max-w-[75%]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm sm:px-4 ${p.failed ? "border border-destructive/50 bg-destructive/10 text-foreground" : "bg-gradient-primary text-primary-foreground opacity-70"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "whitespace-pre-wrap break-words",
											children: p.body
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 flex items-center justify-end gap-2 text-[11px] text-muted-foreground",
										children: p.failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "Falha ao enviar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => retry(p),
												className: "flex items-center gap-1 hover:text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), " Tentar novamente"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setPending((prev) => prev.filter((x) => x.tempId !== p.tempId)),
												className: "hover:text-foreground",
												children: "Descartar"
											})
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " A enviar…"] })
									})]
								})
							}, p.tempId))]
						})
					]
				}), !atBottom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => scrollToBottom(),
					"aria-label": "Ir para a última mensagem",
					className: "absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground shadow-card transition hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-4 w-4" })
				})]
			}),
			replyTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-t border-border bg-accent/50 px-3 py-2 text-xs sm:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "h-3.5 w-3.5 shrink-0 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 truncate text-muted-foreground",
						children: replyTo.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setReplyTo(null),
						"aria-label": "Cancelar resposta",
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
					})
				]
			}),
			banned && !isStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border p-4 text-center text-xs text-muted-foreground",
				children: "A sua conta está suspensa não pode enviar mensagens. Pode apenas enviar uma apelação no painel."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					submit();
				},
				className: "flex items-end gap-2 border-t border-border p-2.5 sm:p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					ref: inputRef,
					value: text,
					onChange: (e) => setText(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							submit();
						}
					},
					rows: 1,
					maxLength: 2e3,
					placeholder: moderatorMode ? "Escrever como moderador…" : "Escreva a sua mensagem…",
					"aria-label": "Mensagem",
					className: "max-h-32 min-h-10 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					disabled: !text.trim(),
					"aria-label": "Enviar",
					className: "h-10 w-10 shrink-0 bg-gradient-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
				})]
			})
		]
	});
}
//#endregion
export { ReportDialog as n, openConversation as r, ChatPanel as t };
