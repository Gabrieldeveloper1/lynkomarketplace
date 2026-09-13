import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as redirect, _ as createRootRouteWithContext, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Slot, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as __exportAll, r as createServerFn } from "./server-935pLRdS.mjs";
import { t as createSsrRpc } from "./createSsrRpc-aZJu5MmU.mjs";
import { n as requireSupabaseAuth } from "./auth-middleware-DE2Fqus-.mjs";
import { a as objectType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as useQueryClient, n as useQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { $ as MessageSquare, C as Smartphone, Ct as House, D as ShieldCheck, E as Shield, Ft as FileText, K as Play, Kt as Cookie, N as Search, Nt as Flame, Ot as Globe, Q as Moon, S as Sparkles, Sn as AppWindow, Wt as CreditCard, Xt as Circle, Y as Package, Z as Music, _t as Key, a as Wallet, an as Check, b as Store, bt as Inbox, ct as LogOut, d as Twitter, dn as Bot, f as Tv, gn as AtSign, hn as BadgeCheck, ht as LayoutDashboard, i as Wrench, in as ChevronDown, j as Settings2, jt as Gamepad2, kt as Gift, lt as LogIn, n as Youtube, nn as ChevronRight, o as Users, on as CheckCheck, p as TriangleAlert, pn as Bell, pt as LifeBuoy, qt as Coins, r as X, rt as Menu, s as User, t as Zap, tt as MessageCircle, ut as Lock, v as Sun, wt as Heart, y as SunMoon, yt as Instagram } from "../_libs/lucide-react.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-C_uf36nf.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/profile.functions-BvhWURZJ.js
var profile_functions_exports = /* @__PURE__ */ __exportAll({
	chooseMyUsername: () => chooseMyUsername,
	ensureMyProfile: () => ensureMyProfile
});
/** Cria o perfil público da conta caso ainda não exista. */
var ensureMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d636923ce4c79be80e1d33e9c7ba2ead4c614ff9a70e141d9b10ff3551257a42"));
/** Define o @ do utilizador (apenas uma vez). */
var chooseMyUsername = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ username: stringType().min(3).max(30) }).parse(data)).handler(createSsrRpc("a03a7386f9d9d89c89143fedc745d2be66f07084e6e34a81e8201ed574ce0040"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BVA3mZO7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DP_Y9mYs.css";
var ThemeContext = (0, import_react.createContext)({
	theme: "dark",
	toggle: () => {}
});
function ThemeProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)("dark");
	(0, import_react.useEffect)(() => {
		const stored = window.localStorage.getItem("tm-theme");
		if (stored) setTheme(stored);
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		window.localStorage.setItem("tm-theme", theme);
	}, [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			toggle: () => setTheme((t) => t === "dark" ? "light" : "dark")
		},
		children
	});
}
var useTheme = () => (0, import_react.useContext)(ThemeContext);
var AuthContext = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [isStaff, setIsStaff] = (0, import_react.useState)(false);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const load = async (userId) => {
		if (!userId) {
			setProfile(null);
			setIsStaff(false);
			setIsAdmin(false);
			return;
		}
		const [{ data: p }, { data: roles }] = await Promise.all([supabase.from("profiles").select("*").eq("id", userId).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", userId)]);
		let prof = p ?? null;
		if (!prof) try {
			await ensureMyProfile();
			const { data: created } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
			prof = created ?? null;
		} catch {}
		if (String((await supabase.auth.getUser()).data.user?.email ?? "").toLowerCase() === "gabrieljairo865@gmail.com") {
			await supabase.from("profiles").update({ staff_badge: true }).eq("id", userId);
			if (prof) prof = {
				...prof,
				staff_badge: true
			};
		}
		setProfile(prof);
		setIsStaff(!!roles?.some((r) => r.role === "admin" || r.role === "moderator"));
		setIsAdmin(!!roles?.some((r) => r.role === "admin"));
	};
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
			setLoading(true);
			setTimeout(() => {
				load(s?.user?.id).finally(() => setLoading(false));
			}, 0);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(true);
			load(data.session?.user?.id).finally(() => setLoading(false));
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	(0, import_react.useEffect)(() => {
		const userId = session?.user?.id;
		if (!userId) return;
		const touch = () => {
			supabase.from("profiles").update({ last_seen_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", userId).then(({ error }) => {
				if (error) console.warn("[presence] não foi possível atualizar o status online", error.message);
			});
		};
		touch();
		const interval = window.setInterval(touch, 3e4);
		const presence = supabase.channel(`presence:${userId}`, { config: { presence: { key: userId } } });
		presence.subscribe(async (status) => {
			if (status === "SUBSCRIBED") await presence.track({ online_at: (/* @__PURE__ */ new Date()).toISOString() });
		});
		const onActivity = () => touch();
		window.addEventListener("focus", onActivity);
		document.addEventListener("visibilitychange", onActivity);
		return () => {
			window.clearInterval(interval);
			window.removeEventListener("focus", onActivity);
			document.removeEventListener("visibilitychange", onActivity);
			supabase.removeChannel(presence);
		};
	}, [session?.user?.id]);
	const value = {
		user: session?.user ?? null,
		session,
		profile,
		isStaff,
		isAdmin,
		loading,
		refreshProfile: () => load(session?.user?.id),
		signOut: async () => {
			await supabase.auth.signOut();
			setProfile(null);
			setIsStaff(false);
			setIsAdmin(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-tight cursor-pointer transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
			mono: "bg-foreground text-background shadow-sm hover:opacity-90 hover:shadow-glow",
			gradient: "bg-gradient-primary text-primary-foreground shadow-sm hover:shadow-glow hover:brightness-110",
			soft: "bg-secondary text-secondary-foreground hover:bg-accent",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			contrast: "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "font-medium hover:bg-accent hover:text-accent-foreground",
			link: "font-medium text-foreground underline-offset-4 hover:underline hover:translate-y-0",
			command: "w-full justify-start gap-2 rounded-full border border-border bg-card px-4 text-muted-foreground shadow-sm hover:border-foreground/30 hover:bg-accent/60"
		},
		size: {
			default: "h-10 px-4 py-2.5",
			sm: "h-8 rounded-lg px-3 text-xs",
			lg: "h-11 rounded-xl px-5 py-3 text-[15px]",
			xl: "h-12 rounded-2xl px-6 py-3.5 text-base",
			pill: "h-10 rounded-full px-6",
			icon: "h-10 w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Sheet = Dialog$1;
var SheetTrigger = DialogTrigger$1;
var SheetClose = DialogClose;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle$1.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription$1.displayName;
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var FEE_RATE = .08;
function formatPrice(cents) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL"
	}).format((cents ?? 0) / 100);
}
function slugify(input) {
	return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}
function timeAgo(date) {
	const diff = Date.now() - new Date(date).getTime();
	const min = Math.floor(diff / 6e4);
	if (min < 1) return "agora";
	if (min < 60) return `há ${min} min`;
	const h = Math.floor(min / 60);
	if (h < 24) return `há ${h} h`;
	return `há ${Math.floor(h / 24)} d`;
}
function NotificationsMenu() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const { data: items = [] } = useQuery({
		queryKey: ["notifications", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("notifications").select("id, kind, title, body, link, read_at, created_at").order("created_at", { ascending: false }).limit(20);
			if (error) throw error;
			return data.filter((notification) => notification.kind !== "order");
		}
	});
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const channel = supabase.channel(`notifications-${user.id}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "notifications",
			filter: `user_id=eq.${user.id}`
		}, () => qc.invalidateQueries({ queryKey: ["notifications", user.id] })).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user, qc]);
	if (!user) return null;
	const unread = items.filter((n) => !n.read_at).length;
	const markAllRead = async () => {
		await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).is("read_at", null).eq("user_id", user.id);
		qc.invalidateQueries({ queryKey: ["notifications", user.id] });
	};
	const markRead = async (id) => {
		await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
		qc.invalidateQueries({ queryKey: ["notifications", user.id] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "icon",
			className: "relative",
			"aria-label": unread ? `Notificações, ${unread} não lidas` : "Notificações",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
				className: "h-5 w-5",
				"aria-hidden": true
			}), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground",
				children: unread > 9 ? "9+" : unread
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-[22rem] p-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Notificações"
				}), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: markAllRead,
					className: "flex items-center gap-1 text-xs text-primary hover:underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, {
						className: "h-3.5 w-3.5",
						"aria-hidden": true
					}), " Marcar todas como lidas"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[22rem] overflow-y-auto",
				children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid place-items-center gap-2 px-4 py-8 sm:py-10 text-center text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {
						className: "h-6 w-6",
						"aria-hidden": true
					}), "Sem notificações por enquanto."]
				}) : items.map((n) => {
					const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read_at ? "bg-transparent" : "bg-primary"}`,
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium",
									children: n.title
								}),
								n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs text-muted-foreground",
									children: n.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[11px] text-muted-foreground",
									children: timeAgo(n.created_at)
								})
							]
						})]
					}) });
					const cls = "block w-full border-b border-border/60 px-4 py-3 text-left transition hover:bg-accent";
					return n.link ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.link,
						onClick: () => markRead(n.id),
						className: cls,
						children: inner
					}, n.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => markRead(n.id),
						className: cls,
						children: inner
					}, n.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/notificacoes",
				className: "block border-t border-border px-4 py-3 text-center text-sm font-medium text-primary hover:bg-accent",
				children: "Ver central de notificações"
			})
		]
	})] });
}
function AccountMenu() {
	const navigate = useNavigate();
	const { profile, user, isStaff, signOut } = useAuth();
	const { theme, toggle } = useTheme();
	const name = profile?.display_name || profile?.username || "Conta";
	const initials = name.slice(0, 2).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "ml-1 flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:bg-accent data-[state=open]:border-primary/50 data-[state=open]:bg-accent",
			"aria-label": "Menu da conta",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
				className: "h-7 w-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
					src: profile?.avatar_url ?? void 0,
					alt: "Perfil"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: initials })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden max-w-[9rem] truncate text-sm font-medium sm:inline",
				children: [
					"Olá, ",
					name,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						children: "👋"
					})
				]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		sideOffset: 10,
		className: "w-72 rounded-2xl border-border/80 p-2 shadow-glow",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-accent/50 p-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "h-10 w-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: profile?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: initials })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1 truncate text-sm font-semibold",
							children: [
								name,
								" ",
								profile?.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3.5 w-3.5 shrink-0 text-primary" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: user?.email
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 px-1 text-[11px] text-muted-foreground",
					children: "Gerencie sua loja, pedidos e preferências."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				asChild: true,
				className: "group gap-3 rounded-xl px-2 py-2.5 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-muted-foreground" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1",
							children: "Minha conta"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				asChild: true,
				className: "group gap-3 rounded-xl px-2 py-2.5 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/favoritos",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4 text-muted-foreground" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1",
							children: "Meus favoritos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" })
					]
				})
			}),
			isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				asChild: true,
				className: "gap-3 rounded-xl px-2 py-2.5 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-muted-foreground" }), " Administração"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl px-2 py-2 text-sm",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunMoon, { className: "h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: "Tema"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => theme === "dark" && toggle(),
							"aria-label": "Tema claro",
							className: `grid h-6 w-7 place-items-center rounded-md transition-colors ${theme === "light" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => theme === "light" && toggle(),
							"aria-label": "Tema escuro",
							className: `grid h-6 w-7 place-items-center rounded-md transition-colors ${theme === "dark" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3.5 w-3.5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				className: "gap-3 rounded-xl px-2 py-2.5 text-sm font-medium text-destructive focus:text-destructive",
				onClick: () => {
					signOut().then(() => navigate({ to: "/" }));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sair da conta"]
			})
		]
	})] });
}
var PUBLIC_PROFILE_SELECT = "id, username, display_name, avatar_url, banner_url, bio, verified, banned, staff_badge, verification_level, verified_at, verif_city, verif_country, verif_business, verif_social, verif_social_network, last_seen_at, created_at, updated_at";
var PRODUCT_SELECT = `*, seller:profiles!products_seller_id_fkey(${PUBLIC_PROFILE_SELECT})`;
var FALLBACK_SITE_PAGES = [
	{
		id: "fallback-regras-do-vendedor",
		slug: "regras-do-vendedor",
		title: "Regras do vendedor",
		summary: "Boas práticas para anunciar, entregar e vender com segurança na LynkoMarketplace.",
		content: "# Regras do vendedor\n\n## Anúncios honestos\n- Descreva exatamente o que será entregue e informe limitações, prazo e região quando necessário.\n- Publique apenas produtos e serviços permitidos pela legislação e pelas regras da plataforma.\n\n## Entrega e atendimento\n- Mantenha o estoque atualizado e entregue o pedido dentro do prazo anunciado.\n- Responda o comprador pelo chat e nunca peça pagamentos por fora da LynkoMarketplace.\n\n## Conta e segurança\n- Não compartilhe credenciais de terceiros, dados pessoais ou conteúdos obtidos de forma ilegal.\n- A reincidência em violações pode limitar anúncios, saques ou acesso à conta.\n\n## Advertências e contestação\nSe receber uma advertência, consulte o motivo no painel e envie uma contestação pelo Discord oficial caso discorde da decisão.",
		position: 0,
		published: true,
		image_url: null,
		created_at: "1970-01-01T00:00:00.000Z",
		updated_at: "1970-01-01T00:00:00.000Z"
	},
	{
		id: "fallback-termos",
		slug: "termos",
		title: "Termos de uso",
		summary: "Condições para utilização da plataforma.",
		content: "# Termos de uso\n\n## Uso da plataforma\nA LynkoMarketplace conecta compradores e vendedores de produtos digitais. Cada usuário é responsável pelas informações publicadas, pelos pagamentos e pelo cumprimento da legislação aplicável.\n\n## Conduta\nÉ proibido fraudar pagamentos, tentar burlar a custódia, publicar conteúdo ilegal ou utilizar a plataforma para prejudicar terceiros.\n\n## Suporte\nEm caso de problema, use o chat do pedido e forneça as informações necessárias para a mediação.",
		position: 1,
		published: true,
		image_url: null,
		created_at: "1970-01-01T00:00:00.000Z",
		updated_at: "1970-01-01T00:00:00.000Z"
	},
	{
		id: "fallback-privacidade",
		slug: "privacidade",
		title: "Privacidade",
		summary: "Como tratamos os dados utilizados na plataforma.",
		content: "# Privacidade\n\nColetamos os dados necessários para criar contas, processar pedidos, prevenir abusos e oferecer suporte. O acesso é limitado às finalidades da plataforma e os dados não são publicados sem necessidade.\n\nVocê pode solicitar informações, correções ou esclarecimentos pelo suporte administrativo no Discord oficial.",
		position: 2,
		published: true,
		image_url: null,
		created_at: "1970-01-01T00:00:00.000Z",
		updated_at: "1970-01-01T00:00:00.000Z"
	},
	{
		id: "fallback-reembolso",
		slug: "reembolso",
		title: "Reembolso",
		summary: "Orientações para problemas de entrega e disputas.",
		content: "# Reembolso\n\nSe o pedido não for entregue ou estiver diferente do anúncio, abra uma mediação pelo chat do pedido. A equipe analisará o pagamento, as mensagens e o conteúdo entregue.\n\nQuando a mediação for aprovada, a Efí Bank processará automaticamente o reembolso aos titulares. A decisão é definitiva para aquele pedido e não exige confirmação do cliente.",
		position: 3,
		published: true,
		image_url: null,
		created_at: "1970-01-01T00:00:00.000Z",
		updated_at: "1970-01-01T00:00:00.000Z"
	}
];
async function fetchCategories() {
	const [{ data, error }, { data: products, error: productsError }] = await Promise.all([supabase.from("categories").select("*").order("position"), supabase.from("products").select("category_slug").eq("status", "active")]);
	if (error) throw error;
	if (productsError) throw productsError;
	const counts = /* @__PURE__ */ new Map();
	for (const product of products ?? []) counts.set(product.category_slug, (counts.get(product.category_slug) ?? 0) + 1);
	return (data ?? []).map((category) => ({
		...category,
		product_count: counts.get(category.slug) ?? 0
	}));
}
async function fetchProducts(f = {}) {
	let query = supabase.from("products").select(PRODUCT_SELECT).eq("status", "active");
	if (f.q) query = query.ilike("title", `%${f.q}%`);
	if (f.category && f.category !== "todas") query = query.eq("category_slug", f.category);
	if (f.auto) query = query.eq("auto_delivery", true);
	if (f.sellerId) query = query.eq("seller_id", f.sellerId);
	if (f.max) query = query.lte("price_cents", f.max);
	if (f.promotedFirst) query = query.order("promoted", { ascending: false });
	if (f.sort === "menor") query = query.order("price_cents", { ascending: true });
	else if (f.sort === "maior") query = query.order("price_cents", { ascending: false });
	else if (f.sort === "vendidos") query = query.order("sales_count", { ascending: false });
	else query = query.order("created_at", { ascending: false });
	const { data, error } = await query.limit(f.limit ?? 60);
	if (error) throw error;
	let rows = data ?? [];
	if (f.verified) rows = rows.filter((p) => p.seller?.verified);
	return rows;
}
async function fetchProductBySlug(slug) {
	const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data ?? null;
}
async function fetchSellerByUsername(username) {
	const { data, error } = await supabase.from("profiles").select(PUBLIC_PROFILE_SELECT).eq("username", username).limit(1).maybeSingle();
	if (error) throw error;
	return data;
}
async function fetchSellers() {
	const { data, error } = await supabase.from("profiles").select(PUBLIC_PROFILE_SELECT).eq("banned", false).order("verified", { ascending: false }).limit(60);
	if (error) throw error;
	return data;
}
async function fetchSellerReviews(sellerId) {
	const { data, error } = await supabase.from("reviews").select("*, buyer:profiles!reviews_buyer_id_fkey(username, display_name, avatar_url)").eq("seller_id", sellerId).order("created_at", { ascending: false }).limit(50);
	if (error) throw error;
	return data ?? [];
}
async function fetchMyReviews(sellerId) {
	return fetchSellerReviews(sellerId);
}
async function fetchProductReviews(productId) {
	const { data, error } = await supabase.from("reviews").select("*, buyer:profiles!reviews_buyer_id_fkey(username, display_name, avatar_url)").eq("product_id", productId).order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function fetchFollowerCount(sellerId) {
	const { count, error } = await supabase.from("follows").select("*", {
		count: "exact",
		head: true
	}).eq("seller_id", sellerId);
	if (error) throw error;
	return count ?? 0;
}
function ratingOf(reviews) {
	if (!reviews.length) return null;
	const pos = reviews.filter((r) => r.positive).length;
	return Math.round(pos / reviews.length * 1e3) / 10;
}
async function uploadMedia(userId, file) {
	const allowedTypes = /* @__PURE__ */ new Set([
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/avif",
		"image/svg+xml",
		"image/bmp",
		"image/tiff"
	]);
	if (file.type === "image/gif" || !allowedTypes.has(file.type)) throw new Error("Formato não suportado. Envie PNG, JPG, WEBP, AVIF, SVG, BMP ou TIFF; GIF não é permitido.");
	if (file.size > 52428800) throw new Error("A imagem deve ter no máximo 50 MB.");
	const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
	const path = `${userId}/${crypto.randomUUID()}-${safeName}`;
	const { error } = await supabase.storage.from("media").upload(path, file, {
		upsert: false,
		contentType: file.type,
		cacheControl: "31536000"
	});
	if (error) throw error;
	return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
async function fetchVariants(productId) {
	const { data, error } = await supabase.from("product_variants").select("*").eq("product_id", productId).eq("active", true).order("position").order("price_cents");
	if (error) throw error;
	return data ?? [];
}
async function fetchSitePages() {
	const { data, error } = await supabase.from("site_pages").select("*").eq("published", true).order("position");
	if (error) {
		console.warn("[marketplace] usando páginas legais locais:", error.message);
		return FALLBACK_SITE_PAGES;
	}
	if (!data?.length) return FALLBACK_SITE_PAGES;
	const existing = new Set(data.map((page) => page.slug));
	return [...data, ...FALLBACK_SITE_PAGES.filter((page) => !existing.has(page.slug))].sort((a, b) => a.position - b.position);
}
async function fetchSitePage(slug) {
	const { data, error } = await supabase.from("site_pages").select("*").eq("slug", slug).maybeSingle();
	if (error) {
		console.warn("[marketplace] usando página legal local:", error.message);
		return FALLBACK_SITE_PAGES.find((page) => page.slug === slug) ?? null;
	}
	return data ?? FALLBACK_SITE_PAGES.find((page) => page.slug === slug) ?? null;
}
async function fetchBlogPosts() {
	const { data, error } = await supabase.from("site_pages").select("*").eq("published", true).like("slug", "blog-%").order("updated_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function fetchOrder(orderId) {
	const { data, error } = await supabase.from("orders").select("*, product:products!orders_product_id_fkey(title, slug, images, auto_delivery), seller:profiles!orders_seller_id_fkey(username, display_name, avatar_url, verified)").eq("id", orderId).maybeSingle();
	if (error) throw error;
	return data;
}
async function fetchOrderEvents(orderId) {
	const { data, error } = await supabase.from("order_events").select("*").eq("order_id", orderId).order("created_at");
	if (error) throw error;
	return data ?? [];
}
async function fetchFavoriteIds(userId) {
	const { data, error } = await supabase.from("favorites").select("product_id").eq("user_id", userId);
	if (error) throw error;
	return (data ?? []).map((r) => r.product_id);
}
async function fetchFavoriteProducts(userId) {
	const { data, error } = await supabase.from("favorites").select(`product:products!favorites_product_id_fkey(${PRODUCT_SELECT})`).eq("user_id", userId).order("created_at", { ascending: false });
	if (error) throw error;
	return (data ?? []).map((r) => r.product).filter(Boolean);
}
async function setFavorite(userId, productId, on) {
	if (on) {
		const { error } = await supabase.from("favorites").insert({
			user_id: userId,
			product_id: productId
		});
		if (error && error.code !== "23505") throw error;
	} else {
		const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("product_id", productId);
		if (error) throw error;
	}
}
async function fetchMyWarnings(userId) {
	const { data, error } = await supabase.from("warnings").select("*").eq("user_id", userId).order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function fetchRecentReviews(limit = 12) {
	const { data, error } = await supabase.from("reviews").select("*, buyer:profiles!reviews_buyer_id_fkey(username, display_name, avatar_url), product:products!reviews_product_id_fkey(title, slug, images)").order("created_at", { ascending: false }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
/**
* Taxa de serviço justa: o valor é fixo em centavos, independentemente do preço
* do produto. Todos os níveis valem a pena mudam apenas a rapidez da mediação
* e a cobertura de reembolso.
*/
var PROTECTION_TIERS = [
	{
		id: "basica",
		name: "Proteção Básica",
		feeCents: 10,
		tagline: "Cobertura essencial para qualquer compra",
		benefits: [
			"Pagamento em custódia até a entrega",
			"Abertura de disputa em até 24h",
			"Suporte por chat com o vendedor"
		]
	},
	{
		id: "media",
		name: "Proteção Média",
		feeCents: 50,
		tagline: "Mediação prioritária da equipe Lynko",
		benefits: [
			"Tudo da Básica",
			"Mediação prioritária em até 6h",
			"Reembolso garantido em item inválido",
			"Histórico de entrega auditado"
		]
	},
	{
		id: "maxima",
		name: "Proteção Máxima",
		feeCents: 200,
		tagline: "Garantia total, resposta imediata",
		benefits: [
			"Tudo da Média",
			"Mediação imediata 24/7",
			"Reembolso total em qualquer falha de entrega",
			"Substituição automática do item",
			"Gestor de conta dedicado"
		]
	}
];
function protectionTier(id) {
	return PROTECTION_TIERS.find((t) => t.id === id) ?? PROTECTION_TIERS[0];
}
var MAP = {
	user: User,
	"gamepad-2": Gamepad2,
	gamepad: Gamepad2,
	coins: Coins,
	play: Play,
	"app-window": AppWindow,
	"credit-card": CreditCard,
	wrench: Wrench,
	"at-sign": AtSign,
	package: Package,
	music: Music,
	tv: Tv,
	shield: Shield,
	key: Key,
	gift: Gift,
	bot: Bot,
	smartphone: Smartphone,
	globe: Globe
};
function CategoryIcon({ name, className = "h-5 w-5" }) {
	const Icon = MAP[name] ?? Package;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className });
}
/** Mostra a imagem da categoria quando definida, senão o ícone SVG. */
function CategoryVisual({ category, className = "h-6 w-6", imageClassName = "h-full w-full object-cover" }) {
	if (category.display_mode === "image" && category.image_url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: category.image_url,
		alt: category.name,
		loading: "lazy",
		className: imageClassName
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, {
		name: category.icon,
		className
	});
}
var BRAND_LOGO_URL$1 = "https://i.ibb.co/DDk11nFh/lynko-market-logo.png";
function Logo({ compact = false }) {
	const { theme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/",
		className: "flex shrink-0 items-center",
		"aria-label": "Lynko Market início",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: BRAND_LOGO_URL$1,
			alt: "Lynko Market",
			className: `${compact ? "h-8 w-10 object-cover object-left" : "h-8 w-auto sm:h-9"}`,
			style: theme === "light" ? { filter: "invert(1)" } : void 0
		})
	});
}
function AdminBadge({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-glow ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3 fill-current" }), " Admin Poderoso"]
	});
}
function SiteHeader() {
	const { theme, toggle } = useTheme();
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [suggestOpen, setSuggestOpen] = (0, import_react.useState)(false);
	const searchRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				searchRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const { user, profile, isStaff, isAdmin, signOut } = useAuth();
	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories
	});
	const { data: sitePages = [] } = useQuery({
		queryKey: ["site-pages"],
		queryFn: fetchSitePages
	});
	const activeCat = useRouterState({ select: (s) => s.location.search?.cat ?? "todas" });
	const { data: suggestions = [], isFetching: searching } = useQuery({
		queryKey: ["search-suggest", q],
		queryFn: () => fetchProducts({
			q,
			limit: 6,
			sort: "recentes"
		}),
		enabled: q.trim().length >= 2
	});
	const submit = (e) => {
		e.preventDefault();
		setSuggestOpen(false);
		navigate({
			to: "/produtos",
			search: {
				q,
				cat: "todas",
				sort: "recentes"
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center gap-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "lg:hidden",
							"aria-label": "Abrir menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
						side: "left",
						className: "w-[22rem] overflow-y-auto border-r border-border p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, {
							categories,
							activeCat,
							sitePages,
							onNavigate: () => setOpen(false),
							theme,
							toggle
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-1 xl:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/produtos",
						search: {
							q: "",
							cat: "todas",
							sort: "recentes"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "pill",
							className: "text-sm",
							children: "Marketplace"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vendedores",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "pill",
							className: "text-sm",
							children: "Vendedores"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto hidden w-full max-w-xl flex-1 md:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
						onSubmit: submit,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-11 items-center gap-1 rounded-full border border-border bg-card/60 pl-4 pr-1.5 transition-colors focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: searchRef,
									value: q,
									onChange: (e) => setQ(e.target.value),
									onFocus: () => setSuggestOpen(true),
									onBlur: () => setTimeout(() => setSuggestOpen(false), 150),
									placeholder: "Pesquisar categorias, produtos ou usuários",
									className: "h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
									"aria-label": "Pesquisar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
									className: "pointer-events-none hidden shrink-0 select-none items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:flex",
									children: "⌘K"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesMenu, {
									categories,
									activeCat,
									inline: true
								})
							]
						})
					}), suggestOpen && q.trim().length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-card",
						children: [suggestions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 py-4 text-sm text-muted-foreground",
							children: searching ? "Buscando..." : "Sem resultados para esta pesquisa."
						}) : suggestions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/produto/$slug",
							params: { slug: p.slug },
							onClick: () => setSuggestOpen(false),
							className: "flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-accent",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-accent",
									children: p.images?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.images[0],
										alt: "",
										className: "h-full w-full object-cover",
										loading: "lazy"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-medium",
										children: p.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-[11px] text-muted-foreground",
										children: p.auto_delivery ? "Entrega automática" : "Entrega manual"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-primary",
									children: formatPrice(p.price_cents)
								})
							]
						}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onMouseDown: (e) => e.preventDefault(),
							onClick: submit,
							className: "mt-1 w-full rounded-xl bg-accent/60 px-3 py-2 text-xs font-medium text-primary",
							children: [
								"Ver todos os resultados para \"",
								q,
								"\""
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-1 md:ml-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "hidden lg:inline-flex",
						onClick: toggle,
						"aria-label": "Alternar tema",
						children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-5 w-5" })
					}), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/mensagens",
							className: "hidden sm:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Mensagens",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, {
									className: "h-5 w-5",
									"aria-hidden": true
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsMenu, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountMenu, {})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { redirect: "/dashboard" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "mono",
							size: "pill",
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" }), " Entrar"]
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border/60 px-4 pb-3 pt-2 md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "flex h-11 items-center gap-2 rounded-2xl border border-border bg-card/70 px-3 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Buscar produtos e categorias",
						className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
						"aria-label": "Buscar produtos e categorias"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground",
						children: "Buscar"
					})
				]
			})
		})]
	});
}
function CategoriesMenu({ categories, activeCat, inline = false }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [term, setTerm] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("populares");
	const active = categories.find((c) => c.slug === activeCat);
	const list = (view === "todas" ? [...categories].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")) : categories.slice(0, 12)).filter((c) => c.name.toLowerCase().includes(term.trim().toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (o) => {
			setOpen(o);
			if (!o) setTerm("");
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "pill",
				className: inline ? "h-8 shrink-0 gap-1.5 rounded-full bg-secondary px-3.5 text-sm font-semibold hover:bg-accent data-[state=open]:bg-accent" : "gap-1 border border-transparent text-sm transition-colors hover:border-border hover:bg-accent data-[state=open]:border-border data-[state=open]:bg-accent",
				children: [active ? active.name : "Categorias", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-4xl gap-0 rounded-3xl p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "flex-row items-center justify-between gap-4 border-b border-border px-6 py-5 pr-14",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-bold",
						children: "Categorias"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: term,
							onChange: (e) => setTerm(e.target.value),
							placeholder: "Filtrar categorias",
							className: "h-9 rounded-full pl-9",
							"aria-label": "Filtrar categorias"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-5 border-b border-border px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setView("populares"),
						className: `-mb-px border-b-2 py-3 text-sm transition-colors ${view === "populares" ? "border-foreground font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
						children: "Populares"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setView("todas"),
						className: `-mb-px border-b-2 py-3 text-sm transition-colors ${view === "todas" ? "border-foreground font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
						children: "Todas (A–Z)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid max-h-[26rem] grid-cols-1 gap-2.5 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "col-span-full px-2 py-8 text-center text-sm text-muted-foreground",
						children: "Nenhuma categoria encontrada."
					}), list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/produtos",
						search: {
							q: "",
							cat: c.slug,
							sort: "recentes"
						},
						onClick: () => setOpen(false),
						className: `flex items-center gap-3 rounded-xl border p-3 transition-colors ${c.slug === activeCat ? "border-primary/60 bg-accent" : "border-border bg-card/40 hover:border-foreground/20 hover:bg-accent"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryVisual, {
								category: c,
								className: "h-5 w-5"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-sm font-medium",
							children: c.name
						})]
					}, c.slug))]
				})
			]
		})]
	});
}
function DrawerContent({ categories, activeCat, sitePages, onNavigate, theme, toggle }) {
	const { user, profile, isStaff, isAdmin } = useAuth();
	const [catTerm, setCatTerm] = (0, import_react.useState)("");
	const filteredCats = categories.filter((c) => c.name.toLowerCase().includes(catTerm.trim().toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-full flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border bg-gradient-hero p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetClose, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": "Fechar menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					onClick: onNavigate,
					className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "h-11 w-11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: profile?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: (profile?.username ?? "U").slice(0, 2).toUpperCase() })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: profile?.display_name || profile?.username
						}), isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminBadge, { className: "mt-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: ["Saldo ", formatPrice(profile?.balance_cents ?? 0)]
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					search: { redirect: "/dashboard" },
					onClick: onNavigate,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full gap-2 bg-gradient-primary text-primary-foreground shadow-glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" }), " Entrar ou criar conta"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerSection, {
					title: "Descobrir",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
							to: "/produtos",
							search: {
								q: "",
								cat: "todas",
								sort: "recentes"
							},
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }),
							onNavigate,
							children: "Marketplace"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
							to: "/produtos",
							search: {
								q: "",
								cat: "todas",
								sort: "vendidos"
							},
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4" }),
							onNavigate,
							children: "Mais vendidos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
							to: "/vendedores",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
							onNavigate,
							children: "Vendedores verificados"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerSection, {
					title: "Minha conta",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
							to: "/dashboard",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }),
							onNavigate,
							children: "Painel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
							to: "/mensagens",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }),
							onNavigate,
							children: "Mensagens"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
							to: "/notificacoes",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }),
							onNavigate,
							children: "Notificações"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
							to: "/dashboard",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
							onNavigate,
							children: "Carteira e saques"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
							to: "/verificacao",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4" }),
							onNavigate,
							children: "Verificação de identidade"
						}),
						isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
							to: "/admin",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary" }),
							onNavigate,
							children: "Painel administrativo"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerSection, {
					title: "Categorias",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: catTerm,
							onChange: (e) => setCatTerm(e.target.value),
							placeholder: "Buscar categoria...",
							className: "h-9 pl-9",
							"aria-label": "Buscar categoria"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/produtos",
								search: {
									q: "",
									cat: "todas",
									sort: "recentes"
								},
								onClick: onNavigate,
								className: `flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${activeCat === "todas" ? "border-primary/60 bg-accent" : "border-border bg-card"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), " Todas as categorias"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: filteredCats.map((c) => {
									const isActive = c.slug === activeCat;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/produtos",
										search: {
											q: "",
											cat: c.slug,
											sort: "recentes"
										},
										onClick: onNavigate,
										className: `flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${isActive ? "border-primary/60 bg-accent font-semibold" : "border-border bg-card font-medium hover:border-primary/50"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-5 w-5 shrink-0 place-items-center overflow-hidden rounded text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryVisual, {
												category: c,
												className: "h-4 w-4 text-primary"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: c.name
										})]
									}, c.slug);
								})
							}),
							filteredCats.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-1 py-2 text-xs text-muted-foreground",
								children: "Nenhuma categoria encontrada."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerSection, {
					title: "Taxa de serviço",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: PROTECTION_TIERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center justify-between text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }),
										" ",
										t.name
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-primary",
									children: ["+", formatPrice(t.feeCents)]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: t.tagline
							})]
						}, t.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerSection, {
					title: "Plataforma",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 px-1 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-primary" }), " Entrega automática 24/7"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 px-1 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-primary" }), " Pagamento em custódia"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 px-1 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-4 w-4 text-primary" }), " Suporte com mediação"]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerSection, {
					title: "Termos e políticas",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-1",
						children: sitePages.map((pg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/p/$slug",
							params: { slug: pg.slug },
							onClick: onNavigate,
							className: "flex items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }),
								" ",
								pg.title
							]
						}, pg.slug))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: toggle,
					className: "mt-6 flex w-full items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [
							theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" }),
							"Tema ",
							theme === "dark" ? "claro" : "escuro"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center justify-center gap-3 border-t border-border pt-5 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-4 w-4" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-center text-[11px] text-muted-foreground",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" LynkoMarketplace"
					]
				})
			]
		})]
	});
}
function DrawerSection({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-7",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-1 rounded-2xl border border-border bg-card p-1.5",
			children
		})]
	});
}
function DrawerLink({ to, search, icon, children, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		search,
		onClick: onNavigate,
		className: "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent",
		activeProps: { className: "bg-accent font-medium text-primary" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 truncate",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" })
		]
	});
}
var ADMIN_SUPPORT_DISCORD_URL = "https://discord.gg/VGmrEsRx2U";
var BRAND_LOGO_URL = "https://i.ibb.co/DDk11nFh/lynko-market-logo.png";
function SiteFooter() {
	const { theme } = useTheme();
	const { data: pages = [] } = useQuery({
		queryKey: ["site-pages"],
		queryFn: fetchSitePages
	});
	const legalLinks = pages.length > 0 ? pages.map((p) => ({
		slug: p.slug,
		title: p.title
	})) : [
		{
			slug: "termos",
			title: "Termos de uso"
		},
		{
			slug: "privacidade",
			title: "Privacidade"
		},
		{
			slug: "reembolso",
			title: "Reembolso"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-24 border-t border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: BRAND_LOGO_URL,
								alt: "Lynko Market",
								className: "h-9 w-auto",
								style: theme === "light" ? { filter: "invert(1)" } : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground",
								children: "Plataforma para comprar e vender contas, itens digitais e serviços com intermédio seguro, suporte administrativo pelo Discord e acompanhamento de entrega."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm font-medium text-foreground",
								children: "Andrey Jairo dos Santos Silva"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "CNPJ: 63.003.956/0001-67"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: ADMIN_SUPPORT_DISCORD_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " Comunidade no Discord"]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Acesso rápido",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Acesso rápido"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 grid gap-2.5 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/dashboard",
										className: "transition-colors hover:text-foreground",
										children: "Anunciar"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/produtos",
										search: {
											q: "",
											cat: "todas",
											sort: "recentes"
										},
										className: "transition-colors hover:text-foreground",
										children: "Categorias"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/favoritos",
										className: "transition-colors hover:text-foreground",
										children: "Favoritos"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/ofertas",
										className: "transition-colors hover:text-foreground",
										children: "Ofertas"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/roadmap",
										className: "transition-colors hover:text-foreground",
										children: "Roadmap público"
									}) })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Suporte",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Suporte"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 grid gap-2.5 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/p/$slug",
										params: { slug: "regras-do-vendedor" },
										className: "transition-colors hover:text-foreground",
										children: "Regras do vendedor"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/protecao",
										className: "transition-colors hover:text-foreground",
										children: "Como funciona a proteção"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/ajuda",
										className: "transition-colors hover:text-foreground",
										children: "Central de ajuda"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/seguranca",
										className: "transition-colors hover:text-foreground",
										children: "Segurança"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/taxas",
										className: "transition-colors hover:text-foreground",
										children: "Taxas transparentes"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/como-funciona",
										className: "transition-colors hover:text-foreground",
										children: "Como funciona"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/status",
										className: "transition-colors hover:text-foreground",
										children: "Status"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: ADMIN_SUPPORT_DISCORD_URL,
										target: "_blank",
										rel: "noreferrer",
										className: "transition-colors hover:text-foreground",
										children: "Discord"
									}) })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Institucional",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Institucional"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 grid gap-2.5 text-sm text-muted-foreground",
								children: legalLinks.map((pg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/p/$slug",
									params: { slug: pg.slug },
									className: "transition-colors hover:text-foreground",
									children: pg.title
								}) }, pg.slug))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-background/50 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-primary" }), " Advertências e responsabilidade"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs leading-relaxed text-muted-foreground",
									children: "Advertências aparecem no painel quando identificamos descumprimento das regras. Reincidências podem limitar anúncios, saques ou acesso à conta. Consulte as regras e fale com o suporte administrativo no Discord se precisar contestar uma decisão."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/p/$slug",
									params: { slug: "regras-do-vendedor" },
									className: "mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Ver regras atualizadas"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "border-t border-border py-8",
					"aria-labelledby": "footer-seals-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							id: "footer-seals-title",
							className: "flex items-center gap-2 text-sm font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), " Selos da comunidade"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Passe o mouse nos selos dos vendedores para entender como cada um é conquistado."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/vendedores",
							className: "text-xs font-semibold text-primary hover:underline",
							children: "Ver vendedores →"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5",
						children: [
							["Funcionário Lynko", "Perfil pertencente a um funcionário autorizado da equipe."],
							["Identidade verificada", "Documentos analisados e aprovados no nível indicado."],
							["Excelente", "Pelo menos 5 avaliações e reputação mínima de 90% positiva."],
							["Prestígio", "Histórico consistente, com pelo menos 10 avaliações e ótima reputação."],
							["Entrega veloz", "Possui anúncios com entrega automática pelo chat do pedido."]
						].map(([name, explanation]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							title: explanation,
							className: "cursor-help rounded-xl border border-border bg-background/50 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold",
								children: name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] leading-relaxed text-muted-foreground",
								children: explanation
							})]
						}, name))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Copyright © LynkoMarketplace ", (/* @__PURE__ */ new Date()).getFullYear()] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hidden lg:block",
							children: "Hospedado na nuvem com segurança"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mercado digital com foco em segurança e praticidade." })
					]
				})
			]
		})
	});
}
var items = [
	{
		label: "Início",
		icon: House,
		to: "/",
		match: (p) => p === "/"
	},
	{
		label: "Buscar",
		icon: Search,
		to: "/produtos",
		search: {
			q: "",
			cat: "todas",
			sort: "recentes"
		},
		match: (p) => p.startsWith("/produtos") || p.startsWith("/produto/")
	},
	{
		label: "Favoritos",
		icon: Heart,
		to: "/favoritos",
		match: (p) => p.startsWith("/favoritos")
	},
	{
		label: "Mensagens",
		icon: MessageCircle,
		to: "/mensagens",
		match: (p) => p.startsWith("/mensagens")
	},
	{
		label: "Painel",
		icon: LayoutDashboard,
		to: "/dashboard",
		match: (p) => p.startsWith("/dashboard")
	}
];
function MobileTabBar() {
	const { user } = useAuth();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Navegação do celular",
		className: "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl md:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-5",
			children: items.map((item) => {
				const active = item.match(pathname);
				const Icon = item.icon;
				const needsAuth = item.to !== "/" && item.to !== "/produtos" && !user;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: needsAuth ? "/auth" : item.to,
					search: item.search ?? void 0,
					className: cn("flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition active:scale-95", active ? "text-primary" : "text-muted-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("grid h-8 w-12 place-items-center rounded-full transition", active && "bg-primary/12"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-[18px] w-[18px] transition", active && "scale-110") })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: item.label
					})]
				}) }, item.label);
			})
		})
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		position: "top-right",
		expand: true,
		closeButton: true,
		offset: 16,
		toastOptions: {
			duration: 2500,
			classNames: {
				toast: "lynko-toast group toast font-display group-[.toaster]:border group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:bg-card/90 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-glow group-[.toaster]:gap-3 group-[.toaster]:pr-12",
				title: "group-[.toast]:text-sm group-[.toast]:font-bold group-[.toast]:tracking-tight",
				description: "group-[.toast]:text-xs group-[.toast]:text-muted-foreground",
				icon: "group-[.toast]:[&>svg]:h-5 group-[.toast]:[&>svg]:w-5",
				actionButton: "group-[.toast]:bg-gradient-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:font-semibold",
				cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl",
				closeButton: "group-[.toast]:right-2 group-[.toast]:left-auto group-[.toast]:top-2 group-[.toast]:z-20 group-[.toast]:grid group-[.toast]:h-8 group-[.toast]:w-8 group-[.toast]:place-items-center group-[.toast]:rounded-lg group-[.toast]:bg-card group-[.toast]:border-border group-[.toast]:cursor-pointer group-[.toast]:pointer-events-auto",
				success: "lynko-toast-success",
				error: "lynko-toast-error",
				warning: "lynko-toast-warning",
				info: "lynko-toast-info"
			}
		},
		...props
	});
};
var CONSENT_KEY = "lynko-cookie-consent";
function CookieConsent() {
	const [consent, setConsent] = (0, import_react.useState)(null);
	const [customizing, setCustomizing] = (0, import_react.useState)(false);
	const [analytics, setAnalytics] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const stored = window.localStorage.getItem(CONSENT_KEY);
			if (stored) setConsent(JSON.parse(stored));
		} catch {}
	}, []);
	if (consent) return null;
	const save = (value) => {
		setConsent(value);
		window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
		document.cookie = `lynko_cookie_consent=${value.analytics ? "all" : "essential"}; path=/; max-age=31536000; SameSite=Lax`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-4 shadow-glow backdrop-blur-xl sm:inset-x-6 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cookie, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold",
						children: "Sua privacidade importa"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted-foreground",
						children: [
							"Usamos cookies essenciais para manter a sessão e melhorar a experiência. Cookies analíticos são opcionais. Consulte a",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/p/$slug",
								params: { slug: "privacidade" },
								className: "text-primary hover:underline",
								children: "Política de Privacidade"
							}),
							"."
						]
					})]
				})]
			}),
			customizing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-2xl border border-border bg-accent/40 p-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "block",
						children: "Cookies essenciais"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Necessários para login, carrinho e segurança."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-500" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "block",
						children: "Cookies analíticos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Ajudam a entender o uso da plataforma."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: analytics,
						onChange: (event) => setAnalytics(event.target.checked),
						className: "h-4 w-4 accent-primary"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap justify-end gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => setCustomizing((value) => !value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "mr-1.5 h-4 w-4" }), " Personalizar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => save({
							essential: true,
							analytics: false
						}),
						children: "Apenas essenciais"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						className: "bg-gradient-primary text-primary-foreground",
						onClick: () => save({
							essential: true,
							analytics: customizing ? analytics : true
						}),
						children: "Aceitar todos"
					}),
					customizing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => save({
							essential: true,
							analytics
						}),
						children: "Salvar preferências"
					})
				]
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "A página que você procura não existe ou foi movida."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Voltar ao início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Esta página não carregou"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Algo deu errado por aqui. Tente atualizar a página ou volte para o início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Tentar novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Voltar ao início"
					})]
				})
			]
		})
	});
}
var Route$36 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "LynkoMarketplace Marketplace de Produtos Digitais" },
			{
				name: "description",
				content: "Marketplace de produtos digitais com entrega automática, vendedores verificados e pagamento em custódia."
			},
			{
				property: "og:title",
				content: "LynkoMarketplace Marketplace de Produtos Digitais"
			},
			{
				property: "og:description",
				content: "Entrega automática, vendedores verificados e pagamento protegido."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$36.useRouteContext();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const isDashboard = pathname === "/dashboard";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ThemeProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 overflow-x-hidden pb-16 md:pb-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						initial: false,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
								duration: .2,
								ease: "easeOut"
							},
							className: "min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
						}, pathname)
					})
				}),
				!isDashboard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieConsent, {})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] })
	});
}
var $$splitComponentImporter$31 = () => import("./routes-nGk-Wqgp.mjs");
var Route$35 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "LynkoMarketplace Produtos digitais com entrega automática" },
			{
				name: "google-site-verification",
				content: "xVeXP1vN-Vlx0bHd1Rw9URLIKZrVdcNYeBGYCrjLA9g"
			},
			{
				name: "description",
				content: "Compre e venda contas, chaves e serviços digitais com entrega automática, vendedores verificados e pagamento protegido no LynkoMarketplace."
			},
			{
				property: "og:title",
				content: "LynkoMarketplace Produtos digitais com entrega automática"
			},
			{
				property: "og:description",
				content: "Entrega automática, vendedores verificados e pagamento protegido em custódia."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "robots",
				content: "index,follow,max-image-preview:large"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://www.lynkomarketplace.online/"
		}, {
			rel: "preconnect",
			href: "https://i.ibb.co"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./route-Di7iQBCH.mjs");
var Route$34 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({
			to: "/auth",
			search: { redirect: "/dashboard" }
		});
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./ajuda-DOp8ySJZ.mjs");
var Route$33 = createFileRoute("/ajuda")({
	head: () => ({ meta: [{ title: "Central de ajuda | LynkoMarketplace" }, {
		name: "description",
		content: "Respostas sobre compras, vendas, Pix, pedidos, segurança e disputas na Lynko."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./auth-BioLZf02.mjs");
var Route$32 = createFileRoute("/auth")({
	validateSearch: objectType({ redirect: stringType().optional() }),
	head: () => ({ meta: [
		{ title: "Entrar ou criar conta | LynkoMarketplace" },
		{
			name: "description",
			content: "Aceda à sua conta LynkoMarketplace para comprar, vender e gerir a sua loja digital com segurança."
		},
		{
			property: "og:title",
			content: "Entrar ou criar conta | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Login e registo seguro no marketplace LynkoMarketplace."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./blog-Q9-88MMI.mjs");
var Route$31 = createFileRoute("/blog")({
	head: () => ({ meta: [{ title: "Blog | LynkoMarketplace" }, {
		name: "description",
		content: "Novidades, dicas e informações da comunidade LynkoMarketplace."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./como-funciona-yAS9pNC4.mjs");
var Route$30 = createFileRoute("/como-funciona")({
	head: () => ({ meta: [{ title: "Como funciona | LynkoMarketplace" }, {
		name: "description",
		content: "Veja como comprar e vender produtos digitais com Pix na Lynko."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./labs-CjPYVTkn.mjs");
var Route$29 = createFileRoute("/labs")({
	head: () => ({ meta: [{ title: "Lynko Labs | LynkoMarketplace" }, {
		name: "description",
		content: "Novidades e experiências que a Lynko está testando com a comunidade."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./ofertas-BzmD0IQN.mjs");
var Route$28 = createFileRoute("/ofertas")({
	head: () => ({ meta: [{ title: "Ofertas reais | LynkoMarketplace" }, {
		name: "description",
		content: "Encontre produtos em destaque e ofertas publicadas por vendedores da Lynko."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./produtos-DMDmyXSN.mjs");
var searchSchema = objectType({
	q: stringType().catch(""),
	cat: stringType().catch("todas"),
	sort: enumType([
		"recentes",
		"menor",
		"maior",
		"vendidos"
	]).catch("recentes")
});
var Route$27 = createFileRoute("/produtos")({
	validateSearch: searchSchema,
	head: () => ({ meta: [
		{ title: "Marketplace de produtos digitais | LynkoMarketplace" },
		{
			name: "description",
			content: "Pesquise e filtre milhares de produtos digitais com entrega automática e vendedores verificados no LynkoMarketplace."
		},
		{
			property: "og:title",
			content: "Marketplace de produtos digitais | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Filtros avançados, entrega automática e vendedores verificados."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./produtos-proibidos-C_lhdIR3.mjs");
var Route$26 = createFileRoute("/produtos-proibidos")({
	head: () => ({ meta: [{ title: "Produtos proibidos | LynkoMarketplace" }, {
		name: "description",
		content: "Conheça os produtos e práticas que não podem ser anunciados na Lynko."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./protecao-CK0d1gDh.mjs");
var Route$25 = createFileRoute("/protecao")({
	head: () => ({ meta: [
		{ title: "Como funciona a proteção de compra | LynkoMarketplace" },
		{
			name: "description",
			content: "Entenda a compra protegida do LynkoMarketplace: pagamento em custódia, etapas do pedido, níveis de proteção, prazos de disputa e reembolso."
		},
		{
			property: "og:title",
			content: "Como funciona a proteção de compra | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Pagamento retido até a entrega, mediação da equipe e reembolso garantido."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./reset-password-CkwXkaTK.mjs");
var Route$24 = createFileRoute("/reset-password")({
	head: () => ({ meta: [
		{ title: "Definir nova senha | LynkoMarketplace" },
		{
			name: "description",
			content: "Crie uma nova senha para a sua conta LynkoMarketplace com segurança."
		},
		{
			property: "og:title",
			content: "Definir nova senha | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Recuperação de acesso à conta LynkoMarketplace."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./roadmap-MN7LJO4z.mjs");
var Route$23 = createFileRoute("/roadmap")({
	head: () => ({ meta: [{ title: "Roadmap público | LynkoMarketplace" }, {
		name: "description",
		content: "Acompanhe o que já foi feito, está em desenvolvimento e está planejado na Lynko."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./seguranca-BaWZ9P7H.mjs");
var Route$22 = createFileRoute("/seguranca")({
	head: () => ({ meta: [{ title: "Segurança | LynkoMarketplace" }, {
		name: "description",
		content: "Como a Lynko protege contas, pagamentos, pedidos e comunidade."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./status-Kp4-U8ue.mjs");
var Route$21 = createFileRoute("/status")({
	head: () => ({ meta: [
		{ title: "Status da plataforma | LynkoMarketplace" },
		{
			name: "description",
			content: "Acompanhe em tempo real a disponibilidade do catálogo, contas, mensagens e pagamentos do LynkoMarketplace."
		},
		{
			property: "og:title",
			content: "Status da plataforma | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Disponibilidade dos serviços do LynkoMarketplace em tempo real."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./taxas-BrKAKBa7.mjs");
var Route$20 = createFileRoute("/taxas")({
	head: () => ({ meta: [{ title: "Taxas | LynkoMarketplace" }, {
		name: "description",
		content: "Veja como funcionam as taxas da Lynko e calcule o valor líquido da venda."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./vendedores-i5ELCLwI.mjs");
var Route$19 = createFileRoute("/vendedores")({
	head: () => ({ meta: [
		{ title: "Vendedores verificados | LynkoMarketplace" },
		{
			name: "description",
			content: "Conheça os vendedores do LynkoMarketplace, com verificação de identidade e reputação pública."
		},
		{
			property: "og:title",
			content: "Vendedores verificados | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Perfis, reputação e anúncios dos vendedores."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./admin-C36Q-gnI.mjs");
var Route$18 = createFileRoute("/_authenticated/admin")({
	head: () => ({ meta: [
		{ title: "Administração | LynkoMarketplace" },
		{
			name: "description",
			content: "Painel de administração: moderação, denúncias, KYC e saques."
		},
		{
			property: "og:title",
			content: "Administração | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Gestão completa da plataforma LynkoMarketplace."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./dashboard-B3bYhCu-.mjs");
var Route$17 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Painel do usuário | LynkoMarketplace" },
		{
			name: "description",
			content: "Gerencie anúncios, compras, vendas, saldo e saques no painel LynkoMarketplace."
		},
		{
			property: "og:title",
			content: "Painel do usuário | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Dashboard completo de compras, vendas e carteira."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./favoritos-BkdMbKEj.mjs");
var Route$16 = createFileRoute("/_authenticated/favoritos")({
	head: () => ({ meta: [
		{ title: "Meus favoritos LynkoMarketplace" },
		{
			name: "description",
			content: "Os anúncios que você guardou para comprar depois no LynkoMarketplace."
		},
		{
			property: "og:title",
			content: "Meus favoritos LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Os anúncios que você guardou para comprar depois."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./mensagens-DUH53Z9B.mjs");
var Route$15 = createFileRoute("/_authenticated/mensagens")({
	validateSearch: (search) => typeof search["c"] === "string" ? { c: search["c"] } : {},
	head: () => ({ meta: [
		{ title: "Caixa de mensagens | LynkoMarketplace" },
		{
			name: "description",
			content: "Sua caixa de mensagens: converse em tempo real com compradores e vendedores, veja não lidas e acione a moderação."
		},
		{
			property: "og:title",
			content: "Caixa de mensagens | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Chat seguro entre cliente e vendedor com moderação."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./notificacoes-inElirTf.mjs");
var Route$14 = createFileRoute("/_authenticated/notificacoes")({
	head: () => ({ meta: [
		{ title: "Central de notificações | LynkoMarketplace" },
		{
			name: "description",
			content: "Acompanhe mensagens, pedidos, saques e verificações em um só lugar e escolha o que quer receber."
		},
		{
			property: "og:title",
			content: "Central de notificações | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Tudo o que acontece na sua conta, em tempo real."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./suporte-C5FLw5-e.mjs");
var Route$13 = createFileRoute("/_authenticated/suporte")({
	head: () => ({ meta: [{ title: "Suporte administrativo | LynkoMarketplace" }, {
		name: "description",
		content: "Suporte administrativo oficial da LynkoMarketplace pelo Discord."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./verificacao-Cp7NXTVq.mjs");
var Route$12 = createFileRoute("/_authenticated/verificacao")({
	head: () => ({ meta: [{ title: "Verificação de identidade | LynkoMarketplace" }, {
		name: "description",
		content: "Envie seus dados e documentos para análise da equipe LynkoMarketplace."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./blog._slug-COkp6E9h.mjs");
var Route$11 = createFileRoute("/blog/$slug")({
	head: ({ params }) => ({ meta: [{ title: `${params.slug.replace(/^blog-/, "")} | LynkoMarketplace` }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./blog.editar-BneYqJXy.mjs");
var Route$10 = createFileRoute("/blog/editar")({
	head: () => ({ meta: [{ title: "Gerenciar blog | LynkoMarketplace" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./checkout._slug-BwXACdpD.mjs");
var Route$9 = createFileRoute("/checkout/$slug")({
	validateSearch: (s) => ({
		variant: typeof s.variant === "string" ? s.variant : void 0,
		qty: Math.max(1, Math.min(20, Number(s.qty) || 1))
	}),
	head: () => ({ meta: [
		{ title: "Checkout seguro | LynkoMarketplace" },
		{
			name: "description",
			content: "Escolha o seu nível de proteção e finalize a compra com pagamento em custódia."
		},
		{
			property: "og:title",
			content: "Checkout seguro | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Pagamento protegido e entrega automática."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./p._slug-DPKdFEMB.mjs");
var Route$8 = createFileRoute("/p/$slug")({
	head: ({ params }) => {
		const title = `${params.slug.replace(/-/g, " ")} | LynkoMarketplace`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: "Termos, políticas e informação legal da LynkoMarketplace."
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: "Termos, políticas e informação legal da LynkoMarketplace."
			},
			{
				property: "og:type",
				content: "article"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
/** Render simples e seguro de markdown básico (##, ###, listas, parágrafos). */
var $$splitComponentImporter$3 = () => import("./produto._slug-BBTelvCQ.mjs");
var Route$7 = createFileRoute("/produto/$slug")({
	head: ({ params }) => {
		const name = params.slug.replace(/-/g, " ");
		return {
			meta: [
				{ title: `${name} | LynkoMarketplace` },
				{
					name: "description",
					content: `Compre ${name} com pagamento protegido, entrega acompanhada e suporte no LynkoMarketplace.`
				},
				{
					name: "keywords",
					content: `${name}, produto digital, compra segura, LynkoMarketplace`
				},
				{
					property: "og:title",
					content: `${name} | LynkoMarketplace`
				},
				{
					property: "og:description",
					content: "Compra protegida com entrega automática."
				},
				{
					property: "og:type",
					content: "product"
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "robots",
					content: "index,follow,max-image-preview:large"
				}
			],
			links: [{
				rel: "canonical",
				href: `https://www.lynkomarketplace.online/produto/${params.slug}`
			}, {
				rel: "preconnect",
				href: "https://i.ibb.co"
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./vendedor._slug-BKUoKqYJ.mjs");
var Route$6 = createFileRoute("/vendedor/$slug")({
	head: ({ params }) => ({
		meta: [
			{ title: `@${params.slug} perfil do vendedor | LynkoMarketplace` },
			{
				name: "description",
				content: `Veja anúncios, avaliações e reputação do vendedor @${params.slug} no LynkoMarketplace.`
			},
			{
				property: "og:title",
				content: `@${params.slug} perfil do vendedor | LynkoMarketplace`
			},
			{
				property: "og:description",
				content: "Reputação, avaliações e anúncios do vendedor."
			},
			{
				property: "og:type",
				content: "profile"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "robots",
				content: "index,follow,max-image-preview:large"
			}
		],
		links: [{
			rel: "canonical",
			href: `https://www.lynkomarketplace.online/vendedor/${params.slug}`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./pedido._id-CssJpe8x.mjs");
var Route$5 = createFileRoute("/_authenticated/pedido/$id")({
	head: () => ({ meta: [
		{ title: "Rastreamento do pedido | LynkoMarketplace" },
		{
			name: "description",
			content: "Acompanhe o estado do seu pedido em tempo real e veja o recibo detalhado."
		},
		{
			property: "og:title",
			content: "Rastreamento do pedido | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Estado em tempo real, recibo de taxas e entrega automática."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./recibo._id-DQ22eOCL.mjs");
var Route$4 = createFileRoute("/_authenticated/recibo/$id")({
	head: () => ({ meta: [
		{ title: "Compra concluída | LynkoMarketplace" },
		{
			name: "description",
			content: "Recibo da sua compra: estado do pedido, resumo do pagamento, entrega e canal de suporte."
		},
		{
			property: "og:title",
			content: "Compra concluída | LynkoMarketplace"
		},
		{
			property: "og:description",
			content: "Recibo com resumo do pagamento e suporte direto."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$3 = createFileRoute("/api/public/didit-webhook")({ server: { handlers: {
	POST: async ({ request }) => {
		const { verifyDiditSignature, applyDiditDecision } = await import("./didit.server-DEa6nkFn.mjs");
		const raw = await request.text();
		if (!verifyDiditSignature(raw, request.headers.get("x-signature-v2") ?? request.headers.get("x-signature"), request.headers.get("x-timestamp"))) return new Response("Invalid signature", { status: 401 });
		try {
			const body = JSON.parse(raw);
			if (body.session_id && body.status) await applyDiditDecision({
				session_id: body.session_id,
				status: body.status,
				decision: body.decision ?? body,
				...body.event_id ? { event_id: body.event_id } : {}
			});
		} catch (error) {
			console.error("[didit-webhook]", error);
		}
		return new Response("ok", { status: 200 });
	},
	GET: async () => new Response("ok")
} } });
var Route$2 = createFileRoute("/api/public/efi-webhook")({ server: { handlers: {
	POST: async ({ request }) => {
		const { getEfiNotification, EFI_PAID_STATUSES, efiConfigured } = await import("./efi.server-DFMEMm5a.mjs");
		const { fulfillOrder } = await import("./fulfillment.server-Cub17CqI.mjs");
		if (!efiConfigured()) return new Response("not configured", { status: 200 });
		let token;
		const raw = await request.text();
		try {
			token = JSON.parse(raw).notification;
		} catch {
			token = new URLSearchParams(raw).get("notification") ?? void 0;
		}
		if (!token) return new Response("ok", { status: 200 });
		try {
			const events = await getEfiNotification(token);
			for (const event of events) {
				const payload = event;
				const status = typeof payload.status?.current === "string" ? payload.status.current : "";
				const orderId = typeof payload.custom_id === "string" ? payload.custom_id : null;
				if (orderId && EFI_PAID_STATUSES.includes(status)) await fulfillOrder(orderId);
			}
		} catch (error) {
			console.error("[efi-webhook]", error);
		}
		return new Response("ok", { status: 200 });
	},
	GET: async () => new Response("ok")
} } });
var Route$1 = createFileRoute("/api/public/robots")({ server: { handlers: { GET: async () => new Response("User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /auth\nDisallow: /admin\nDisallow: /mensagens\nDisallow: /api/\nSitemap: https://www.lynkomarketplace.online/sitemap.xml\n", { headers: {
	"Content-Type": "text/plain; charset=utf-8",
	"Cache-Control": "public, max-age=3600"
} }) } } });
var SITE_URL = "https://www.lynkomarketplace.online";
function xmlEscape(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
var Route = createFileRoute("/api/public/sitemap")({ server: { handlers: { GET: async () => {
	const { supabaseAdmin } = await import("./client.server-BwQZA6UW.mjs");
	const [{ data: products }, { data: sellers }] = await Promise.all([supabaseAdmin.from("products").select("slug, updated_at").eq("status", "active").limit(5e3), supabaseAdmin.from("profiles").select("username, updated_at").eq("banned", false).limit(5e3)]);
	const urls = [
		...[
			"/",
			"/produtos",
			"/vendedores",
			"/protecao",
			"/status",
			"/p/termos",
			"/p/privacidade",
			"/p/reembolsos",
			"/p/taxas"
		].map((path) => `<url><loc>${SITE_URL}${path}</loc><changefreq>daily</changefreq><priority>${path === "/" ? "1.0" : "0.8"}</priority></url>`),
		...(products ?? []).map((product) => `<url><loc>${SITE_URL}/produto/${xmlEscape(product.slug)}</loc><lastmod>${new Date(product.updated_at).toISOString()}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`),
		...(sellers ?? []).map((seller) => `<url><loc>${SITE_URL}/vendedor/${xmlEscape(seller.username)}</loc><lastmod>${new Date(seller.updated_at).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`)
	];
	return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`, { headers: {
		"Content-Type": "application/xml; charset=utf-8",
		"Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600"
	} });
} } } });
var IndexRoute = Route$35.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$36
});
var AuthenticatedRouteRoute = Route$34.update({
	id: "/_authenticated",
	getParentRoute: () => Route$36
});
var AjudaRoute = Route$33.update({
	id: "/ajuda",
	path: "/ajuda",
	getParentRoute: () => Route$36
});
var AuthRoute = Route$32.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$36
});
var BlogRoute = Route$31.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$36
});
var ComoFuncionaRoute = Route$30.update({
	id: "/como-funciona",
	path: "/como-funciona",
	getParentRoute: () => Route$36
});
var LabsRoute = Route$29.update({
	id: "/labs",
	path: "/labs",
	getParentRoute: () => Route$36
});
var OfertasRoute = Route$28.update({
	id: "/ofertas",
	path: "/ofertas",
	getParentRoute: () => Route$36
});
var ProdutosRoute = Route$27.update({
	id: "/produtos",
	path: "/produtos",
	getParentRoute: () => Route$36
});
var ProdutosProibidosRoute = Route$26.update({
	id: "/produtos-proibidos",
	path: "/produtos-proibidos",
	getParentRoute: () => Route$36
});
var ProtecaoRoute = Route$25.update({
	id: "/protecao",
	path: "/protecao",
	getParentRoute: () => Route$36
});
var ResetPasswordRoute = Route$24.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$36
});
var RoadmapRoute = Route$23.update({
	id: "/roadmap",
	path: "/roadmap",
	getParentRoute: () => Route$36
});
var SegurancaRoute = Route$22.update({
	id: "/seguranca",
	path: "/seguranca",
	getParentRoute: () => Route$36
});
var StatusRoute = Route$21.update({
	id: "/status",
	path: "/status",
	getParentRoute: () => Route$36
});
var TaxasRoute = Route$20.update({
	id: "/taxas",
	path: "/taxas",
	getParentRoute: () => Route$36
});
var VendedoresRoute = Route$19.update({
	id: "/vendedores",
	path: "/vendedores",
	getParentRoute: () => Route$36
});
var AuthenticatedAdminRoute = Route$18.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$17.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFavoritosRoute = Route$16.update({
	id: "/favoritos",
	path: "/favoritos",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMensagensRoute = Route$15.update({
	id: "/mensagens",
	path: "/mensagens",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNotificacoesRoute = Route$14.update({
	id: "/notificacoes",
	path: "/notificacoes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSuporteRoute = Route$13.update({
	id: "/suporte",
	path: "/suporte",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedVerificacaoRoute = Route$12.update({
	id: "/verificacao",
	path: "/verificacao",
	getParentRoute: () => AuthenticatedRouteRoute
});
var BlogSlugRoute = Route$11.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => BlogRoute
});
var BlogEditarRoute = Route$10.update({
	id: "/editar",
	path: "/editar",
	getParentRoute: () => BlogRoute
});
var CheckoutSlugRoute = Route$9.update({
	id: "/checkout/$slug",
	path: "/checkout/$slug",
	getParentRoute: () => Route$36
});
var PSlugRoute = Route$8.update({
	id: "/p/$slug",
	path: "/p/$slug",
	getParentRoute: () => Route$36
});
var ProdutoSlugRoute = Route$7.update({
	id: "/produto/$slug",
	path: "/produto/$slug",
	getParentRoute: () => Route$36
});
var VendedorSlugRoute = Route$6.update({
	id: "/vendedor/$slug",
	path: "/vendedor/$slug",
	getParentRoute: () => Route$36
});
var AuthenticatedPedidoIdRoute = Route$5.update({
	id: "/pedido/$id",
	path: "/pedido/$id",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReciboIdRoute = Route$4.update({
	id: "/recibo/$id",
	path: "/recibo/$id",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiPublicDiditWebhookRoute = Route$3.update({
	id: "/api/public/didit-webhook",
	path: "/api/public/didit-webhook",
	getParentRoute: () => Route$36
});
var ApiPublicEfiWebhookRoute = Route$2.update({
	id: "/api/public/efi-webhook",
	path: "/api/public/efi-webhook",
	getParentRoute: () => Route$36
});
var ApiPublicRobotsRoute = Route$1.update({
	id: "/api/public/robots",
	path: "/api/public/robots",
	getParentRoute: () => Route$36
});
var ApiPublicSitemapRoute = Route.update({
	id: "/api/public/sitemap",
	path: "/api/public/sitemap",
	getParentRoute: () => Route$36
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedFavoritosRoute,
	AuthenticatedMensagensRoute,
	AuthenticatedNotificacoesRoute,
	AuthenticatedSuporteRoute,
	AuthenticatedVerificacaoRoute,
	AuthenticatedPedidoIdRoute,
	AuthenticatedReciboIdRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var BlogRouteChildren = {
	BlogSlugRoute,
	BlogEditarRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AjudaRoute,
	AuthRoute,
	BlogRoute: BlogRoute._addFileChildren(BlogRouteChildren),
	ComoFuncionaRoute,
	LabsRoute,
	OfertasRoute,
	ProdutosRoute,
	ProdutosProibidosRoute,
	ProtecaoRoute,
	ResetPasswordRoute,
	RoadmapRoute,
	SegurancaRoute,
	StatusRoute,
	TaxasRoute,
	VendedoresRoute,
	CheckoutSlugRoute,
	PSlugRoute,
	ProdutoSlugRoute,
	VendedorSlugRoute,
	ApiPublicDiditWebhookRoute,
	ApiPublicEfiWebhookRoute,
	ApiPublicRobotsRoute,
	ApiPublicSitemapRoute
};
var routeTree = Route$36._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 3e4,
		gcTime: 3e5,
		retry: 1,
		refetchOnWindowFocus: false
	} } });
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Input as $, fetchSellerByUsername as A, formatPrice as B, fetchMyWarnings as C, fetchProductReviews as D, fetchProductBySlug as E, fetchVariants as F, DialogDescription as G, timeAgo as H, ratingOf as I, DialogTitle as J, DialogFooter as K, setFavorite as L, fetchSellers as M, fetchSitePage as N, fetchProducts as O, fetchSitePages as P, AvatarImage as Q, uploadMedia as R, fetchMyReviews as S, fetchOrderEvents as T, Dialog as U, slugify as V, DialogContent as W, Avatar as X, DialogTrigger as Y, AvatarFallback as Z, fetchBlogPosts as _, Route$7 as a, fetchFavoriteProducts as b, Route$11 as c, Route$32 as d, Button as et, ADMIN_SUPPORT_DISCORD_URL as f, protectionTier as g, PROTECTION_TIERS as h, Route$6 as i, cn as it, fetchSellerReviews as j, fetchRecentReviews as k, Route$15 as l, CategoryVisual as m, Route$4 as n, ensureMyProfile as nt, Route$8 as o, AdminBadge as p, DialogHeader as q, Route$5 as r, profile_functions_exports as rt, Route$9 as s, router_exports as t, useAuth as tt, Route$27 as u, fetchCategories as v, fetchOrder as w, fetchFollowerCount as x, fetchFavoriteIds as y, FEE_RATE as z };
