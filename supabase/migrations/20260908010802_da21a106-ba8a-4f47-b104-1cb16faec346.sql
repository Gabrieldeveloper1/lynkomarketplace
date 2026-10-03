CREATE TABLE public.kyc_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  session_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'Not Started',
  decision jsonb,
  url text,
  last_event_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.kyc_sessions TO authenticated;
GRANT ALL ON public.kyc_sessions TO service_role;
ALTER TABLE public.kyc_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own kyc sessions" ON public.kyc_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX kyc_sessions_user_idx ON public.kyc_sessions (user_id, created_at DESC);