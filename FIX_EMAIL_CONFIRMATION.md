# 🔧 Résolution du problème "Error sending confirmation email"

## Problème
Après avoir modifié le format du mail de confirmation dans Supabase, l'inscription ne fonctionne plus et affiche l'erreur : **"Error sending confirmation email"**

## Causes possibles

1. **Syntaxe incorrecte dans le template d'email** - Variables mal formatées ou manquantes
2. **Variables invalides** - Utilisation de variables qui n'existent pas dans Supabase
3. **Configuration SMTP incorrecte** - Si vous utilisez un serveur SMTP personnalisé
4. **Template HTML invalide** - Erreurs de syntaxe HTML dans le template

## Solution : Vérifier et corriger le template dans Supabase

### Étape 1 : Accéder aux templates d'email

1. Connectez-vous à votre [dashboard Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Authentication** (menu de gauche)
4. Cliquez sur **Email Templates** (ou **Templates**)

### Étape 2 : Vérifier le template "Confirm signup"

1. Trouvez le template **"Confirm signup"** (ou **"Confirmation d'inscription"**)
2. Vérifiez que le template contient les variables suivantes (obligatoires) :
   - `{{ .ConfirmationURL }}` - URL de confirmation (OBLIGATOIRE)
   - `{{ .Email }}` - Email de l'utilisateur (optionnel mais recommandé)
   - `{{ .Token }}` - Token de confirmation (optionnel, généralement dans l'URL)

### Étape 3 : Template correct (exemple)

**Sujet de l'email :**
```
Confirmez votre inscription sur BROQUES
```

**Corps de l'email (HTML) :**
```html
<h2>Bienvenue sur BROQUES !</h2>
<p>Merci de vous être inscrit. Veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
<p>Ou copiez ce lien dans votre navigateur :</p>
<p>{{ .ConfirmationURL }}</p>
<p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
```

**Corps de l'email (Texte) :**
```
Bienvenue sur BROQUES !

Merci de vous être inscrit. Veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :

{{ .ConfirmationURL }}

Si vous n'avez pas créé de compte, ignorez cet email.
```

### Étape 4 : Variables disponibles dans Supabase

Voici les variables que vous pouvez utiliser dans vos templates :

- `{{ .ConfirmationURL }}` - URL complète de confirmation (OBLIGATOIRE pour la confirmation)
- `{{ .Email }}` - Adresse email de l'utilisateur
- `{{ .Token }}` - Token de confirmation (généralement déjà dans l'URL)
- `{{ .TokenHash }}` - Hash du token
- `{{ .SiteURL }}` - URL de votre site (configurée dans Settings > API)

### Étape 5 : Vérifications importantes

✅ **Vérifiez que :**
- `{{ .ConfirmationURL }}` est présent dans le template (OBLIGATOIRE)
- La syntaxe des variables est correcte : `{{ .VariableName }}` (avec espaces autour du point)
- Le template HTML est valide (pas de balises non fermées)
- Aucun caractère spécial n'a cassé la syntaxe

❌ **Évitez :**
- `{{.ConfirmationURL}}` (sans espaces) - peut fonctionner mais moins fiable
- `{{ ConfirmationURL }}` (sans le point)
- Variables personnalisées qui n'existent pas
- HTML complexe avec des erreurs de syntaxe

### Étape 6 : Tester avec le template par défaut

Si le problème persiste :

1. Cliquez sur **"Reset to default"** (Réinitialiser par défaut) pour le template "Confirm signup"
2. Testez l'inscription
3. Si ça fonctionne, le problème vient de votre template personnalisé
4. Recréez votre template personnalisé en partant du template par défaut

### Étape 7 : Vérifier la configuration SMTP (si applicable)

Si vous utilisez un serveur SMTP personnalisé :

1. Allez dans **Settings** > **Auth** > **SMTP Settings**
2. Vérifiez que :
   - L'hôte SMTP est correct
   - Le port est correct (généralement 587 pour TLS ou 465 pour SSL)
   - Le nom d'utilisateur et le mot de passe sont corrects
   - Le "From" email est valide

### Étape 8 : Vérifier les logs Supabase

1. Allez dans **Logs** (menu de gauche)
2. Filtrez par **"Auth"** ou **"Authentication"**
3. Cherchez les erreurs liées à l'envoi d'email
4. Les logs vous donneront plus de détails sur l'erreur exacte

## Solution rapide : Désactiver temporairement la confirmation par email

Si vous avez besoin d'une solution temporaire pendant que vous corrigez le template :

1. Allez dans **Authentication** > **Settings** (ou **Policies**)
2. Trouvez **"Enable email confirmations"** (Activer les confirmations par email)
3. Désactivez cette option temporairement
4. Les utilisateurs pourront se connecter directement après l'inscription

⚠️ **Attention** : Cela réduit la sécurité. Réactivez la confirmation dès que le problème est résolu.

## Vérification finale

Après avoir corrigé le template :

1. Testez l'inscription avec un nouvel email
2. Vérifiez que l'email de confirmation est bien reçu
3. Vérifiez que le lien de confirmation fonctionne
4. Vérifiez les logs Supabase pour confirmer qu'il n'y a plus d'erreurs

## Support

Si le problème persiste après avoir suivi ces étapes :

1. Vérifiez les [logs Supabase](https://app.supabase.com/project/_/logs) pour plus de détails
2. Consultez la [documentation officielle Supabase sur les templates d'email](https://supabase.com/docs/guides/auth/auth-email-templates)
3. Vérifiez le [statut de Supabase](https://status.supabase.com/) pour d'éventuels problèmes de service

