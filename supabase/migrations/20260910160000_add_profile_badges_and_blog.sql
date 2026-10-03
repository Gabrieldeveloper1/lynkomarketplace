-- Selos controlados pelo sistema. O selo de funcionário é vinculado ao e-mail informado pelo proprietário.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS staff_badge boolean NOT NULL DEFAULT false;

UPDATE public.profiles
SET staff_badge = true
WHERE id = (
  SELECT id FROM auth.users WHERE lower(email) = 'gabrieljairo865@gmail.com' LIMIT 1
);

CREATE INDEX IF NOT EXISTS profiles_staff_badge_idx ON public.profiles(staff_badge) WHERE staff_badge = true;
