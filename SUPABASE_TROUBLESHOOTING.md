# 🔧 Guide de résolution des problèmes Supabase

## Problème : Le domaine Supabase n'est pas trouvé (ENOTFOUND)

Si vous voyez l'erreur `getaddrinfo ENOTFOUND` ou `Failed to fetch`, cela signifie que l'URL de votre projet Supabase dans `.env.local` est incorrecte ou obsolète.

### ✅ Solution : Mettre à jour les variables d'environnement

1. **Allez sur le dashboard Supabase**
   - Ouvrez https://supabase.com/dashboard
   - Connectez-vous à votre compte
   - Sélectionnez votre projet

2. **Récupérez les nouvelles informations**
   - Cliquez sur **Settings** (⚙️) dans la barre latérale
   - Allez dans **API**
   - Vous verrez :
     - **Project URL** : L'URL de votre projet (ex: `https://xxxxx.supabase.co`)
     - **anon public** : La clé publique anonyme

3. **Mettez à jour `.env.local`**
   ```bash
   # Ouvrez le fichier .env.local
   nano .env.local
   # ou
   code .env.local
   ```

   Mettez à jour avec les nouvelles valeurs :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-nouveau-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-nouvelle-clé-anon
   ```

4. **Vérifiez la connexion**
   ```bash
   node scripts/test-supabase-connection.js
   ```

5. **Redémarrez le serveur de développement**
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   # Puis relancez-le
   npm run dev
   ```

## 🔍 Vérifications supplémentaires

### Vérifier que le projet est actif
- Sur le dashboard Supabase, vérifiez que votre projet n'est pas en pause
- Si le projet était en pause, attendez 1-2 minutes après la réactivation

### Vérifier le format de l'URL
L'URL doit :
- Commencer par `https://`
- Se terminer par `.supabase.co`
- Exemple : `https://abcdefghijklmnop.supabase.co`

### Vérifier le format de la clé
La clé anon doit :
- Commencer par `eyJ` (c'est un JWT)
- Faire environ 200-300 caractères

## 🧪 Tester la connexion

Utilisez le script de test :
```bash
node scripts/test-supabase-connection.js
```

Ce script vérifie :
- ✅ Que les variables d'environnement sont définies
- ✅ Que l'URL est valide
- ✅ Que la connexion au serveur fonctionne
- ✅ Que l'API Auth est accessible

## 📞 Besoin d'aide ?

Si le problème persiste :
1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs du serveur de développement
3. Vérifiez que votre projet Supabase est bien actif sur le dashboard

