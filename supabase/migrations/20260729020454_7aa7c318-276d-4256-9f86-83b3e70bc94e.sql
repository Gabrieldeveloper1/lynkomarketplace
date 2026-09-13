
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  messages boolean NOT NULL DEFAULT true,
  orders boolean NOT NULL DEFAULT true,
  withdrawals boolean NOT NULL DEFAULT true,
  verification boolean NOT NULL DEFAULT true,
  reports boolean NOT NULL DEFAULT true,
  marketing boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.notification_preferences TO authenticated;
GRANT ALL ON public.notification_preferences TO service_role;

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own notification prefs" ON public.notification_preferences
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert own notification prefs" ON public.notification_preferences
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update own notification prefs" ON public.notification_preferences
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TRIGGER notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.verifications ADD COLUMN IF NOT EXISTS social_network text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verif_social_network text;

CREATE OR REPLACE FUNCTION public.notify_user(_user_id uuid, _kind text, _title text, _body text, _link text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _allowed boolean := true; _p public.notification_preferences%ROWTYPE;
BEGIN
  SELECT * INTO _p FROM public.notification_preferences WHERE user_id = _user_id;
  IF FOUND THEN
    _allowed := CASE _kind
      WHEN 'message' THEN _p.messages
      WHEN 'order' THEN _p.orders
      WHEN 'withdrawal' THEN _p.withdrawals
      WHEN 'verification' THEN _p.verification
      WHEN 'report' THEN _p.reports
      WHEN 'appeal' THEN _p.reports
      WHEN 'marketing' THEN _p.marketing
      ELSE true
    END;
  END IF;
  IF _allowed THEN
    INSERT INTO public.notifications (user_id, kind, title, body, link)
    VALUES (_user_id, _kind, _title, _body, _link);
  END IF;
END; $$;
REVOKE ALL ON FUNCTION public.notify_user(uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;
