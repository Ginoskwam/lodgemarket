-- ============================================
-- Fonction pour incrémenter les vues d'une annonce
-- ============================================
-- 
-- Instructions :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Exécutez ce script pour créer la fonction d'incrémentation

-- Créer la fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_vues(annonce_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE annonces
  SET nombre_vues = COALESCE(nombre_vues, 0) + 1
  WHERE id = annonce_id;
END;
$$;

-- Commentaire pour documenter la fonction
COMMENT ON FUNCTION increment_vues(UUID) IS 'Incrémente le compteur de vues d''une annonce';

