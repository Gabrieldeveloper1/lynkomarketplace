import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Cria o perfil público da conta caso ainda não exista. */
export const ensureMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureProfile } = await import("@/lib/profile.server");
    await ensureProfile(context.userId, context.claims as never);
    return { ok: true };
  });

/** Define o @ do utilizador (apenas uma vez). */
export const chooseMyUsername = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ username: z.string().min(3).max(30) }).parse(data))
  .handler(async ({ context, data }) => {
    const { setUsername } = await import("@/lib/profile.server");
    const username = await setUsername(context.userId, data.username);
    return { username };
  });
