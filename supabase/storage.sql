-- ============================================
-- Configuration du Storage Supabase pour les photos
-- ============================================
-- 
-- Instructions :
-- 1. Allez dans Storage dans votre projet Supabase
-- 2. Créez un bucket nommé "photos"
-- 3. Configurez les politiques de sécurité ci-dessous
--

-- Créer le bucket (à faire manuellement dans Supabase Dashboard)
-- Nom du bucket : photos
-- Public : false (privé)
-- File size limit : 5MB (recommandé)
-- Allowed MIME types : image/jpeg, image/png, image/webp

-- ============================================
-- Politiques de sécurité pour le Storage
-- ============================================

-- Permettre à tous les utilisateurs authentifiés de télécharger des photos
-- (Les photos sont publiques une fois uploadées, mais seul le propriétaire peut uploader)

-- Politique : Les utilisateurs peuvent uploader dans leur propre dossier
-- Bucket: photos
-- Policy name: "Users can upload in their own folder"
-- Policy definition:
-- (bucket_id = 'photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)

-- Politique : Tous peuvent lire les fichiers du bucket photos
-- Bucket: photos
-- Policy name: "Anyone can read photos"
-- Policy definition:
-- (bucket_id = 'photos'::text)

-- Note: Ces politiques doivent être créées manuellement dans Supabase Dashboard
-- sous Storage > photos > Policies

