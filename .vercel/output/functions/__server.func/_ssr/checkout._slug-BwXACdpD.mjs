import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as createCheckout } from "./commerce.functions-BTItmHS8.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as ShieldCheck, T as ShoppingBag, V as Receipt, an as Check, dt as LoaderCircle, t as Zap, ut as Lock, yn as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Input, B as formatPrice, E as fetchProductBySlug, F as fetchVariants, et as Button, g as protectionTier, h as PROTECTION_TIERS, s as Route$9, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Separator } from "./separator-B3hsz7IR.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout._slug-BwXACdpD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const { slug } = Route$9.useParams();
	const search = Route$9.useSearch();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [protection, setProtection] = (0, import_react.useState)("basica");
	const [variantId, setVariantId] = (0, import_react.useState)(search.variant);
	const quantity = Math.max(1, Math.min(20, search.qty ?? 1));
	const [buying, setBuying] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)(user?.email ?? "");
	const [payment, setPayment] = (0, import_react.useState)(null);
	const { data: product, isLoading } = useQuery({
		queryKey: ["product", slug],
		queryFn: () => fetchProductBySlug(slug)
	});
	const { data: variants = [] } = useQuery({
		queryKey: ["variants", product?.id],
		queryFn: () => fetchVariants(product.id),
		enabled: !!product
	});
	const variant = (0, import_react.useMemo)(() => variants.find((v) => v.id === variantId) ?? (variants.length ? variants[0] : null), [variants, variantId]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-5xl px-4 py-8 sm:py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full rounded-2xl" })
	});
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Anúncio não encontrado."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/produtos",
				children: "Voltar ao marketplace"
			})
		})]
	});
	const unit = variant ? variant.price_cents : product.price_cents;
	const base = unit * quantity;
	const tier = protectionTier(protection);
	const total = base + tier.feeCents;
	const isOwn = user?.id === product.seller_id;
	const confirm = async () => {
		const buyerEmail = email.trim().toLowerCase();
		if (buyerEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(buyerEmail)) {
			toast.error("Informe um e-mail válido ou deixe o campo em branco.");
			return;
		}
		setBuying(true);
		try {
			const res = await createCheckout({ data: {
				productId: product.id,
				variantId: variant?.id ?? null,
				quantity,
				protection,
				email: buyerEmail || void 0
			} });
			if (res.pixCode) toast.success("QR Code Pix gerado! Pague para receber automaticamente.");
			else if (res.message) toast.info(res.message);
			if (res.pixCode || res.pixQrcodeImage) sessionStorage.setItem(`efi-payment:${res.orderId}`, JSON.stringify({
				pix_copy_paste: res.pixCode,
				pix_qrcode: res.pixQrcodeImage
			}));
			if (user) navigate({
				to: "/pedido/$id",
				params: { id: res.orderId }
			});
			else {
				setPayment({
					pixCode: res.pixCode,
					pixQrcodeImage: res.pixQrcodeImage,
					orderId: res.orderId
				});
				toast.success(buyerEmail ? "Compra registrada. Confira também a pasta de spam do seu e-mail." : "Compra registrada. O pedido pode aparecer na parte de spam se você informou um e-mail.");
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Não foi possível iniciar a compra.");
		} finally {
			setBuying(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto max-w-6xl px-4 py-6 pb-28 sm:py-8 lg:pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/produto/$slug",
				params: { slug },
				className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Voltar ao anúncio"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), " Compra protegida"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl",
					children: "Finalize sua compra"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "gap-1 border-emerald-500/30 text-emerald-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Ambiente seguro"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Escolha a variação e o nível de proteção. O valor fica em custódia até à entrega."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card p-1 text-center text-[11px] sm:text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-primary px-2 py-2.5 font-bold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[10px] opacity-75",
							children: "01"
						}), "Configurar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-2 py-2.5 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[10px]",
							children: "02"
						}), "Pagamento"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-2 py-2.5 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[10px]",
							children: "03"
						}), "Entrega"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-3xl border border-primary/20 bg-gradient-surface p-5 shadow-sm sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold",
							children: "Onde receber as informações"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Usaremos o e-mail apenas para comprovante, status e entrega quando aplicável."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "checkout-email",
						className: "font-bold",
						children: "E-mail para receber o produto e o comprovante"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Não é obrigatório informar um e-mail. Se deixar em branco, acompanhe o pedido pela sua conta; se informar um e-mail, confira também a pasta de spam."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "checkout-email",
						type: "email",
						value: email,
						onChange: (event) => setEmail(event.target.value),
						placeholder: "voce@email.com",
						autoComplete: "email",
						className: "mt-3 max-w-xl bg-background"
					})
				]
			}),
			payment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold text-emerald-600",
						children: "Pedido registrado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"Pedido ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: payment.orderId.slice(0, 8) }),
							". Pague com o código Pix abaixo; a confirmação e a entrega serão enviadas para o seu e-mail."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-white p-3 shadow-sm",
							children: payment.pixQrcodeImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: payment.pixQrcodeImage,
								alt: "QR Code Pix do pedido",
								className: "h-52 w-52"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
								value: payment.pixCode,
								size: 208,
								includeMargin: true
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-center text-xs font-semibold text-emerald-700",
						children: "Aponte a câmera do aplicativo do seu banco para pagar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs font-semibold text-foreground",
						children: "Pix copia e cola"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 break-all rounded-xl bg-background p-3 font-mono text-xs",
						children: payment.pixCode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-2 w-full",
						onClick: () => {
							navigator.clipboard.writeText(payment.pixCode);
							toast.success("Código Pix copiado!");
						},
						children: "Copiar código Pix"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[1fr_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [variants.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold uppercase tracking-wider text-muted-foreground",
							children: "1 · Variação do produto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid gap-2 sm:grid-cols-2",
							children: variants.map((v) => {
								const selected = variant?.id === v.id;
								const out = product.auto_delivery && v.stock <= 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: out,
									onClick: () => setVariantId(v.id),
									className: `rounded-xl border p-3 text-left transition disabled:opacity-40 ${selected ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/40"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold",
											children: v.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-primary",
											children: formatPrice(v.price_cents)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[11px] text-muted-foreground",
										children: out ? "Esgotado" : v.description || `${v.stock} disponíveis`
									})]
								}, v.id);
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-muted-foreground",
								children: [variants.length > 0 ? "2" : "1", " · Nível de proteção"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Taxa fixa em centavos igual para qualquer valor de compra. Somos justos em todos os níveis."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid gap-3 md:grid-cols-3",
								children: PROTECTION_TIERS.map((t) => {
									const selected = protection === t.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setProtection(t.id),
										className: `rounded-2xl border p-4 text-left transition ${selected ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/40"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: `h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-bold",
													children: t.name
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-lg font-extrabold text-primary",
												children: ["+", formatPrice(t.feeCents)]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-[11px] text-muted-foreground",
												children: t.tagline
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "mt-3 space-y-1.5",
												children: t.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex gap-1.5 text-[11px] text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-3 w-3 shrink-0 text-primary" }), b]
												}, b))
											})
										]
									}, t.id);
								})
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "h-fit lg:sticky lg:top-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card p-5 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4 text-primary" }), " Recibo da compra"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-accent",
									children: product.images?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: product.images[0],
										alt: product.title,
										className: "h-full w-full object-cover"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold",
											children: product.title
										}),
										variant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "mt-1",
											children: variant.name
										}),
										quantity > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: [
												quantity,
												" × ",
												formatPrice(unit)
											]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted-foreground",
											children: "Produto"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPrice(base) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted-foreground",
											children: tier.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "text-primary",
											children: ["+", formatPrice(tier.feeCents)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted-foreground",
											children: "Taxa do comprador"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-emerald-500",
											children: "Grátis"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: "Total a pagar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-extrabold text-primary",
									children: formatPrice(total)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: confirm,
								disabled: buying || isOwn,
								size: "lg",
								className: "mt-4 w-full bg-gradient-primary text-primary-foreground shadow-glow",
								children: [buying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-2 h-4 w-4" }), isOwn ? "Este anúncio é seu" : "Gerar QR Code Pix"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-2 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium text-foreground",
										children: "O pagamento pode demorar até 1 minuto para ser confirmado!"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0 text-primary" }), "Pagamento em custódia só libertamos ao vendedor após a entrega."]
									}),
									product.auto_delivery && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 shrink-0 text-primary" }), "Entrega automática assim que o pagamento for confirmado."]
									})
								]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Total a pagar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-lg font-extrabold text-primary",
							children: formatPrice(total)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: confirm,
						disabled: buying || isOwn,
						className: "ml-auto h-11 flex-1 bg-gradient-primary text-primary-foreground shadow-glow",
						children: [buying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-2 h-4 w-4" }), isOwn ? "Anúncio seu" : "Gerar Pix"]
					})]
				})
			})
		]
	});
}
//#endregion
export { CheckoutPage as component };
