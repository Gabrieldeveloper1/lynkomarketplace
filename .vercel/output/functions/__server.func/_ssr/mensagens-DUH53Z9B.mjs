import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as MessageSquare, N as Search, bt as Inbox, rn as ChevronLeft, st as MailOpen } from "../_libs/lucide-react.mjs";
import { $ as Input, H as timeAgo, Q as AvatarImage, X as Avatar, Z as AvatarFallback, l as Route$15, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as ChatPanel } from "./chat-panel-CZpycPMC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mensagens-DUH53Z9B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Mensagens() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const { c: focusId } = Route$15.useSearch();
	const [activeId, setActiveId] = (0, import_react.useState)(focusId ?? null);
	(0, import_react.useEffect)(() => {
		if (focusId) setActiveId(focusId);
	}, [focusId]);
	const [term, setTerm] = (0, import_react.useState)("");
	const [onlyUnread, setOnlyUnread] = (0, import_react.useState)(false);
	const { data: conversations = [], refetch } = useQuery({
		queryKey: ["conversations", user?.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("conversations").select("*, buyer:profiles!conversations_buyer_id_fkey(username, display_name, avatar_url), seller:profiles!conversations_seller_id_fkey(username, display_name, avatar_url)").or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`).order("last_message_at", { ascending: false });
			if (error) throw error;
			return data;
		},
		enabled: !!user
	});
	const { data: recent = [] } = useQuery({
		queryKey: [
			"conversation-previews",
			user?.id,
			conversations.map((conversation) => conversation.id).join(",")
		],
		queryFn: async () => {
			const conversationIds = conversations.map((conversation) => conversation.id);
			if (conversationIds.length === 0) return [];
			const { data, error } = await supabase.from("messages").select("id, conversation_id, sender_id, body, kind, read_at, created_at").in("conversation_id", conversationIds).order("created_at", { ascending: false }).limit(400);
			if (error) throw error;
			return data;
		},
		enabled: !!user && conversations.length > 0
	});
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const channel = supabase.channel("inbox-updates").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "messages"
		}, () => {
			refetch();
			qc.invalidateQueries({ queryKey: ["conversation-previews", user.id] });
			qc.invalidateQueries({ queryKey: ["conversations", user.id] });
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "conversations"
		}, () => {
			refetch();
			qc.invalidateQueries({ queryKey: ["conversation-previews", user.id] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [
		user,
		refetch,
		qc
	]);
	const meta = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const m of recent) {
			const entry = map.get(m.conversation_id) ?? { unread: 0 };
			if (!entry.last) entry.last = m.kind === "system" ? "Aviso da moderação" : m.body;
			if (!m.read_at && m.sender_id !== user?.id && m.conversation_id !== activeId) entry.unread += 1;
			map.set(m.conversation_id, entry);
		}
		return map;
	}, [
		recent,
		user?.id,
		activeId
	]);
	const list = (0, import_react.useMemo)(() => {
		const q = term.trim().toLowerCase();
		return conversations.filter((c) => {
			const other = c.buyer_id === user?.id ? c.seller : c.buyer;
			const name = `${other?.display_name ?? ""} ${other?.username ?? ""}`.toLowerCase();
			const info = meta.get(c.id);
			if (onlyUnread && !(info?.unread ?? 0)) return false;
			if (!q) return true;
			return name.includes(q) || (info?.last ?? "").toLowerCase().includes(q);
		});
	}, [
		conversations,
		term,
		onlyUnread,
		meta,
		user?.id
	]);
	const current = activeId ?? list[0]?.id ?? null;
	const mobileOpen = !!activeId;
	const totalUnread = [...meta.values()].reduce((a, b) => a + b.unread, 0);
	const openChat = (conversationId) => {
		setActiveId(conversationId);
		const readAt = (/* @__PURE__ */ new Date()).toISOString();
		qc.setQueriesData({ queryKey: ["conversation-previews", user?.id] }, (current) => {
			if (!Array.isArray(current)) return current;
			return current.map((message) => message?.conversation_id === conversationId && message?.sender_id !== user?.id ? {
				...message,
				read_at: message.read_at ?? readAt
			} : message);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl min-w-0 px-3 py-5 sm:px-4 sm:py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
						className: "h-6 w-6",
						"aria-hidden": true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-extrabold",
						children: "Caixa de mensagens"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Converse com compradores e vendedores. Pode responder mensagens específicas, denunciar abusos ou chamar a moderação a qualquer momento."
					})]
				}),
				totalUnread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "h-7 gap-1 px-3",
					children: [
						totalUnread,
						" não lida",
						totalUnread > 1 ? "s" : ""
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-w-0 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `h-fit max-h-[600px] flex-col rounded-2xl border border-border bg-card ${mobileOpen ? "hidden lg:flex" : "flex"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 border-b border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: term,
							onChange: (e) => setTerm(e.target.value),
							placeholder: "Procurar conversa",
							"aria-label": "Procurar conversa",
							className: "pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
							active: !onlyUnread,
							onClick: () => setOnlyUnread(false),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-3.5 w-3.5" }),
							children: "Todas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
							active: onlyUnread,
							onClick: () => setOnlyUnread(true),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailOpen, { className: "h-3.5 w-3.5" }),
							children: "Não lidas"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-y-auto p-2",
					children: [list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-6 text-center text-sm text-muted-foreground",
						children: conversations.length ? "Nenhuma conversa neste filtro." : "Sem conversas ainda."
					}), list.map((c) => {
						const other = c.buyer_id === user?.id ? c.seller : c.buyer;
						const info = meta.get(c.id);
						const name = other?.display_name || `@${other?.username ?? "usuário"}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => openChat(c.id),
							"aria-current": current === c.id,
							className: `flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${current === c.id ? "bg-accent" : "hover:bg-accent/60"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "h-9 w-9 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: other?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: (other?.username ?? "U").slice(0, 2).toUpperCase() })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-sm font-medium",
												children: name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-auto shrink-0 text-[11px] text-muted-foreground",
												children: timeAgo(c.last_message_at)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: info?.last ?? "Sem mensagens"
										}),
										c.moderation_requested && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400",
											children: "Moderação acionada"
										})
									]
								}),
								(info?.unread ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground",
									children: info.unread
								})
							]
						}, c.id);
					})]
				})]
			}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `min-w-0 ${mobileOpen ? "" : "hidden lg:block"}`,
				children: [mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setActiveId(null),
					className: "mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }), " Todas as conversas"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, { conversationId: current })
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden h-[520px] place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground lg:grid",
				children: "Selecione uma conversa"
			})]
		})]
	});
}
function FilterChip({ active, onClick, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-pressed": active,
		className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${active ? "border-transparent bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent"}`,
		children: [icon, children]
	});
}
//#endregion
export { Mensagens as component };
