# 📧 Guide : Modifier manuellement le template d'email Supabase

## 🎯 Situation
Il n'y a pas de bouton "Reset to default" dans votre interface Supabase. Pas de problème, on va modifier le template manuellement !

---

## 📋 Étape 1 : Accéder au template

1. **Dans Supabase Dashboard** :
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet
   - **Authentication** (menu de gauche)
   - **Email Templates** (ou **Templates**)

2. **Trouvez et cliquez sur le template "Confirm signup"** :
   - Il peut s'appeler "Confirm signup", "Confirmation d'inscription", ou "Signup confirmation"
   - Cliquez dessus pour l'éditer

---

## 📋 Étape 2 : Modifier le Sujet (Subject)

1. **Trouvez le champ "Subject"** (Sujet de l'email)

2. **Remplacez tout le contenu** par :
   ```
   Confirm your signup
   ```

3. **Ou en français** (si vous préférez) :
   ```
   Confirmez votre inscription
   ```

---

## 📋 Étape 3 : Modifier le Corps (Body) - ⚠️ IMPORTANT

1. **Trouvez le champ "Body"** (Corps de l'email)
   - Il peut être un éditeur HTML ou texte
   - Il peut avoir des onglets "HTML" et "Text"

2. **Supprimez TOUT le contenu actuel** du champ Body

3. **Copiez-collez EXACTEMENT ce contenu** :

### Version HTML (recommandée)

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

### Version française (si vous préférez)

```html
<h2>Confirmez votre inscription</h2>

<p>Cliquez sur ce lien pour confirmer votre compte :</p>
<p><a href="{{ .ConfirmationURL }}">Confirmer mon email</a></p>
```

### Version texte simple (si pas d'éditeur HTML)

```
Confirm your signup

Follow this link to confirm your user:

{{ .ConfirmationURL }}
```

---

## ⚠️ POINT CRITIQUE : La variable {{ .ConfirmationURL }}

**C'est la partie la plus importante !**

La variable doit être écrite **EXACTEMENT** comme ça :
```
{{ .ConfirmationURL }}
```

### ✅ CORRECT :
- `{{ .ConfirmationURL }}` ← Avec espaces autour du point
- `{{ .ConfirmationURL }}` ← Dans un lien HTML

### ❌ INCORRECT :
- `{{.ConfirmationURL}}` ← Sans espaces
- `{{ ConfirmationURL }}` ← Sans le point
- `{{.ConfirmationURL }}` ← Espace seulement après
- `{{ .ConfirmationURL}}` ← Espace seulement avant

---

## 📋 Étape 4 : Vérifier avant de sauvegarder

Avant de cliquer sur "Save", vérifiez que :

1. ✅ Le **Subject** contient : `Confirm your signup` (ou votre texte)
2. ✅ Le **Body** contient **obligatoirement** : `{{ .ConfirmationURL }}`
3. ✅ La variable a des **espaces** autour du point : `{{ .ConfirmationURL }}`
4. ✅ Vous avez **supprimé** tout l'ancien contenu problématique

---

## 📋 Étape 5 : Sauvegarder

1. **Cliquez sur le bouton "Save"** (ou "Enregistrer", "Update", etc.)
   - Il est généralement en bas à droite ou en haut à droite

2. **Attendez la confirmation** :
   - Vous devriez voir un message "Saved" ou "Template updated"
   - Ou une coche verte ✅

3. **Fermez l'éditeur** si nécessaire

---

## 📋 Étape 6 : Tester

1. **Retournez sur votre application** :
   - Ouvrez votre site
   - Allez sur `/auth/register`

2. **Créez un compte de test** :
   - Utilisez un email valide (vous devez pouvoir recevoir l'email)
   - Remplissez tous les champs
   - Cliquez sur "Créer mon compte"

3. **Vérifiez votre boîte email** :
   - L'email devrait arriver dans 1-2 minutes
   - Si ça ne fonctionne pas, vérifiez les spams

---

## 🔍 Si ça ne fonctionne toujours pas

### Vérification 1 : La variable est-elle correcte ?

Ouvrez à nouveau le template et vérifiez que vous voyez exactement :
```
{{ .ConfirmationURL }}
```

### Vérification 2 : Y a-t-il d'autres variables problématiques ?

Assurez-vous qu'il n'y a **PAS** de variables comme :
- `{{ .Token }}` seule (sans l'URL)
- `{{ .Email }}` dans un contexte incorrect
- Des variables personnalisées qui n'existent pas

### Vérification 3 : Le HTML est-il valide ?

Si vous utilisez HTML, assurez-vous que :
- Toutes les balises sont fermées : `<h2>...</h2>`, `<p>...</p>`
- Pas de caractères spéciaux qui cassent le HTML
- Le lien contient bien `{{ .ConfirmationURL }}`

### Vérification 4 : Vérifier les logs Supabase

1. Dans Supabase, allez dans **"Logs"** (menu de gauche)
2. Filtrez par **"Auth"** ou **"Authentication"**
3. Cherchez les erreurs récentes lors de l'inscription
4. Notez le message d'erreur exact

---

## 📝 Template complet de référence

Voici un template complet qui fonctionne à coup sûr :

**Subject :**
```
Confirm your signup
```

**Body (HTML) :**
```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>

<p>If you didn't sign up, you can safely ignore this email.</p>
```

**Body (Text) :**
```
Confirm your signup

Follow this link to confirm your user:

{{ .ConfirmationURL }}

If you didn't sign up, you can safely ignore this email.
```

---

## ✅ Checklist finale

Avant de tester, vérifiez que :

- [ ] J'ai supprimé tout l'ancien contenu du template
- [ ] Le Subject contient "Confirm your signup" (ou équivalent)
- [ ] Le Body contient `{{ .ConfirmationURL }}` (avec espaces autour du point)
- [ ] J'ai cliqué sur "Save" et j'ai vu une confirmation
- [ ] Je suis prêt à tester avec un nouvel email

---

## 🎉 C'est fait !

Une fois le template modifié et sauvegardé, testez l'inscription. Si l'email arrive, le problème est résolu !

Si vous avez encore des problèmes, dites-moi exactement :
1. Quel message d'erreur vous voyez
2. Ce que contient votre template actuel (copiez-collez le contenu)
3. Ce que vous voyez dans les logs Supabase

