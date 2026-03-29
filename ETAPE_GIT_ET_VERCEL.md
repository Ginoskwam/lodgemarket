# 📦 Étape : Créer le dépôt Git et déployer sur Vercel

## Étape 1 : Créer un dépôt sur GitHub

1. Allez sur [github.com](https://github.com)
2. Connectez-vous (ou créez un compte si nécessaire)
3. Cliquez sur le bouton **"+"** en haut à droite
4. Cliquez sur **"New repository"**
5. Remplissez :
   - **Repository name** : `broques` (ou un nom de votre choix)
   - **Description** : "BROQUES - Location de matériel entre voisins"
   - **Visibility** : Private (recommandé) ou Public
   - ⚠️ **NE COCHEZ PAS** "Initialize this repository with a README"
6. Cliquez sur **"Create repository"**

---

## Étape 2 : Connecter votre projet local au dépôt GitHub

Une fois le dépôt créé, GitHub vous donnera des commandes. Utilisez celles-ci dans votre terminal :

```bash
cd /Users/romainberthe/tonmatos
git remote add origin https://github.com/VOTRE-USERNAME/broques.git
git branch -M main
git push -u origin rebrand-broques
```

⚠️ Remplacez `VOTRE-USERNAME` par votre nom d'utilisateur GitHub.

Si vous préférez utiliser la branche `main` au lieu de `rebrand-broques` :
```bash
git checkout -b main
git push -u origin main
```

---

## Étape 3 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** (ou connectez-vous)
3. Choisissez **"Continue with GitHub"** (ou GitLab/Bitbucket)
4. Autorisez Vercel à accéder à votre compte
5. Cliquez sur **"Add New Project"**
6. Sélectionnez votre dépôt `broques`
7. Vercel détectera automatiquement Next.js
8. ⚠️ **NE CLIQUEZ PAS ENCORE SUR "Deploy"** - on va d'abord configurer les variables d'environnement

---

## Étape 4 : Configurer les variables d'environnement AVANT le premier déploiement

1. Dans la page de configuration du projet Vercel, descendez jusqu'à **"Environment Variables"**
2. Ajoutez les 3 variables une par une :

   **Variable 1 :**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: votre URL Supabase de PRODUCTION (celle du nouveau projet)
   - Cliquez sur **"Add"**

   **Variable 2 :**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: votre clé anon de PRODUCTION
   - Cliquez sur **"Add"**

   **Variable 3 :**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: votre clé service_role de PRODUCTION
   - ⚠️ Cochez **"Production"** uniquement (pas Preview ni Development)
   - Cliquez sur **"Add"**

3. Une fois les 3 variables ajoutées, cliquez sur **"Deploy"**

---

## Étape 5 : Attendre le déploiement

- Le déploiement prend 2-5 minutes
- Vous verrez les logs en temps réel
- Une fois terminé, vous aurez une URL : `https://broques.vercel.app` (ou similaire)

---

## Étape 6 : Tester votre site en production

1. Cliquez sur l'URL fournie par Vercel
2. Testez :
   - ✅ Création de compte
   - ✅ Création d'annonce
   - ✅ Upload de photo
   - ✅ Recherche
   - ✅ Messagerie

Si tout fonctionne, **félicitations ! 🎉 Votre site est en ligne !**

