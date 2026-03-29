# Configuration des Notifications Push

Ce document explique comment configurer les notifications push pour l'application.

## Prérequis

1. **Clés VAPID** : Les clés VAPID (Voluntary Application Server Identification) sont nécessaires pour authentifier votre serveur auprès des services de push (Chrome, Firefox, etc.)

2. **Service Worker** : Un service worker est déjà configuré dans `/public/sw.js`

3. **Base de données** : Une table `push_subscriptions` doit être créée dans Supabase

## Étape 1 : Générer les clés VAPID

Exécutez le script de génération :

```bash
node scripts/generate-vapid-keys.js
```

Cela affichera :
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` : Clé publique (peut être exposée côté client)
- `VAPID_PRIVATE_KEY` : Clé privée (doit rester secrète)
- `VAPID_EMAIL` : Email de contact (optionnel)

## Étape 2 : Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=votre_cle_publique_ici
VAPID_PRIVATE_KEY=votre_cle_privee_ici
VAPID_EMAIL=mailto:contact@broques.fr
```

## Étape 3 : Créer la table push_subscriptions dans Supabase

Exécutez cette requête SQL dans l'éditeur SQL de Supabase :

```sql
-- Table pour stocker les subscriptions push
CREATE TABLE IF NOT EXISTS push_subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- RLS (Row Level Security) - permettre aux utilisateurs de gérer leurs propres subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs peuvent lire leurs propres subscriptions
CREATE POLICY "Users can read their own push subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique : les utilisateurs peuvent insérer leurs propres subscriptions
CREATE POLICY "Users can insert their own push subscriptions"
  ON push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique : les utilisateurs peuvent mettre à jour leurs propres subscriptions
CREATE POLICY "Users can update their own push subscriptions"
  ON push_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Politique : les utilisateurs peuvent supprimer leurs propres subscriptions
CREATE POLICY "Users can delete their own push subscriptions"
  ON push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);
```

## Étape 4 : Tester les notifications push

1. **Démarrer l'application** :
   ```bash
   npm run dev
   ```

2. **Se connecter** : Connectez-vous avec un compte utilisateur

3. **Autoriser les notifications** : Le navigateur demandera automatiquement la permission pour les notifications

4. **Tester** : Envoyez un message à un autre utilisateur connecté. Le destinataire devrait recevoir une notification push même si l'application n'est pas ouverte.

## Fonctionnement

### Côté client

1. **Service Worker** (`/public/sw.js`) :
   - Écoute les événements `push`
   - Affiche les notifications
   - Gère les clics sur les notifications

2. **NotificationsProvider** (`/components/NotificationsProvider.tsx`) :
   - Enregistre le service worker
   - Demande la permission
   - Crée et enregistre la subscription push

3. **Hook useNotifications** (`/hooks/useNotifications.ts`) :
   - Écoute les nouveaux messages via Supabase Realtime
   - Affiche les notifications système (si l'application est ouverte)

### Côté serveur

1. **API `/api/push/subscribe`** :
   - Enregistre les subscriptions push des utilisateurs
   - Stocke les informations dans la base de données

2. **API `/api/push/send`** :
   - Envoie les notifications push aux utilisateurs
   - Utilise la bibliothèque `web-push`

3. **API `/api/push/vapid-public-key`** :
   - Retourne la clé publique VAPID au client

## Compatibilité

### Desktop
- ✅ Chrome/Edge (Windows, macOS, Linux)
- ✅ Firefox (Windows, macOS, Linux)
- ✅ Safari (macOS) - iOS 16.4+

### Mobile
- ✅ Chrome Android
- ✅ Firefox Android
- ✅ Safari iOS (16.4+) - Support Web Push Notifications standard
  - Nécessite que l'application soit ajoutée à l'écran d'accueil (PWA)
  - Voir `APNS_SETUP.md` pour plus de détails

## Dépannage

### Les notifications ne s'affichent pas

1. **Vérifier les permissions** :
   - Le navigateur doit avoir la permission d'afficher des notifications
   - Vérifier dans les paramètres du navigateur

2. **Vérifier le service worker** :
   - Ouvrir les DevTools > Application > Service Workers
   - Vérifier que le service worker est actif

3. **Vérifier les clés VAPID** :
   - Les clés doivent être correctement configurées dans `.env.local`
   - La clé publique doit correspondre à la clé privée

4. **Vérifier la console** :
   - Ouvrir la console du navigateur pour voir les erreurs éventuelles

### Les notifications push ne fonctionnent pas en production

1. **HTTPS requis** : Les notifications push nécessitent HTTPS (sauf localhost)
2. **Service Worker** : Le service worker doit être accessible via HTTPS
3. **Clés VAPID** : Les clés doivent être les mêmes en développement et en production

## Notes importantes

- Les notifications push fonctionnent même si l'application n'est pas ouverte
- Les notifications système (via `useNotifications`) fonctionnent uniquement si l'application est ouverte
- Les deux systèmes peuvent fonctionner en parallèle pour une meilleure expérience utilisateur

