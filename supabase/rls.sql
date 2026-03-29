-- ============================================
-- Row Level Security (RLS) Policies pour Supabase
-- ============================================
-- 
-- Instructions :
-- 1. Activez RLS sur chaque table dans Supabase Dashboard
-- 2. Exécutez ce script pour créer les politiques de sécurité
-- 3. Les politiques garantissent que les utilisateurs ne peuvent accéder qu'à leurs propres données
--

-- ============================================
-- 1. Table profiles
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir tous les profils actifs
CREATE POLICY "Les utilisateurs peuvent voir tous les profils actifs"
  ON profiles FOR SELECT
  USING (is_active = true);

-- Les utilisateurs peuvent voir leur propre profil (même inactif)
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Les utilisateurs peuvent insérer leur propre profil
CREATE POLICY "Les utilisateurs peuvent insérer leur propre profil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. Table annonces
-- ============================================
ALTER TABLE annonces ENABLE ROW LEVEL SECURITY;

-- Tous les utilisateurs peuvent voir les annonces disponibles
CREATE POLICY "Tous peuvent voir les annonces disponibles"
  ON annonces FOR SELECT
  USING (disponible = true);

-- Les utilisateurs peuvent voir leurs propres annonces (même non disponibles)
CREATE POLICY "Les utilisateurs peuvent voir leurs propres annonces"
  ON annonces FOR SELECT
  USING (auth.uid() = proprietaire_id);

-- Les utilisateurs peuvent créer leurs propres annonces
CREATE POLICY "Les utilisateurs peuvent créer leurs propres annonces"
  ON annonces FOR INSERT
  WITH CHECK (auth.uid() = proprietaire_id);

-- Les utilisateurs peuvent mettre à jour leurs propres annonces
CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres annonces"
  ON annonces FOR UPDATE
  USING (auth.uid() = proprietaire_id);

-- Les utilisateurs peuvent supprimer leurs propres annonces
CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres annonces"
  ON annonces FOR DELETE
  USING (auth.uid() = proprietaire_id);

-- ============================================
-- 3. Table conversations
-- ============================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir les conversations où ils sont participants
CREATE POLICY "Les utilisateurs peuvent voir leurs conversations"
  ON conversations FOR SELECT
  USING (
    auth.uid() = participant1_id OR
    auth.uid() = participant2_id
  );

-- Les utilisateurs peuvent créer des conversations où ils sont participants
CREATE POLICY "Les utilisateurs peuvent créer des conversations"
  ON conversations FOR INSERT
  WITH CHECK (
    auth.uid() = participant1_id OR
    auth.uid() = participant2_id
  );

-- Les utilisateurs peuvent mettre à jour leurs conversations
CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs conversations"
  ON conversations FOR UPDATE
  USING (
    auth.uid() = participant1_id OR
    auth.uid() = participant2_id
  );

-- ============================================
-- 4. Table messages
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir les messages où ils sont expéditeur ou destinataire
CREATE POLICY "Les utilisateurs peuvent voir leurs messages"
  ON messages FOR SELECT
  USING (
    auth.uid() = expediteur_id OR
    auth.uid() = destinataire_id
  );

-- Les utilisateurs peuvent créer des messages où ils sont expéditeurs
CREATE POLICY "Les utilisateurs peuvent créer des messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = expediteur_id);

-- Les utilisateurs peuvent mettre à jour les messages qu'ils ont reçus (pour marquer comme lu)
CREATE POLICY "Les utilisateurs peuvent mettre à jour les messages reçus"
  ON messages FOR UPDATE
  USING (auth.uid() = destinataire_id)
  WITH CHECK (auth.uid() = destinataire_id);

