-- ============================================
-- Fonction pour créer/mettre à jour un profil
-- Cette fonction contourne RLS pour permettre la création de profil lors de l'inscription
-- ============================================

-- Supprimer la fonction si elle existe déjà
DROP FUNCTION IF EXISTS public.create_or_update_profile(UUID, TEXT, TEXT);

-- Créer une fonction qui permet de créer/mettre à jour un profil
-- SECURITY DEFINER permet de contourner RLS
CREATE OR REPLACE FUNCTION public.create_or_update_profile(
  user_id UUID,
  user_pseudo TEXT,
  user_ville TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    pseudo,
    ville,
    description,
    telephone_verifie,
    is_active,
    date_inscription
  ) VALUES (
    user_id,
    user_pseudo,
    user_ville,
    NULL,
    false,
    true,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    pseudo = EXCLUDED.pseudo,
    ville = COALESCE(EXCLUDED.ville, profiles.ville),
    is_active = true;
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION public.create_or_update_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_or_update_profile TO anon;

