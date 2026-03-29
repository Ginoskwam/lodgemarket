# Plan de Tests Automatisés - Tonmatos

## 📋 Vue d'ensemble

Ce document définit la stratégie de tests automatisés pour le projet Tonmatos, une plateforme de location/prêt de matériel entre voisins.

**Objectif:** Maintenir un plan de tests 100% automatisé et exécutable, lancé à chaque campagne de non-régression (NRT).

---

## 🎯 Périmètre de Tests

### Fonctionnalités Couvertes

#### 1. Authentification
- ✅ Inscription (register)
- ✅ Connexion (login)
- ✅ Déconnexion
- ✅ Gestion de session (middleware)
- ✅ Redirection après authentification
- ✅ Protection des routes privées

#### 2. Annonces
- ✅ Liste des annonces (page principale)
- ✅ Création d'annonce
- ✅ Modification d'annonce (propriétaire uniquement)
- ✅ Consultation détaillée d'annonce
- ✅ Mes annonces (liste personnelle)
- ✅ Filtrage/recherche (si implémenté)

#### 3. Messagerie
- ✅ Liste des conversations
- ✅ Consultation d'une conversation
- ✅ Envoi de message
- ✅ Notifications de nouveaux messages

#### 4. Profil Utilisateur
- ✅ Consultation du profil
- ✅ Modification du profil

#### 5. Notifications Push
- ✅ Abonnement aux notifications
- ✅ Réception de notifications
- ✅ Gestion des clés VAPID

#### 6. Pages Statiques
- ✅ Page d'accueil (landing)
- ✅ Aide
- ✅ Privacy Policy
- ✅ Terms of Service

#### 7. API Routes
- ✅ `/api/send-notification`
- ✅ `/api/push/subscribe`
- ✅ `/api/push/vapid-public-key`
- ✅ `/api/push/send`

---

## 🏗️ Pyramide de Tests

### Répartition (cible)

```
        /\
       /E2E\         5%  - Tests end-to-end critiques
      /------\
     /  Intég  \     15% - Tests d'intégration (API, DB)
    /----------\
   /   Unit    \     80% - Tests unitaires (composants, utils, libs)
  /------------\
```

### Niveaux de Tests

#### 1. Tests Unitaires (80%)
**Outil:** Vitest + React Testing Library

**Couverture:**
- Composants React isolés
- Utilitaires et helpers (`lib/`)
- Validation de formulaires (Zod schemas)
- Fonctions de transformation de données
- Hooks personnalisés

**Exemples:**
- `components/` - Rendu, interactions, états
- `lib/supabase/` - Clients Supabase
- `lib/email.ts` - Formatage emails
- `lib/push-notifications.ts` - Logique notifications

#### 2. Tests d'Intégration (15%)
**Outil:** Vitest + MSW (Mock Service Worker)

**Couverture:**
- API Routes Next.js
- Intégration Supabase (avec mocks)
- Middleware d'authentification
- Flux complets (ex: création annonce → DB)

**Exemples:**
- `app/api/**/route.ts` - Routes API
- `middleware.ts` - Protection routes
- Flux auth complet (register → login → session)

#### 3. Tests E2E (5%)
**Outil:** Playwright

**Couverture:**
- Parcours utilisateur critiques (Critical User Journeys)
- Tests cross-browser (Chrome, Firefox, Safari)
- Tests d'accessibilité (axe-core)
- Tests visuels (screenshots)

**Exemples:**
- Inscription → Création annonce → Message
- Login → Consultation annonce → Contact
- Navigation complète

---

## 🚀 Parcours Critiques (NRT)

### Critical User Journeys (CUJ)

Les parcours suivants sont **obligatoires** dans chaque NRT:

#### CUJ-1: Inscription et Première Annonce
1. Accès page d'accueil
2. Clic "Publier une annonce" → redirection login
3. Inscription nouveau compte
4. Confirmation email (mock)
5. Création d'une annonce
6. Vérification affichage dans "Mes annonces"

**Temps cible:** < 30s

#### CUJ-2: Recherche et Contact
1. Consultation liste annonces
2. Filtrage/recherche (si disponible)
3. Clic sur une annonce
4. Envoi message au propriétaire
5. Vérification notification

**Temps cible:** < 20s

#### CUJ-3: Gestion Annonce
1. Login utilisateur existant
2. Accès "Mes annonces"
3. Modification d'une annonce
4. Vérification mise à jour
5. Suppression (si disponible)

**Temps cible:** < 25s

#### CUJ-4: Messagerie
1. Login
2. Accès messages
3. Ouverture conversation
4. Envoi message
5. Vérification affichage

**Temps cible:** < 15s

#### CUJ-5: Authentification et Sécurité
1. Tentative accès route protégée sans auth → redirection login
2. Login avec mauvais credentials → erreur
3. Login avec bons credentials → succès
4. Déconnexion
5. Vérification session supprimée

**Temps cible:** < 20s

**Total NRT:** ~2 minutes

---

## 🗄️ Stratégie de Données de Test

### Fixtures et Seed Data

#### Comptes de Test
- `test-user-1@tonmatos.test` - Utilisateur standard
- `test-user-2@tonmatos.test` - Second utilisateur (pour messages)
- `test-admin@tonmatos.test` - Admin (si applicable)

**Mot de passe:** `TestPassword123!` (identique pour tous en test)

#### Données d'Annonces
- 5-10 annonces de test avec catégories variées
- Annonces avec/sans images
- Annonces actives/expirées

#### Base de Données
- **Local:** Supabase local (via Docker) avec seed script
- **Staging:** Base dédiée avec reset automatique avant NRT
- **Isolation:** Chaque test utilise des données isolées (UUID, timestamps)

### Mocks et Sandbox

#### Services Externes
- **Email (Supabase Auth):** Mock avec MSW
- **Notifications Push:** Mock service worker
- **Supabase Storage:** Mock ou bucket dédié test
- **Geolocalisation:** Mock Leaflet avec coordonnées fixes

#### Configuration
```typescript
// tests/fixtures/users.ts
export const testUsers = {
  user1: { email: 'test-user-1@tonmatos.test', password: 'TestPassword123!' },
  user2: { email: 'test-user-2@tonmatos.test', password: 'TestPassword123!' }
}

// tests/fixtures/annonces.ts
export const testAnnonces = {
  valid: { title: 'Perceuse Bosch', description: '...', price: 10 },
  invalid: { title: '', description: '...' } // pour tests validation
}
```

---

## 🌍 Environnements

### Local
- **URL:** `http://localhost:3000`
- **Supabase:** Local (Docker) ou projet test dédié
- **Variables:** `.env.test.local`
- **Isolation:** Base de données réinitialisée avant chaque run

### Staging
- **URL:** `https://staging.tonmatos.com` (ou équivalent)
- **Supabase:** Projet staging dédié
- **Variables:** Variables d'environnement CI/CD
- **Isolation:** Reset automatique avant NRT

### Configuration Environnement

```bash
# .env.test.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test_anon_key
SUPABASE_SERVICE_ROLE_KEY=test_service_role_key
NODE_ENV=test
```

---

## ✅ Critères de Succès/Échec (Gating)

### Critères de Succès NRT
- ✅ **100% des CUJ passent** (5/5)
- ✅ **0 test flaky** (pas de retry nécessaire)
- ✅ **Temps d'exécution < 3 minutes** (objectif: 2 min)
- ✅ **Accessibilité:** 0 violation axe-core niveau S1/S2
- ✅ **Pas de régression visuelle** (screenshots comparés)

### Critères d'Échec (Bloquant)
- ❌ **1+ CUJ échoue** → Bloquant (S1)
- ❌ **Erreur 500 sur route critique** → Bloquant (S1)
- ❌ **Authentification cassée** → Bloquant (S1)
- ❌ **Création annonce impossible** → Bloquant (S1)

### Critères d'Échec (Non-bloquant)
- ⚠️ **Test unitaire isolé échoue** → S2 (majeur)
- ⚠️ **Violation a11y mineure** → S3 (mineur)
- ⚠️ **Régression visuelle cosmétique** → S4 (cosmétique)

### Gating CI/CD
- **Merge vers `main`:** Tous les tests doivent passer
- **Déploiement staging:** NRT doit passer
- **Déploiement production:** NRT + tests E2E complets

---

## ⏱️ Temps d'Exécution et Optimisation

### Temps Cibles

| Niveau | Temps Cible | Temps Max |
|--------|-------------|-----------|
| Unit | < 10s | 30s |
| Integration | < 20s | 60s |
| E2E (NRT) | < 2 min | 3 min |
| E2E (Complet) | < 5 min | 10 min |
| **Total (NRT)** | **< 3 min** | **5 min** |

### Optimisations

#### Parallélisation
- **Unit/Integration:** Parallélisation par fichier (Vitest workers)
- **E2E:** Sharding par navigateur (Chrome, Firefox)
- **CI:** Matrices de jobs parallèles

#### Stratégies
- **Tests rapides d'abord:** Unit → Integration → E2E
- **Cache:** Cache des dépendances (node_modules, .next)
- **Selective testing:** Ne lancer que les tests modifiés en PR
- **Retry:** 1 retry max pour tests E2E (éviter flakiness)

#### Configuration
```typescript
// vitest.config.ts
export default {
  pool: 'threads',
  poolOptions: { threads: { maxThreads: 4 } }
}

// playwright.config.ts
export default {
  workers: process.env.CI ? 2 : 4,
  shard: { total: 2, current: 1 } // en CI
}
```

---

## 📊 Rapports et Artifacts

### Rapports de Tests
- **Format:** JSON + HTML (Vitest), HTML (Playwright)
- **Stockage:** `test-results/` (gitignored)
- **CI:** Upload artifacts en cas d'échec

### Artifacts en Cas d'Échec
- **Screenshots:** `test-results/screenshots/`
- **Vidéos:** `test-results/videos/` (E2E uniquement)
- **Traces:** `test-results/traces/` (Playwright trace)
- **Logs:** `test-results/logs/`

### Rapport de Bug (Template)

Voir `BUG_REPORT_TEMPLATE.md` pour le format standard.

---

## 🔄 Maintenance du Plan

### Mise à Jour Obligatoire
À chaque nouvelle fonctionnalité:
1. ✅ Mettre à jour `TEST_PLAN.md` (ajouter feature dans périmètre)
2. ✅ Ajouter tests correspondants (unit + integration + E2E si critique)
3. ✅ Mettre à jour CUJ si nécessaire
4. ✅ Vérifier temps d'exécution

### Revue Trimestrielle
- Analyse des tests flaky
- Optimisation des temps d'exécution
- Révision de la pyramide (ajustement %)
- Mise à jour des outils

---

## 🛠️ Stack Technique

### Outils Choisis

| Type | Outil | Version | Raison |
|------|-------|---------|--------|
| **Unit/Integration** | Vitest | ^1.0.0 | Rapide, compatible Next.js, ESM natif |
| **Testing Library** | @testing-library/react | ^14.0.0 | Standard React, accessible |
| **E2E** | Playwright | ^1.40.0 | Multi-browser, stable, excellent DX |
| **A11y** | @axe-core/playwright | ^4.8.0 | Intégration Playwright |
| **Mocking** | MSW | ^2.0.0 | Mock Service Worker pour API |
| **Assertions** | Vitest (built-in) | - | Assertions intégrées |
| **Coverage** | @vitest/coverage-v8 | ^1.0.0 | Couverture de code |

### Alternatives Considérées
- **Jest:** Plus lent, configuration plus complexe avec Next.js
- **Cypress:** Moins performant, pas de multi-browser natif
- **Testing Library:** Choix standard, pas d'alternative sérieuse

---

## 📁 Structure des Tests

```
tests/
├── unit/                    # Tests unitaires
│   ├── components/          # Tests composants
│   ├── lib/                 # Tests utilitaires
│   └── hooks/               # Tests hooks
├── integration/             # Tests d'intégration
│   ├── api/                 # Tests routes API
│   ├── auth/                # Tests flux auth
│   └── supabase/            # Tests intégration Supabase
├── e2e/                     # Tests end-to-end
│   ├── critical/            # CUJ (NRT)
│   ├── features/            # Tests par feature
│   └── a11y/                # Tests accessibilité
├── fixtures/                # Données de test
│   ├── users.ts
│   ├── annonces.ts
│   └── messages.ts
├── helpers/                 # Helpers partagés
│   ├── auth.ts              # Helpers authentification
│   ├── supabase.ts          # Helpers Supabase
│   └── playwright.ts        # Helpers Playwright
└── setup/                   # Configuration
    ├── vitest.setup.ts
    ├── playwright.setup.ts
    └── msw-handlers.ts      # Handlers MSW
```

---

## 🎯 Prochaines Étapes

1. ✅ Installation des dépendances de test
2. ✅ Configuration des outils (Vitest, Playwright)
3. ✅ Création de la structure de dossiers
4. ✅ Implémentation des tests NRT (CUJ)
5. ✅ Ajout des commandes npm
6. ✅ Documentation des helpers
7. ✅ Intégration CI/CD

---

**Dernière mise à jour:** 2025-01-04  
**Maintenu par:** Équipe Tonmatos  
**Version:** 1.0.0

