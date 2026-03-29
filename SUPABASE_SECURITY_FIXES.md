# Corrections de sécurité Supabase

Ce document récapitule tous les problèmes de sécurité identifiés et corrigés dans votre projet Supabase.

## 🔒 Problèmes corrigés

### 1. **Permissions 'anon' retirées des fonctions sensibles**

**Problème** : Les fonctions `create_or_update_profile` et `create_profile_for_user` étaient accessibles aux utilisateurs non authentifiés (`anon`), permettant à n'importe qui de créer/modifier des profils.

**Solution** :
- ✅ Retiré `GRANT EXECUTE TO anon` de ces fonctions
- ✅ Ajouté des vérifications `auth.uid()` dans les fonctions
- ✅ Les fonctions vérifient maintenant que l'utilisateur authentifié correspond à l'ID fourni

**Fichiers modifiés** :
- `supabase/fix-profile-function.sql`
- `supabase/fix-profile-insert.sql`

### 2. **Fonctions SECURITY DEFINER sécurisées**

**Problème** : Plusieurs fonctions utilisaient `SECURITY DEFINER` sans `SET search_path`, ce qui peut créer des risques d'injection SQL.

**Solution** :
- ✅ Ajouté `SET search_path = public` à toutes les fonctions `SECURITY DEFINER`
- ✅ Ajouté des vérifications de sécurité dans toutes les fonctions

**Fonctions corrigées** :
- `create_or_update_profile`
- `create_profile_for_user`
- `increment_vues`
- `update_annonce_safe`
- `handle_new_user`

### 3. **Fonction increment_vues sécurisée**

**Problème** : La fonction `increment_vues` pouvait être appelée pour n'importe quelle annonce, même inexistante ou non disponible.

**Solution** :
- ✅ Ajouté une vérification que l'annonce existe et est disponible
- ✅ Ajouté `SET search_path = public`

**Fichier modifié** :
- `supabase/create-increment-vues-function.sql`

### 4. **Fonction update_annonce_safe améliorée**

**Problème** : La fonction vérifiait la propriété mais n'utilisait pas `auth.uid()` directement.

**Solution** :
- ✅ Ajouté une vérification `auth.uid()` pour s'assurer que l'utilisateur est authentifié
- ✅ Vérification que `auth.uid()` correspond à `p_proprietaire_id`
- ✅ Ajouté `SET search_path = public`

**Fichier modifié** :
- `supabase/create_update_annonce_function.sql`

### 5. **Politiques Storage corrigées**

**Problème** : Les politiques Storage permettaient à n'importe quel utilisateur authentifié de supprimer/modifier les photos d'annonces sans vérifier la propriété.

**Solution** :
- ✅ Créé une fonction helper `is_annonce_owner()` pour vérifier la propriété
- ✅ Modifié les politiques Storage pour utiliser cette fonction
- ✅ Les politiques vérifient maintenant la propriété avant d'autoriser les opérations

**Fichier modifié** :
- `supabase/storage-policies-production.sql`

## 📋 Script de migration

Un script de migration complet a été créé : **`supabase/fix-security-issues.sql`**

Ce script applique toutes les corrections en une seule fois. Il est recommandé de l'exécuter dans l'ordre suivant :

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Exécutez le script `fix-security-issues.sql`
4. Vérifiez que toutes les fonctions et politiques sont correctement créées

## ✅ Vérifications à faire après l'application

1. **Vérifier les fonctions** :
   - Toutes les fonctions doivent avoir `SET search_path = public`
   - Les fonctions sensibles ne doivent plus avoir de permissions `anon`

2. **Vérifier les politiques Storage** :
   - Les politiques doivent utiliser `is_annonce_owner()` pour les annonces
   - Les politiques de profil doivent vérifier `auth.uid()`

3. **Tester l'application** :
   - Vérifier que la création de profil fonctionne toujours
   - Vérifier que l'upload de photos fonctionne
   - Vérifier que la suppression de photos vérifie bien la propriété

## 🔍 Détails techniques

### Fonction helper créée

```sql
CREATE OR REPLACE FUNCTION public.is_annonce_owner(annonce_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM annonces
    WHERE id = annonce_id
    AND proprietaire_id = auth.uid()
  );
END;
$$;
```

Cette fonction est utilisée dans les politiques Storage pour vérifier que l'utilisateur authentifié est bien le propriétaire de l'annonce avant d'autoriser les opérations sur les fichiers.

### Exemple de vérification ajoutée

Toutes les fonctions sensibles vérifient maintenant :

```sql
IF auth.uid() IS NULL THEN
  RAISE EXCEPTION 'Vous devez être authentifié';
END IF;

IF auth.uid() != user_id THEN
  RAISE EXCEPTION 'Vous ne pouvez modifier que vos propres données';
END IF;
```

## 📝 Notes importantes

- Les fonctions `create_or_update_profile` et `create_profile_for_user` ne sont plus accessibles aux utilisateurs non authentifiés
- La fonction `increment_vues` reste accessible publiquement mais vérifie que l'annonce existe et est disponible
- Toutes les opérations sur les photos d'annonces vérifient maintenant la propriété via `is_annonce_owner()`

## 🚀 Prochaines étapes

1. Exécutez le script `fix-security-issues.sql` dans Supabase
2. Testez votre application pour vous assurer que tout fonctionne
3. Vérifiez dans le dashboard Supabase que les alertes de sécurité ont disparu

Si vous rencontrez des problèmes après l'application des corrections, vérifiez que :
- Les utilisateurs sont bien authentifiés avant d'appeler les fonctions
- Les chemins des fichiers Storage suivent le format attendu (`profiles/{user_id}/...` ou `annonces/{annonce_id}/...`)

