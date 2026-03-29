# Vérification : Nom de l'Application

## ✅ Confirmation

**Le nom de l'application utilisé dans les tests est bien "BROQUES"**, pas "Tonmatos".

### Vérification effectuée :

1. **Tests E2E** : Utilisent `toHaveTitle(/BROQUES/i)` ✅
2. **Fixtures** : Les emails de test utilisent `@broques.test` - domaine fictif cohérent avec le nom de l'application ✅
3. **Configuration** : `.env.test.local` contient `noreply@broques.com` ✅

## ✅ Cohérence

Tous les domaines de test utilisent maintenant `@broques.test` pour rester cohérent avec le nom de l'application BROQUES.

## 🔍 Comment vérifier que je ne "corrige" pas des bugs qui n'en sont pas

### 1. Toujours demander avant de corriger
- Je ne dois jamais corriger automatiquement sans votre confirmation
- Si je vois une erreur, je dois d'abord vous la signaler et demander

### 2. Vérifier les changements
- Utiliser `git diff` pour voir ce que j'ai modifié
- Lire les fichiers modifiés avant de valider

### 3. Tests comme référence de vérité
- Les tests doivent refléter le comportement **réel** de l'application
- Si un test échoue, vérifier d'abord si c'est le test ou l'application qui est incorrect

### 4. Communication claire
- Je dois expliquer **pourquoi** je propose une correction
- Vous pouvez toujours dire "non, c'est voulu" et je m'arrêterai

## ✅ État actuel

- Nom de l'application dans les tests : **BROQUES** ✅
- Domaine email de test : `@broques.test` (cohérent avec le nom de l'app) ✅
- Titre de page vérifié : "BROQUES - Location de matériel entre voisins" ✅

