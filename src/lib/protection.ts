export type ProtectionLevel = "basica" | "media" | "maxima";

export type ProtectionTier = {
  id: ProtectionLevel;
  name: string;
  feeCents: number;
  tagline: string;
  benefits: string[];
};

/**
 * Taxa de serviço justa: o valor é fixo em centavos, independentemente do preço
 * do produto. Todos os níveis valem a pena — mudam apenas a rapidez da mediação
 * e a cobertura de reembolso.
 */
export const PROTECTION_TIERS: ProtectionTier[] = [
  {
    id: "basica",
    name: "Proteção Básica",
    feeCents: 10,
    tagline: "Cobertura essencial para qualquer compra",
    benefits: [
      "Pagamento em custódia até a entrega",
      "Abertura de disputa em até 24h",
      "Suporte por chat com o vendedor",
    ],
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
      "Histórico de entrega auditado",
    ],
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
      "Gestor de conta dedicado",
    ],
  },
];

export function protectionTier(id: string | null | undefined): ProtectionTier {
  return PROTECTION_TIERS.find((t) => t.id === id) ?? PROTECTION_TIERS[0];
}
