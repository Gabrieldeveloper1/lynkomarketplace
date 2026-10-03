ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS moderation_note text,
  ADD COLUMN IF NOT EXISTS moderation_updated_at timestamptz;

UPDATE public.conversations SET moderation_status = 'requested' WHERE moderation_requested = true AND moderation_status = 'none';