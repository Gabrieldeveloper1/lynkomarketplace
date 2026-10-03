-- Administradores e moderadores podem corrigir a identidade pública do perfil
-- pelo painel. Usuários comuns continuam sem poder alterar o nome cadastrado.
CREATE OR REPLACE FUNCTION public.lock_profile_display_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.display_name IS DISTINCT FROM OLD.display_name
     AND COALESCE(auth.role(), '') <> 'service_role'
     AND NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'O nome cadastrado não pode ser alterado.';
  END IF;
  RETURN NEW;
END;
$$;
