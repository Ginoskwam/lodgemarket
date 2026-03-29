-- ============================================
-- Ajout de la photo de profil
-- ============================================
-- 
-- Instructions :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Exécutez ce script pour ajouter le champ photo de profil

-- Ajouter la colonne photo_profil à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS photo_profil TEXT;

-- Commentaire pour documenter le champ
COMMENT ON COLUMN profiles.photo_profil IS 'URL de la photo de profil de l''utilisateur';

