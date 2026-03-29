# 🚨 Actions immédiates : Résoudre "Error sending confirmation email"

## ⚡ Solution rapide : Désactiver temporairement la confirmation par email

Pour que votre application fonctionne **MAINTENANT** pendant qu'on corrige le problème d'email :

### Étape 1 : Désactiver la confirmation par email

1. **Dans Supabase Dashboard** :
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet
   - **Settings** (icône engrenage en bas à gauche)
   - **Authentication** (dans le menu Settings)

2. **Trouvez "Enable email confirmations"** :
   - C'est une case à cocher
   - Elle peut être dans "Email Auth" ou "User Management"

3. **Décochez cette case** :
   - Cliquez pour désactiver
   - Sauvegardez (bouton "Save" en bas)

4. **Testez l'inscription** :
   - Retournez sur votre application
   - Créez un compte
   - ✅ Ça devrait fonctionner maintenant !

### ⚠️ Important
- C'est une solution **temporaire**
- Les utilisateurs pourront se connecter sans confirmer leur email
- **Réactivez la confirmation** dès que le problème d'email est résolu

---

## 🔍 Diagnostic : Trouver la cause exacte

Pendant que l'application fonctionne, diagnostiquons le problème :

### 1. Vérifier les logs Supabase

1. **Dans Supabase** :
   - **Logs** (menu de gauche)
   - Filtrez par **"Auth"** ou **"Authentication"**

2. **Cherchez les erreurs récentes** :
   - Regardez les logs au moment où vous essayiez de vous inscrire
   - **Copiez le message d'erreur exact**

3. **Erreurs communes** :
   - `SMTP connection failed` → Problème de configuration SMTP
   - `Invalid template variable` → Problème dans le template
   - `Site URL not configured` → URL du site manquante
   - `Rate limit exceeded` → Trop de tentatives

### 2. Vérifier le template (même si désactivé)

1. **Authentication > Email Templates > Confirm signup**

2. **Vérifiez que le Body contient** :
   ```
   {{ .ConfirmationURL }}
   ```
   - Avec des **espaces** autour du point
   - Pas `{{.ConfirmationURL}}` (sans espaces)

3. **Si ce n'est pas correct, copiez-collez ceci** :
   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your user:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
   ```

4. **Sauvegardez**

### 3. Vérifier la configuration Site URL

1. **Settings > Authentication**

2. **Trouvez "Site URL"** :
   - Pour le développement : `http://localhost:3000`
   - Pour la production : votre URL (ex: `https://votre-site.com`)

3. **Vérifiez "Redirect URLs"** :
   - Doit contenir : `http://localhost:3000/**` (pour le dev)
   - Ou : `https://votre-site.com/**` (pour la prod)

---

## 🔧 Solutions selon l'erreur

### Si l'erreur est "SMTP connection failed"

**Solution** :
1. **Settings > Authentication > SMTP Settings**
2. Si vous utilisez un SMTP personnalisé :
   - Vérifiez host, port, username, password
   - Testez la connexion
3. Si vous utilisez le SMTP par défaut de Supabase :
   - Vérifiez qu'il n'y a pas d'erreur affichée
   - Contactez le support Supabase si nécessaire

### Si l'erreur est "Invalid template variable"

**Solution** :
1. Vérifiez que `{{ .ConfirmationURL }}` est écrit avec des espaces
2. Supprimez toutes les variables personnalisées
3. Utilisez le template minimal (voir ci-dessous)

### Si l'erreur est "Site URL not configured"

**Solution** :
1. **Settings > Authentication**
2. Configurez "Site URL" avec votre URL
3. Ajoutez votre URL dans "Redirect URLs"

---

## 📝 Template minimal de test

Si rien ne fonctionne, essayez ce template ultra-simple :

**Subject :**
```
Confirm
```

**Body :**
```
{{ .ConfirmationURL }}
```

Si même ça ne fonctionne pas, le problème n'est **PAS** dans le template.

---

## ✅ Checklist de vérification

Avant de réactiver la confirmation par email :

- [ ] J'ai vérifié les logs Supabase et noté l'erreur exacte
- [ ] Le template contient `{{ .ConfirmationURL }}` (avec espaces)
- [ ] Le template est sauvegardé
- [ ] Site URL est configurée correctement
- [ ] Redirect URLs contient mon URL
- [ ] SMTP est configuré (ou utilise le défaut)
- [ ] J'ai testé avec le template minimal
- [ ] L'erreur dans les logs est claire

---

## 🎯 Prochaines étapes

1. **Maintenant** : Désactivez la confirmation par email (solution rapide)
2. **Ensuite** : Vérifiez les logs pour trouver l'erreur exacte
3. **Puis** : Corrigez le problème selon l'erreur trouvée
4. **Enfin** : Réactivez la confirmation par email

---

## 💡 Astuce

Si vous ne trouvez pas l'erreur exacte dans les logs :
1. Essayez de créer un compte
2. Regardez immédiatement les logs (dans les 10 secondes)
3. L'erreur devrait apparaître en temps réel

---

## 🆘 Besoin d'aide ?

Si vous êtes bloqué, dites-moi :
1. **L'erreur exacte** dans les logs Supabase
2. **Le contenu actuel** de votre template (copiez-collez)
3. **Votre configuration** Site URL et SMTP

Je pourrai vous aider plus précisément !

