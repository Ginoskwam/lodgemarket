# 🚀 Guide de déploiement pas à pas - BROQUES

## ✅ Étape 1 : Vérifier Supabase (vous l'avez fait !)

1. Dans Supabase, allez dans **Table Editor** (menu de gauche)
2. Vérifiez que vous voyez ces 4 tables :
   - ✅ `profiles`
   - ✅ `annonces`
   - ✅ `conversations`
   - ✅ `messages`

Si les tables sont là, c'est bon ! ✅

---

## 📦 Étape 2 : Créer le bucket pour les photos

1. Dans Supabase, allez dans **Storage** (menu de gauche)
2. Cliquez sur **"New bucket"**
3. Nommez-le : `photos`
4. Cochez **"Public bucket"** (important pour que les photos soient visibles)
5. Cliquez sur **"Create bucket"**

✅ Bucket créé !

---

## 🔐 Étape 3 : Récupérer vos clés API Supabase

1. Dans Supabase, allez dans **Settings** (icône engrenage en bas à gauche)
2. Cliquez sur **"API"**
3. Vous verrez :
   - **Project URL** : `https://xxxxx.supabase.co` → copiez cette URL
   - **anon public** key : une longue clé → copiez cette clé
   - **service_role** key : une autre longue clé (⚠️ gardez-la secrète) → copiez cette clé aussi

Notez ces 3 valeurs quelque part, vous en aurez besoin !

---

## 💻 Étape 4 : Configurer les variables d'environnement localement

1. À la racine de votre projet, créez un fichier `.env.local` (s'il n'existe pas déjà)
2. Ouvrez ce fichier et ajoutez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-publique
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role-secrète
```

Remplacez les valeurs par celles que vous avez copiées à l'étape 3.

3. Sauvegardez le fichier

---

## 🧪 Étape 5 : Tester en local

1. Dans votre terminal, à la racine du projet, lancez :
   ```bash
   npm run dev
   ```

2. Ouvrez votre navigateur sur `http://localhost:3000`

3. Testez rapidement :
   - Créez un compte
   - Créez une annonce
   - Vérifiez que tout fonctionne

Si ça fonctionne, vous êtes prêt pour la production ! ✅

---

## 📝 Étape 6 : Préparer Git (si pas déjà fait)

1. Vérifiez que vous avez un fichier `.gitignore` qui contient :
   ```
   .env.local
   .env*.local
   .next
   node_modules
   ```

2. Si Git n'est pas encore initialisé :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - BROQUES v1.0"
   ```

3. Créez un dépôt sur GitHub :
   - Allez sur [github.com](https://github.com)
   - Cliquez sur **"New repository"**
   - Nommez-le (ex: `broques`)
   - Ne cochez PAS "Initialize with README"
   - Cliquez sur **"Create repository"**

4. Connectez votre projet local au dépôt :
   ```bash
   git remote add origin https://github.com/votre-username/broques.git
   git branch -M main
   git push -u origin main
   ```

Remplacez `votre-username` et `broques` par vos valeurs.

---

## 🚀 Étape 7 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** (ou connectez-vous si vous avez déjà un compte)
3. Connectez-vous avec votre compte GitHub/GitLab/Bitbucket
4. Cliquez sur **"Add New Project"**
5. Sélectionnez votre dépôt `broques`
6. Vercel détectera automatiquement Next.js, cliquez sur **"Deploy"**

⚠️ **ATTENDEZ** que le premier déploiement se termine (il va échouer, c'est normal, on va corriger ça)

---

## ⚙️ Étape 8 : Configurer les variables d'environnement dans Vercel

1. Dans Vercel, allez dans votre projet
2. Cliquez sur **"Settings"** (en haut)
3. Cliquez sur **"Environment Variables"** (menu de gauche)
4. Ajoutez les 3 variables une par une :

   **Variable 1 :**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: votre URL Supabase (celle de l'étape 3)
   - Environments: cochez **Production**, **Preview**, **Development**
   - Cliquez sur **"Save"**

   **Variable 2 :**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: votre clé anon (celle de l'étape 3)
   - Environments: cochez **Production**, **Preview**, **Development**
   - Cliquez sur **"Save"**

   **Variable 3 :**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: votre clé service role (celle de l'étape 3)
   - Environments: cochez **Production** uniquement (⚠️ c'est une clé secrète)
   - Cliquez sur **"Save"**

---

## 🔄 Étape 9 : Redéployer

1. Dans Vercel, allez dans **"Deployments"** (en haut)
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Attendez que le déploiement se termine (2-5 minutes)

---

## ✅ Étape 10 : Tester votre site en production

1. Une fois le déploiement terminé, Vercel vous donnera une URL (ex: `https://broques.vercel.app`)
2. Cliquez sur cette URL
3. Testez votre site :
   - ✅ Créez un compte
   - ✅ Créez une annonce
   - ✅ Upload une photo
   - ✅ Testez la recherche
   - ✅ Testez la messagerie

Si tout fonctionne, **félicitations ! 🎉 Votre site est en ligne !**

---

## 🐛 En cas de problème

### Erreur "Invalid API key"
→ Vérifiez que les variables d'environnement sont bien configurées dans Vercel

### Photos ne s'affichent pas
→ Vérifiez que le bucket `photos` est bien **public** dans Supabase Storage

### Erreur de build
→ Regardez les logs dans Vercel (onglet "Deployments" > cliquez sur le déploiement)

---

## 📞 Besoin d'aide ?

Dites-moi à quelle étape vous êtes bloqué et je vous aiderai ! 😊

