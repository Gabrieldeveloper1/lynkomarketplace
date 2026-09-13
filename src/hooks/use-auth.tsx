import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/marketplace";
import { ensureMyProfile } from "@/lib/profile.functions";

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isStaff: boolean;
  isAdmin: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      setIsStaff(false);
      setIsAdmin(false);
      return;
    }
    const [{ data: p }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    let prof = p ?? null;
    if (!prof) {
      // Conta sem perfil (registada antes do perfil automático): cria agora.
      try {
        await ensureMyProfile();
        const { data: created } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        prof = created ?? null;
      } catch {
        /* mantém sem perfil; a próxima tentativa repete */
      }
    }
    if (
      String((await supabase.auth.getUser()).data.user?.email ?? "").toLowerCase() ===
      "gabrieljairo865@gmail.com"
    ) {
      await supabase.from("profiles").update({ staff_badge: true }).eq("id", userId);
      if (prof) prof = { ...prof, staff_badge: true };
    }
    setProfile(prof);
    setIsStaff(!!roles?.some((r) => r.role === "admin" || r.role === "moderator"));
    setIsAdmin(!!roles?.some((r) => r.role === "admin"));
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(true);
      setTimeout(() => {
        void load(s?.user?.id).finally(() => setLoading(false));
      }, 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(true);
      void load(data.session?.user?.id).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;
    const touch = () => {
      void supabase
        .from("profiles")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", userId)
        .then(({ error }) => {
          if (error)
            console.warn("[presence] não foi possível atualizar o status online", error.message);
        });
    };
    touch();
    const interval = window.setInterval(touch, 30_000);
    const presence = supabase.channel(`presence:${userId}`, {
      config: { presence: { key: userId } },
    });
    void presence.subscribe(async (status) => {
      if (status === "SUBSCRIBED") await presence.track({ online_at: new Date().toISOString() });
    });
    const onActivity = () => touch();
    window.addEventListener("focus", onActivity);
    document.addEventListener("visibilitychange", onActivity);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onActivity);
      document.removeEventListener("visibilitychange", onActivity);
      void supabase.removeChannel(presence);
    };
  }, [session?.user?.id]);

  const value: AuthState = {
    user: session?.user ?? null,
    session,
    profile,
    isStaff,
    isAdmin,
    loading,
    refreshProfile: () => load(session?.user?.id),
    signOut: async () => {
      await supabase.auth.signOut();
      setProfile(null);
      setIsStaff(false);
      setIsAdmin(false);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
