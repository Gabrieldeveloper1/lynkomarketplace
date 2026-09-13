import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { registerServiceWorker, showDeviceNotification } from "@/lib/push";

type NotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  user_id: string;
};

const EMOJI: Record<string, string> = {
  sale: "💰",
  order: "📦",
  message: "💬",
  moderation: "🛡️",
  report: "⚠️",
  system: "✨",
};

/** Escuta novas notificações e mostra o aviso do aparelho, respeitando as preferências. */
export function PushManager() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const prefs = useRef<{ push_sales: boolean; push_mediation: boolean }>({
    push_sales: true,
    push_mediation: true,
  });

  useEffect(() => {
    void registerServiceWorker();
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    void (async () => {
      const { data } = await supabase
        .from("notification_preferences")
        .select("push_sales, push_mediation")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled && data) {
        prefs.current = {
          push_sales: (data as { push_sales?: boolean }).push_sales ?? true,
          push_mediation: (data as { push_mediation?: boolean }).push_mediation ?? true,
        };
      }
    })();

    const channel = supabase
      .channel(`push-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as NotificationRow;
          void qc.invalidateQueries({ queryKey: ["notifications"] });
          const isSale = row.kind === "sale" || row.kind === "order";
          const isMediation = row.kind === "moderation";
          if (isSale && !prefs.current.push_sales) return;
          if (isMediation && !prefs.current.push_mediation) return;
          void showDeviceNotification({
            title: `${EMOJI[row.kind] ?? "🔔"} ${row.title}`,
            body: row.body,
            link: row.link ?? "/dashboard",
            tag: row.id,
          });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [user, qc]);

  return null;
}
