# 🔍 Diagnostic complet : Error sending confirmation email

## 🎯 Le problème persiste après modification du template

Si vous avez modifié le template mais que l'erreur persiste, vérifions d'autres causes.

---

## ✅ Vérification 1 : Le template est-il correctement sauvegardé ?

1. **Retournez dans Supabase** :
   - Authentication > Email Templates > Confirm signup

2. **Vérifiez le contenu actuel** :
   - Le Body contient-il `{{ .ConfirmationURL }}` (avec espaces) ?
   - Y a-t-il des caractères bizarres ou des erreurs de syntaxe ?

3. **Si le template n'est pas correct** :
   - Supprimez TOUT le contenu
   - Copiez-collez exactement ceci :

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

4. **Cliquez sur Save** et attendez la confirmation

---

## ✅ Vérification 2 : Configuration de l'URL du site

L'URL du site doit être correctement configurée dans Supabase.

1. **Dans Supabase** :
   - Settings (icône engrenage en bas à gauche)
   - Authentication
   - Cherchez "Site URL" ou "URL Configuration"

2. **Vérifiez l'URL** :
   - Pour le développement local : `http://localhost:3000`
   - Pour la production : votre URL de production (ex: `https://votre-site.com`)

3. **Si l'URL est incorrecte** :
   - Modifiez-la pour correspondre à votre environnement
   - Sauvegardez

4. **Vérifiez aussi "Redirect URLs"** :
   - Ajoutez votre URL si elle n'y est pas
   - Format : `http://localhost:3000/**` (pour le dev)
   - Format : `https://votre-site.com/**` (pour la prod)

---

## ✅ Vérification 3 : Configuration SMTP

Si vous utilisez un SMTP personnalisé, vérifiez la configuration.

1. **Dans Supabase** :
   - Settings > Authentication
   - Cherchez "SMTP Settings" ou "Email Settings"

2. **Si vous utilisez le SMTP par défaut de Supabase** :
   - Normalement, ça devrait fonctionner sans configuration
   - Vérifiez qu'il n'y a pas d'erreur affichée

3. **Si vous utilisez un SMTP personnalisé** :
   - Vérifiez que tous les paramètres sont corrects :
     - Host (ex: smtp.gmail.com)
     - Port (généralement 587 pour TLS ou 465 pour SSL)
     - Username
     - Password
     - From email (doit être une adresse valide)

4. **Testez le SMTP** :
   - Certaines interfaces ont un bouton "Test SMTP"
   - Utilisez-le pour vérifier que l'envoi fonctionne

---

## ✅ Vérification 4 : Vérifier les logs Supabase

Les logs vous donneront l'erreur exacte.

1. **Dans Supabase** :
   - Logs (menu de gauche, icône journal 📋)

2. **Filtrez les logs** :
   - Sélectionnez "Auth" ou "Authentication"
   - Ou cherchez "email" dans les logs

3. **Cherchez les erreurs récentes** :
   - Regardez les logs au moment où vous essayez de vous inscrire
   - Notez le message d'erreur exact

4. **Erreurs communes** :
   - `SMTP connection failed` → Problème SMTP
   - `Invalid template variable` → Problème dans le template
   - `Site URL not configured` → Problème d'URL
   - `Rate limit exceeded` → Trop de tentatives

---

## ✅ Vérification 5 : Désactiver temporairement la confirmation par email

Pour tester si le problème vient vraiment de l'email ou d'autre chose :

1. **Dans Supabase** :
   - Authentication > Settings (ou Policies)
   - Cherchez "Enable email confirmations" ou "Require email confirmation"

2. **Désactivez temporairement** :
   - Décochez "Enable email confirmations"
   - Sauvegardez

3. **Testez l'inscription** :
   - Créez un compte
   - Si ça fonctionne, le problème vient bien de l'email
   - Si ça ne fonctionne toujours pas, le problème est ailleurs

4. **Réactivez après le test** :
   - Remettez "Enable email confirmations"
   - On va corriger le problème d'email

---

## ✅ Vérification 6 : Vérifier d'autres templates

Parfois, d'autres templates peuvent causer des problèmes.

1. **Dans Email Templates**, vérifiez aussi :
   - "Magic Link" (si utilisé)
   - "Change Email Address"
   - "Reset Password"

2. **Vérifiez qu'ils contiennent les bonnes variables** :
   - Pas de variables invalides
   - Syntaxe correcte

---

## 🔧 Solutions selon l'erreur dans les logs

### Erreur : "Invalid template variable"
**Solution** :
- Vérifiez que `{{ .ConfirmationURL }}` est écrit avec des espaces
- Supprimez toutes les variables personnalisées qui n'existent pas

### Erreur : "SMTP connection failed"
**Solution** :
- Vérifiez la configuration SMTP
- Si vous utilisez Gmail, vous devez utiliser un "App Password"
- Vérifiez que le port est correct (587 ou 465)

### Erreur : "Site URL not configured"
**Solution** :
- Allez dans Settings > Authentication
- Configurez "Site URL" avec votre URL (localhost:3000 pour le dev)

### Erreur : "Rate limit exceeded"
**Solution** :
- Attendez quelques minutes
- Réessayez

---

## 🧪 Test complet étape par étape

1. **Vérifiez le template** :
   - [ ] Le Body contient `{{ .ConfirmationURL }}` (avec espaces)
   - [ ] Le template est sauvegardé
   - [ ] Pas d'erreurs de syntaxe HTML

2. **Vérifiez la configuration** :
   - [ ] Site URL est configurée
   - [ ] Redirect URLs contient votre URL
   - [ ] SMTP est configuré (ou utilise le défaut)

3. **Vérifiez les logs** :
   - [ ] Vous avez regardé les logs Supabase
   - [ ] Vous avez noté l'erreur exacte

4. **Testez** :
   - [ ] Essayez avec un nouvel email (pas un email déjà utilisé)
   - [ ] Vérifiez les spams
   - [ ] Attendez 2-3 minutes

---

## 📝 Template de test minimal

Si rien ne fonctionne, essayez ce template minimal :

**Subject :**
```
Confirm
```

**Body :**
```
{{ .ConfirmationURL }}
```

C'est le plus simple possible. Si ça ne fonctionne pas, le problème n'est pas dans le template.

---

## 🆘 Si rien ne fonctionne

Si après toutes ces vérifications, ça ne fonctionne toujours pas :

1. **Notez exactement** :
   - Le message d'erreur dans les logs Supabase
   - Le contenu actuel de votre template
   - Votre configuration SMTP (si personnalisée)
   - Votre Site URL

2. **Vérifiez la version de Supabase** :
   - Certaines versions ont des bugs connus
   - Vérifiez les mises à jour disponibles

3. **Contactez le support Supabase** :
   - Avec toutes les informations ci-dessus
   - Ils pourront vous aider plus précisément

---

## 💡 Solution alternative : Désactiver la confirmation par email

Si vous avez besoin que l'application fonctionne immédiatement :

1. **Désactivez la confirmation par email** :
   - Authentication > Settings
   - Décochez "Enable email confirmations"

2. **Les utilisateurs pourront se connecter directement** après inscription

3. **⚠️ Attention** : Cela réduit la sécurité. Réactivez dès que possible.

---

## ✅ Checklist finale

- [ ] Template contient `{{ .ConfirmationURL }}` (avec espaces)
- [ ] Template est sauvegardé
- [ ] Site URL est configurée
- [ ] Redirect URLs contient votre URL
- [ ] SMTP est configuré correctement (ou utilise le défaut)
- [ ] J'ai vérifié les logs Supabase
- [ ] J'ai noté l'erreur exacte
- [ ] J'ai testé avec un nouvel email
- [ ] J'ai vérifié les spams

