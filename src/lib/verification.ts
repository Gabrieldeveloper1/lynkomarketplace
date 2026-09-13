export type VerificationLevelId = "basico" | "maximo";

export type VerificationLevel = {
  id: VerificationLevelId;
  name: string;
  short: string;
  tagline: string;
  requires: string[];
  publicInfo: string[];
  benefits: string[];
};

export const VERIFICATION_LEVELS: VerificationLevel[] = [
  {
    id: "basico",
    name: "Verificação Básica",
    short: "Básico",
    tagline: "E-mail confirmado e dados essenciais da conta verificados.",
    requires: ["E-mail confirmado", "Nome de exibição", "País e cidade"],
    publicInfo: ["Perfil com e-mail confirmado"],
    benefits: ["Conta com e-mail confirmado", "Mais confiança na página do anúncio"],
  },
  {
    id: "maximo",
    name: "Verificação Máxima",
    short: "Máximo",
    tagline: "Identidade confirmada com documento e selfie.",
    requires: [
      "Nome completo",
      "Número do documento",
      "Foto do documento",
      "Selfie com o documento",
    ],
    publicInfo: [
      "Documentos verificados",
      "País e cidade",
      "Nome comercial e rede social, se informados",
    ],
    benefits: [
      "Documentos verificados",
      "Maior confiança no marketplace",
      "Mediação prioritária em disputas",
    ],
  },
];

export function levelOf(id?: string | null): VerificationLevel | null {
  const normalized = id === "completo" ? "maximo" : id;
  return VERIFICATION_LEVELS.find((level) => level.id === normalized) ?? null;
}

export function levelLabel(id?: string | null): string {
  return levelOf(id)?.short ?? "Não verificado";
}

export function publicVerificationLabel(verified?: boolean | null): string {
  return verified ? "Documentos verificados" : "Não verificado";
}
