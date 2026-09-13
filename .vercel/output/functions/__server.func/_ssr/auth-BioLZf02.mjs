import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as supabase } from "./client-C9kal07l.mjs";
import { $t as CircleCheck, D as ShieldCheck, G as Plus, Rt as Eye, an as Check, dt as LoaderCircle, ot as Mail, t as Zap, ut as Lock, vn as ArrowRight, vt as KeyRound, x as Star, yn as ArrowLeft, zt as EyeOff } from "../_libs/lucide-react.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Input, V as slugify, d as Route$32, et as Button, f as ADMIN_SUPPORT_DISCORD_URL, it as cn, tt as useAuth } from "./router-BVA3mZO7.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BioLZf02.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var PILLARS = [
	{
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }),
		t: "Entrega automática 24/7",
		d: "Pix confirmado, produto entregue em segundos no painel do comprador."
	},
	{
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }),
		t: "Identidade verificada",
		d: "KYC com documento e selfie, emblema de verificado e reputação pública."
	},
	{
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }),
		t: "Pagamento em custódia",
		d: "Processado pelo Efí Bank e liberado ao vendedor após a entrega."
	}
];
function PasswordField({ id, name, autoComplete, minLength, placeholder }) {
	const [show, setShow] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			name,
			type: show ? "text" : "password",
			required: true,
			minLength,
			placeholder,
			autoComplete,
			className: "pr-10"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setShow((s) => !s),
			"aria-label": show ? "Ocultar senha" : "Mostrar senha",
			className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground",
			children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
		})]
	});
}
function strengthOf(pw) {
	let score = 0;
	if (pw.length >= 6) score++;
	if (pw.length >= 10) score++;
	if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
	if (/\d/.test(pw)) score++;
	if (/[^A-Za-z0-9]/.test(pw)) score++;
	return Math.min(score, 4);
}
function AuthPage() {
	const navigate = useNavigate();
	const search = Route$32.useSearch();
	const { user, loading } = useAuth();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [mode, setMode] = (0, import_react.useState)("tabs");
	const [recoverSent, setRecoverSent] = (0, import_react.useState)(false);
	const [signupSent, setSignupSent] = (0, import_react.useState)(null);
	const [pw, setPw] = (0, import_react.useState)("");
	const [accepted, setAccepted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({
			to: search.redirect ?? "/dashboard",
			replace: true
		});
	}, [
		user,
		loading,
		navigate,
		search.redirect
	]);
	const signIn = async (e) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		setBusy(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: String(form.get("email")).trim(),
			password: String(form.get("password"))
		});
		setBusy(false);
		if (error) {
			const msg = /invalid login credentials/i.test(error.message) ? "E-mail ou senha incorretos." : /email not confirmed/i.test(error.message) ? "Confirme o seu e-mail antes de entrar." : error.message;
			return toast.error(msg);
		}
		toast.success("Bem-vindo de volta!");
		navigate({ to: search.redirect ?? "/dashboard" });
	};
	const recover = async (e) => {
		e.preventDefault();
		const email = String(new FormData(e.currentTarget).get("email")).trim();
		setBusy(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
		setBusy(false);
		if (error) return toast.error(error.message);
		setRecoverSent(true);
	};
	const signUp = async (e) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const username = slugify(String(form.get("username")));
		const displayName = String(form.get("display_name") || "").trim();
		const email = String(form.get("email")).trim();
		const password = String(form.get("password"));
		if (displayName.length < 2) return toast.error("Informe o nome público da sua loja ou perfil.");
		if (username.length < 3) return toast.error("Nome de usuário inválido (mínimo 3 caracteres).");
		if (password.length < 6) return toast.error("A senha precisa de pelo menos 6 caracteres.");
		if (password !== String(form.get("confirm"))) return toast.error("As senhas não coincidem.");
		if (!accepted) return toast.error("É preciso aceitar os Termos de Uso e a Política de Privacidade.");
		setBusy(true);
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: window.location.origin,
				data: {
					username,
					display_name: displayName
				}
			}
		});
		setBusy(false);
		if (error) {
			const msg = /already registered/i.test(error.message) ? "Já existe uma conta com este e-mail. Tente entrar." : error.message;
			return toast.error(msg);
		}
		if (!data.session) {
			setSignupSent(email);
			return;
		}
		toast.success("Conta criada! Já pode começar a vender.");
		navigate({ to: search.redirect ?? "/dashboard" });
	};
	const score = strengthOf(pw);
	const scoreLabel = [
		"Muito fraca",
		"Fraca",
		"Razoável",
		"Boa",
		"Excelente"
	][score];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 bg-gradient-hero opacity-80",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-primary/20 blur-3xl",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:py-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-extrabold",
							children: "LynkoMarketplace"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Digital com mais confiança"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden flex-col justify-center lg:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex w-fit items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-current" }), " Marketplace digital nº1 em confiança"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight xl:text-5xl",
								children: [
									"Compre e venda digital com",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-gradient-primary bg-clip-text text-transparent",
										children: "proteção total"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-md text-muted-foreground",
								children: "Contas, chaves, gift cards e serviços digitais. Custódia do pagamento, entrega automática e mediação humana sempre que precisar."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-8 grid gap-3",
								children: PILLARS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
										children: p.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold",
										children: p.t
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: p.d
									})] })]
								}, p.t))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6",
								children: [
									{
										v: "8%",
										l: "Taxa por venda"
									},
									{
										v: "R$ 3,50",
										l: "Saque mínimo"
									},
									{
										v: "Pix",
										l: "Aprovação automática"
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl font-extrabold text-primary",
									children: s.v
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: s.l
								})] }, s.l))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto w-full max-w-md rounded-[2rem] border border-border bg-card/90 p-5 shadow-glow backdrop-blur-xl sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mx-auto mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-center text-2xl font-extrabold tracking-tight",
										children: mode === "recover" ? "Recuperar sua senha" : "Que bom ver você por aqui!"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-center text-sm text-muted-foreground",
										children: mode === "recover" ? "Enviaremos um link seguro para redefinir sua senha." : "Digite seu e-mail e senha para entrar no seu painel."
									})
								]
							}),
							signupSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-6 w-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: "Confirme o seu e-mail"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: [
											"Enviámos um link de confirmação para ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: signupSent }),
											". Abra a mensagem para ativar a conta e depois volte aqui para entrar."
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										className: "gap-2 bg-gradient-primary text-primary-foreground shadow-glow",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/dashboard",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Anunciar agora"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => setSignupSent(null),
										children: "Voltar ao início de sessão"
									})
								]
							}) : mode === "recover" ? recoverSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Se existir uma conta com esse e-mail, o link de recuperação já está a caminho. Verifique também a pasta de spam."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => {
											setRecoverSent(false);
											setMode("tabs");
										},
										children: "Voltar"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: recover,
								className: "grid gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "rec-email",
											children: "E-mail da conta"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "rec-email",
											name: "email",
											type: "email",
											required: true,
											autoComplete: "email"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										disabled: busy,
										className: "gap-2 bg-gradient-primary text-primary-foreground shadow-glow",
										children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
											className: "h-4 w-4 animate-spin",
											"aria-hidden": true
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {
											className: "h-4 w-4",
											"aria-hidden": true
										}), busy ? "Enviando..." : "Enviar link de recuperação"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setMode("tabs"),
										className: "inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Voltar ao início de sessão"]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
								defaultValue: "login",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
										className: "grid w-full grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "login",
											children: "Entrar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "registo",
											children: "Criar conta"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "login",
										className: "mt-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											onSubmit: signIn,
											className: "grid gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "login-email",
														children: "E-mail"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "login-email",
														name: "email",
														type: "email",
														required: true,
														autoComplete: "email",
														placeholder: "voce@email.com"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															htmlFor: "login-password",
															children: "Senha"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => setMode("recover"),
															className: "text-xs text-primary hover:underline",
															children: "Esqueci a senha"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
														id: "login-password",
														name: "password",
														autoComplete: "current-password",
														placeholder: "••••••••"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													disabled: busy,
													className: "gap-2 bg-gradient-primary text-primary-foreground shadow-glow",
													children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
														className: "h-4 w-4 animate-spin",
														"aria-hidden": true
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
														className: "h-4 w-4",
														"aria-hidden": true
													}), busy ? "Entrando..." : "Fazer login"]
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "registo",
										className: "mt-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											onSubmit: signUp,
											className: "grid gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-4 sm:grid-cols-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																htmlFor: "su-name",
																children: "Nome público"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "su-name",
																name: "display_name",
																required: true,
																minLength: 2,
																maxLength: 40,
																placeholder: "Minha Loja Digital",
																"aria-describedby": "su-name-hint"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																id: "su-name-hint",
																className: "text-[11px] text-muted-foreground",
																children: "Aparece no topo do seu perfil."
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																htmlFor: "su-username",
																children: "Usuário"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "pl-3 text-sm font-semibold text-muted-foreground",
																	children: "@"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																	id: "su-username",
																	name: "username",
																	required: true,
																	maxLength: 30,
																	placeholder: "minha-loja",
																	"aria-describedby": "su-user-hint",
																	className: "border-0 bg-transparent focus-visible:ring-0"
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																id: "su-user-hint",
																className: "text-[11px] text-muted-foreground",
																children: "Será o link da sua loja."
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "su-email",
														children: "E-mail"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "su-email",
														name: "email",
														type: "email",
														required: true,
														autoComplete: "email",
														placeholder: "voce@email.com"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															htmlFor: "su-password",
															children: "Senha"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															onChange: (e) => setPw(e.target.value),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
																id: "su-password",
																name: "password",
																minLength: 6,
																autoComplete: "new-password",
																placeholder: "Mínimo 6 caracteres"
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "flex h-1.5 flex-1 gap-1",
																children: [
																	0,
																	1,
																	2,
																	3
																].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-full flex-1 rounded-full ${pw && i < score ? "bg-primary" : "bg-border"}` }, i))
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "w-20 text-right text-[11px] text-muted-foreground",
																children: pw ? scoreLabel : ""
															})]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "su-confirm",
														children: "Confirmar senha"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
														id: "su-confirm",
														name: "confirm",
														minLength: 6,
														autoComplete: "new-password",
														placeholder: "Repita a senha"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "flex items-start gap-2.5 text-[12px] leading-relaxed text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
														checked: accepted,
														onCheckedChange: (v) => setAccepted(v === true),
														className: "mt-0.5",
														"aria-label": "Aceito os termos"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"Li e aceito os",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
															to: "/p/$slug",
															params: { slug: "termos" },
															className: "text-primary hover:underline",
															children: "Termos de Uso"
														}),
														",",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
															to: "/p/$slug",
															params: { slug: "privacidade" },
															className: "text-primary hover:underline",
															children: "a Política de Privacidade"
														}),
														" ",
														"e as",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
															to: "/p/$slug",
															params: { slug: "regras-do-vendedor" },
															className: "text-primary hover:underline",
															children: "Regras do Vendedor"
														}),
														"."
													] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													disabled: busy,
													className: "gap-2 bg-gradient-primary text-primary-foreground shadow-glow",
													children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
														className: "h-4 w-4 animate-spin",
														"aria-hidden": true
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
														className: "h-4 w-4",
														"aria-hidden": true
													}), busy ? "Criando..." : "Criar conta"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
													className: "grid gap-2 rounded-xl border border-border bg-accent/30 p-3 text-[11px] text-muted-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Publique anúncios e receba por Pix com custódia." }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Verificação de identidade em 3 níveis, você escolhe o quanto compartilha." }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Notificações em tempo real de mensagens, pedidos e saques." })
													]
												})
											]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
										className: "h-5 w-5",
										"aria-hidden": true
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block text-sm font-bold",
									children: "Compra 100% garantida"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-xs leading-relaxed text-muted-foreground",
									children: "O pagamento fica protegido até a entrega. Se o produto não chegar, o dinheiro volta."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-center text-xs text-muted-foreground",
								children: [
									"Precisa de ajuda?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: ADMIN_SUPPORT_DISCORD_URL,
										target: "_blank",
										rel: "noreferrer",
										className: "text-primary hover:underline",
										children: "Fale com o suporte no Discord"
									}),
									" ",
									"ou",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/produtos",
										search: {
											q: "",
											cat: "todas",
											sort: "recentes"
										},
										className: "text-primary hover:underline",
										children: "explore sem conta"
									}),
									"."
								]
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { AuthPage as component };
