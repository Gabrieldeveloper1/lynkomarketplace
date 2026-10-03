-- Public media storage for product, category, avatar and banner images.
-- GIFs are intentionally excluded; stored URLs remain valid until explicitly removed.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'image/bmp',
    'image/tiff'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "media read authenticated" ON storage.objects;
DROP POLICY IF EXISTS "media read anon" ON storage.objects;
DROP POLICY IF EXISTS "media upload own folder" ON storage.objects;
DROP POLICY IF EXISTS "media update own folder" ON storage.objects;
DROP POLICY IF EXISTS "media delete own folder" ON storage.objects;
DROP POLICY IF EXISTS "media public read" ON storage.objects;
DROP POLICY IF EXISTS "media authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "media authenticated update" ON storage.objects;

CREATE POLICY "media public read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "media authenticated upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND COALESCE(metadata->>'mimetype', '') <> 'image/gif'
  );

CREATE POLICY "media authenticated update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND COALESCE(metadata->>'mimetype', '') <> 'image/gif'
  );

GRANT SELECT ON storage.objects TO anon, authenticated;
GRANT INSERT, UPDATE ON storage.objects TO authenticated;
