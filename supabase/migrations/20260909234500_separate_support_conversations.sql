ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS conversation_type text NOT NULL DEFAULT 'marketplace';

UPDATE public.conversations c
SET conversation_type = 'support'
WHERE c.product_id IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.messages m
    WHERE m.conversation_id = c.id
      AND m.body LIKE 'Olá! Este é o canal oficial de atendimento%'
  );

ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_conversation_type_check;

ALTER TABLE public.conversations
  ADD CONSTRAINT conversations_conversation_type_check
  CHECK (conversation_type IN ('marketplace', 'support'));

CREATE INDEX IF NOT EXISTS conversations_conversation_type_idx
  ON public.conversations (conversation_type, last_message_at DESC);
