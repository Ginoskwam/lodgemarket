# 🔧 Résolution : Erreur SMTP "authentication failed" (535)

## 🎯 Votre erreur exacte
```
"error":"535 5.7.8 Error: authentication failed"
```

**Le problème** : Supabase ne peut pas s'authentifier auprès du serveur SMTP pour envoyer les emails.

**Ce n'est PAS un problème de template** - c'est un problème de configuration SMTP.

---

## ✅ Solution 1 : Vérifier la configuration SMTP dans Supabase

### Étape 1 : Accéder aux paramètres SMTP

1. **Dans Supabase Dashboard** :
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet
   - **Settings** (icône engrenage en bas à gauche)
   - **Authentication** (dans le menu Settings)
   - Cherchez **"SMTP Settings"** ou **"Email Settings"**

### Étape 2 : Vérifier si vous utilisez un SMTP personnalisé

**Si vous avez configuré un SMTP personnalisé** :

1. **Vérifiez tous les paramètres** :
   - **Host** : ex: `smtp.gmail.com`, `smtp.sendgrid.net`, etc.
   - **Port** : généralement `587` (TLS) ou `465` (SSL)
   - **Username** : votre email ou nom d'utilisateur SMTP
   - **Password** : votre mot de passe SMTP
   - **From email** : l'adresse email d'expéditeur

2. **Problèmes courants** :
   - ❌ Mot de passe incorrect
   - ❌ Username incorrect
   - ❌ Port incorrect (587 vs 465)
   - ❌ Host incorrect
   - ❌ Pour Gmail : vous devez utiliser un "App Password" (pas votre mot de passe normal)

### Étape 3 : Si vous utilisez Gmail

**Gmail nécessite un "App Password"** :

1. **Allez sur votre compte Google** :
   - https://myaccount.google.com
   - Sécurité
   - Validation en 2 étapes (doit être activée)

2. **Créez un App Password** :
   - En bas de la page, cherchez "Mots de passe des applications"
   - Créez un nouveau mot de passe pour "Mail"
   - Copiez le mot de passe généré (16 caractères)

3. **Dans Supabase** :
   - Utilisez ce App Password (pas votre mot de passe Gmail normal)
   - Host : `smtp.gmail.com`
   - Port : `587`
   - Username : votre adresse Gmail complète
   - Password : le App Password (16 caractères)

### Étape 4 : Si vous utilisez le SMTP par défaut de Supabase

**Si vous n'avez PAS configuré de SMTP personnalisé** :

1. **Vérifiez qu'il n'y a pas d'erreur affichée** dans les paramètres
2. **Le problème peut venir de Supabase lui-même** :
   - Parfois, le service SMTP par défaut de Supabase a des problèmes
   - Vérifiez le statut de Supabase : https://status.supabase.com

3. **Solution temporaire** :
   - Configurez un SMTP personnalisé (Gmail, SendGrid, etc.)
   - Ou désactivez la confirmation par email temporairement

---

## ✅ Solution 2 : Configurer un SMTP personnalisé (Gmail)

Si le SMTP par défaut de Supabase ne fonctionne pas, configurez Gmail :

### Étape 1 : Créer un App Password Gmail

1. **Allez sur** : https://myaccount.google.com/apppasswords
   - Ou : Google Account > Sécurité > Mots de passe des applications

2. **Sélectionnez** :
   - Application : "Mail"
   - Appareil : "Autre (nom personnalisé)" → tapez "Supabase"

3. **Générez le mot de passe** :
   - Copiez les 16 caractères (ex: `abcd efgh ijkl mnop`)
   - ⚠️ **Notez-le**, vous ne pourrez plus le voir après

### Étape 2 : Configurer dans Supabase

1. **Settings > Authentication > SMTP Settings**

2. **Activez "Enable Custom SMTP"** (ou similaire)

3. **Remplissez les champs** :
   - **Sender email** : `votre-email@gmail.com`
   - **Sender name** : `BROQUES` (ou votre nom)
   - **Host** : `smtp.gmail.com`
   - **Port** : `587`
   - **Username** : `votre-email@gmail.com` (votre adresse Gmail complète)
   - **Password** : Le App Password (16 caractères, sans espaces)
   - **Secure** : Cochez (TLS)

4. **Sauvegardez**

5. **Testez** :
   - Certaines interfaces ont un bouton "Test SMTP"
   - Ou testez en créant un compte

---

## ✅ Solution 3 : Utiliser un autre service SMTP

Si Gmail ne fonctionne pas, essayez :

### Option A : SendGrid (gratuit jusqu'à 100 emails/jour)

1. **Créez un compte** : https://sendgrid.com
2. **Créez une API Key** dans SendGrid
3. **Dans Supabase** :
   - Host : `smtp.sendgrid.net`
   - Port : `587`
   - Username : `apikey`
   - Password : votre API Key SendGrid

### Option B : Resend (gratuit jusqu'à 3000 emails/mois)

1. **Créez un compte** : https://resend.com
2. **Créez une API Key**
3. **Dans Supabase** :
   - Host : `smtp.resend.com`
   - Port : `587`
   - Username : `resend`
   - Password : votre API Key Resend

### Option C : Mailgun

1. **Créez un compte** : https://mailgun.com
2. **Récupérez les credentials SMTP**
3. **Configurez dans Supabase**

---

## ✅ Solution 4 : Désactiver temporairement la confirmation par email

**Solution rapide** pour que l'application fonctionne maintenant :

1. **Settings > Authentication**
2. **Décochez "Enable email confirmations"**
3. **Sauvegardez**

⚠️ **Temporaire uniquement** - réactivez dès que le SMTP est configuré.

---

## 🔍 Vérifications à faire

### Vérification 1 : Les credentials SMTP sont-ils corrects ?

- [ ] Le host est correct (ex: `smtp.gmail.com`)
- [ ] Le port est correct (587 pour TLS, 465 pour SSL)
- [ ] Le username est correct (email complet pour Gmail)
- [ ] Le password est correct (App Password pour Gmail, pas le mot de passe normal)
- [ ] Le "From email" est une adresse valide

### Vérification 2 : Le service SMTP fonctionne-t-il ?

Testez vos credentials SMTP avec un client email (Thunderbird, Mail, etc.) pour vérifier qu'ils fonctionnent.

### Vérification 3 : Y a-t-il des restrictions ?

- Gmail : Vérifiez que "Accès aux applications moins sécurisées" n'est pas nécessaire (utilisez App Password)
- Certains fournisseurs bloquent les connexions SMTP depuis certains serveurs

---

## 📝 Configuration Gmail complète (exemple)

**Dans Supabase SMTP Settings** :

```
Sender email: votre-email@gmail.com
Sender name: BROQUES
Host: smtp.gmail.com
Port: 587
Username: votre-email@gmail.com
Password: xxxx xxxx xxxx xxxx (App Password, 16 caractères)
Secure: ✅ (TLS activé)
```

---

## ✅ Checklist de résolution

- [ ] J'ai vérifié la configuration SMTP dans Supabase
- [ ] Si j'utilise Gmail, j'ai créé un App Password
- [ ] J'ai entré les bonnes credentials (host, port, username, password)
- [ ] J'ai testé la configuration SMTP
- [ ] Si ça ne fonctionne pas, j'ai essayé un autre service (SendGrid, Resend)
- [ ] J'ai désactivé temporairement la confirmation si nécessaire

---

## 🆘 Si rien ne fonctionne

1. **Vérifiez le statut Supabase** : https://status.supabase.com
2. **Contactez le support Supabase** avec l'erreur exacte
3. **Utilisez un service SMTP externe** (SendGrid, Resend) qui est plus fiable

---

## 💡 Astuce

Pour Gmail, si vous avez des problèmes :
- Assurez-vous que la validation en 2 étapes est activée
- Utilisez un App Password (pas votre mot de passe normal)
- Vérifiez que vous n'avez pas de restrictions sur votre compte Google

