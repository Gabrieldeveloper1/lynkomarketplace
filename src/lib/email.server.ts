type EmailMessage = {
  to: string;
  subject: string;
  html: string;
};

function env(name: string) {
  return process.env[name]?.trim() ?? "";
}

/** Sends through Resend when configured; never exposes the API key to the browser. */
export async function sendTransactionalEmail(message: EmailMessage) {
  const apiKey = env("RESEND_API_KEY");
  const from = env("EMAIL_FROM") || env("RESEND_FROM");
  if (!apiKey || !from) {
    console.warn("[email] RESEND_API_KEY/EMAIL_FROM não configurados; e-mail não enviado.");
    return { sent: false as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [message.to], subject: message.subject, html: message.html }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Falha ao enviar e-mail: ${response.status} ${detail.slice(0, 300)}`);
  }
  return { sent: true as const };
}

export function escapeEmailHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function marketplaceEmail(options: {
  eyebrow: string;
  title: string;
  intro: string;
  content: string;
  accent?: "purple" | "green";
}) {
  const accent = options.accent === "green" ? "#10b981" : "#8b5cf6";
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#0b0b12;font-family:Arial,sans-serif;color:#f8fafc;padding:24px 12px"><div style="max-width:640px;margin:0 auto;background:#151522;border:1px solid #2b2b42;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px #0006"><div style="padding:28px 30px;background:linear-gradient(135deg,#241542,#111827);border-bottom:1px solid #37304f"><div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:${accent};font-weight:700">LYNKO MARKETPLACE</div><div style="margin-top:14px;font-size:12px;color:#c4b5fd">${options.eyebrow}</div><h1 style="margin:8px 0 0;font-size:28px;line-height:1.15;color:#fff">${options.title}</h1></div><div style="padding:30px"><p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#e2e8f0">${options.intro}</p>${options.content}<div style="margin-top:28px;padding-top:20px;border-top:1px solid #303044;font-size:12px;line-height:1.6;color:#94a3b8">Este é um e-mail automático da LynkoMarketplace. Não responda diretamente a esta mensagem.</div></div></div></body></html>`;
}

export function deliveryEmail(options: {
  productTitle: string;
  orderShortId: string;
  deliveredContent?: string | null;
}) {
  const title = escapeEmailHtml(options.productTitle);
  const order = escapeEmailHtml(options.orderShortId);
  const content = options.deliveredContent
    ? `<div style="margin:22px 0;padding:20px;border:1px solid #245c4c;background:#0d2a24;border-radius:16px"><div style="font-size:12px;color:#6ee7b7;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Sua entrega</div><pre style="margin:12px 0 0;white-space:pre-wrap;word-break:break-word;color:#ecfdf5;font-size:14px;line-height:1.6">${escapeEmailHtml(options.deliveredContent)}</pre></div>`
    : `<div style="margin:22px 0;padding:18px;border-radius:16px;background:#211b35;color:#ddd6fe">O pagamento foi confirmado. O vendedor será avisado para concluir a entrega.</div>`;
  return marketplaceEmail({
    eyebrow: "Pedido atualizado",
    title: options.deliveredContent ? "Sua entrega chegou" : "Pagamento confirmado",
    intro: `Olá! O pedido do produto <strong style="color:#fff">${title}</strong> foi atualizado com segurança.`,
    content: `${content}<p style="font-size:13px;color:#cbd5e1">Pedido <strong style="color:#fff">#${order}</strong></p><p style="font-size:13px;color:#94a3b8">Guarde este e-mail e acesse sua conta para acompanhar mensagens, mediação e histórico da compra.</p>`,
    accent: options.deliveredContent ? "green" : "purple",
  });
}
