import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as MessageSquare, D as ShieldCheck, Pt as Flag, a as Wallet, bt as Inbox, h as Trash2, it as Megaphone, on as CheckCheck, pn as Bell, w as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { H as timeAgo, et as Button, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notificacoes-inElirTf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KINDS = [
	{
		id: "todas",
		label: "Todas",
		icon: Bell
	},
	{
		id: "message",
		label: "Mensagens",
		icon: MessageSquare
	},
	{
		id: "withdrawal",
		label: "Saques",
		icon: Wallet
	},
	{
		id: "verification",
		label: "Verificação",
		icon: ShieldCheck
	},
	{
		id: "report",
		label: "Denúncias",
		icon: Flag
	}
];
var PREFS = [
	{
		key: "messages",
		label: "Mensagens no chat",
		hint: "Avisos de novas mensagens de clientes e vendedores.",
		icon: MessageSquare
	},
	{
		key: "withdrawals",
		label: "Saques",
		hint: "Aprovações, recusas e comprovantes da equipe.",
		icon: Wallet
	},
	{
		key: "verification",
		label: "Verificação de identidade",
		hint: "Resultado da análise dos seus documentos.",
		icon: ShieldCheck
	},
	{
		key: "reports",
		label: "Denúncias e apelações",
		hint: "Respostas da moderação nos seus casos.",
		icon: Flag
	},
	{
		key: "marketing",
		label: "Novidades da plataforma",
		hint: "Recursos novos e comunicados gerais.",
		icon: Megaphone
	}
];
var DEFAULT_PREFS = {
	messages: true,
	withdrawals: true,
	verification: true,
	reports: true,
	marketing: true
};
function iconFor(kind) {
	return KINDS.find((k) => k.id === kind)?.icon ?? Bell;
}
function Notificacoes() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [kind, setKind] = (0, import_react.useState)("todas");
	const [onlyUnread, setOnlyUnread] = (0, import_react.useState)(false);
	const { data: items = [], isLoading } = useQuery({
		queryKey: ["notifications", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("notifications").select("id, kind, title, body, link, read_at, created_at").order("created_at", { ascending: false }).limit(200);
			if (error) throw error;
			return data.filter((notification) => notification.kind !== "order");
		}
	});
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const channel = supabase.channel(`notifications-page-${user.id}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "notifications",
			filter: `user_id=eq.${user.id}`
		}, () => qc.invalidateQueries({ queryKey: ["notifications", user.id] })).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user, qc]);
	const filtered = (0, import_react.useMemo)(() => items.filter((n) => (kind === "todas" || n.kind === kind || kind === "report" && n.kind === "appeal") && (!onlyUnread || !n.read_at)), [
		items,
		kind,
		onlyUnread
	]);
	const unread = items.filter((n) => !n.read_at).length;
	const refresh = () => qc.invalidateQueries({ queryKey: ["notifications", user?.id] });
	const markAllRead = async () => {
		await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).is("read_at", null).eq("user_id", user.id);
		refresh();
	};
	const markRead = async (id) => {
		await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
		refresh();
	};
	const openNotification = async (notification) => {
		await markRead(notification.id);
		const link = notification.link ?? "/dashboard";
		if (link.startsWith("/mensagens")) {
			const url = new URL(link, window.location.origin);
			navigate({
				to: "/mensagens",
				search: { c: url.searchParams.get("c") ?? void 0 }
			});
			return;
		}
		if (link.startsWith("/pedido/")) {
			navigate({
				to: "/pedido/$id",
				params: { id: link.slice(8) }
			});
			return;
		}
		if (link === "/dashboard") {
			navigate({ to: "/dashboard" });
			return;
		}
		navigate({ to: link });
	};
	const remove = async (id) => {
		await supabase.from("notifications").delete().eq("id", id);
		refresh();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
						className: "h-6 w-6",
						"aria-hidden": true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-extrabold",
						children: "Central de notificações"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: unread > 0 ? `${unread} não lida(s)` : "Tudo em dia por aqui."
					})]
				}),
				unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					className: "ml-auto gap-2",
					onClick: markAllRead,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, {
						className: "h-4 w-4",
						"aria-hidden": true
					}), " Marcar todas como lidas"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-6 lg:grid-cols-[1fr_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-label": "Caixa de notificações",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					role: "group",
					"aria-label": "Filtrar notificações",
					children: [KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "pill",
						variant: kind === k.id ? "default" : "outline",
						onClick: () => setKind(k.id),
						"aria-pressed": kind === k.id,
						className: "gap-1.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							}),
							" ",
							k.label
						]
					}, k.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "pill",
						variant: onlyUnread ? "default" : "outline",
						onClick: () => setOnlyUnread((v) => !v),
						"aria-pressed": onlyUnread,
						className: "text-xs",
						children: "Só não lidas"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-hidden rounded-2xl border border-border bg-card",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 p-4",
						children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-xl" }, i))
					}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid place-items-center gap-2 px-4 py-16 text-center text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {
							className: "h-7 w-7",
							"aria-hidden": true
						}), "Nenhuma notificação nesta caixa."]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: filtered.map((n) => {
						const Icon = iconFor(n.kind);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: `flex items-start gap-3 border-b border-border/60 p-4 last:border-0 ${n.read_at ? "" : "bg-accent/40"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "h-4 w-4",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: n.title
										}),
										n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: n.body
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-muted-foreground",
											children: timeAgo(n.created_at)
										}),
										n.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => void openNotification(n),
											className: "mt-2 inline-block text-xs font-medium text-primary hover:underline",
											children: "Abrir"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1",
									children: [!n.read_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Marcar como lida",
										onClick: () => markRead(n.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, {
											className: "h-4 w-4",
											"aria-hidden": true
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Excluir notificação",
										onClick: () => remove(n.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
											className: "h-4 w-4",
											"aria-hidden": true
										})
									})]
								})
							]
						}, n.id);
					}) })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesPanel, {})
			})]
		})]
	});
}
function PreferencesPanel() {
	const { user } = useAuth();
	const [prefs, setPrefs] = (0, import_react.useState)(DEFAULT_PREFS);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("notification_preferences").select("messages, withdrawals, verification, reports, marketing").eq("user_id", user.id).maybeSingle().then(({ data }) => {
			if (data) setPrefs(data);
			setLoaded(true);
		});
	}, [user]);
	const update = async (key, value) => {
		const next = {
			...prefs,
			[key]: value
		};
		setPrefs(next);
		const { error } = await supabase.from("notification_preferences").upsert({
			user_id: user.id,
			...next
		}, { onConflict: "user_id" });
		if (error) {
			setPrefs(prefs);
			toast.error(error.message);
			return;
		}
		toast.success("Preferências atualizadas.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "h-fit rounded-2xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
					className: "h-4 w-4 text-primary",
					"aria-hidden": true
				}), " Preferências de notificação"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Escolha o que quer receber. Avisos críticos de segurança continuam sendo enviados."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-4",
				children: PREFS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: `pref-${p.key}`,
							className: "flex items-center gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, {
									className: "h-3.5 w-3.5 text-muted-foreground",
									"aria-hidden": true
								}),
								" ",
								p.label
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: p.hint
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: `pref-${p.key}`,
						checked: prefs[p.key],
						disabled: !loaded,
						onCheckedChange: (v) => update(p.key, v)
					})]
				}, p.key))
			})
		]
	});
}
//#endregion
export { Notificacoes as component };
