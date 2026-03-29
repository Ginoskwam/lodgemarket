# 🔧 Solution : Problème avec le SMTP par défaut de Supabase

## 🎯 Votre situation
- Vous utilisez le SMTP par défaut de Supabase (pas de SMTP personnalisé)
- Erreur : `535 5.7.8 Error: authentication failed`
- Les emails ne sont plus envoyés

## 🔍 Causes possibles

1. **Problème temporaire avec le service SMTP de Supabase**
2. **Limitation du plan gratuit** (certains plans ont des limites)
3. **Problème de configuration du projet**

---

## ✅ Solution 1 : Vérifier le statut de Supabase (2 minutes)

1. **Allez sur** : https://status.supabase.com
2. **Vérifiez s'il y a des incidents** concernant :
   - Email service
   - SMTP
   - Authentication

3. **Si c'est un problème Supabase** :
   - Attendez que Supabase résolve le problème
   - Ou passez à la Solution 2 (SMTP personnalisé)

---

## ✅ Solution 2 : Configurer un SMTP personnalisé Gmail (10 minutes) - RECOMMANDÉ

C'est la solution la plus fiable. Gmail est gratuit et fonctionne bien.

### Étape 1 : Créer un App Password Gmail

1. **Allez sur votre compte Google** :
   - https://myaccount.google.com
   - Ou directement : https://myaccount.google.com/apppasswords

2. **Assurez-vous que la validation en 2 étapes est activée** :
   - Si ce n'est pas le cas, activez-la d'abord
   - Google > Sécurité > Validation en 2 étapes

3. **Créez un App Password** :
   - Allez sur : https://myaccount.google.com/apppasswords
   - Sélectionnez :
     - **Application** : "Mail"
     - **Appareil** : "Autre (nom personnalisé)"
     - Tapez : "Supabase"
   - Cliquez sur "Générer"

4. **Copiez le mot de passe** :
   - Vous verrez 16 caractères (ex: `abcd efgh ijkl mnop`)
   - ⚠️ **Notez-le immédiatement**, vous ne pourrez plus le voir après
   - Supprimez les espaces : `abcdefghijklmnop`

### Étape 2 : Configurer dans Supabase

1. **Dans Supabase Dashboard** :
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet
   - **Settings** (icône engrenage en bas à gauche)
   - **Authentication** (dans le menu Settings)

2. **Trouvez "SMTP Settings"** ou "Email Settings" :
   - Cherchez une section "SMTP" ou "Custom SMTP"
   - Il peut y avoir un bouton "Enable Custom SMTP" ou "Configure SMTP"

3. **Activez le SMTP personnalisé** :
   - Cliquez sur "Enable Custom SMTP" ou similaire
   - Ou remplissez directement les champs si disponibles

4. **Remplissez les champs** :
   - **Sender email** : `votre-email@gmail.com` (votre adresse Gmail)
   - **Sender name** : `BROQUES` (ou le nom que vous voulez)
   - **Host** : `smtp.gmail.com`
   - **Port** : `587`
   - **Username** : `votre-email@gmail.com` (votre adresse Gmail complète)
   - **Password** : Le App Password que vous avez créé (16 caractères, sans espaces)
   - **Secure** ou **TLS** : ✅ Cochez cette case

5. **Sauvegardez** :
   - Cliquez sur "Save" ou "Update"
   - Attendez la confirmation

6. **Testez** :
   - Si il y a un bouton "Test SMTP", utilisez-le
   - Sinon, testez en créant un compte

### ✅ Vérification

Après configuration, testez :
1. Créez un compte de test sur votre application
2. Vérifiez que l'email de confirmation arrive
3. Si ça fonctionne, le problème est résolu !

---

## ✅ Solution 3 : Utiliser un autre service SMTP (alternatives)

Si vous ne voulez pas utiliser Gmail :

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

---

## ✅ Solution 4 : Désactiver temporairement la confirmation (solution rapide)

**Pour que l'application fonctionne MAINTENANT** :

1. **Dans Supabase** :
   - Settings > Authentication
   - Cherchez "Enable email confirmations" ou "Require email confirmation"
   - **Décochez cette case**
   - Sauvegardez

2. **Testez** :
   - Créez un compte
   - ✅ Ça devrait fonctionner immédiatement !

⚠️ **Important** : C'est temporaire. Les utilisateurs pourront se connecter sans confirmer leur email. Réactivez dès que vous avez configuré un SMTP personnalisé.

---

## 📋 Checklist : Quelle solution choisir ?

- [ ] **Solution 1** : Vérifier le statut Supabase (si c'est temporaire, attendez)
- [ ] **Solution 2** : Configurer Gmail SMTP (recommandé, 10 minutes)
- [ ] **Solution 3** : Utiliser SendGrid ou Resend (si vous préférez)
- [ ] **Solution 4** : Désactiver temporairement (pour que ça fonctionne maintenant)

---

## 🎯 Recommandation

**Je recommande la Solution 2 (Gmail)** car :
- ✅ C'est gratuit
- ✅ C'est fiable
- ✅ Ça prend 10 minutes
- ✅ Vous contrôlez votre propre SMTP

**En attendant**, vous pouvez utiliser la Solution 4 pour que l'application fonctionne immédiatement.

---

## 💡 Astuce : Utiliser un email dédié

Si vous avez un domaine (ex: `tonmatos.com`), vous pouvez :
1. Créer un email : `noreply@tonmatos.com` (ou `contact@tonmatos.com`)
2. Configurer ce email avec Gmail ou un autre service
3. L'utiliser comme "Sender email" dans Supabase

Cela donne un aspect plus professionnel aux emails.

---

## 🆘 Si vous avez des problèmes avec Gmail

1. **Assurez-vous que la validation en 2 étapes est activée**
2. **Utilisez un App Password** (pas votre mot de passe normal)
3. **Vérifiez que vous avez supprimé les espaces** du App Password
4. **Le username doit être votre email Gmail complet** (avec @gmail.com)

---

## ✅ Après configuration

Une fois le SMTP configuré :
1. Testez l'inscription
2. Vérifiez que l'email arrive
3. Si ça fonctionne, vous pouvez réactiver "Enable email confirmations" si vous l'avez désactivée

---

## 📝 Résumé rapide

**Pour résoudre maintenant** :
1. Désactivez temporairement "Enable email confirmations" (Solution 4)
2. Configurez Gmail SMTP (Solution 2)
3. Réactivez "Enable email confirmations"
4. Testez

**Temps total** : ~15 minutes

