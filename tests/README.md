# Tests Automatisés - Tonmatos

Ce dossier contient tous les tests automatisés du projet Tonmatos.

## 📁 Structure

```
tests/
├── unit/              # Tests unitaires (composants, libs, hooks)
├── integration/       # Tests d'intégration (API, flux complets)
├── e2e/              # Tests end-to-end (Playwright)
│   ├── critical/     # Tests NRT (Critical User Journeys)
│   ├── features/     # Tests par feature
│   └── a11y/         # Tests d'accessibilité
├── fixtures/         # Données de test réutilisables
├── helpers/          # Helpers partagés
└── setup/            # Configuration et setup
```

## 🚀 Commandes

### Tests Unitaires
```bash
npm run test              # Exécuter tous les tests unitaires
npm run test:watch        # Mode watch (re-exécution automatique)
npm run test:ui           # Interface graphique Vitest
npm run test:coverage     # Avec rapport de couverture
```

### Tests d'Intégration
```bash
npm run test:integration  # Exécuter les tests d'intégration
```

### Tests E2E
```bash
npm run test:e2e          # Exécuter tous les tests E2E
npm run test:e2e:ui       # Interface graphique Playwright
npm run test:e2e:headed   # Mode headed (voir le navigateur)
npm run test:nrt          # Suite NRT (tests critiques uniquement)
npm run test:a11y         # Tests d'accessibilité
```

### Tous les Tests
```bash
npm run test:all          # Exécute unit + integration + e2e
```

## 🎯 Tests NRT (Non-Régression)

Les tests NRT sont les **Critical User Journeys** qui doivent passer à chaque campagne de non-régression:

- **CUJ-1:** Inscription et Première Annonce
- **CUJ-2:** Recherche et Contact
- **CUJ-3:** Gestion Annonce
- **CUJ-4:** Messagerie
- **CUJ-5:** Authentification et Sécurité

Temps d'exécution cible: < 2 minutes

## 📝 Écrire un Nouveau Test

### Test Unitaire (Vitest)

```typescript
import { describe, it, expect } from 'vitest'

describe('MaFonction', () => {
  it('devrait faire quelque chose', () => {
    expect(true).toBe(true)
  })
})
```

### Test E2E (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('mon test e2e', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Tonmatos/)
})
```

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env.test.local` pour les tests:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test_anon_key
VAPID_PUBLIC_KEY=test_vapid_key
```

### Fixtures

Les fixtures sont dans `tests/fixtures/`:
- `users.ts` - Utilisateurs de test
- `annonces.ts` - Données d'annonces
- `messages.ts` - Messages de test

### Helpers

Les helpers sont dans `tests/helpers/`:
- `auth.ts` - Helpers authentification
- `supabase.ts` - Helpers Supabase
- `playwright.ts` - Helpers E2E

## 🐛 Rapport de Bug

En cas d'échec de test, utiliser le template `BUG_REPORT_TEMPLATE.md` à la racine du projet.

## 📊 Rapports

- **Coverage:** `coverage/` (après `npm run test:coverage`)
- **Playwright:** `playwright-report/` (après `npm run test:e2e`)
- **Screenshots/Vidéos:** `test-results/` (en cas d'échec E2E)

## 🔍 Debugging

### Tests E2E

```bash
# Mode debug avec Playwright
PWDEBUG=1 npm run test:e2e

# Mode headed pour voir le navigateur
npm run test:e2e:headed

# Interface graphique
npm run test:e2e:ui
```

### Tests Unitaires

```bash
# Mode watch avec logs
npm run test:watch

# Interface graphique
npm run test:ui
```

## ✅ Bonnes Pratiques

1. **Tests isolés:** Chaque test doit être indépendant
2. **Données propres:** Utiliser des fixtures, pas de données hardcodées
3. **Attentes explicites:** Utiliser `waitFor` plutôt que `sleep`
4. **Sélecteurs robustes:** Préférer `data-testid` aux sélecteurs CSS fragiles
5. **Nettoyage:** Nettoyer les données de test après chaque test si nécessaire

## 📚 Documentation

- [TEST_PLAN.md](../TEST_PLAN.md) - Plan de tests complet
- [BUG_REPORT_TEMPLATE.md](../BUG_REPORT_TEMPLATE.md) - Template de rapport de bug
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)

