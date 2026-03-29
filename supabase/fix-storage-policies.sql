-- ============================================
-- Correction des politiques Storage pour le bucket photos
-- ============================================
-- 
-- Ce script crée les politiques correctes pour permettre
-- l'upload et la lecture des photos
--

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Anyone can read photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload in their folder" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

-- Politique 1 : Permettre à tous de lire les photos (SELECT)
CREATE POLICY "Anyone can read photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'photos');

-- Politique 2 : Permettre aux utilisateurs authentifiés d'uploader dans leur dossier (INSERT)
CREATE POLICY "Users can upload in their folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- Politique 3 : Permettre aux utilisateurs de supprimer leurs propres fichiers (DELETE)
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- Politique 4 : Permettre aux utilisateurs de mettre à jour leurs propres fichiers (UPDATE)
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

