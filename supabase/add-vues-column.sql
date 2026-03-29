-- ============================================
-- Ajout du compteur de vues pour les annonces
-- ============================================
-- 
-- Instructions :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Exécutez ce script pour ajouter le champ nombre de vues

-- Vérifier et ajouter la colonne nombre_vues si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'annonces' 
        AND column_name = 'nombre_vues'
    ) THEN
        ALTER TABLE annonces ADD COLUMN nombre_vues INTEGER DEFAULT 0;
        RAISE NOTICE 'Colonne nombre_vues ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne nombre_vues existe déjà';
    END IF;
END $$;

-- Commentaire pour documenter le champ
COMMENT ON COLUMN annonces.nombre_vues IS 'Nombre de fois que l''annonce a été consultée';

-- Vérifier que la colonne a bien été créée
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
    AND table_name = 'annonces' 
    AND column_name = 'nombre_vues';

