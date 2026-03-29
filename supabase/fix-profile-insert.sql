-- ============================================
-- Correction de la politique RLS pour profiles
-- ============================================
-- 
-- Ce script corrige le problème d'insertion de profil lors de l'inscription
-- Le problème : auth.uid() n'est pas toujours disponible lors de l'inscription
-- Solution : Utiliser une fonction qui contourne RLS pour créer le profil initial
--

-- Supprimer l'ancienne politique d'insertion
DROP POLICY IF EXISTS "Les utilisateurs peuvent insérer leur propre profil" ON profiles;

-- Créer une fonction qui permet d'insérer un profil (contourne RLS)
CREATE OR REPLACE FUNCTION public.create_profile_for_user(
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
    is_active
  ) VALUES (
    user_id,
    user_pseudo,
    user_ville,
    NULL,
    false,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    pseudo = EXCLUDED.pseudo,
    ville = EXCLUDED.ville;
END;
$$;

-- Nouvelle politique : permettre l'insertion si auth.uid() = id
-- Mais aussi permettre via la fonction create_profile_for_user
CREATE POLICY "Les utilisateurs peuvent insérer leur propre profil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION public.create_profile_for_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_profile_for_user TO anon;

