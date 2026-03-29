-- ============================================
-- Ajout de tous les champs supplémentaires au profil
-- ============================================
-- 
-- Instructions :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Exécutez ce script pour ajouter tous les nouveaux champs manquants
-- 4. Ce script vérifie si chaque colonne existe avant de l'ajouter

-- Fonction pour ajouter une colonne si elle n'existe pas
DO $$ 
BEGIN
    -- Ajouter la colonne adresse
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'profiles' 
        AND column_name = 'adresse'
    ) THEN
        ALTER TABLE profiles ADD COLUMN adresse TEXT;
        RAISE NOTICE 'Colonne adresse ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne adresse existe déjà';
    END IF;

    -- Ajouter la colonne passions
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'profiles' 
        AND column_name = 'passions'
    ) THEN
        ALTER TABLE profiles ADD COLUMN passions TEXT;
        RAISE NOTICE 'Colonne passions ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne passions existe déjà';
    END IF;

    -- Ajouter la colonne photo_profil
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

-- Commentaires pour documenter les champs
COMMENT ON COLUMN profiles.adresse IS 'Adresse complète de l''utilisateur';
COMMENT ON COLUMN profiles.passions IS 'Centres d''intérêt et passions de l''utilisateur';
COMMENT ON COLUMN profiles.photo_profil IS 'URL de la photo de profil de l''utilisateur';

-- Vérifier que toutes les colonnes ont bien été créées
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
    AND table_name = 'profiles' 
    AND column_name IN ('adresse', 'passions', 'photo_profil')
ORDER BY column_name;

