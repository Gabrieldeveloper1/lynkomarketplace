import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const uploadInput = z.object({
  base64: z.string().min(1),
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(120),
});

export const uploadImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => uploadInput.parse(data))
  .handler(async ({ data }) => {
    const { uploadImageToImgBb } = await import("@/lib/imgbb.server");
    const url = await uploadImageToImgBb(data);
    return { url };
  });
