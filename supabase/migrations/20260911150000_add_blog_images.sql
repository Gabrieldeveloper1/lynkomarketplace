ALTER TABLE public.site_pages
  ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.site_pages.image_url IS 'Imagem de capa pública do artigo, armazenada no bucket media.';
