# Prochaines étapes - tonmatos

Ce document liste les améliorations possibles pour faire évoluer le MVP.

## 🔧 Améliorations techniques

### 1. Notifications email complètes
- [ ] Implémenter l'envoi d'email via Resend ou SendGrid
- [ ] Créer une Supabase Edge Function pour gérer les emails
- [ ] Ajouter des templates d'email plus élaborés
- [ ] Gérer les préférences de notification utilisateur

### 2. Gestion des photos
- [ ] Ajouter un carousel pour les photos multiples
- [ ] Permettre la suppression de photos
- [ ] Ajouter un redimensionnement automatique des images
- [ ] Optimiser le chargement des images (Next.js Image)

### 3. Recherche et filtres
- [ ] Ajouter une recherche textuelle dans les annonces
- [ ] Améliorer les filtres (prix min/max, date, etc.)
- [ ] Ajouter un tri (prix, date, popularité)
- [ ] Implémenter la pagination

### 4. Profil utilisateur
- [ ] Page de profil détaillée
- [ ] Édition du profil
- [ ] Historique des locations
- [ ] Système de notation/avis (optionnel)

### 5. Sécurité
- [ ] Validation côté serveur plus stricte
- [ ] Rate limiting sur les API routes
- [ ] Protection CSRF
- [ ] Vérification email obligatoire

## 🎨 Améliorations UX/UI

### 1. Design
- [ ] Améliorer le responsive design
- [ ] Ajouter des animations subtiles
- [ ] Créer un système de thème (dark mode)
- [ ] Améliorer l'accessibilité (ARIA, contraste)

### 2. Fonctionnalités utilisateur
- [ ] Favoris / Annonces sauvegardées
- [ ] Notifications in-app (en plus des emails)
- [ ] Indicateur de messages non lus
- [ ] Prévisualisation des messages

### 3. Expérience mobile
- [ ] PWA (Progressive Web App)
- [ ] Notifications push
- [ ] Optimisation pour mobile

## 📊 Fonctionnalités métier

### 1. Calendrier de disponibilité
- [ ] Système de réservation avec dates
- [ ] Calendrier de disponibilité par annonce
- [ ] Gestion des conflits de réservation

### 2. Gestion des annonces
- [ ] Marquer une annonce comme "louée"
- [ ] Historique des locations
- [ ] Statistiques pour les propriétaires

### 3. Messagerie avancée
- [ ] Pièces jointes dans les messages
- [ ] Réactions aux messages
- [ ] Recherche dans les conversations

## 🚀 Évolutions possibles (hors MVP)

### 1. Paiement (optionnel)
- [ ] Intégration Stripe
- [ ] Gestion des cautions
- [ ] Paiement sécurisé

### 2. Assurance (optionnel)
- [ ] Partenariat avec une assurance
- [ ] Gestion des sinistres

### 3. Arbitrage (optionnel)
- [ ] Système de médiation
- [ ] Signalement de problèmes
- [ ] Support client

## 📈 Analytics et monitoring

- [ ] Intégration Google Analytics ou Plausible
- [ ] Monitoring des erreurs (Sentry)
- [ ] Dashboard admin pour les statistiques
- [ ] Logs d'activité

## 🧪 Tests

- [ ] Tests unitaires (Jest)
- [ ] Tests d'intégration
- [ ] Tests E2E (Playwright ou Cypress)
- [ ] Tests de charge

## 📱 Mobile native (optionnel)

- [ ] Application React Native
- [ ] Partage de code avec Next.js
- [ ] Notifications push natives

## 🔄 CI/CD

- [ ] GitHub Actions pour les tests
- [ ] Déploiement automatique
- [ ] Preview deployments sur Vercel

## 📝 Documentation

- [ ] Documentation API
- [ ] Guide de contribution
- [ ] Documentation technique détaillée
- [ ] Tutoriels vidéo

---

**Note** : Ces améliorations sont optionnelles. Le MVP actuel est fonctionnel et peut être utilisé tel quel pour valider le concept.

