import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { x as Star } from "../_libs/lucide-react.mjs";
import { it as cn } from "./router-BVA3mZO7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/star-rating-Qt0Vbggm.js
var import_jsx_runtime = require_jsx_runtime();
function StarRating({ value, onChange, size = "sm", className }) {
	const dim = size === "md" ? "h-5 w-5" : "h-4 w-4";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center gap-0.5", className),
		role: onChange ? "radiogroup" : void 0,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((n) => {
			const icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn(dim, n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40") });
			if (!onChange) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: icon }, n);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "radio",
				"aria-checked": value === n,
				"aria-label": `${n} ${n === 1 ? "estrela" : "estrelas"}`,
				onClick: () => onChange(n),
				className: "rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				children: icon
			}, n);
		})
	});
}
//#endregion
export { StarRating as t };
