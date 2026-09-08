import { z } from "zod";

export type SocialNetwork = {
  id: string;
  label: string;
  /** Domínios aceitos (com ou sem www / subdomínio) */
  domains: string[];
  placeholder: string;
};

export const SOCIAL_NETWORKS: SocialNetwork[] = [
  { id: "instagram", label: "Instagram", domains: ["instagram.com", "instagr.am"], placeholder: "https://instagram.com/sualoja" },
  { id: "tiktok", label: "TikTok", domains: ["tiktok.com"], placeholder: "https://tiktok.com/@sualoja" },
  { id: "x", label: "X (Twitter)", domains: ["x.com", "twitter.com"], placeholder: "https://x.com/sualoja" },
  { id: "youtube", label: "YouTube", domains: ["youtube.com", "youtu.be"], placeholder: "https://youtube.com/@sualoja" },
  { id: "facebook", label: "Facebook", domains: ["facebook.com", "fb.com"], placeholder: "https://facebook.com/sualoja" },
  { id: "telegram", label: "Telegram", domains: ["t.me", "telegram.me"], placeholder: "https://t.me/sualoja" },
  { id: "discord", label: "Discord", domains: ["discord.gg", "discord.com"], placeholder: "https://discord.gg/suacomunidade" },
  { id: "linkedin", label: "LinkedIn", domains: ["linkedin.com"], placeholder: "https://linkedin.com/company/sualoja" },
];

export function networkOf(id?: string | null): SocialNetwork | null {
  return SOCIAL_NETWORKS.find((n) => n.id === id) ?? null;
}

const urlSchema = z
  .string()
  .trim()
  .min(5)
  .max(200)
  .refine((v) => /^https?:\/\//i.test(v) || /^[\w.-]+\.[a-z]{2,}/i.test(v), {
    message: "Endereço inválido.",
  });

/**
 * Valida se o link informado pertence mesmo ao domínio da rede social escolhida.
 * Retorna a URL normalizada (com https://) ou uma mensagem de erro.
 */
export function validateSocialUrl(
  networkId: string,
  raw: string,
): { ok: true; url: string } | { ok: false; error: string } {
  const net = networkOf(networkId);
  if (!net) return { ok: false, error: "Escolha a rede social." };

  const parsed = urlSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Informe um link válido." };

  const withProtocol = /^https?:\/\//i.test(parsed.data) ? parsed.data : `https://${parsed.data}`;

  let host: string;
  let url: URL;
  try {
    url = new URL(withProtocol);
    host = url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return { ok: false, error: "Informe um link válido." };
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, error: "O link precisa começar com https://" };
  }

  const matches = net.domains.some((d) => host === d || host.endsWith(`.${d}`));
  if (!matches) {
    return {
      ok: false,
      error: `Para ${net.label} o link precisa ser do domínio ${net.domains.join(" ou ")}.`,
    };
  }

  if (url.pathname === "/" || url.pathname === "") {
    return { ok: false, error: `Informe o link do seu perfil no ${net.label}, não só o site.` };
  }

  return { ok: true, url: `https://${host}${url.pathname}${url.search}` };
}
