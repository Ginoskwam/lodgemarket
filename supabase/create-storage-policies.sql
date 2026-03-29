-- ============================================
-- Création des politiques Storage pour le bucket photos
-- ============================================
-- 
-- Ce script crée les politiques nécessaires pour :
-- 1. Permettre à tous de lire les photos (SELECT)
-- 2. Permettre aux utilisateurs authentifiés d'uploader (INSERT)
--

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Anyone can read photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

-- Politique 1 : Permettre à tous de lire les photos (SELECT)
CREATE POLICY "Anyone can read photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'photos');

-- Politique 2 : Permettre aux utilisateurs authentifiés d'uploader (INSERT)
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'photos' 
  AND auth.role() = 'authenticated'
);

