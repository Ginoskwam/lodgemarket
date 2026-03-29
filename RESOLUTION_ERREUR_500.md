# 🔧 Résolution : Erreur 500 "Error sending confirmation email"

## 🎯 Votre erreur
```
/signup | 500: Error sending confirmation email
```

C'est une **erreur 500** (erreur serveur), ce qui signifie que Supabase ne peut pas traiter votre template d'email.

---

## ✅ Solution 1 : Vérifier et corriger le template (PRIORITÉ)

L'erreur 500 vient souvent d'un template mal formé.

### Étape 1 : Ouvrir le template

1. **Dans Supabase** :
   - Authentication > Email Templates
   - Cliquez sur **"Confirm signup"**

### Étape 2 : Vérifier le contenu actuel

**Regardez exactement ce qui est dans le champ "Body"** :
- Y a-t-il des caractères bizarres ?
- Y a-t-il des variables mal formatées ?
- Y a-t-il du HTML cassé ?

### Étape 3 : Remplacer par un template minimal

**Supprimez TOUT le contenu actuel** du Body, puis copiez-collez **EXACTEMENT** ceci :

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

### Étape 4 : Vérifier le Subject

Le Subject doit être simple :
```
Confirm your signup
```

### Étape 5 : Sauvegarder et tester

1. **Cliquez sur "Save"**
2. **Attendez la confirmation**
3. **Testez l'inscription** avec un nouvel email

---

## ✅ Solution 2 : Template ultra-minimal (si Solution 1 ne fonctionne pas)

Si l'erreur 500 persiste, essayez ce template **ultra-simple** :

### Subject :
```
Confirm
```

### Body :
```
{{ .ConfirmationURL }}
```

C'est le plus simple possible. Si ça ne fonctionne pas, le problème n'est **PAS** dans le template.

---

## ✅ Solution 3 : Vérifier la configuration SMTP

L'erreur 500 peut aussi venir d'un problème SMTP.

### Étape 1 : Vérifier SMTP Settings

1. **Settings > Authentication**
2. **Cherchez "SMTP Settings"** ou "Email Settings"

### Étape 2 : Si vous utilisez un SMTP personnalisé

Vérifiez que tous les champs sont corrects :
- **Host** : ex: `smtp.gmail.com`
- **Port** : `587` (TLS) ou `465` (SSL)
- **Username** : votre email
- **Password** : votre mot de passe (ou App Password pour Gmail)
- **From email** : doit être une adresse valide

### Étape 3 : Si vous utilisez le SMTP par défaut de Supabase

1. **Vérifiez qu'il n'y a pas d'erreur affichée**
2. **Essayez de désactiver puis réactiver** le SMTP par défaut
3. Si le problème persiste, contactez le support Supabase

---

## ✅ Solution 4 : Vérifier Site URL et Redirect URLs

### Étape 1 : Vérifier Site URL

1. **Settings > Authentication**
2. **Trouvez "Site URL"**
3. **Vérifiez qu'elle est correcte** :
   - Dev : `http://localhost:3000`
   - Prod : votre URL de production

### Étape 2 : Vérifier Redirect URLs

1. **Dans la même section**, trouvez "Redirect URLs"
2. **Ajoutez votre URL** si elle n'y est pas :
   - `http://localhost:3000/**` (pour le dev)
   - `https://votre-site.com/**` (pour la prod)

---

## ✅ Solution 5 : Vérifier les autres templates

Parfois, d'autres templates peuvent causer des problèmes.

1. **Authentication > Email Templates**
2. **Vérifiez tous les templates** :
   - Magic Link
   - Change Email Address
   - Reset Password
3. **Vérifiez qu'ils contiennent les bonnes variables**

---

## 🔍 Diagnostic approfondi

### Vérification 1 : Le template contient-il des variables invalides ?

**Variables VALIDES dans Supabase** :
- `{{ .ConfirmationURL }}` ✅
- `{{ .Email }}` ✅
- `{{ .Token }}` ✅ (mais généralement dans l'URL)
- `{{ .TokenHash }}` ✅

**Variables INVALIDES** (causent erreur 500) :
- `{{ .CustomVariable }}` ❌ (si elle n'existe pas)
- `{{ ConfirmationURL }}` ❌ (sans le point)
- `{{.ConfirmationURL}}` ⚠️ (peut causer des problèmes, utilisez avec espaces)

### Vérification 2 : Y a-t-il des caractères spéciaux ?

Vérifiez que le template ne contient pas :
- Des caractères de contrôle invisibles
- Des caractères Unicode problématiques
- Des balises HTML mal fermées

### Vérification 3 : Le HTML est-il valide ?

Si vous utilisez HTML, vérifiez que :
- Toutes les balises sont fermées : `<h2>...</h2>`, `<p>...</p>`, `<a>...</a>`
- Pas de balises orphelines
- Pas de caractères `<` ou `>` en dehors des balises HTML

---

## 📝 Template de référence qui fonctionne à coup sûr

**Subject :**
```
Confirm your signup
```

**Body (HTML) :**
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

**Body (Text) :**
```
Confirm your signup

Follow this link to confirm your user:

{{ .ConfirmationURL }}
```

---

## 🧪 Test étape par étape

1. **Remplacez le template** par le template minimal ci-dessus
2. **Sauvegardez**
3. **Attendez 30 secondes** (pour que les changements soient pris en compte)
4. **Testez l'inscription** avec un **nouvel email** (pas un email déjà utilisé)
5. **Vérifiez les logs** à nouveau

---

## ✅ Checklist de vérification

Avant de tester, vérifiez que :

- [ ] J'ai supprimé TOUT l'ancien contenu du template
- [ ] Le Body contient `{{ .ConfirmationURL }}` (avec espaces autour du point)
- [ ] Le Subject est simple : "Confirm your signup"
- [ ] J'ai cliqué sur "Save" et j'ai vu une confirmation
- [ ] J'ai attendu 30 secondes après la sauvegarde
- [ ] Site URL est configurée correctement
- [ ] Redirect URLs contient mon URL
- [ ] SMTP est configuré (ou utilise le défaut)

---

## 🆘 Si l'erreur 500 persiste

Si même avec le template minimal l'erreur 500 persiste :

1. **Vérifiez les logs Supabase** pour plus de détails :
   - Parfois il y a un message d'erreur plus détaillé
   - Cherchez les logs juste après votre tentative d'inscription

2. **Contactez le support Supabase** :
   - Avec le message d'erreur exact
   - Le contenu de votre template
   - Votre configuration SMTP

3. **Solution temporaire** :
   - Désactivez la confirmation par email (Settings > Authentication > Enable email confirmations)
   - Les utilisateurs pourront se connecter directement
   - Réactivez dès que le problème est résolu

---

## 💡 Astuce : Copier-coller depuis un éditeur de texte

Parfois, copier-coller depuis le navigateur peut introduire des caractères invisibles.

**Solution** :
1. Ouvrez un éditeur de texte simple (TextEdit, Notepad, etc.)
2. Copiez le template depuis ce guide
3. Collez-le dans l'éditeur de texte
4. Copiez depuis l'éditeur de texte
5. Collez dans Supabase

Cela évite les caractères invisibles qui peuvent causer l'erreur 500.

