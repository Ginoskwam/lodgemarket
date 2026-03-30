# Guide : créer Supabase + Git depuis zéro (Lodgemarket)

Tu n’as **pas besoin** d’un projet Supabase préexistant : ce guide part de **zéro**.  
Temps indicatif : **20–40 minutes** (attente du déploiement Supabase comprise).

---

## Partie A — Créer le projet Supabase

1. Va sur **https://supabase.com** → **Start your project** (ou **Sign in**).
2. Connecte-toi avec **GitHub** ou **email** (compte gratuit suffit).
3. Clique **New project**.
4. Renseigne :
   - **Name** : par exemple `lodgemarket` (le nom est libre).
   - **Database password** : génère un mot de passe **fort** et **enregistre-le** dans un endroit sûr (tu en auras besoin pour des outils avancés ; l’app Next.js utilise surtout l’URL + la clé **anon**).
   - **Region** : choisis l’Europe (ex. **Frankfurt**) si tu es en Belgique/France.
5. Clique **Create new project**.
6. Attends **2 à 5 minutes** jusqu’à ce que le tableau de bord affiche le projet comme **prêt** (plus d’animation « Setting up »).

### Récupérer l’URL et la clé « anon » (indispensable pour l’app)

1. Dans le menu de gauche : **Project Settings** (icône engrenage) → **API**.
2. Note quelque part (bloc-notes) :
   - **Project URL** → ressemble à `https://xxxx.supabase.co`
   - **anon public** (sous *Project API keys*) → longue chaîne commençant souvent par `eyJ...`

Tu les mettras dans `.env.local` plus bas.

---

## Partie B — Créer les tables et la sécurité (SQL)

Tout se fait dans **SQL Editor** : menu gauche **SQL Editor** → **New query**.

Pour **chaque** étape : ouvre le fichier indiqué dans ton projet sur le disque, **sélectionne tout** (Cmd+A), **copie**, **colle** dans Supabase, puis **Run** (ou raccourci affiché dans l’éditeur).

**Ordre strict** (important) :

| # | Fichier dans le dossier `lodgemarket` |
|---|----------------------------------------|
| 1 | `supabase/schema.sql` |
| 2 | `supabase/rls.sql` |
| 3 | `supabase/migration_prix_vente.sql` |
| 4 | `supabase/migration-soft-delete.sql` |
| 5 | `supabase/add-vues-column.sql` |
| 6 | `supabase/create-increment-vues-function.sql` |

Ensuite, pour que tout le monde puisse appeler la fonction de vues (recommandé) :

1. Nouvelle requête, colle et exécute :

```sql
GRANT EXECUTE ON FUNCTION increment_vues(UUID) TO anon, authenticated;
```

Si Supabase répond une erreur du type *function does not exist*, vérifie que l’étape 6 a bien réussi.

---

## Partie C — Bucket pour les photos (Storage)

1. Menu gauche **Storage** → **New bucket**.
2. **Name** : exactement `photos` (minuscules).
3. **Public bucket** : tu peux cocher **Public** pour simplifier les URLs d’images en local ; sinon laisse privé et garde les politiques ci‑dessous.
4. **Create bucket**.

Puis : **SQL Editor** → nouvelle requête → copie-colle tout le contenu de :

- `supabase/create-storage-policies.sql`

→ **Run**.

---

## Partie D — Lier l’app à ton projet (fichier `.env.local`)

1. Dans le dossier du projet sur ton Mac :

```bash
cd /Users/romainberthe/lodgemarket
cp .env.local.example .env.local
```

2. Ouvre `.env.local` avec un éditeur de texte et remplace :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...ta_cle_anon...
```

(en collant **tes** valeurs depuis **Settings → API**)

3. Lance l’app :

```bash
npm install
npm run dev
```

Ouvre **http://localhost:3000** (ou le port indiqué dans le terminal). Teste **inscription** puis **nouvelle annonce**.

---

## Partie E — Mettre le code sur GitHub

1. Va sur **https://github.com** → connecte-toi → **+** → **New repository**.
2. Nom : ex. `lodgemarket`. **Ne coche pas** « Add a README » (évite un conflit au premier push).
3. **Create repository**.

Sur ton Mac, dans le **Terminal** :

```bash
cd /Users/romainberthe/lodgemarket
git config user.email "ton-email@exemple.com"
git config user.name "Ton Prénom"
git add -A
git status
git commit -m "Lodgemarket: projet initial"
```

Puis (remplace l’URL par celle affichée par GitHub, onglet **HTTPS** du bouton vert **Code**) :

```bash
git remote add origin https://github.com/TON_USER/lodgemarket.git
git branch -M main
git push -u origin main
```

- Si une fenêtre ou le navigateur demande de te connecter à GitHub : accepte.
- Si on te demande un **mot de passe** pour `https://github.com` : ce n’est plus le mot de passe du site ; il faut un **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens). Le fichier `CREER_TOKEN_GITHUB.md` dans ce dépôt peut t’aider si besoin.

---

## En cas de problème

- **Erreur SQL** : copie le message d’erreur complet (ou le nom de l’étape 1–6) et demande de l’aide en le collant.
- **Photos qui ne s’uploadent pas** : vérifie que le bucket s’appelle bien `photos` et que `create-storage-policies.sql` a été exécuté sans erreur.
- **Table déjà existante** : si tu relances `schema.sql` sur un projet déjà configuré, certaines lignes peuvent échouer ; dans le doute, crée un **nouveau** projet Supabase propre ou exécute seulement les fichiers manquants.

Tu peux aussi lire `COMMENCER_ICI.md` et `GUIDE_DEBUTANT.md` pour plus de contexte général sur le projet.
