# Vérification du bucket "photos" dans Supabase

## ✅ Vérifications à faire

1. **Le bucket existe** : ✅ Vous l'avez déjà !

2. **Vérifier qu'il est public** :
   - Dans Supabase, allez dans **Storage**
   - Cliquez sur le bucket `photos`
   - Vérifiez que **"Public bucket"** est coché
   - Si ce n'est pas le cas, cochez-le et sauvegardez

3. **Vérifier les politiques de stockage** :
   - Dans le bucket `photos`, allez dans l'onglet **"Policies"**
   - Vous devriez avoir au minimum :
     - Une politique de **lecture publique** (SELECT) pour que les photos soient visibles
     - Une politique d'**écriture** (INSERT) pour les utilisateurs authentifiés

Si le bucket existe déjà et est public, c'est parfait ! Vous pouvez passer à l'étape suivante.

