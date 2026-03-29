# Guide Git pour tonmatos

## 🎯 Commandes Git essentielles

### Voir l'état actuel
```bash
git status
```
Affiche les fichiers modifiés, ajoutés ou supprimés.

### Voir l'historique des commits
```bash
git log
```
Affiche tous les commits avec leurs messages. Appuyez sur `q` pour quitter.

### Sauvegarder vos changements (créer un commit)
```bash
# 1. Ajouter tous les fichiers modifiés
git add .

# 2. Créer un commit avec un message
git commit -m "Description de ce que vous avez changé"
```

**Exemple :**
```bash
git add .
git commit -m "Amélioration du design de la page d'accueil"
```

### Créer une branche (pour tester des changements)
```bash
# Créer une nouvelle branche
git branch nom-de-la-branche

# Passer sur cette branche
git checkout nom-de-la-branche
```

**Exemple avant de modifier le UI :**
```bash
git branch test-nouveau-ui
git checkout test-nouveau-ui
```

### Revenir en arrière

#### Option 1 : Annuler les modifications non sauvegardées
```bash
# Annuler tous les changements non commités
git checkout .
```

#### Option 2 : Revenir à un commit précédent
```bash
# Voir l'historique pour trouver le numéro du commit
git log

# Revenir à un commit spécifique (remplacez COMMIT_ID par le numéro)
git checkout COMMIT_ID

# Revenir au dernier commit
git checkout main
```

#### Option 3 : Revenir à la branche principale
```bash
# Si vous êtes sur une branche de test
git checkout main
```

### Comparer les changements
```bash
# Voir les différences avant de commit
git diff
```

## 📋 Workflow recommandé avant de modifier le UI

### Étape 1 : Créer une branche de test
```bash
git branch test-nouveau-ui
git checkout test-nouveau-ui
```

### Étape 2 : Faire vos modifications
(Les modifications seront faites dans cette branche)

### Étape 3a : Si vous êtes satisfait
```bash
# Revenir sur la branche principale
git checkout main

# Fusionner les changements
git merge test-nouveau-ui
```

### Étape 3b : Si vous n'êtes pas satisfait
```bash
# Revenir sur la branche principale (les changements restent dans test-nouveau-ui)
git checkout main

# Supprimer la branche de test si vous voulez
git branch -d test-nouveau-ui
```

## 🔍 Commandes utiles

### Voir quelles branches existent
```bash
git branch
```

### Voir sur quelle branche vous êtes
```bash
git branch
```
La branche actuelle est marquée d'un `*`.

### Supprimer une branche
```bash
git branch -d nom-de-la-branche
```

## 💡 Conseils

1. **Commitez souvent** : Créez des commits régulièrement avec des messages clairs
2. **Utilisez des branches** : Pour tester des changements majeurs (comme le UI)
3. **Messages de commit clairs** : Décrivez ce que vous avez changé
4. **Vérifiez avant de commit** : Utilisez `git status` et `git diff` pour voir ce qui va être sauvegardé

## 🆘 En cas de problème

Si vous avez fait des changements et que vous voulez tout annuler :
```bash
# Annuler tous les changements non sauvegardés
git checkout .
```

Si vous voulez revenir au dernier commit :
```bash
git reset --hard HEAD
```
⚠️ **Attention** : Cette commande supprime définitivement tous les changements non commités !

## 📚 Ressources

- [Documentation officielle Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)

