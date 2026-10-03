-- Chat: respostas e mensagens de sistema/moderador
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES public.messages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'user';

-- Conversas: pedido/entrada de moderador
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS moderation_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS moderator_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Perfis: motivo do banimento
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ban_reason text,
  ADD COLUMN IF NOT EXISTS banned_at timestamptz;

-- Função utilitária
CREATE OR REPLACE FUNCTION public.is_banned(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND banned = true) $$;

-- Apelações de banimento
CREATE TABLE IF NOT EXISTS public.appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  staff_reply text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.appeals TO authenticated;
GRANT ALL ON public.appeals TO service_role;

ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own and staff read appeals" ON public.appeals
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY "own create appeal" ON public.appeals
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "staff update appeals" ON public.appeals
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER appeals_updated_at BEFORE UPDATE ON public.appeals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Moderador pode entrar na conversa e escrever
DROP POLICY IF EXISTS "members send messages" ON public.messages;
CREATE POLICY "members send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND NOT public.is_banned(auth.uid())
    AND (public.is_conversation_member(conversation_id, auth.uid()) OR public.is_staff(auth.uid()))
  );

DROP POLICY IF EXISTS "participants update conversation" ON public.conversations;
CREATE POLICY "participants update conversation" ON public.conversations
  FOR UPDATE TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR public.is_staff(auth.uid()))
  WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid() OR public.is_staff(auth.uid()));

-- Banidos não denunciam nem publicam
DROP POLICY IF EXISTS "users create reports" ON public.reports;
CREATE POLICY "users create reports" ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid() AND NOT public.is_banned(auth.uid()));

DROP POLICY IF EXISTS "owner creates products" ON public.products;
CREATE POLICY "owner creates products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (seller_id = auth.uid() AND NOT public.is_banned(auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;