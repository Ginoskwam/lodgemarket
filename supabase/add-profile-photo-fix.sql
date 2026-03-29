-- ============================================
-- Ajout de la photo de profil (avec vérification)
-- ============================================
-- 
-- Instructions :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Exécutez ce script pour ajouter le champ photo de profil
-- 4. Si vous avez déjà exécuté le script précédent, ce script vérifie d'abord si la colonne existe

-- Vérifier et ajouter la colonne photo_profil si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'profiles' 
        AND column_name = 'photo_profil'
    ) THEN
        ALTER TABLE profiles ADD COLUMN photo_profil TEXT;
        RAISE NOTICE 'Colonne photo_profil ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne photo_profil existe déjà';
    END IF;
END $$;

-- Commentaire pour documenter le champ
COMMENT ON COLUMN profiles.photo_profil IS 'URL de la photo de profil de l''utilisateur';

-- Vérifier que la colonne a bien été créée
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
    AND table_name = 'profiles' 
    AND column_name = 'photo_profil';

