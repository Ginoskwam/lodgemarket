# Setup des Tests - Guide Rapide

## ✅ Installation Complète

Les dépendances sont déjà installées. Si besoin de réinstaller:

```bash
npm install
```

## 🎯 Première Exécution

### 1. Installer les navigateurs Playwright

```bash
npx playwright install
```

### 2. Configurer les variables d'environnement

Créer `.env.test.local`:

```bash
cp .env.local.example .env.test.local
```

Puis configurer avec vos valeurs de test (Supabase local ou projet test).

### 3. Lancer les tests NRT

```bash
npm run test:nrt
```

## 📋 Checklist de Vérification

- [ ] Playwright installé (`npx playwright install`)
- [ ] Variables d'environnement configurées (`.env.test.local`)
- [ ] Serveur de développement fonctionne (`npm run dev`)
- [ ] Tests unitaires passent (`npm run test`)
- [ ] Tests NRT passent (`npm run test:nrt`)

## 🚨 Résolution de Problèmes

### Erreur: "Cannot find module"

```bash
npm install
```

### Erreur: "Playwright browsers not found"

```bash
npx playwright install
```

### Tests E2E échouent: "Navigation timeout"

Vérifier que le serveur de dev tourne:
```bash
npm run dev
```

Les tests Playwright démarrent automatiquement le serveur, mais en cas de problème, le lancer manuellement.

### Erreur Supabase dans les tests

Vérifier que `.env.test.local` contient les bonnes valeurs:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📚 Prochaines Étapes

1. Lire [TEST_PLAN.md](./TEST_PLAN.md) pour comprendre la stratégie
2. Lire [tests/README.md](./tests/README.md) pour les détails techniques
3. Exécuter `npm run test:nrt` pour valider le setup
4. Ajouter vos propres tests selon les besoins

## 🔗 Liens Utiles

- [TEST_PLAN.md](./TEST_PLAN.md) - Plan de tests complet
- [tests/README.md](./tests/README.md) - Documentation technique des tests
- [BUG_REPORT_TEMPLATE.md](./BUG_REPORT_TEMPLATE.md) - Template de rapport de bug

