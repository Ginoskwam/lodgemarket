# 🔑 Créer un Personal Access Token GitHub

## Étapes pour créer votre token

1. **Allez sur GitHub.com** et connectez-vous

2. **Cliquez sur votre photo de profil** (en haut à droite)

3. **Cliquez sur "Settings"** (Paramètres)

4. **Dans le menu de gauche**, descendez tout en bas et cliquez sur **"Developer settings"**

5. **Dans le menu de gauche**, cliquez sur **"Personal access tokens"**

6. **Cliquez sur "Tokens (classic)"** ou **"Fine-grained tokens"** (classic est plus simple)

7. **Cliquez sur "Generate new token"** (ou "Generate new token (classic)")

8. **Remplissez le formulaire** :
   - **Note** : `BROQUES Deployment` (ou un nom de votre choix)
   - **Expiration** : choisissez une durée (ex: 90 jours, ou No expiration)
   - **Scopes** : cochez au minimum :
     - ✅ `repo` (accès complet aux dépôts)
     - ✅ `workflow` (si vous utilisez GitHub Actions)

9. **Cliquez sur "Generate token"** (en bas)

10. **⚠️ IMPORTANT : Copiez le token immédiatement !**
    - Il s'affichera une seule fois
    - C'est une longue chaîne qui commence par `ghp_...`
    - Si vous le perdez, vous devrez en créer un nouveau

11. **Sauvegardez le token** quelque part de sûr (notes, gestionnaire de mots de passe, etc.)

---

## Utiliser le token

Quand Git vous demandera :
- **Username** : votre nom d'utilisateur GitHub (`Ginoskwam`)
- **Password** : collez le token (pas votre mot de passe GitHub !)

---

## Alternative : Utiliser GitHub CLI

Si vous préférez, vous pouvez aussi installer GitHub CLI et vous authentifier avec :
```bash
gh auth login
```

Mais le token est la méthode la plus simple pour commencer.

