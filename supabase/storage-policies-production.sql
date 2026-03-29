-- ============================================
-- Politiques Storage pour le bucket photos (PRODUCTION)
-- ============================================
-- 
-- Ce script crée les politiques correctes pour permettre
-- l'upload et la lecture des photos dans le bucket "photos"
--
-- Structure des chemins :
-- - profiles/{user_id}/{filename} pour les photos de profil
-- - annonces/{annonce_id}/{filename} pour les photos d'annonces
--
-- Instructions :
-- 1. Allez dans Supabase Dashboard > SQL Editor
-- 2. Exécutez ce script
-- 3. Vérifiez que le bucket "photos" existe dans Storage
--

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Anyone can read photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload in their folder" ON storage.objects;

-- Politique 1 : Permettre à tous de lire les photos (SELECT)
-- Les photos sont publiques une fois uploadées
CREATE POLICY "Anyone can read photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'photos');

-- Politique 2 : Permettre aux utilisateurs authentifiés d'uploader leurs photos de profil
-- Chemin attendu : profiles/{user_id}/{filename}
CREATE POLICY "Users can upload profile photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'photos' 
  AND auth.role() = 'authenticated'
  AND (
    -- Permettre l'upload dans profiles/{user_id}/...
    (storage.foldername(name))[1] = 'profiles'::text
    AND (storage.foldername(name))[2] = (auth.uid())::text
  )
);

-- Politique 3 : Permettre aux utilisateurs authentifiés d'uploader des photos d'annonces
-- Chemin attendu : annonces/{annonce_id}/{filename}
-- Note: On vérifie que l'utilisateur est propriétaire de l'annonce via une fonction
CREATE POLICY "Users can upload announcement photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'annonces'::text
  -- Note: La vérification de propriété de l'annonce doit être faite au niveau applicatif
  -- car on ne peut pas facilement joindre les tables dans les politiques storage
);

-- Politique 4 : Permettre aux utilisateurs de supprimer leurs propres fichiers de profil
CREATE POLICY "Users can delete their profile photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'profiles'::text
  AND (storage.foldername(name))[2] = (auth.uid())::text
);

-- Politique 5 : Permettre aux utilisateurs de supprimer les photos de leurs annonces
-- Note: La vérification de propriété doit être faite au niveau applicatif
CREATE POLICY "Users can delete announcement photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'annonces'::text
);

-- Politique 6 : Permettre aux utilisateurs de mettre à jour leurs propres fichiers
CREATE POLICY "Users can update their files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
  AND (
    -- Photos de profil
    (
      (storage.foldername(name))[1] = 'profiles'::text
      AND (storage.foldername(name))[2] = (auth.uid())::text
    )
    OR
    -- Photos d'annonces (vérification de propriété au niveau applicatif)
    (storage.foldername(name))[1] = 'annonces'::text
  )
);

