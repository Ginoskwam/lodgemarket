-- ============================================
-- Ajout de champs supplémentaires au profil
-- ============================================
-- 
-- Instructions :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Exécutez ce script pour ajouter les nouveaux champs

-- Ajouter les colonnes adresse et passions à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS adresse TEXT,
ADD COLUMN IF NOT EXISTS passions TEXT;

-- Commentaires pour documenter les nouveaux champs
COMMENT ON COLUMN profiles.adresse IS 'Adresse complète de l''utilisateur';
COMMENT ON COLUMN profiles.passions IS 'Centres d''intérêt et passions de l''utilisateur';

