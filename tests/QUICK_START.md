# Guide Rapide - Exécuter les Tests

## 📍 Étape 1 : Se placer dans le répertoire du projet

```bash
cd ~/tonmatos
```

Ou le chemin complet vers votre projet.

## ✅ Étape 2 : Vérifier que vous êtes au bon endroit

```bash
pwd
# Doit afficher : /Users/romainberthe/tonmatos
```

Vérifier que vous voyez les fichiers du projet :

```bash
ls -la | grep package.json
# Doit afficher : -rw-r--r-- package.json
```

## 🚀 Étape 3 : Exécuter les tests

### Tests NRT (tests critiques)

```bash
npm run test:nrt
```

### Tous les tests E2E

```bash
npm run test:e2e
```

### Tests unitaires

```bash
npm run test
```

### Tests d'intégration

```bash
npm run test:integration
```

## ⚠️ Si ça ne fonctionne pas

### 1. Vérifier que les dépendances sont installées

```bash
npm install
```

### 2. Vérifier que Playwright est installé

```bash
npx playwright --version
# Doit afficher : Version 1.57.0 (ou similaire)
```

Si Playwright n'est pas installé :

```bash
npx playwright install
```

### 3. Vérifier que le fichier .env.test.local existe

```bash
ls -la .env.test.local
# Doit afficher le fichier
```

Si le fichier n'existe pas, créer `.env.test.local` avec vos variables d'environnement (voir `SETUP_ENV_TEST.md`).

### 4. Vérifier les scripts dans package.json

```bash
cat package.json | grep -A 15 '"scripts"'
# Doit afficher les commandes de test
```

## 📝 Commandes Utiles

### Voir l'aide

```bash
npm run test:nrt --help
```

### Mode debug (voir le navigateur)

```bash
npm run test:e2e:headed
```

### Interface graphique Playwright

```bash
npm run test:e2e:ui
```

### Interface graphique Vitest

```bash
npm run test:ui
```

## 🔍 Problèmes Courants

### Erreur : "command not found: npm"

Installer Node.js et npm.

### Erreur : "Cannot find module"

```bash
npm install
```

### Erreur : "Playwright browsers not found"

```bash
npx playwright install
```

### Erreur : "Navigation timeout"

Le serveur Next.js devrait démarrer automatiquement. Si ce n'est pas le cas, vérifier que le port 3000 est libre.

---

**Dernière mise à jour :** 2025-01-04

