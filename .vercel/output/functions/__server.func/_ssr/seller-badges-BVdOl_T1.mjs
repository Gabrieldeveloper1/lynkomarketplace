import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as ShieldCheck, Ut as Crown, hn as BadgeCheck, t as Zap, x as Star } from "../_libs/lucide-react.mjs";
import { it as cn } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seller-badges-BVdOl_T1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function publicVerificationLabel(verified) {
	return verified ? "Documentos verificados" : "Não verificado";
}
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
function SellerBadges({ profile, reviewCount = 0, positiveReviews = 0, hasAutomaticDelivery = false, compact = false }) {
	const positiveRate = reviewCount ? positiveReviews / reviewCount * 100 : 0;
	const badges = [];
	if (profile.staff_badge) badges.push({
		key: "staff",
		label: "Funcionário Lynko",
		explanation: "Este perfil pertence a um funcionário autorizado da equipe Lynko.",
		icon: ShieldCheck,
		className: "border-primary/40 bg-primary/10 text-primary"
	});
	if (profile.verified) badges.push({
		key: "verified",
		label: "Identidade verificada",
		explanation: `A identidade foi aprovada pela Lynko no nível ${profile.verification_level || "verificado"}.`,
		icon: BadgeCheck,
		className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
	});
	if (reviewCount >= 5 && positiveRate >= 90) badges.push({
		key: "excellent",
		label: "Excelente",
		explanation: `O vendedor recebeu ${positiveRate.toFixed(0)}% de avaliações positivas em pelo menos 5 compras concluídas.`,
		icon: Star,
		className: "border-amber-500/30 bg-amber-500/10 text-amber-500"
	});
	if (reviewCount >= 10 && positiveRate >= 90) badges.push({
		key: "prestige",
		label: "Prestígio",
		explanation: "Selo de destaque para vendedores com histórico consistente e excelente reputação.",
		icon: Crown,
		className: "border-violet-500/30 bg-violet-500/10 text-violet-500"
	});
	if (hasAutomaticDelivery) badges.push({
		key: "fast-delivery",
		label: "Entrega veloz",
		explanation: "Este vendedor possui anúncios com entrega automática pelo chat do pedido.",
		icon: Zap,
		className: "border-sky-500/30 bg-sky-500/10 text-sky-500"
	});
	if (!badges.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 150,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-1.5",
			children: badges.map((badge) => {
				const Icon = badge.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: `cursor-help gap-1 ${compact ? "px-1.5 text-[10px]" : "text-[11px]"} ${badge.className}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" }),
							" ",
							badge.label
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
					className: "max-w-64 text-center",
					children: badge.explanation
				})] }, badge.key);
			})
		})
	});
}
//#endregion
export { publicVerificationLabel as n, SellerBadges as t };
