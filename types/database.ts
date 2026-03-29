/**
 * Types TypeScript pour la base de données Supabase
 * Ces types correspondent aux tables créées dans Supabase
 */

export type Profile = {
  id: string // UUID, même id que auth.users
  pseudo: string
  ville: string | null
  adresse: string | null
  description: string | null
  passions: string | null
  photo_profil: string | null
  telephone_verifie: boolean
  date_inscription: string // timestamp
  is_active: boolean
}

export type Annonce = {
  id: string // UUID
  titre: string
  description: string
  categorie: 'Bricolage & Outils' | 'Jardinage & Extérieur' | 'Événementiel & Fêtes' | 'Audio & Musique' | 'Sport & Loisirs' | 'Transport & Mobilité' | 'Multimédia & Électronique' | 'Maison & Décoration' | 'Cuisine & Électroménager' | 'Autre'
  prix_jour: number
  caution_indicative: number | null
  ville: string
  photos: string[] // URLs des photos
  disponible: boolean
  date_creation: string // timestamp
  proprietaire_id: string // UUID → profiles
  regles_specifiques: string | null
  nombre_vues: number | null
  nombre_articles: number | null // Nombre d'articles disponibles
}

export type Conversation = {
  id: string // UUID
  annonce_id: string // UUID → annonces
  participant1_id: string // UUID → profiles
  participant2_id: string // UUID → profiles
  date_creation: string // timestamp
  derniere_activite: string // timestamp
  dernier_email_notif: string | null // timestamp
  deleted_by_participant1: boolean // Soft delete pour participant1
  deleted_by_participant2: boolean // Soft delete pour participant2
}

export type Message = {
  id: string // UUID
  conversation_id: string // UUID → conversations
  expediteur_id: string // UUID → profiles
  destinataire_id: string // UUID → profiles
  contenu: string
  date_envoi: string // timestamp
  lu: boolean
  deleted_by_expediteur: boolean // Soft delete pour l'expéditeur
  deleted_by_destinataire: boolean // Soft delete pour le destinataire
}

// Types pour les requêtes avec jointures
export type AnnonceWithOwner = Annonce & {
  proprietaire: Profile
}

export type ConversationWithDetails = Conversation & {
  annonce: Annonce
  participant1: Profile
  participant2: Profile
}

export type MessageWithSender = Message & {
  expediteur: Profile
}

