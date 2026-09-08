export type VerificationLevelId = "basico" | "intermediario" | "completo";

export type VerificationLevel = {
  id: VerificationLevelId;
  name: string;
  short: string;
  tagline: string;
  /** Dados exigidos pelo nível */
  requires: string[];
  /** O que fica visível no perfil público */
  publicInfo: string[];
  benefits: string[];
};

export const VERIFICATION_LEVELS: VerificationLevel[] = [
  {
    id: "basico",
    name: "Verificação Básica",
    short: "Básico",
    tagline: "Sem enviar documentos. Confirma apenas contato e localidade.",
    requires: ["Nome de exibição", "Telefone de contato", "País e cidade"],
    publicInfo: ["Nível de verificação", "País e cidade"],
    benefits: [
      "Emblema de verificado nível Básico",
      "Mais confiança na página do anúncio",
      "Nenhum documento pessoal é enviado",
    ],
  },
  {
    id: "intermediario",
    name: "Verificação Intermediária",
    short: "Intermediário",
    tagline: "Documento de identidade, sem selfie. Ideal para quem vende com frequência.",
    requires: ["Nome completo", "Número do documento", "Foto do documento"],
    publicInfo: ["Nível de verificação", "País e cidade", "Nome comercial (se informado)"],
    benefits: [
      "Emblema de verificado nível Intermediário",
      "Prioridade nos resultados de pesquisa",
      "Documento fica privado, visível só para a equipe",
    ],
  },
  {
    id: "completo",
    name: "Verificação Completa",
    short: "Completo",
    tagline: "Documento + selfie. O nível de maior confiança do marketplace.",
    requires: ["Nome completo", "Número do documento", "Foto do documento", "Selfie com o documento"],
    publicInfo: [
      "Nível de verificação",
      "País e cidade",
      "Nome comercial e rede social (se informados)",
    ],
    benefits: [
      "Emblema de verificado nível Completo",
      "Maior destaque e limites de saque ampliados",
      "Mediação prioritária em disputas",
    ],
  },
];

export function levelOf(id?: string | null): VerificationLevel | null {
  return VERIFICATION_LEVELS.find((l) => l.id === id) ?? null;
}

export function levelLabel(id?: string | null): string {
  return levelOf(id)?.short ?? "Não verificado";
}
