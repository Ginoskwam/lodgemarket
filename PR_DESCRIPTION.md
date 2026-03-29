# feat: Ajout des notifications push avec support iOS/APNs

## 🎉 Fonctionnalités ajoutées

### Notifications Push
- ✅ Service worker pour gérer les notifications push
- ✅ Hook useNotifications pour les notifications système
- ✅ Intégration des notifications push via web-push
- ✅ Support Apple Push Notification Service (APNs) pour iOS
- ✅ Manifest.json pour PWA

### API Routes
- ✅ `/api/push/subscribe` - Enregistrement des subscriptions
- ✅ `/api/push/send` - Envoi de notifications push
- ✅ `/api/push/vapid-public-key` - Récupération de la clé publique

### Documentation
- ✅ Guide complet de configuration (PUSH_NOTIFICATIONS_SETUP.md)
- ✅ Guide spécifique iOS/APNs (APNS_SETUP.md)
- ✅ Script de génération des clés VAPID

### Corrections
- ✅ Correction du layout (viewport, metadata)
- ✅ Correction de l'affichage de l'image sur la page d'accueil
- ✅ Nettoyage du cache Next.js

## 📋 Configuration requise

1. Générer les clés VAPID : `node scripts/generate-vapid-keys.js`
2. Ajouter les variables d'environnement dans `.env.local`:
   ```
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
   VAPID_PRIVATE_KEY=...
   VAPID_EMAIL=mailto:contact@broques.fr
   ```
3. Créer la table `push_subscriptions` dans Supabase (voir PUSH_NOTIFICATIONS_SETUP.md)

## 🧪 Tests

- [x] Build réussi
- [x] Service worker fonctionnel
- [x] Notifications système testées
- [x] Support iOS 16.4+ vérifié

## 📱 Compatibilité

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari macOS
- ✅ Safari iOS 16.4+

## 🔗 Liens utiles

- [Documentation Push Notifications](./PUSH_NOTIFICATIONS_SETUP.md)
- [Documentation APNs iOS](./APNS_SETUP.md)

