# CONTEXT.md - Documentation du projet BROQUES

> **Dernière mise à jour** : Analyse complète du codebase  
> **Projet** : BROQUES - Plateforme de location de matériel entre voisins  
> **Objectif** : Documenter la stack, l'architecture, les conventions et les points critiques pour les futures sessions de développement

---

## 📋 Table des matières

1. [Stack technique](#stack-technique)
2. [Architecture](#architecture)
3. [Conventions de code](#conventions-de-code)
4. [Structure des pages et routing](#structure-des-pages-et-routing)
5. [Design System](#design-system)
6. [Logique produit](#logique-produit)
7. [Contraintes techniques](#contraintes-techniques)
8. [Points critiques à ne pas casser](#points-critiques-à-ne-pas-casser)
9. [Zones d'incertitude](#zones-dincertitude)

---

## 🛠 Stack technique

### Frameworks & Bibliothèques principales

- **Next.js 14.2.18** (App Router)
  - Server Components et Client Components
  - Server Actions (implicites via Server Components)
  - Middleware pour l'authentification
  - Image optimization intégrée

- **React 18.2.0**
  - Hooks standards (useState, useEffect, etc.)
  - Suspense pour le chargement asynchrone

- **TypeScript 5**
  - Strict mode activé
  - Path aliases configurés : `@/*` → `./*`

### Base de données & Backend

- **Supabase 2.39.0**
  - Authentification (email/password)
  - Base de données PostgreSQL
  - Storage pour les photos
  - Real-time subscriptions (messages)
  - Row Level Security (RLS) activé

- **@supabase/ssr 0.1.0**
  - Gestion des sessions côté serveur et client
  - Middleware pour maintenir les sessions

### UI & Styling

- **Tailwind CSS 3.3.0**
  - Configuration personnalisée avec palette BROQUES
  - Classes utilitaires personnalisées dans `globals.css`
  - Design system cohérent

- **PostCSS + Autoprefixer**
  - Traitement CSS standard

### Cartographie

- **Leaflet 1.9.4** + **react-leaflet 4.2.1**
  - Cartes interactives pour visualiser les annonces
  - Géocodage via Nominatim (OpenStreetMap)
  - Import dynamique pour éviter les erreurs SSR

### Formulaires & Validation

- **react-hook-form 7.49.2**
  - Gestion des formulaires

- **zod 3.22.4**
  - Validation de schémas TypeScript

### Outils de développement

- **ESLint** avec config Next.js
- **Node.js** (version non spécifiée, probablement 20+)

---

## 🏗 Architecture

### Structure des dossiers

```
tonmatos/
├── app/                    # Next.js App Router
│   ├── (pages)            # Pages publiques et privées
│   ├── api/               # API Routes
│   ├── auth/              # Authentification
│   ├── annonces/          # Gestion des annonces
│   ├── messages/          # Messagerie
│   ├── profil/            # Profil utilisateur
│   ├── layout.tsx         # Layout racine
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et clients
│   ├── supabase/          # Clients Supabase (server/client/middleware)
│   └── email.ts           # Utilitaires email (optionnel)
├── types/                 # Types TypeScript
│   └── database.ts        # Types générés depuis Supabase
├── supabase/              # Scripts SQL et migrations
├── public/                # Assets statiques
└── middleware.ts          # Middleware Next.js pour auth
```

### Patterns architecturaux

#### 1. **Séparation Server/Client Components**
- **Server Components** par défaut (pages, layouts)
- **Client Components** (`'use client'`) uniquement quand nécessaire :
  - Interactions utilisateur (onClick, onChange)
  - Hooks React (useState, useEffect)
  - Accès au navigateur (localStorage, window)

#### 2. **Gestion de l'authentification**
- **Middleware** (`middleware.ts`) : maintient la session sur chaque requête
- **Client Supabase serveur** (`lib/supabase/server.ts`) : pour Server Components
- **Client Supabase client** (`lib/supabase/client.ts`) : pour Client Components
- **Client Supabase middleware** (`lib/supabase/middleware.ts`) : pour le middleware

#### 3. **Routing**
- **App Router** de Next.js 14
- Routes dynamiques : `[id]`, `[id]/modifier`
- Routes imbriquées pour l'organisation logique

#### 4. **Gestion des données**
- **Supabase** comme source unique de vérité
- **Real-time** pour les messages (subscriptions)
- **Optimistic updates** dans certains composants

---

## 📝 Conventions de code

### Naming

- **Fichiers** : kebab-case (`annonces-map.tsx`, `contact-button.tsx`)
- **Composants** : PascalCase (`AnnoncesMap`, `ContactButton`)
- **Fonctions** : camelCase (`handleContact`, `loadAnnonces`)
- **Types** : PascalCase (`Annonce`, `Profile`, `Conversation`)

### Structure des composants

```typescript
// 1. Imports
import { ... } from '...'

// 2. Types/interfaces (si locaux)
type Props = { ... }

// 3. Composant principal
export function ComponentName({ ... }: Props) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
}
```

### Commentaires

- Commentaires JSDoc pour les composants principaux
- Commentaires explicatifs pour la logique complexe
- Pas de commentaires redondants

### Gestion des erreurs

- Try/catch dans les fonctions async
- Affichage d'erreurs utilisateur via des alertes ou des messages inline
- Logs console pour le debugging

### TypeScript

- Types stricts activés
- Types partagés dans `types/database.ts`
- Éviter `any` autant que possible (quelques `@ts-ignore` pour Leaflet dynamique)

---

## 🗺 Structure des pages et routing

### Routes publiques

- `/` - Page d'accueil (landing page)
- `/annonces` - Liste des annonces (avec filtres)
- `/annonces/[id]` - Détail d'une annonce
- `/auth/login` - Connexion
- `/auth/register` - Inscription
- `/aide` - Page d'aide
- `/privacy` - Politique de confidentialité
- `/terms` - Conditions d'utilisation

### Routes protégées (nécessitent authentification)

- `/annonces/nouvelle` - Créer une annonce
- `/annonces/[id]/modifier` - Modifier une annonce (propriétaire uniquement)
- `/annonces/mes-annonces` - Liste des annonces de l'utilisateur
- `/messages` - Liste des conversations
- `/messages/[id]` - Détail d'une conversation
- `/profil/modifier` - Modifier le profil

### API Routes

- `/api/send-notification` - Envoi de notifications email (POST)

### Patterns de routing

- **Suspense** utilisé pour les pages avec `useSearchParams` (ex: `/annonces`)
- **Redirections** après authentification via query params (`?redirect=/path`)
- **Protection** des routes via vérification de session dans les composants

---

## 🎨 Design System

### Palette de couleurs

#### Couleurs principales

- **Primary (Orange brûlé)** : `#C2410C`
  - Variantes : `primary-dark` (`#9A3412`), `primary-light` (`#EA580C`)
  - Utilisation : Boutons principaux, liens, accents

- **Brique** : `#B91C1C`
  - Variantes : `brique-light` (`#DC2626`)
  - Utilisation : Badges, éléments d'alerte

- **Charbon** : `#1F2937`
  - Variantes : `charbon-light` (`#374151`), `charbon-dark` (`#111827`)
  - Utilisation : Textes principaux, éléments sombres

- **Crème** : `#FEF3C7`
  - Variantes : `creme-light` (`#FDE68A`)
  - Utilisation : Arrière-plans, accents doux

#### Couleurs système

- **Gray** : Palette complète de gris (50-900)
  - `gray-text` : `#111827` (textes principaux)
  - `gray-secondary` : `#6B7280` (textes secondaires)

- **Success** : `#10B981` (vert)

### Typographie

#### Polices

- **Inter** : Police principale (sans-serif)
  - Poids : 300, 400, 500, 600, 700
  - Utilisation : Corps de texte, UI

- **Poppins** : Police display (optionnelle)
  - Poids : 400, 500, 600, 700, 800
  - Utilisation : Titres, éléments de mise en avant

#### Classes typographiques

- `.heading-1` : `text-4xl md:text-5xl lg:text-6xl font-bold`
- `.heading-2` : `text-3xl md:text-4xl lg:text-5xl font-bold`
- `.heading-3` : `text-2xl md:text-3xl font-semibold`
- `.body-large` : `text-lg md:text-xl`
- `.body-text` : `text-base`
- `.text-secondary` : `text-base text-gray-secondary`
- `.text-small` : `text-sm text-gray-secondary`

### Composants UI

#### Boutons

- `.btn-primary` : Bouton principal (fond primary, texte blanc)
- `.btn-secondary` : Bouton secondaire (fond blanc, bordure primary)
- `.btn-ghost` : Bouton discret (texte uniquement)

#### Cartes

- `.card` : Carte de base (fond blanc, ombre douce, border-radius 2xl)
- `.card-hover` : Carte avec effet hover (scale et ombre renforcée)

#### Inputs

- `.input` : Input standard (hauteur fixe 48px, border-radius xl)
- `.input-error` : Input en erreur (bordure brique)

#### Badges

- `.badge-primary` : Badge principal (fond brique-50, texte brique-700)
- `.badge-gray` : Badge gris
- `.badge-success` : Badge succès (vert)

### Ombres

- `shadow-soft` : Ombre douce (2px 8px)
- `shadow-warm` : Ombre chaude avec teinte primary
- `shadow-medium` : Ombre moyenne (6px 16px)
- `shadow-large` : Ombre grande (12px 24px)

### Animations

- `.animate-float` : Animation flottante pour le logo (3s ease-in-out infinite)

### Background

- Fond global : Dégradé `linear-gradient(to bottom, #FFFBEB, #FFF7ED)` fixe

---

## 💼 Logique produit

### Concept

**BROQUES** est une plateforme de location de matériel entre voisins. Les utilisateurs peuvent :
- Publier des annonces pour louer leur matériel
- Rechercher et contacter des propriétaires
- Échanger via une messagerie intégrée
- Organiser la remise en main propre directement

### Fonctionnalités principales

#### 1. **Gestion des annonces**

- **Création** : Titre, description, catégorie, prix/jour, ville, photos, nombre d'articles, caution indicative
- **Catégories** : 10 catégories prédéfinies (Bricolage, Jardinage, Événementiel, etc.)
- **Recherche** : Filtres par catégorie, ville, rayon (km), prix max
- **Affichage** : Vue grille ou carte (Leaflet)
- **Vues** : Compteur de vues par annonce (incrémenté automatiquement)

#### 2. **Géolocalisation**

- **Géocodage** : Conversion ville → coordonnées via Nominatim (OpenStreetMap)
- **Carte** : Affichage des annonces sur une carte interactive
- **Recherche par rayon** : Filtrage des annonces dans un rayon donné (formule de Haversine)
- **Centre par défaut** : Basé sur la ville de l'utilisateur connecté, sinon Belgique

#### 3. **Messagerie**

- **Conversations** : Une conversation par annonce et paire d'utilisateurs
- **Messages** : Envoi/réception de messages en temps réel
- **Notifications** : Compteur de messages non lus dans le header
- **Real-time** : Mise à jour automatique via Supabase subscriptions
- **Tri et filtres** : Par date, non lus, recherche textuelle
- **Suppression** : Possibilité de supprimer une conversation (supprime tous les messages)

#### 4. **Profils utilisateurs**

- **Informations** : Pseudo, ville, description, passions, photo de profil
- **Statut** : Téléphone vérifié, date d'inscription, actif/inactif
- **Affichage** : Sur les annonces et dans les conversations

#### 5. **Authentification**

- **Inscription** : Email + mot de passe
- **Connexion** : Email + mot de passe
- **Session** : Gérée automatiquement par Supabase via cookies
- **Redirections** : Après login/register, redirection vers la page demandée

#### 6. **Photos**

- **Upload** : Via Supabase Storage (bucket `photos`)
- **Affichage** : Next.js Image component pour l'optimisation
- **Multiple** : Tableau de photos par annonce

### Flux utilisateur typiques

#### Publier une annonce
1. `/annonces/nouvelle` → Formulaire de création
2. Upload photos → Supabase Storage
3. Sauvegarde → Table `annonces`
4. Redirection → `/annonces/mes-annonces`

#### Contacter un propriétaire
1. `/annonces/[id]` → Clic sur "Contacter le propriétaire"
2. Vérification auth → Redirection login si nécessaire
3. Création/récupération conversation → Table `conversations`
4. Redirection → `/messages/[id]`

#### Envoyer un message
1. `/messages/[id]` → Saisie du message
2. Envoi → Table `messages`
3. Real-time update → Affichage immédiat
4. Notification email (optionnel) → API `/api/send-notification`

---

## ⚙️ Contraintes techniques

### Supabase

- **RLS activé** : Toutes les tables ont Row Level Security
- **Politiques** : Définies dans les scripts SQL (non visibles dans le code)
- **Storage** : Bucket `photos` pour les images d'annonces
- **Rate limiting** : Nominatim (géocodage) limite à 1 req/s → délai de 200ms entre requêtes

### Next.js

- **SSR/SSG** : Pages serveur par défaut, Client Components quand nécessaire
- **Images** : Domains configurés : `localhost` et `**.supabase.co`
- **Webpack** : Alias `canvas: false` pour éviter les erreurs Leaflet

### Leaflet

- **Import dynamique** : Nécessaire pour éviter les erreurs SSR
- **Types** : Quelques `@ts-ignore` pour les imports dynamiques
- **Icônes** : SVG inline pour les marqueurs personnalisés

### Géocodage

- **Service** : Nominatim (OpenStreetMap) - gratuit mais rate-limited
- **User-Agent** : Requis dans les headers
- **Cache** : Implémenté côté client pour éviter les requêtes répétées

### Authentification

- **Session** : Maintenue via cookies (gérés par `@supabase/ssr`)
- **Middleware** : Exécuté sur chaque requête pour rafraîchir la session
- **Synchronisation** : Parfois nécessaire d'utiliser `window.location.href` au lieu de `router.push` pour forcer un refresh

### Emails

- **Notifications** : Route API `/api/send-notification` existe mais nécessite configuration
- **Service** : Resend mentionné dans `.env.local.example` mais non implémenté
- **Limitation** : Impossible de récupérer l'email utilisateur sans Admin API Supabase

---

## 🚨 Points critiques à ne pas casser

### 1. **Authentification et sessions**

- ⚠️ **NE PAS** modifier la logique de gestion des sessions dans `lib/supabase/`
- ⚠️ **NE PAS** supprimer le middleware (`middleware.ts`)
- ⚠️ **NE PAS** changer la structure des cookies Supabase
- ✅ **MAINTENIR** la séparation server/client pour les clients Supabase

### 2. **Structure de la base de données**

- ⚠️ **NE PAS** modifier les noms de colonnes dans `types/database.ts` sans mettre à jour le schéma SQL
- ⚠️ **NE PAS** supprimer les index (performances critiques)
- ⚠️ **NE PAS** modifier les contraintes de clés étrangères
- ✅ **VÉRIFIER** la cohérence entre types TypeScript et schéma SQL

### 3. **Design System**

- ⚠️ **NE PAS** modifier les classes CSS personnalisées sans vérifier tous les usages
- ⚠️ **NE PAS** changer les couleurs principales sans mettre à jour toute la palette
- ⚠️ **NE PAS** supprimer les classes utilitaires dans `globals.css`
- ✅ **UTILISER** les classes du design system plutôt que du CSS inline

### 4. **Géolocalisation**

- ⚠️ **NE PAS** supprimer le délai de 200ms entre requêtes Nominatim (rate limit)
- ⚠️ **NE PAS** modifier le User-Agent (requis par Nominatim)
- ⚠️ **GARDER** le cache de géocodage pour les performances
- ✅ **TESTER** le fallback si le géocodage échoue

### 5. **Real-time (messages)**

- ⚠️ **NE PAS** supprimer les subscriptions Supabase dans le Header
- ⚠️ **NE PAS** modifier la logique de comptage des messages non lus
- ✅ **NETTOYER** les subscriptions dans les useEffect cleanup

### 6. **Routing et navigation**

- ⚠️ **NE PAS** supprimer les Suspense autour des pages avec `useSearchParams`
- ⚠️ **NE PAS** modifier les redirections après auth sans tester
- ✅ **MAINTENIR** la cohérence entre routes publiques/protégées

### 7. **Upload de photos**

- ⚠️ **NE PAS** modifier les politiques de storage Supabase sans vérifier les permissions
- ⚠️ **NE PAS** changer le nom du bucket `photos`
- ✅ **VALIDER** les types de fichiers et tailles avant upload

### 8. **Types TypeScript**

- ⚠️ **NE PAS** utiliser `any` sauf cas exceptionnels (Leaflet dynamique)
- ⚠️ **NE PAS** modifier les types dans `database.ts` sans mettre à jour le schéma
- ✅ **MAINTENIR** la cohérence des types entre composants

---

## ❓ Zones d'incertitude

### 1. **Politiques RLS Supabase**

- **Statut** : Non visibles dans le code
- **Impact** : Les politiques de sécurité sont définies dans Supabase mais non documentées ici
- **Action** : Vérifier dans le dashboard Supabase si besoin de modifier les permissions

### 2. **Notifications email**

- **Statut** : Route API existe mais non fonctionnelle
- **Raison** : Nécessite Admin API Supabase ou service externe (Resend)
- **Action** : Implémenter si nécessaire avec Resend ou Supabase Edge Functions

### 3. **Validation des formulaires**

- **Statut** : `react-hook-form` et `zod` installés mais usage limité
- **Impact** : Validation côté client peut être incomplète
- **Action** : Vérifier la validation sur tous les formulaires

### 4. **Gestion des erreurs**

- **Statut** : Try/catch présents mais pas de système centralisé
- **Impact** : Erreurs affichées via alertes, pas de logging structuré
- **Action** : Considérer un système de gestion d'erreurs plus robuste

### 5. **Tests**

- **Statut** : Aucun test visible dans le codebase
- **Impact** : Pas de garantie de non-régression
- **Action** : Ajouter des tests si nécessaire

### 6. **Performance**

- **Statut** : Pas d'optimisations visibles (memo, useMemo, etc.)
- **Impact** : Possible ralentissement avec beaucoup de données
- **Action** : Profiler et optimiser si nécessaire

### 7. **Accessibilité**

- **Statut** : Pas de vérification d'accessibilité visible
- **Impact** : Peut ne pas être conforme aux standards WCAG
- **Action** : Auditer l'accessibilité si nécessaire

### 8. **SEO**

- **Statut** : Metadata de base présente mais limitée
- **Impact** : SEO peut être amélioré (Open Graph, Twitter Cards, etc.)
- **Action** : Enrichir les metadata si nécessaire

### 9. **Internationalisation**

- **Statut** : Application en français uniquement
- **Impact** : Pas de support multilingue
- **Action** : Ajouter i18n si nécessaire

### 10. **Variables d'environnement**

- **Statut** : `.env.local.example` présent mais `.env.local` non versionné
- **Impact** : Configuration de production non documentée
- **Action** : Documenter les variables nécessaires en production

---

## 📚 Ressources utiles

### Documentation externe

- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Leaflet](https://leafletjs.com/)
- [React Hook Form](https://react-hook-form.com/)

### Fichiers de référence dans le projet

- `package.json` : Dépendances et scripts
- `tsconfig.json` : Configuration TypeScript
- `tailwind.config.ts` : Configuration Tailwind et design tokens
- `app/globals.css` : Design system CSS
- `types/database.ts` : Types de la base de données
- `supabase/schema.sql` : Schéma de la base de données

---

## 🔄 Évolutions futures possibles

### Améliorations suggérées

1. **Notifications email** : Implémenter avec Resend ou Supabase Edge Functions
2. **Tests** : Ajouter des tests unitaires et d'intégration
3. **Performance** : Optimiser les requêtes et ajouter du caching
4. **Accessibilité** : Auditer et améliorer l'a11y
5. **SEO** : Enrichir les metadata et ajouter un sitemap
6. **Validation** : Utiliser zod pour valider tous les formulaires
7. **Gestion d'erreurs** : Centraliser avec un système de logging
8. **Internationalisation** : Ajouter le support multilingue si nécessaire

---

**Note** : Ce document doit être mis à jour lors de changements majeurs dans l'architecture, la stack ou les conventions du projet.

