# tonmatos

Plateforme de location de matériel entre particuliers - MVP

## 🎯 Description

**tonmatos** est une plateforme de mise en relation pour la location d'objets entre particuliers. L'application permet de :
- Publier des annonces de matériel à louer
- Consulter les annonces disponibles
- Échanger des messages entre propriétaires et locataires
- Recevoir des notifications par email lors de nouveaux messages

**Principe fort** : MVP simple, sans paiement intégré, sans gestion d'assurance, sans arbitrage. Tout se fait en remise en main propre et hors plateforme pour la partie financière.

## 🛠️ Stack technique

- **Framework** : Next.js 14 (App Router, TypeScript)
- **UI** : React + Tailwind CSS
- **Auth & Base de données** : Supabase
- **Hébergement** : Vercel (compatible)

## 📋 Prérequis

- Node.js 18+ et npm
- Un compte Supabase (gratuit) : [https://supabase.com](https://supabase.com)
- Un compte Vercel (gratuit) : [https://vercel.com](https://vercel.com) (optionnel pour le déploiement)

## 🚀 Installation

### 1. Cloner et installer les dépendances

```bash
cd tonmatos
npm install
```

### 2. Configurer Supabase

#### a. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **Project URL** et votre **anon key** (disponibles dans Settings > API)

#### b. Créer les tables

1. Dans Supabase, allez dans **SQL Editor**
2. Exécutez le script `supabase/schema.sql` pour créer toutes les tables
3. Exécutez le script `supabase/rls.sql` pour configurer les Row Level Security

#### c. Configurer le Storage

1. Dans Supabase, allez dans **Storage**
2. Créez un nouveau bucket nommé `photos`
3. Configurez-le comme suit :
   - **Public bucket** : Non (privé)
   - **File size limit** : 5MB
   - **Allowed MIME types** : `image/jpeg, image/png, image/webp`
4. Créez les politiques de sécurité (voir `supabase/storage.sql` pour les détails)

#### d. Activer Row Level Security

Pour chaque table créée, activez RLS dans Supabase Dashboard :
- `profiles` → Settings → Enable RLS
- `annonces` → Settings → Enable RLS
- `conversations` → Settings → Enable RLS
- `messages` → Settings → Enable RLS

### 3. Configurer les variables d'environnement

1. Copiez le fichier `.env.local.example` vers `.env.local` :

```bash
cp .env.local.example .env.local
```

2. Éditez `.env.local` et remplissez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase

# Optionnel - pour les notifications email
RESEND_API_KEY=votre_cle_resend
RESEND_FROM_EMAIL=noreply@tonmatos.com
```

### 4. Lancer le projet en local

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
tonmatos/
├── app/                    # Pages Next.js (App Router)
│   ├── auth/              # Pages d'authentification
│   ├── annonces/          # Pages des annonces
│   ├── messages/          # Pages de messagerie
│   └── api/               # API routes
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configuration
│   ├── supabase/         # Clients Supabase
│   └── email.ts          # Service d'envoi d'emails
├── types/                 # Types TypeScript
├── supabase/              # Scripts SQL pour Supabase
│   ├── schema.sql        # Création des tables
│   ├── rls.sql           # Politiques de sécurité
│   └── storage.sql       # Configuration Storage
└── README.md
```

## 🎨 Pages principales

- `/` - Landing page
- `/annonces` - Liste des annonces avec filtres
- `/annonces/nouvelle` - Créer une annonce (protégé)
- `/annonces/[id]` - Détail d'une annonce
- `/messages` - Inbox (liste des conversations)
- `/messages/[id]` - Vue d'une conversation
- `/auth/login` - Connexion
- `/auth/register` - Inscription

## 📧 Notifications email

Le système de notifications email est configuré mais nécessite une implémentation complète :

### Option 1 : Resend (recommandé)

1. Créez un compte sur [https://resend.com](https://resend.com)
2. Obtenez votre API key
3. Ajoutez-la dans `.env.local`
4. Décommentez le code dans `lib/email.ts`

### Option 2 : Supabase Edge Functions

Créez une Edge Function Supabase qui utilise l'Admin API pour récupérer les emails et envoyer les notifications.

### Option 3 : Service externe

Intégrez un autre service d'email (SendGrid, AWS SES, etc.) en modifiant `lib/email.ts`.

**Note** : Pour l'instant, les emails sont loggés en console en mode développement.

## 🚢 Déploiement sur Vercel

1. Poussez votre code sur GitHub
2. Connectez votre repo à Vercel
3. Ajoutez les variables d'environnement dans Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY` (si vous utilisez Resend)
   - `RESEND_FROM_EMAIL` (si vous utilisez Resend)
4. Déployez !

## 🔒 Sécurité

- **Row Level Security (RLS)** : Toutes les tables sont protégées par RLS
- **Authentification** : Gérée par Supabase Auth
- **Validation** : Les données sont validées côté client et serveur
- **Photos** : Stockées dans Supabase Storage avec politiques de sécurité

## 🐛 Dépannage

### Erreur "relation does not exist"
- Vérifiez que vous avez bien exécuté `supabase/schema.sql`

### Erreur "permission denied"
- Vérifiez que RLS est activé et que les politiques sont créées (`supabase/rls.sql`)

### Erreur upload photos
- Vérifiez que le bucket `photos` existe dans Supabase Storage
- Vérifiez les politiques de sécurité du bucket

### Les emails ne sont pas envoyés
- Vérifiez votre configuration email dans `.env.local`
- Consultez les logs de la console pour voir les emails qui seraient envoyés

## 📝 Notes importantes

- **Pas de paiement** : L'application ne gère pas les paiements
- **Pas d'assurance** : Aucune gestion d'assurance intégrée
- **Pas d'arbitrage** : Les litiges doivent être résolus entre particuliers
- **Remise en main propre** : Tout se fait hors plateforme pour la partie financière

## 🤝 Contribution

Ce projet est un MVP. Pour contribuer :
1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est fourni tel quel pour un usage MVP.

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez la documentation Supabase : [https://supabase.com/docs](https://supabase.com/docs)
2. Vérifiez la documentation Next.js : [https://nextjs.org/docs](https://nextjs.org/docs)
3. Consultez les logs de la console pour les erreurs

---

**Bon développement ! 🚀**

