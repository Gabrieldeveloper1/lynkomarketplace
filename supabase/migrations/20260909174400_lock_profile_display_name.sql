-- The registered display name is immutable after account creation.
CREATE OR REPLACE FUNCTION public.lock_profile_display_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.display_name IS DISTINCT FROM OLD.display_name THEN
    RAISE EXCEPTION 'O nome cadastrado não pode ser alterado.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lock_profile_display_name_on_profiles ON public.profiles;
CREATE TRIGGER lock_profile_display_name_on_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.lock_profile_display_name();
