-- Compatibilidade para blog, perfis, conversas de entrega e mediação.
-- Todas as operações são idempotentes.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS staff_badge boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS profiles_last_seen_at_idx ON public.profiles(last_seen_at);
CREATE INDEX IF NOT EXISTS profiles_staff_badge_idx ON public.profiles(staff_badge) WHERE staff_badge = true;
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS conversation_type text NOT NULL DEFAULT 'marketplace',
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS moderation_note text,
  ADD COLUMN IF NOT EXISTS moderation_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS moderation_requested_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS moderation_cancelled_at timestamptz;
UPDATE public.conversations SET moderation_status = 'requested' WHERE moderation_requested = true AND moderation_status = 'none';
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_conversation_type_check;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_conversation_type_check CHECK (conversation_type IN ('marketplace', 'support'));
CREATE INDEX IF NOT EXISTS conversations_conversation_type_idx ON public.conversations (conversation_type, last_message_at DESC);
