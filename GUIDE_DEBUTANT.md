# 🎓 Guide complet pour débutants - tonmatos

Bienvenue ! Ce guide va vous accompagner étape par étape, même si vous n'avez jamais fait de développement. On va y aller doucement et tout expliquer.

## 📚 Ce que vous allez apprendre

Vous allez installer et configurer votre première application web. Pas de panique, on va tout faire ensemble !

---

## ÉTAPE 1 : Installer les outils nécessaires (15 minutes)

### 1.1 Installer Node.js

**Qu'est-ce que c'est ?** Node.js est un outil qui permet de faire tourner du code JavaScript sur votre ordinateur. C'est nécessaire pour faire fonctionner Next.js.

**Comment faire :**

1. Allez sur le site : [https://nodejs.org/](https://nodejs.org/)
2. Vous verrez deux gros boutons verts. Cliquez sur celui qui dit **"LTS"** (c'est la version stable recommandée)
3. Le fichier va se télécharger automatiquement
4. Une fois téléchargé, double-cliquez dessus pour l'installer
5. Suivez les instructions à l'écran (cliquez sur "Suivant" / "Next" partout)
6. À la fin, cliquez sur "Terminer" / "Finish"

**Comment vérifier que ça a marché :**

1. Ouvrez votre **Terminal** (sur Mac) ou **Invite de commandes** (sur Windows)
   - Mac : Appuyez sur `Cmd + Espace`, tapez "Terminal", appuyez sur Entrée
   - Windows : Appuyez sur `Windows + R`, tapez "cmd", appuyez sur Entrée
2. Tapez cette commande et appuyez sur Entrée :
   ```bash
   node --version
   ```
3. Vous devriez voir un numéro (comme `v20.10.0`). Si c'est le cas, c'est bon ! ✅

**Si ça ne marche pas :** Fermez et rouvrez le Terminal, puis réessayez.

---

### 1.2 Vérifier que npm est installé

**Qu'est-ce que c'est ?** npm est un gestionnaire de paquets. Il permet d'installer des "morceaux de code" (appelés "packages") que votre application a besoin.

**Comment faire :**

1. Dans le même Terminal, tapez :
   ```bash
   npm --version
   ```
2. Vous devriez voir un numéro (comme `10.2.3`). Si c'est le cas, c'est bon ! ✅

**Note :** npm est installé automatiquement avec Node.js, donc normalement ça devrait marcher tout seul.

---

## ÉTAPE 2 : Préparer votre projet (5 minutes)

### 2.1 Ouvrir le Terminal dans le bon dossier

**Sur Mac :**
1. Ouvrez le Finder
2. Allez dans le dossier où se trouve votre projet `tonmatos`
3. Faites un clic droit sur le dossier `tonmatos`
4. Cliquez sur "Services" > "Nouveau terminal au dossier" (ou "New Terminal at Folder")

**Sur Windows :**
1. Ouvrez l'Explorateur de fichiers
2. Allez dans le dossier où se trouve votre projet `tonmatos`
3. Dans la barre d'adresse en haut, tapez `cmd` et appuyez sur Entrée

**Alternative (pour les deux) :**
1. Ouvrez le Terminal
2. Tapez `cd ` (avec un espace après cd)
3. Glissez-déposez le dossier `tonmatos` dans le Terminal
4. Appuyez sur Entrée

Vous devriez voir quelque chose comme :
```
/Users/votre_nom/tonmatos
```
ou
```
C:\Users\votre_nom\tonmatos
```

---

### 2.2 Installer les dépendances du projet

**Qu'est-ce que c'est ?** Votre projet a besoin de "morceaux de code" (packages) pour fonctionner. On va les télécharger maintenant.

**Comment faire :**

1. Dans le Terminal (dans le bon dossier), tapez :
   ```bash
   npm install
   ```
2. Appuyez sur Entrée
3. **Attendez** (ça peut prendre 2-5 minutes). Vous verrez plein de lignes qui défilent, c'est normal !
4. À la fin, vous devriez voir quelque chose comme "added 500 packages" ou "up to date"

**Si vous voyez des erreurs en rouge :**
- Ne paniquez pas ! Copiez le message d'erreur et on pourra le résoudre ensemble
- Parfois, il suffit de réessayer : tapez `npm install` à nouveau

---

## ÉTAPE 3 : Créer un compte Supabase (10 minutes)

**Qu'est-ce que c'est ?** Supabase est un service qui va héberger votre base de données (où seront stockées les annonces, les messages, etc.) et gérer l'authentification (connexion des utilisateurs).

**C'est gratuit ?** Oui, pour commencer, c'est totalement gratuit !

### 3.1 Créer le compte

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur le bouton **"Start your project"** ou **"Sign up"** (en haut à droite)
3. Vous pouvez vous inscrire avec :
   - GitHub (si vous avez un compte GitHub)
   - Email (sinon, utilisez votre email)
4. Suivez les instructions pour créer votre compte
5. Vérifiez votre email si nécessaire

### 3.2 Créer un nouveau projet

1. Une fois connecté, vous verrez un bouton **"New Project"** ou **"Nouveau projet"**
2. Cliquez dessus
3. Remplissez le formulaire :
   - **Name** : Donnez un nom à votre projet (ex: "tonmatos" ou "mon-projet")
   - **Database Password** : Choisissez un mot de passe fort (notez-le quelque part en sécurité !)
   - **Region** : Choisissez la région la plus proche de vous (ex: "West EU" pour l'Europe de l'Ouest)
4. Cliquez sur **"Create new project"**
5. **Attendez 2-3 minutes** que Supabase prépare votre projet (vous verrez une barre de progression)

---

## ÉTAPE 4 : Configurer Supabase (20 minutes)

### 4.1 Récupérer vos clés API

**Qu'est-ce que c'est ?** Ce sont des "clés secrètes" qui permettent à votre application de communiquer avec Supabase.

**Comment faire :**

1. Dans votre projet Supabase, regardez le menu à gauche
2. Cliquez sur l'icône **"Settings"** (⚙️) en bas
3. Cliquez sur **"API"** dans le sous-menu
4. Vous verrez deux choses importantes :
   - **Project URL** : C'est une adresse qui ressemble à `https://xxxxx.supabase.co`
   - **anon public key** : C'est une très longue chaîne de caractères qui commence souvent par `eyJ...`

5. **Copiez ces deux valeurs** et gardez-les de côté (on en aura besoin juste après)

---

### 4.2 Créer les tables de la base de données

**Qu'est-ce que c'est ?** Les "tables" sont comme des feuilles Excel. Chaque table stocke un type d'information :
- Une table pour les utilisateurs
- Une table pour les annonces
- Une table pour les messages
- etc.

**Comment faire :**

1. Dans Supabase, cliquez sur **"SQL Editor"** dans le menu de gauche (icône avec `</>`)
2. Cliquez sur le bouton **"New query"** (en haut à gauche)
3. Ouvrez le fichier `supabase/schema.sql` dans votre projet (avec un éditeur de texte comme Notepad, TextEdit, ou VS Code)
4. **Sélectionnez tout le contenu** du fichier (Cmd+A sur Mac, Ctrl+A sur Windows)
5. **Copiez** (Cmd+C ou Ctrl+C)
6. **Collez** dans la fenêtre SQL Editor de Supabase
7. Cliquez sur le bouton **"Run"** (ou appuyez sur Ctrl+Entrée / Cmd+Entrée)
8. Vous devriez voir un message vert "Success" en bas

**Si vous voyez une erreur :**
- Ne paniquez pas ! Parfois certaines tables existent déjà, c'est normal
- Lisez le message d'erreur : s'il dit "already exists", c'est OK, continuez

---

### 4.3 Configurer la sécurité (RLS)

**Qu'est-ce que c'est ?** RLS (Row Level Security) empêche les utilisateurs de voir les données des autres. C'est très important pour la sécurité !

**Comment faire :**

1. Toujours dans SQL Editor, cliquez sur **"New query"** à nouveau
2. Ouvrez le fichier `supabase/rls.sql` dans votre projet
3. **Copiez tout le contenu** et **collez-le** dans SQL Editor
4. Cliquez sur **"Run"**
5. Vous devriez voir "Success" ✅

---

### 4.4 Activer Row Level Security sur chaque table

**Comment faire :**

1. Dans Supabase, cliquez sur **"Table Editor"** dans le menu de gauche (icône avec une grille)
2. Vous devriez voir plusieurs tables : `profiles`, `annonces`, `conversations`, `messages`
3. Pour **chaque table**, faites ceci :
   - Cliquez sur le nom de la table (ex: `profiles`)
   - Cliquez sur l'onglet **"Policies"** en haut
   - Vérifiez que vous voyez des politiques listées (si vous avez bien exécuté `rls.sql`, elles devraient être là)
   - Si vous ne voyez rien, allez dans l'onglet **"Settings"** et cochez **"Enable RLS"**
4. Répétez pour les 4 tables : `profiles`, `annonces`, `conversations`, `messages`

---

### 4.5 Configurer le Storage pour les photos

**Qu'est-ce que c'est ?** Le Storage est l'endroit où seront stockées les photos des annonces.

**Comment faire :**

1. Dans Supabase, cliquez sur **"Storage"** dans le menu de gauche (icône avec un dossier)
2. Cliquez sur **"New bucket"** (ou "Nouveau bucket")
3. Remplissez :
   - **Name** : `photos` (exactement comme ça, en minuscules)
   - **Public bucket** : **Décochez** cette case (on veut que ce soit privé)
4. Cliquez sur **"Create bucket"**

**Maintenant, configurons les permissions :**

1. Cliquez sur le bucket `photos` que vous venez de créer
2. Cliquez sur l'onglet **"Policies"**
3. Cliquez sur **"New Policy"** > **"Create a policy from scratch"**
4. Première politique (pour lire les photos) :
   - **Policy name** : `Anyone can read photos`
   - **Allowed operation** : `SELECT`
   - **Policy definition** : Tapez simplement `true`
   - Cliquez sur **"Review"** puis **"Save policy"**

5. Cliquez à nouveau sur **"New Policy"** > **"Create a policy from scratch"**
6. Deuxième politique (pour uploader) :
   - **Policy name** : `Users can upload in their folder`
   - **Allowed operation** : `INSERT`
   - **Policy definition** : Tapez `(storage.foldername(name))[1] = (auth.uid())::text`
   - Cliquez sur **"Review"** puis **"Save policy"**

---

## ÉTAPE 5 : Configurer votre application (5 minutes)

### 5.1 Créer le fichier .env.local

**Qu'est-ce que c'est ?** C'est un fichier qui contient vos "clés secrètes". Il ne sera jamais partagé publiquement.

**Comment faire :**

1. Dans le dossier `tonmatos` de votre projet, cherchez le fichier `.env.local.example`
2. **Copiez ce fichier** et renommez la copie en `.env.local`
   - Sur Mac : Clic droit > Dupliquer, puis renommez
   - Sur Windows : Clic droit > Copier, puis Coller, puis renommez
3. Ouvrez le fichier `.env.local` avec un éditeur de texte

### 5.2 Remplir les valeurs

Dans le fichier `.env.local`, vous devriez voir :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Remplissez avec vos vraies valeurs :**

1. Remplacez `your_supabase_project_url` par votre **Project URL** (celle que vous avez copiée à l'étape 4.1)
2. Remplacez `your_supabase_anon_key` par votre **anon public key** (celle que vous avez copiée à l'étape 4.1)

**Exemple :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.exemple
```

**Important :** 
- Ne mettez **PAS d'espaces** avant ou après le `=`
- Ne mettez **PAS de guillemets** autour des valeurs
- Sauvegardez le fichier (Cmd+S ou Ctrl+S)

---

## ÉTAPE 6 : Lancer l'application (2 minutes)

### 6.1 Démarrer le serveur de développement

**Comment faire :**

1. Ouvrez le Terminal dans le dossier `tonmatos` (comme à l'étape 2.1)
2. Tapez cette commande :
   ```bash
   npm run dev
   ```
3. Appuyez sur Entrée
4. **Attendez quelques secondes**. Vous devriez voir quelque chose comme :
   ```
   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000
   ```
5. Si vous voyez ça, c'est que ça marche ! ✅

### 6.2 Ouvrir l'application dans votre navigateur

1. Ouvrez votre navigateur (Chrome, Firefox, Safari, etc.)
2. Dans la barre d'adresse, tapez : `http://localhost:3000`
3. Appuyez sur Entrée
4. **Vous devriez voir la page d'accueil de tonmatos !** 🎉

---

## ÉTAPE 7 : Tester l'application (10 minutes)

### 7.1 Créer un compte

1. Sur la page d'accueil, cliquez sur **"Inscription"** (en haut à droite)
2. Remplissez le formulaire :
   - **Email** : Votre email
   - **Mot de passe** : Choisissez un mot de passe (minimum 6 caractères)
   - **Pseudo** : Votre pseudo
   - **Ville** : Votre ville (optionnel)
3. Cliquez sur **"Créer mon compte"**
4. Vous devriez être redirigé vers la page de connexion

### 7.2 Se connecter

1. Entrez votre email et mot de passe
2. Cliquez sur **"Se connecter"**
3. Vous devriez être connecté ! Vous verrez votre pseudo en haut à droite

### 7.3 Créer une annonce

1. Cliquez sur **"Publier une annonce"** (en haut)
2. Remplissez le formulaire :
   - **Titre** : Ex: "Perceuse visseuse Bosch"
   - **Catégorie** : Choisissez dans la liste
   - **Ville** : Votre ville
   - **Prix par jour** : Ex: 15
   - **Description** : Décrivez votre matériel
   - **Photos** : Ajoutez 1 à 5 photos
3. Cliquez sur **"Publier l'annonce"**
4. Vous devriez voir votre annonce ! ✅

### 7.4 Voir les annonces

1. Cliquez sur **"Annonces"** dans le menu
2. Vous devriez voir toutes les annonces disponibles
3. Cliquez sur une annonce pour voir les détails

### 7.5 Tester la messagerie

1. Sur la page d'une annonce, cliquez sur **"Contacter le propriétaire"**
2. Vous devriez être redirigé vers une page de conversation
3. Tapez un message et cliquez sur **"Envoyer"**
4. Le message devrait apparaître ! ✅

---

## 🎉 Félicitations !

Votre application fonctionne ! Vous avez créé votre première application web !

---

## ❓ Problèmes courants et solutions

### "npm: command not found"
→ Node.js n'est pas installé ou pas dans le PATH. Réinstallez Node.js (étape 1.1)

### "Cannot find module..."
→ Les dépendances ne sont pas installées. Faites `npm install` (étape 2.2)

### "Invalid API key" ou erreur Supabase
→ Vérifiez que vos clés dans `.env.local` sont correctes (étape 5.2)

### "relation does not exist"
→ Les tables n'ont pas été créées. Réexécutez `supabase/schema.sql` (étape 4.2)

### "permission denied"
→ RLS n'est pas configuré. Réexécutez `supabase/rls.sql` (étape 4.3)

### L'application ne se lance pas
→ Vérifiez que vous êtes dans le bon dossier (étape 2.1) et que vous avez fait `npm install`

### Erreur lors de l'upload de photos
→ Vérifiez que le bucket `photos` existe et que les politiques sont créées (étape 4.5)

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué :
1. Relisez l'étape concernée
2. Vérifiez les "Problèmes courants" ci-dessus
3. Copiez le message d'erreur exact et demandez de l'aide

---

## 🚀 Prochaines étapes

Une fois que tout fonctionne :
- Lisez le fichier `README.md` pour comprendre le code
- Lisez `NEXT_STEPS.md` pour voir les améliorations possibles
- Personnalisez le design avec Tailwind CSS
- Déployez sur Vercel (voir README.md)

**Bon courage ! Vous allez y arriver ! 💪**

