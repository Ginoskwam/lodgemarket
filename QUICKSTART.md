# Guide de démarrage rapide - tonmatos

Ce guide vous permet de démarrer rapidement avec tonmatos en 10 minutes.

## ⚡ Étapes rapides

### 1. Installation (2 min)

```bash
cd tonmatos
npm install
```

### 2. Configuration Supabase (5 min)

#### a. Créer un projet Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte (gratuit)
3. Créez un nouveau projet
4. Attendez que le projet soit prêt (2-3 minutes)

#### b. Récupérer les clés API
1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (longue chaîne de caractères)

#### c. Créer les tables
1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez le contenu de `supabase/schema.sql`
4. Cliquez sur **Run** (ou Ctrl+Enter)
5. Répétez avec `supabase/rls.sql`

#### d. Configurer le Storage
1. Dans Supabase, allez dans **Storage**
2. Cliquez sur **New bucket**
3. Nom : `photos`
4. Public : **Non** (décochez)
5. Cliquez sur **Create bucket**
6. Dans le bucket `photos`, allez dans **Policies**
7. Créez une politique :
   - **Policy name** : "Anyone can read photos"
   - **Allowed operation** : SELECT
   - **Policy definition** : `true`
8. Créez une autre politique :
   - **Policy name** : "Users can upload in their folder"
   - **Allowed operation** : INSERT
   - **Policy definition** : `(storage.foldername(name))[1] = (auth.uid())::text`

### 3. Configuration locale (1 min)

1. Créez le fichier `.env.local` :

```bash
cp .env.local.example .env.local
```

2. Éditez `.env.local` et ajoutez vos clés Supabase :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

### 4. Lancer l'application (1 min)

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## ✅ Vérification

1. **Inscription** : Créez un compte sur `/auth/register`
2. **Créer une annonce** : Allez sur `/annonces/nouvelle`
3. **Voir les annonces** : Allez sur `/annonces`
4. **Contacter un propriétaire** : Cliquez sur "Contacter le propriétaire" sur une annonce
5. **Envoyer un message** : Écrivez un message dans la conversation

## 🎯 Prochaines étapes

- Configurez les notifications email (voir README.md)
- Déployez sur Vercel (voir README.md)
- Personnalisez le design avec Tailwind CSS

## 🐛 Problèmes courants

**"relation does not exist"**
→ Vous n'avez pas exécuté `supabase/schema.sql`

**"permission denied"**
→ Vous n'avez pas exécuté `supabase/rls.sql` ou RLS n'est pas activé

**Erreur upload photos**
→ Vérifiez que le bucket `photos` existe et que les politiques sont créées

---

**C'est parti ! 🚀**

