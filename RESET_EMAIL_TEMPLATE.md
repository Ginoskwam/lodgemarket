# 🔄 Réinitialisation du template d'email Supabase

## Méthode automatique (recommandée)

### Option 1 : Script Node.js

```bash
# 1. Ajoutez votre clé service_role dans .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=votre_cle_ici" >> .env.local

# 2. Exécutez le script
node scripts/reset-email-template.js
```

### Option 2 : Script Bash

```bash
# 1. Ajoutez votre clé service_role dans .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=votre_cle_ici" >> .env.local

# 2. Exécutez le script
./scripts/reset-email-simple.sh
```

## Méthode manuelle (si les scripts ne fonctionnent pas)

1. **Connectez-vous au dashboard Supabase**
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet

2. **Accédez aux templates d'email**
   - Menu de gauche : **Authentication**
   - Cliquez sur **Email Templates** (ou **Templates**)

3. **Réinitialisez le template**
   - Trouvez le template **"Confirm signup"** (ou **"Confirmation d'inscription"**)
   - Cliquez sur le bouton **"Reset to default"** (ou **"Réinitialiser par défaut"**)
   - Confirmez l'action

4. **Vérifiez le template**
   - Le template doit contenir `{{ .ConfirmationURL }}`
   - Le sujet doit être "Confirm your signup" (ou similaire)

5. **Testez l'inscription**
   - Essayez de créer un nouveau compte
   - Vérifiez que l'email de confirmation est bien reçu

## Obtenir la clé service_role

Si vous avez besoin de la clé service_role pour les scripts automatiques :

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **Settings** (icône engrenage en bas à gauche)
4. Cliquez sur **API**
5. Trouvez la section **"Project API keys"**
6. Copiez la clé **"service_role"** (⚠️ gardez-la secrète, ne la partagez jamais)
7. Ajoutez-la dans `.env.local` :
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Template par défaut correct

Si vous voulez vérifier manuellement que le template est correct :

**Sujet :**
```
Confirm your signup
```

**Corps HTML :**
```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

**Corps texte :**
```
Confirm your signup

Follow this link to confirm your user:

{{ .ConfirmationURL }}
```

⚠️ **Important** : La variable `{{ .ConfirmationURL }}` (avec espaces autour du point) est **OBLIGATOIRE**.

