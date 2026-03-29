# Guide de déploiement en production - BROQUES

Ce guide vous explique comment publier votre première version de BROQUES en production sur Vercel.

## 📋 Prérequis

- Un compte [Vercel](https://vercel.com) (gratuit)
- Un compte [Supabase](https://supabase.com) (gratuit jusqu'à un certain usage)
- Un compte [GitHub](https://github.com), [GitLab](https://gitlab.com) ou [Bitbucket](https://bitbucket.org) pour héberger votre code

---

## 🗄️ Étape 1 : Préparer la base de données Supabase

### 1.1 Créer le projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte
2. Créez un nouveau projet
3. Notez les informations de connexion :
   - **URL du projet** (ex: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (clé publique)
   - **Service Role Key** (clé secrète, à garder privée)

### 1.2 Créer les tables

1. Dans Supabase, allez dans **SQL Editor**
2. Exécutez le script `supabase/schema.sql` pour créer toutes les tables
3. Vérifiez que les tables suivantes existent :
   - `profiles`
   - `annonces`
   - `conversations`
   - `messages`

### 1.3 Configurer Row Level Security (RLS)

1. Allez dans **Authentication > Policies**
2. Activez RLS sur toutes les tables
3. Créez les politiques nécessaires (voir `supabase/schema.sql` pour les exemples)

### 1.4 Configurer le stockage pour les photos

1. Allez dans **Storage**
2. Créez un bucket nommé `photos`
3. Configurez les politiques de stockage :
   - **Public** : lecture publique des photos
   - **Authenticated** : écriture pour les utilisateurs authentifiés

### 1.5 Exécuter les migrations si nécessaire

Si vous avez des annonces existantes, exécutez les scripts de migration :
- `supabase/migration_categories.sql` (pour les nouvelles catégories)
- `supabase/migration_nombre_articles.sql` (pour le champ nombre_articles)

---

## 🔐 Étape 2 : Configurer les variables d'environnement

### 2.1 Variables nécessaires

Créez un fichier `.env.local` à la racine du projet avec :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-publique-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role-secrète
```

**⚠️ Important :**
- `NEXT_PUBLIC_*` : variables accessibles côté client (dans le navigateur)
- `SUPABASE_SERVICE_ROLE_KEY` : variable secrète, uniquement côté serveur

### 2.2 Où trouver ces valeurs dans Supabase

1. **URL et Anon Key** : Settings > API > Project URL et anon/public key
2. **Service Role Key** : Settings > API > service_role key (⚠️ gardez-la secrète !)

---

## 📦 Étape 3 : Préparer le code

### 3.1 Vérifier le fichier .gitignore

Assurez-vous que `.gitignore` contient :
```
.env.local
.env*.local
.next
node_modules
```

### 3.2 Vérifier package.json

Vérifiez que les scripts sont corrects :
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### 3.3 Créer un fichier .env.local.example

Créez un fichier `.env.local.example` (sans valeurs sensibles) pour documenter les variables nécessaires.

---

## 🚀 Étape 4 : Déployer sur Vercel

### 4.1 Préparer le dépôt Git

1. Initialisez Git si ce n'est pas déjà fait :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - BROQUES v1.0"
   ```

2. Créez un dépôt sur GitHub/GitLab/Bitbucket

3. Poussez votre code :
   ```bash
   git remote add origin https://github.com/votre-username/broques.git
   git branch -M main
   git push -u origin main
   ```

### 4.2 Connecter Vercel au dépôt

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur **"Add New Project"**
3. Importez votre dépôt Git
4. Vercel détectera automatiquement Next.js

### 4.3 Configurer les variables d'environnement dans Vercel

1. Dans les paramètres du projet Vercel, allez dans **Settings > Environment Variables**
2. Ajoutez les variables suivantes :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé anon
   - `SUPABASE_SERVICE_ROLE_KEY` = votre clé service role (⚠️ Production uniquement)

3. Sélectionnez les environnements (Production, Preview, Development)

### 4.4 Déployer

1. Cliquez sur **"Deploy"**
2. Vercel va :
   - Installer les dépendances (`npm install`)
   - Builder l'application (`npm run build`)
   - Déployer sur leur infrastructure

3. Attendez la fin du déploiement (2-5 minutes)

### 4.5 Obtenir l'URL de production

Une fois déployé, Vercel vous donnera une URL :
- **Production** : `https://votre-projet.vercel.app`
- Vous pouvez aussi configurer un domaine personnalisé

---

## ✅ Étape 5 : Vérifications post-déploiement

### 5.1 Tester l'application

1. Visitez votre URL de production
2. Testez les fonctionnalités principales :
   - ✅ Inscription / Connexion
   - ✅ Création d'annonce
   - ✅ Recherche d'annonces
   - ✅ Messagerie
   - ✅ Upload de photos

### 5.2 Vérifier les logs

1. Dans Vercel, allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Vérifiez les logs pour détecter d'éventuelles erreurs

### 5.3 Vérifier Supabase

1. Dans Supabase, vérifiez que les données sont bien créées
2. Vérifiez les logs d'authentification
3. Vérifiez le stockage des photos

---

## 🔧 Étape 6 : Configuration avancée (optionnel)

### 6.1 Domaine personnalisé

1. Dans Vercel, allez dans **Settings > Domains**
2. Ajoutez votre domaine (ex: `broques.be`)
3. Suivez les instructions pour configurer le DNS

### 6.2 Variables d'environnement par environnement

Vous pouvez avoir des variables différentes pour :
- **Production** : votre site en ligne
- **Preview** : chaque pull request
- **Development** : votre environnement local

### 6.3 Monitoring

- Vercel fournit des analytics de base
- Vous pouvez intégrer d'autres outils (Sentry, etc.)

---

## 🐛 Dépannage

### Erreur : "Invalid API key"
- Vérifiez que les variables d'environnement sont bien configurées dans Vercel
- Vérifiez que vous utilisez la bonne clé (anon pour client, service role pour serveur)

### Erreur : "Table does not exist"
- Vérifiez que vous avez bien exécuté `schema.sql` dans Supabase
- Vérifiez que les migrations ont été exécutées

### Photos ne s'affichent pas
- Vérifiez que le bucket `photos` existe dans Supabase Storage
- Vérifiez les politiques de stockage (lecture publique)

### Erreur de build
- Vérifiez les logs de build dans Vercel
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez qu'il n'y a pas d'erreurs TypeScript

---

## 📝 Checklist de déploiement

- [ ] Base de données Supabase créée et configurée
- [ ] Tables créées (profiles, annonces, conversations, messages)
- [ ] RLS activé et configuré
- [ ] Bucket `photos` créé dans Storage
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Code poussé sur Git
- [ ] Projet Vercel créé et connecté au dépôt
- [ ] Déploiement réussi
- [ ] Tests fonctionnels effectués
- [ ] Domain personnalisé configuré (optionnel)

---

## 🎉 C'est prêt !

Votre application BROQUES est maintenant en ligne ! 

Pour les prochaines mises à jour :
1. Faites vos modifications
2. Commitez et poussez sur Git
3. Vercel déploiera automatiquement la nouvelle version

---

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)

