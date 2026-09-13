-- Manual identity verification submitted by the user and reviewed by staff.
ALTER TABLE public.verifications
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS document_type text,
  ADD COLUMN IF NOT EXISTS document_path text,
  ADD COLUMN IF NOT EXISTS selfie_path text;

ALTER TABLE public.verifications
  DROP CONSTRAINT IF EXISTS verifications_document_type_check;
ALTER TABLE public.verifications
  ADD CONSTRAINT verifications_document_type_check
  CHECK (document_type IS NULL OR document_type IN ('rg', 'cnh'));

-- KYC files are private: never expose identity documents through a public bucket.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('kyc-documents', 'kyc-documents', false, 10485760, ARRAY['image/jpeg', 'image/png']::text[])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png']::text[];

DROP POLICY IF EXISTS "kyc user upload own files" ON storage.objects;
DROP POLICY IF EXISTS "kyc user read own files" ON storage.objects;
DROP POLICY IF EXISTS "kyc staff read files" ON storage.objects;

CREATE POLICY "kyc user upload own files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'kyc-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "kyc user read own files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "kyc staff read files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'kyc-documents' AND public.is_staff(auth.uid()));

GRANT SELECT, INSERT ON storage.objects TO authenticated;
