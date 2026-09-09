const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";
const MAX_IMAGE_BYTES = 32 * 1024 * 1024;

export async function uploadImageToImgBb(input: {
  base64: string;
  filename: string;
  contentType: string;
}): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB_API_KEY não configurada no ambiente do servidor.");
  }

  if (!input.contentType.startsWith("image/")) {
    throw new Error("Envie somente arquivos de imagem.");
  }

  const normalizedBase64 = input.base64.replace(/^data:[^;]+;base64,/, "");
  const estimatedBytes = Math.ceil((normalizedBase64.length * 3) / 4);
  if (!normalizedBase64 || estimatedBytes > MAX_IMAGE_BYTES) {
    throw new Error("A imagem deve ter no máximo 32 MB.");
  }

  const body = new URLSearchParams({
    key: apiKey,
    image: normalizedBase64,
    name: input.filename.slice(0, 180),
    expiration: "0",
  });

  const response = await fetch(IMGBB_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = (await response.json()) as {
    success?: boolean;
    data?: { url?: string; display_url?: string; delete_url?: string };
    error?: { message?: string };
  };

  if (!response.ok || !payload.success || !payload.data?.url) {
    throw new Error(payload.error?.message || "O ImgBB não aceitou a imagem.");
  }

  // Only persist the public image URL. We deliberately do not persist or expose delete_url.
  return payload.data.url;
}
