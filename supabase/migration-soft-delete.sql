-- Migration pour ajouter le support du soft delete pour les conversations et messages
-- À exécuter dans Supabase SQL Editor

-- Ajouter les colonnes pour le soft delete des conversations
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS deleted_by_participant1 BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_by_participant2 BOOLEAN DEFAULT FALSE;

-- Ajouter les colonnes pour le soft delete des messages
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS deleted_by_expediteur BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_by_destinataire BOOLEAN DEFAULT FALSE;

-- Créer des index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_conversations_participant1_deleted 
ON conversations(participant1_id, deleted_by_participant1);

CREATE INDEX IF NOT EXISTS idx_conversations_participant2_deleted 
ON conversations(participant2_id, deleted_by_participant2);

CREATE INDEX IF NOT EXISTS idx_messages_expediteur_deleted 
ON messages(expediteur_id, deleted_by_expediteur);

CREATE INDEX IF NOT EXISTS idx_messages_destinataire_deleted 
ON messages(destinataire_id, deleted_by_destinataire);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_destinataire_deleted 
ON messages(conversation_id, destinataire_id, deleted_by_destinataire);

-- Commentaires pour la documentation
COMMENT ON COLUMN conversations.deleted_by_participant1 IS 'Indique si la conversation a été supprimée par le participant 1 (soft delete)';
COMMENT ON COLUMN conversations.deleted_by_participant2 IS 'Indique si la conversation a été supprimée par le participant 2 (soft delete)';
COMMENT ON COLUMN messages.deleted_by_expediteur IS 'Indique si le message a été supprimé par l''expéditeur (soft delete)';
COMMENT ON COLUMN messages.deleted_by_destinataire IS 'Indique si le message a été supprimé par le destinataire (soft delete)';

