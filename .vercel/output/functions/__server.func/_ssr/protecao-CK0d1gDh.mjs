import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as ShieldCheck, Dt as Handshake, Jt as Clock, P as Scale, X as PackageCheck, a as Wallet, hn as BadgeCheck, nt as MessageCircleQuestionMark, t as Zap, ut as Lock } from "../_libs/lucide-react.mjs";
import { B as formatPrice, et as Button, f as ADMIN_SUPPORT_DISCORD_URL, h as PROTECTION_TIERS } from "./router-BVA3mZO7.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-uwqhymWC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/protecao-CK0d1gDh.js
var import_jsx_runtime = require_jsx_runtime();
var PILLARS = [
	{
		icon: Lock,
		title: "Pagamento em custódia",
		text: "O pagamento é processado pela Efí Bank. Se uma mediação for aprovada, o reembolso é solicitado automaticamente ao banco."
	},
	{
		icon: Zap,
		title: "Entrega automática",
		text: "Nos anúncios com o raio, o conteúdo chega no chat segundos após o pagamento ser aprovado."
	},
	{
		icon: Scale,
		title: "Mediação imparcial",
		text: "Se algo der errado, a nossa equipe entra na conversa e analisa o histórico dos dois lados."
	},
	{
		icon: Wallet,
		title: "Reembolso automático",
		text: "Quando a equipe aprova a mediação, a Efí Bank processa o reembolso aos titulares. A plataforma não interfere no processamento bancário."
	}
];
var STEPS = [
	{
		icon: Handshake,
		title: "1. Você escolhe e paga",
		text: "O Pix é gerado na hora e o pagamento é processado pela Efí Bank. O pedido e a entrega ficam registrados no chat."
	},
	{
		icon: PackageCheck,
		title: "2. O vendedor entrega",
		text: "A entrega acontece no chat do pedido: automática nos anúncios com estoque digital, ou manual com prazo combinado."
	},
	{
		icon: BadgeCheck,
		title: "3. Pagamento e entrega registrados",
		text: "A confirmação do cliente não é necessária para concluir o fluxo. O pedido permanece documentado no chat para eventual análise."
	},
	{
		icon: ShieldCheck,
		title: "4. Deu problema? Abra mediação",
		text: "Chame a mediação pelo chat do pedido. Se aprovada, a Efí Bank processa o reembolso automaticamente; se recusada, não é possível abrir nova mediação para o mesmo produto."
	}
];
var FAQ = [
	{
		q: "Quando o vendedor recebe o meu dinheiro?",
		a: "O pagamento e o reembolso são processados pela Efí Bank. A equipe não movimenta o dinheiro manualmente: quando uma mediação é aprovada, apenas solicita o reembolso ao banco."
	},
	{
		q: "O que acontece se o produto não funcionar?",
		a: "Abra a mediação pelo chat do pedido. A equipe analisa as mensagens, o conteúdo entregue e decide pela aprovação ou recusa. Se aprovada, a Efí Bank envia automaticamente o reembolso aos titulares."
	},
	{
		q: "Qual é o prazo para reclamar?",
		a: "O prazo interno para abrir uma disputa começa na entrega: até 24 horas na Proteção Básica; na Proteção Média, a mediação é prioritária; na Proteção Máxima, o atendimento é imediato, 24 horas por dia, 7 dias por semana. Esses prazos da plataforma não reduzem direitos previstos na legislação aplicável."
	},
	{
		q: "A taxa de proteção é cobrada sobre o preço?",
		a: "Não. É um valor fixo por pedido, mostrado no checkout antes de você pagar, independentemente do preço do produto."
	},
	{
		q: "Posso cancelar um pedido que ainda não paguei?",
		a: "Sim. Enquanto o pagamento estiver pendente, basta não pagar o Pix a cobrança expira sozinha e nada é debitado."
	},
	{
		q: "E se o vendedor sumir depois do pagamento?",
		a: "Sem entrega dentro do prazo combinado, abra a mediação no chat. Se aprovada, a solicitação de reembolso é enviada automaticamente à Efí Bank, sem intervenção manual da plataforma."
	},
	{
		q: "Como sei que o vendedor é confiável?",
		a: "Cada perfil mostra selo de verificação de identidade, número de vendas concluídas e avaliações reais de quem já comprou. Prefira vendedores verificados."
	},
	{
		q: "Preciso falar com alguém. Como abro suporte?",
		a: "Use o chat do pedido e acione a moderação: assim a equipe já entra com todo o histórico à vista, o que resolve muito mais rápido do que um contato avulso."
	}
];
var LEGAL_NOTES = [
	{
		title: "Direito de arrependimento",
		text: "Em contratações feitas fora do estabelecimento comercial, o art. 49 do Código de Defesa do Consumidor prevê prazo de 7 dias para desistência, contado da assinatura ou do recebimento, observadas as regras aplicáveis ao caso concreto.",
		href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
		label: "Consultar art. 49 do CDC"
	},
	{
		title: "Produto ou serviço com problema",
		text: "O CDC prevê responsabilidade por vícios e estabelece prazos para reclamar, conforme a natureza do produto ou serviço. A disputa deve ser aberta no chat assim que o problema for identificado, com provas e detalhes da compra.",
		href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
		label: "Consultar CDC no Planalto"
	},
	{
		title: "Privacidade e dados pessoais",
		text: "O tratamento de dados pessoais segue a Lei Geral de Proteção de Dados (LGPD). O checkout Pix não solicita mais CPF, telefone ou nome do comprador para gerar a cobrança.",
		href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm",
		label: "Consultar LGPD"
	}
];
function ProtecaoPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-8 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), " Compra protegida"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-[1.9rem] font-extrabold leading-tight tracking-tight sm:text-4xl",
						children: "Sua compra fica protegida do pagamento à resolução"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base",
						children: "Toda compra no LynkoMarketplace é processada pela Efí Bank e fica registrada no chat. Veja como funciona, o que cada nível de proteção cobre e as dúvidas mais comuns."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-8 rounded-3xl border border-primary/20 bg-primary/5 p-5 sm:p-7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-6 w-6 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-extrabold",
						children: "Compra protegida"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted-foreground",
						children: "O pagamento é processado pela Efí Bank. Se o produto não chegar, estiver inválido ou não corresponder ao anúncio, abra uma mediação pelo chat do pedido para análise. A decisão aprovada dispara automaticamente a solicitação de reembolso à Efí Bank."
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: PILLARS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-bold",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: p.text
						})
					]
				}, p.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-extrabold sm:text-2xl",
					children: "As 4 etapas de um pedido protegido"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-5 grid gap-3 sm:grid-cols-2",
					children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute -right-3 -top-4 font-display text-6xl font-black text-primary/5",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-bold",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted-foreground",
								children: s.text
							})
						]
					}, s.title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-extrabold sm:text-2xl",
						children: "Níveis de proteção"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Você escolhe no checkout. A taxa é fixa por pedido não é percentual sobre o preço."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-3 sm:grid-cols-3",
						children: PROTECTION_TIERS.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-2xl border p-4 sm:p-5 ${i === 1 ? "border-primary/50 bg-primary/5 shadow-glow" : "border-border bg-card"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold",
										children: t.name
									}), i === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-gradient-primary text-primary-foreground",
										children: "Mais usada"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: t.tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 font-display text-2xl font-extrabold text-primary",
									children: [
										"+",
										formatPrice(t.feeCents),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1 text-xs font-medium text-muted-foreground",
											children: "por pedido"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 grid gap-1.5",
									children: t.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b })]
									}, b))
								})
							]
						}, t.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-extrabold sm:text-2xl",
					children: "Perguntas frequentes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					collapsible: true,
					className: "mt-4 rounded-2xl border border-border bg-card px-4 sm:px-5",
					children: FAQ.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
						value: f.q,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
							className: "text-left text-sm font-semibold",
							children: f.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: f.a
						})]
					}, f.q))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-extrabold sm:text-2xl",
						children: "Direitos, prazos e transparência"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground",
						children: "As regras abaixo explicam o funcionamento da plataforma e não substituem a legislação brasileira nem a orientação de um profissional. Em caso de conflito, prevalecem os direitos previstos em lei."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-3 md:grid-cols-3",
						children: LEGAL_NOTES.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-2xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold",
									children: note.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs leading-relaxed text-muted-foreground",
									children: note.text
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: note.href,
									target: "_blank",
									rel: "noreferrer",
									className: "mt-3 inline-block text-xs font-semibold text-primary hover:underline",
									children: [note.label, " →"]
								})
							]
						}, note.title))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-2xl border border-border bg-gradient-hero p-5 text-center sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleQuestionMark, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-lg font-extrabold",
						children: "Ainda com dúvida?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-1 max-w-md text-sm text-muted-foreground",
						children: "Para dúvidas administrativas sobre o site ou sua conta, fale com a equipe pelo Discord. Se for sobre um pedido, use o chat dele para que a equipe veja todo o histórico e possa fazer a mediação."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col justify-center gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "bg-gradient-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: ADMIN_SUPPORT_DISCORD_URL,
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleQuestionMark, { className: "mr-2 h-4 w-4" }), " Falar no Discord"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/status",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mr-2 h-4 w-4" }), " Ver estado da plataforma"]
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { ProtecaoPage as component };
