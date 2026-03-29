# 📧 Guide pas à pas : Réinitialiser le template d'email Supabase

## 🎯 Objectif
Réinitialiser le template d'email de confirmation "Confirm signup" à sa valeur par défaut pour corriger l'erreur "Error sending confirmation email".

---

## 📋 Étape 1 : Accéder au dashboard Supabase

1. **Ouvrez votre navigateur** (Chrome, Firefox, Safari, etc.)

2. **Allez sur le site Supabase** :
   - Tapez dans la barre d'adresse : `https://app.supabase.com`
   - Ou cliquez sur ce lien : [https://app.supabase.com](https://app.supabase.com)

3. **Connectez-vous** si nécessaire :
   - Entrez votre email et mot de passe
   - Cliquez sur "Sign in"

4. **Sélectionnez votre projet** :
   - Vous verrez la liste de vos projets Supabase
   - Cliquez sur le projet **"tonmatos"** (ou le nom de votre projet)
   - ⚠️ **Votre projet** : `bhuoyearxjeucjpygrhh` (visible dans votre `.env.local`)

---

## 📋 Étape 2 : Accéder aux templates d'email

Une fois dans votre projet :

1. **Regardez le menu de gauche** (barre latérale)
   - Vous verrez plusieurs icônes et options

2. **Trouvez l'option "Authentication"** :
   - C'est une icône qui ressemble à un cadenas 🔒 ou un utilisateur 👤
   - Elle peut aussi être écrite en texte : **"Authentication"**
   - Si vous ne la voyez pas, cherchez dans le menu déroulant ou utilisez la recherche

3. **Cliquez sur "Authentication"**

4. **Dans le sous-menu qui s'affiche**, cherchez :
   - **"Email Templates"** ou **"Templates"** ou **"Email"**
   - Cliquez dessus

   💡 **Astuce** : Le chemin complet est généralement :
   ```
   Authentication > Email Templates
   ```
   ou
   ```
   Authentication > Settings > Email Templates
   ```

---

## 📋 Étape 3 : Trouver le template "Confirm signup"

Une fois dans la section "Email Templates", vous verrez une liste de templates :

1. **Cherchez le template "Confirm signup"** :
   - Il peut s'appeler :
     - **"Confirm signup"** (en anglais)
     - **"Confirmation d'inscription"** (en français)
     - **"Signup confirmation"**
     - **"Confirm email"**

2. **Cliquez sur ce template** pour l'ouvrir

   📝 **Vous devriez voir** :
   - Un champ "Subject" (Sujet)
   - Un champ "Body" (Corps) avec un éditeur HTML/text
   - Un bouton "Reset to default" ou "Réinitialiser par défaut"

---

## 📋 Étape 4 : Réinitialiser le template

1. **Trouvez le bouton "Reset to default"** :
   - Il peut être en haut à droite
   - Ou en bas du formulaire
   - Ou dans un menu "..." (trois points)
   - Le texte peut être :
     - **"Reset to default"** (anglais)
     - **"Réinitialiser par défaut"** (français)
     - **"Restore default"**
     - **"Reset"**

2. **Cliquez sur ce bouton**

3. **Confirmez l'action** si une popup apparaît :
   - Cliquez sur "Confirm" ou "Oui" ou "OK"
   - ⚠️ Cela va écraser votre template personnalisé

4. **Attendez quelques secondes** :
   - Le template devrait se réinitialiser automatiquement
   - Vous verrez peut-être un message de confirmation

---

## 📋 Étape 5 : Vérifier que le template est correct

Après la réinitialisation, vérifiez que le template contient les bonnes valeurs :

### ✅ Vérification du Sujet (Subject)

Le sujet doit être :
```
Confirm your signup
```
ou similaire (peut varier selon la langue)

### ✅ Vérification du Corps (Body)

Le corps doit contenir **obligatoirement** cette variable :
```
{{ .ConfirmationURL }}
```

**Exemple de template correct** :
```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

⚠️ **Important** :
- La variable doit être écrite exactement comme ça : `{{ .ConfirmationURL }}`
- Avec des **espaces** autour du point : `{{ .ConfirmationURL }}`
- **PAS** comme ça : `{{.ConfirmationURL}}` (sans espaces)

### ✅ Si le template n'est pas correct

Si après le reset, le template ne contient pas `{{ .ConfirmationURL }}` :

1. **Copiez-collez ce template manuellement** dans le champ "Body" :

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

2. **Cliquez sur "Save"** ou "Enregistrer"

---

## 📋 Étape 6 : Tester l'inscription

Maintenant que le template est réinitialisé, testez si l'inscription fonctionne :

1. **Retournez sur votre application** :
   - Ouvrez votre site (localhost ou votre URL de production)
   - Allez sur la page d'inscription : `/auth/register`

2. **Créez un compte de test** :
   - Utilisez un email valide (vous devez pouvoir recevoir l'email)
   - Entrez un mot de passe
   - Remplissez les autres champs requis
   - Cliquez sur "Créer mon compte"

3. **Vérifiez votre boîte email** :
   - Allez dans votre boîte de réception
   - Cherchez un email de Supabase
   - L'email devrait arriver dans les 1-2 minutes

4. **Si l'email arrive** :
   - ✅ **Succès !** Le problème est résolu
   - Cliquez sur le lien de confirmation dans l'email
   - Vérifiez que vous pouvez vous connecter

5. **Si l'email n'arrive pas** :
   - Vérifiez les spams/courrier indésirable
   - Attendez 2-3 minutes
   - Vérifiez les logs Supabase (étape suivante)

---

## 📋 Étape 7 : Vérifier les logs (si problème persiste)

Si l'inscription ne fonctionne toujours pas :

1. **Dans Supabase**, allez dans **"Logs"** (menu de gauche)
   - Icône qui ressemble à un journal 📋 ou "Logs"

2. **Filtrez par "Auth"** ou "Authentication"

3. **Cherchez les erreurs récentes** :
   - Regardez les messages d'erreur
   - Notez les codes d'erreur

4. **Si vous voyez des erreurs SMTP** :
   - Le problème peut venir de la configuration SMTP
   - Vérifiez dans **Settings > Auth > SMTP Settings**

---

## 🔍 Dépannage

### ❌ Je ne trouve pas "Authentication" dans le menu

**Solution** :
- Utilisez la barre de recherche en haut du dashboard
- Tapez "Authentication" ou "Email Templates"
- Ou cherchez "Settings" puis "Auth"

### ❌ Je ne vois pas "Email Templates"

**Solution** :
- Le chemin peut être : **Authentication > Settings > Email Templates**
- Ou : **Settings > Authentication > Email Templates**
- Cherchez dans les sous-menus

### ❌ Le bouton "Reset to default" n'existe pas

**Solution** :
- Vérifiez que vous êtes bien sur le template "Confirm signup"
- Essayez de cliquer sur le template pour l'éditer
- Le bouton peut être dans un menu "..." (trois points)
- Ou copiez-collez manuellement le template par défaut (voir étape 5)

### ❌ Après le reset, l'inscription ne fonctionne toujours pas

**Vérifications** :
1. ✅ Le template contient bien `{{ .ConfirmationURL }}` (avec espaces)
2. ✅ Vous avez sauvegardé le template (bouton "Save")
3. ✅ Vérifiez les logs Supabase pour voir l'erreur exacte
4. ✅ Testez avec un nouvel email (pas un email déjà utilisé)

### ❌ Je reçois toujours "Error sending confirmation email"

**Solutions** :
1. **Vérifiez la configuration SMTP** :
   - Settings > Auth > SMTP Settings
   - Si vous utilisez un SMTP personnalisé, vérifiez les paramètres

2. **Vérifiez l'URL du site** :
   - Settings > Auth > URL Configuration
   - L'URL "Site URL" doit être correcte

3. **Contactez le support Supabase** si le problème persiste

---

## ✅ Checklist finale

Avant de fermer ce guide, vérifiez que :

- [ ] J'ai accédé au dashboard Supabase
- [ ] J'ai trouvé "Authentication > Email Templates"
- [ ] J'ai cliqué sur "Reset to default" pour "Confirm signup"
- [ ] Le template contient `{{ .ConfirmationURL }}` (avec espaces)
- [ ] J'ai testé l'inscription avec un nouvel email
- [ ] L'email de confirmation arrive bien
- [ ] Je peux me connecter après confirmation

---

## 🎉 Félicitations !

Si tout fonctionne, votre problème est résolu ! L'inscription devrait maintenant fonctionner correctement.

Si vous avez encore des problèmes, consultez le fichier `FIX_EMAIL_CONFIRMATION.md` pour plus de détails techniques.

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué à une étape :
1. Notez à quelle étape vous êtes
2. Notez le message d'erreur exact (s'il y en a un)
3. Vérifiez les logs Supabase (Étape 7)

