ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS rating smallint;
UPDATE public.reviews SET rating = CASE WHEN positive THEN 5 ELSE 1 END WHERE rating IS NULL;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_rating_range CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5));