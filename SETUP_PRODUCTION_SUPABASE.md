# 🗄️ Configuration d'un nouveau projet Supabase pour la production

## Étape 1 : Créer un nouveau projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Cliquez sur **"New Project"** (ou le bouton "+" en haut à droite)
4. Remplissez le formulaire :
   - **Name** : `broques-production` (ou un nom de votre choix)
   - **Database Password** : créez un mot de passe fort (⚠️ notez-le quelque part, vous en aurez besoin)
   - **Region** : choisissez la région la plus proche (ex: `West EU` pour la Belgique)
   - **Pricing Plan** : Free (pour commencer)
5. Cliquez sur **"Create new project"**
6. ⏳ Attendez 2-3 minutes que le projet soit créé

---

## Étape 2 : Exécuter le schéma SQL

1. Une fois le projet créé, allez dans **SQL Editor** (menu de gauche)
2. Cliquez sur **"New query"**
3. Ouvrez le fichier `supabase/schema.sql` de votre projet local
4. Copiez tout le contenu du fichier
5. Collez-le dans l'éditeur SQL de Supabase
6. Cliquez sur **"Run"** (ou Ctrl+Enter)
7. ✅ Vérifiez qu'il n'y a pas d'erreur (vous devriez voir "Success. No rows returned")

---

## Étape 3 : Créer le bucket pour les photos

1. Dans Supabase, allez dans **Storage** (menu de gauche)
2. Cliquez sur **"New bucket"**
3. Nommez-le : `photos`
4. ⚠️ **Cochez "Public bucket"** (important pour que les photos soient visibles)
5. Cliquez sur **"Create bucket"**

---

## Étape 4 : Récupérer les clés API de PRODUCTION

1. Dans Supabase, allez dans **Settings** (icône engrenage en bas à gauche)
2. Cliquez sur **"API"**
3. Notez ces 3 valeurs (⚠️ ce sont les clés de PRODUCTION, différentes de votre local) :

   **Project URL** :
   ```
   https://xxxxx.supabase.co
   ```
   → Copiez cette URL

   **anon public** key :
   ```
   eyJhbGc... (très longue clé)
   ```
   → Copiez cette clé

   **service_role** key :
   ```
   eyJhbGc... (très longue clé différente)
   ```
   → ⚠️ Copiez cette clé (gardez-la secrète, c'est la clé admin)

4. Notez ces 3 valeurs quelque part (fichier texte, notes, etc.)

---

## Étape 5 : Vérifier que tout est en place

1. Allez dans **Table Editor** → Vérifiez les 4 tables : `profiles`, `annonces`, `conversations`, `messages`
2. Allez dans **Storage** → Vérifiez que le bucket `photos` existe et est public
3. Allez dans **Settings > API** → Vérifiez que vous avez bien noté les 3 clés

✅ Si tout est bon, vous êtes prêt pour configurer Vercel !

---

## 📝 Résumé

Vous avez maintenant :
- ✅ Un projet Supabase de PRODUCTION (séparé de votre local)
- ✅ Toutes les tables créées
- ✅ Le bucket `photos` créé et public
- ✅ Les 3 clés API notées

**Prochaine étape** : Configurer Vercel avec ces nouvelles clés de production.

