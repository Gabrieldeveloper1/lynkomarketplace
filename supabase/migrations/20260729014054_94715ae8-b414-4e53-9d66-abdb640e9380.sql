ALTER TABLE public.verifications
  ADD COLUMN IF NOT EXISTS level text NOT NULL DEFAULT 'basico',
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS business_name text,
  ADD COLUMN IF NOT EXISTS social_url text,
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.verifications ALTER COLUMN document_number DROP NOT NULL;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verification_level text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verif_country text,
  ADD COLUMN IF NOT EXISTS verif_city text,
  ADD COLUMN IF NOT EXISTS verif_business text,
  ADD COLUMN IF NOT EXISTS verif_social text;