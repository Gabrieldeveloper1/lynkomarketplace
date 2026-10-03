ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS reason text, ADD COLUMN IF NOT EXISTS evidence_url text, ADD COLUMN IF NOT EXISTS reviewed_at timestamptz, ADD COLUMN IF NOT EXISTS reviewed_by uuid;

CREATE TABLE IF NOT EXISTS public.withdrawal_events (
  id uuid primary key default gen_random_uuid(),
  withdrawal_id uuid not null references public.withdrawals(id) on delete cascade,
  actor_id uuid,
  actor_role text not null default 'system',
  status text not null,
  reason text,
  evidence_url text,
  note text,
  created_at timestamptz not null default now()
);

GRANT SELECT ON public.withdrawal_events TO authenticated;
GRANT ALL ON public.withdrawal_events TO service_role;
ALTER TABLE public.withdrawal_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner and staff read withdrawal events" ON public.withdrawal_events;
CREATE POLICY "owner and staff read withdrawal events" ON public.withdrawal_events
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.withdrawals w WHERE w.id = withdrawal_events.withdrawal_id AND (w.seller_id = auth.uid() OR public.is_staff(auth.uid()))));

CREATE INDEX IF NOT EXISTS withdrawal_events_withdrawal_idx ON public.withdrawal_events(withdrawal_id, created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawals;