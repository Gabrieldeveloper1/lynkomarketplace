ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS protection text NOT NULL DEFAULT 'basica',
  ADD COLUMN IF NOT EXISTS protection_fee_cents bigint NOT NULL DEFAULT 10;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'username',''), split_part(NEW.email,'@',1)) || '-' || substr(NEW.id::text,1,4),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'display_name',''), split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  IF lower(NEW.email) = 'gabrieljairo865@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $function$;

DELETE FROM public.user_roles
WHERE role IN ('admin','moderator')
  AND user_id NOT IN (SELECT id FROM auth.users WHERE lower(email) = 'gabrieljairo865@gmail.com');

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = 'gabrieljairo865@gmail.com'
ON CONFLICT DO NOTHING;