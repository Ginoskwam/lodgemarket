# 🔄 Redéployer manuellement sur Vercel

## Option 1 : Redéployer depuis Vercel

1. Dans Vercel, allez dans votre projet
2. Allez dans l'onglet **"Deployments"**
3. Cliquez sur les **3 points** (⋯) du dernier déploiement
4. Cliquez sur **"Redeploy"**
5. Attendez que le déploiement se termine

---

## Option 2 : Vérifier la connexion Git

Si l'option 1 ne fonctionne pas, vérifiez que Vercel est bien connecté à votre dépôt :

1. Dans Vercel, allez dans **Settings** de votre projet
2. Allez dans **"Git"**
3. Vérifiez que votre dépôt GitHub `broques` est bien connecté
4. Si ce n'est pas le cas, cliquez sur **"Connect Git Repository"** et sélectionnez votre dépôt

---

## Option 3 : Déclencher un nouveau commit

Si vous voulez forcer un nouveau déploiement, vous pouvez faire un petit changement et le commiter :

```bash
# Faire un petit changement (ex: ajouter un commentaire)
# Puis :
git add .
git commit -m "Trigger redeploy"
git push
```

Vercel devrait alors détecter le nouveau commit et redéployer automatiquement.

