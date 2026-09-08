ALTER TABLE public.verifications ADD COLUMN IF NOT EXISTS social_network text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verif_social_network text;