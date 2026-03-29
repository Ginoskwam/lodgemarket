-- ============================================
-- Script SQL pour créer les tables Supabase
-- ============================================
-- 
-- Instructions :
-- 1. Connectez-vous à votre projet Supabase
-- 2. Allez dans SQL Editor
-- 3. Exécutez ce script pour créer toutes les tables nécessaires
-- 4. Configurez les Row Level Security (RLS) avec les politiques ci-dessous
--

-- ============================================
-- 1. Table profiles (profil utilisateur)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudo TEXT NOT NULL,
  ville TEXT,
  description TEXT,
  telephone_verifie BOOLEAN DEFAULT false,
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_pseudo ON profiles(pseudo);
CREATE INDEX IF NOT EXISTS idx_profiles_ville ON profiles(ville);

-- ============================================
-- 2. Table annonces
-- ============================================
CREATE TABLE IF NOT EXISTS annonces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  categorie TEXT NOT NULL CHECK (categorie IN ('Bricolage & Outils', 'Jardinage & Extérieur', 'Événementiel & Fêtes', 'Audio & Musique', 'Sport & Loisirs', 'Transport & Mobilité', 'Multimédia & Électronique', 'Maison & Décoration', 'Cuisine & Électroménager', 'Autre')),
  prix_jour NUMERIC(10, 2) NOT NULL,
  caution_indicative NUMERIC(10, 2),
  ville TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  disponible BOOLEAN DEFAULT true,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  proprietaire_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  regles_specifiques TEXT,
  nombre_articles INTEGER DEFAULT 1
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_annonces_proprietaire ON annonces(proprietaire_id);
CREATE INDEX IF NOT EXISTS idx_annonces_disponible ON annonces(disponible);
CREATE INDEX IF NOT EXISTS idx_annonces_categorie ON annonces(categorie);
CREATE INDEX IF NOT EXISTS idx_annonces_ville ON annonces(ville);
CREATE INDEX IF NOT EXISTS idx_annonces_date_creation ON annonces(date_creation DESC);

-- ============================================
-- 3. Table conversations
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  annonce_id UUID NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
  participant1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  derniere_activite TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dernier_email_notif TIMESTAMP WITH TIME ZONE,
  CONSTRAINT check_different_participants CHECK (participant1_id != participant2_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_conversations_annonce ON conversations(annonce_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON conversations(participant2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_derniere_activite ON conversations(derniere_activite DESC);

-- ============================================
-- 4. Table messages
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  expediteur_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  destinataire_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  date_envoi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lu BOOLEAN DEFAULT false
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_expediteur ON messages(expediteur_id);
CREATE INDEX IF NOT EXISTS idx_messages_destinataire ON messages(destinataire_id);
CREATE INDEX IF NOT EXISTS idx_messages_date_envoi ON messages(date_envoi ASC);
CREATE INDEX IF NOT EXISTS idx_messages_lu ON messages(lu) WHERE lu = false;

-- ============================================
-- 5. Fonction pour créer automatiquement un profil lors de l'inscription
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, pseudo, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'pseudo', 'Utilisateur'),
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. Fonction pour mettre à jour derniere_activite automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION public.update_conversation_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET derniere_activite = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour l'activité de la conversation
DROP TRIGGER IF EXISTS on_message_created ON messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_activity();

