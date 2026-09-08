import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { timeAgo } from "@/lib/format";

type Notification = {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export function NotificationsMenu() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, kind, title, body, link, read_at, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as Notification[];
    },
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const n = payload.new as Notification;
          toast(n.title, { description: n.body || undefined });
          qc.invalidateQueries({ queryKey: ["notifications", user.id] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, qc]);

  if (!user) return null;

  const unread = items.filter((n) => !n.read_at).length;

  const markAllRead = async () => {
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null)
      .eq("user_id", user.id);
    qc.invalidateQueries({ queryKey: ["notifications", user.id] });
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["notifications", user.id] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unread ? `Notificações, ${unread} não lidas` : "Notificações"}
        >
          <Bell className="h-5 w-5" aria-hidden />
          {unread > 0 && (
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notificações</p>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden /> Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="max-h-[22rem] overflow-y-auto">
          {items.length === 0 ? (
            <div className="grid place-items-center gap-2 px-4 py-8 sm:py-10 text-center text-sm text-muted-foreground">
              <Inbox className="h-6 w-6" aria-hidden />
              Sem notificações por enquanto.
            </div>
          ) : (
            items.map((n) => {
              const inner = (
                <>
                  <span className="flex items-start gap-2">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        n.read_at ? "bg-transparent" : "bg-primary"
                      }`}
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{n.title}</span>
                      {n.body && (
                        <span className="block truncate text-xs text-muted-foreground">{n.body}</span>
                      )}
                      <span className="block text-[11px] text-muted-foreground">
                        {timeAgo(n.created_at)}
                      </span>
                    </span>
                  </span>
                </>
              );
              const cls =
                "block w-full border-b border-border/60 px-4 py-3 text-left transition hover:bg-accent";
              return n.link ? (
                <Link key={n.id} to={n.link as "/dashboard"} onClick={() => markRead(n.id)} className={cls}>
                  {inner}
                </Link>
              ) : (
                <button key={n.id} onClick={() => markRead(n.id)} className={cls}>
                  {inner}
                </button>
              );
            })
          )}
        </div>
        <Link
          to="/notificacoes"
          className="block border-t border-border px-4 py-3 text-center text-sm font-medium text-primary hover:bg-accent"
        >
          Ver central de notificações
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
