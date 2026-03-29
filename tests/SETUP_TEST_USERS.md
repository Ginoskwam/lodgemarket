# Configuration des Utilisateurs de Test

## ⚠️ Problème Identifié

Les tests E2E échouent car les utilisateurs de test définis dans `tests/fixtures/users.ts` n'existent pas dans votre Supabase staging.

## ✅ Solution : Créer les Utilisateurs de Test

### Option 1 : Créer les utilisateurs manuellement dans Supabase

1. Aller sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionner votre projet staging
3. Aller dans **Authentication** > **Users**
4. Cliquer sur **Add User** > **Create new user**
5. Créer les utilisateurs suivants :

#### Utilisateur 1
- **Email:** `test-user-1@broques.test`
- **Password:** `TestPassword123!`
- **Auto Confirm User:** ✅ (cocher pour éviter la confirmation email)

#### Utilisateur 2
- **Email:** `test-user-2@broques.test`
- **Password:** `TestPassword123!`
- **Auto Confirm User:** ✅

#### Utilisateur Admin (optionnel)
- **Email:** `test-admin@broques.test`
- **Password:** `TestPassword123!`
- **Auto Confirm User:** ✅

### Option 2 : Utiliser des utilisateurs existants

Si vous avez déjà des utilisateurs dans votre staging, modifiez `tests/fixtures/users.ts` :

```typescript
export const testUsers = {
  user1: {
    email: 'votre-email-existant@example.com',
    password: 'votre-mot-de-passe',
    name: 'Test User 1',
  },
  // ...
}
```

## 🔧 Alternative : Désactiver temporairement les tests de login

Si vous ne pouvez pas créer les utilisateurs maintenant, vous pouvez :

1. Commenter les tests qui nécessitent le login
2. Ou utiliser `test.skip()` pour les ignorer temporairement

## ✅ Vérification

Une fois les utilisateurs créés, relancer les tests :

```bash
npm run test:nrt
```

Les tests de login devraient maintenant passer.

## 📝 Note sur les Emails

Si Supabase n'accepte pas les emails avec `@broques.test`, vous pouvez :

1. Utiliser un domaine réel que vous possédez
2. Ou modifier les fixtures pour utiliser un autre format
3. Ou configurer Supabase pour accepter ce domaine (si possible)

---

**Important:** Ne jamais utiliser les credentials de production dans les tests !

