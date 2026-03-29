# Guide de dépannage - Internal Server Error

## Solution rapide : Désactiver temporairement les notifications

Si vous ne pouvez pas ouvrir le site, ajoutez cette ligne dans votre `.env.local` :

```
DISABLE_NOTIFICATIONS=true
```

Puis redémarrez le serveur (`npm run dev`).

## Vérifications à faire

1. **Vérifier les variables d'environnement**
   - Ouvrez `.env.local`
   - Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont définis

2. **Vérifier les logs du serveur**
   - Regardez le terminal où vous avez lancé `npm run dev`
   - Cherchez les erreurs en rouge

3. **Tester l'API Supabase**
   - Allez sur https://supabase.com/dashboard
   - Vérifiez que votre projet est actif
   - Testez une requête simple dans l'éditeur SQL

4. **Vérifier la console du navigateur**
   - Ouvrez les outils de développement (F12)
   - Regardez l'onglet Console pour les erreurs JavaScript
   - Regardez l'onglet Network pour les requêtes qui échouent

## Si le problème persiste

1. Désactivez temporairement le NotificationsProvider dans `app/layout.tsx` :
   - Commentez la ligne `<NotificationsProvider />`

2. Vérifiez si le problème vient d'une route spécifique :
   - Essayez d'accéder directement à `/annonces` ou `/auth/login`

3. Vérifiez les permissions Supabase :
   - Les tables `conversations` et `messages` doivent être accessibles
   - Les RLS (Row Level Security) doivent être configurées correctement

