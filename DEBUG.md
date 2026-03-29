# Guide de débogage pour l'erreur "Internal Server Error"

Si vous rencontrez une erreur "Internal Server Error", voici les étapes pour identifier le problème :

## 1. Vérifier les logs du serveur

Dans le terminal où vous avez lancé `npm run dev`, regardez les erreurs affichées.

## 2. Vérifier les variables d'environnement

Assurez-vous que votre fichier `.env.local` contient :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Vérifier la base de données Supabase

Les colonnes de soft delete peuvent ne pas exister encore. Pour les ajouter, exécutez le script SQL dans `supabase/migration-soft-delete.sql`.

## 4. Tester les routes API individuellement

Testez ces routes dans votre navigateur ou avec curl :
- `/api/push/vapid-public-key`
- `/api/messages/unread-count?userId=VOTRE_ID`

## 5. Désactiver temporairement les fonctionnalités

Si le problème persiste, vous pouvez temporairement commenter le `<NotificationsProvider />` dans `app/layout.tsx` pour voir si c'est la cause.

