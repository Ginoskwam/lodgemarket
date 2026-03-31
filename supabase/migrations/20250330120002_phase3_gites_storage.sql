-- PHASE 3 — Buckets Storage + politiques (property-images public, property-documents privé)
-- Chemins attendus : {property_id}/{filename}

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('property-images', 'property-images', true),
  ('property-documents', 'property-documents', false)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

-- ---------------------------------------------------------------------------
-- property-images : lecture catalogue + upload par gestionnaire du bien
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "phase3_property_images_public_read" ON storage.objects;
CREATE POLICY "phase3_property_images_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "phase3_property_images_authenticated_insert" ON storage.objects;
CREATE POLICY "phase3_property_images_authenticated_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND public.storage_property_id_from_path(name) IS NOT NULL
    AND public.user_manages_property(
      auth.uid(),
      public.storage_property_id_from_path(name)
    )
  );

DROP POLICY IF EXISTS "phase3_property_images_authenticated_update" ON storage.objects;
CREATE POLICY "phase3_property_images_authenticated_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.storage_property_id_from_path(name) IS NOT NULL
    AND (
      public.user_manages_property(auth.uid(), public.storage_property_id_from_path(name))
      OR public.is_admin_user(auth.uid())
    )
  )
  WITH CHECK (
    bucket_id = 'property-images'
    AND public.storage_property_id_from_path(name) IS NOT NULL
    AND (
      public.user_manages_property(auth.uid(), public.storage_property_id_from_path(name))
      OR public.is_admin_user(auth.uid())
    )
  );

DROP POLICY IF EXISTS "phase3_property_images_authenticated_delete" ON storage.objects;
CREATE POLICY "phase3_property_images_authenticated_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.storage_property_id_from_path(name) IS NOT NULL
    AND (
      public.user_manages_property(auth.uid(), public.storage_property_id_from_path(name))
      OR public.is_admin_user(auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- property-documents : pas de lecture anon ; signed URLs côté serveur pour acheteurs
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "phase3_property_documents_select" ON storage.objects;
CREATE POLICY "phase3_property_documents_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'property-documents'
    AND public.storage_property_id_from_path(name) IS NOT NULL
    AND (
      public.is_admin_user(auth.uid())
      OR public.user_manages_property(auth.uid(), public.storage_property_id_from_path(name))
    )
  );

DROP POLICY IF EXISTS "phase3_property_documents_insert" ON storage.objects;
CREATE POLICY "phase3_property_documents_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-documents'
    AND public.storage_property_id_from_path(name) IS NOT NULL
    AND public.user_manages_property(
      auth.uid(),
      public.storage_property_id_from_path(name)
    )
  );

DROP POLICY IF EXISTS "phase3_property_documents_update" ON storage.objects;
CREATE POLICY "phase3_property_documents_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-documents'
    AND public.storage_property_id_from_path(name) IS NOT NULL
    AND (
      public.user_manages_property(auth.uid(), public.storage_property_id_from_path(name))
      OR public.is_admin_user(auth.uid())
    )
  )
  WITH CHECK (
    bucket_id = 'property-documents'
    AND public.storage_property_id_from_path(name) IS NOT NULL
    AND (
      public.user_manages_property(auth.uid(), public.storage_property_id_from_path(name))
      OR public.is_admin_user(auth.uid())
    )
  );

DROP POLICY IF EXISTS "phase3_property_documents_delete" ON storage.objects;
CREATE POLICY "phase3_property_documents_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-documents'
    AND public.storage_property_id_from_path(name) IS NOT NULL
    AND (
      public.user_manages_property(auth.uid(), public.storage_property_id_from_path(name))
      OR public.is_admin_user(auth.uid())
    )
  );
