# 🔧 Solution : Template fonctionne en preview mais erreur à l'envoi

## Problème
Le template d'email s'affiche correctement dans le preview Supabase, mais l'inscription échoue avec l'erreur "Error sending confirmation email".

## Cause
Si le preview fonctionne, cela signifie que :
- ✅ Le template est syntaxiquement correct
- ✅ Les variables `{{ .ConfirmationURL }}` sont bien formatées
- ❌ Mais Supabase ne peut **pas envoyer** l'email (problème SMTP ou configuration)

## Solutions (par ordre de priorité)

### ✅ Solution 1 : Désactiver temporairement la confirmation par email

**C'est la solution la plus rapide pour débloquer l'inscription.**

1. Allez sur [Dashboard Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. **Authentication** (menu gauche)
4. **Settings** (ou **Configuration**)
5. Cherchez **"Enable email confirmations"** (Activer les confirmations par email)
6. **Décochez** cette option
7. **Sauvegardez**

➡️ Maintenant, les utilisateurs pourront s'inscrire **sans** avoir besoin de confirmer leur email.

⚠️ **Note** : Réactivez cette option une fois que vous avez configuré SMTP correctement.

---

### ✅ Solution 2 : Configurer SMTP dans Supabase

Si vous voulez garder la confirmation par email activée :

1. **Dashboard Supabase** > **Settings** (icône engrenage)
2. **Auth** > **SMTP Settings**
3. Configurez votre serveur SMTP :
   - **Host** : ex: `smtp.gmail.com` ou `smtp.resend.com`
   - **Port** : `587` (TLS) ou `465` (SSL)
   - **Username** : votre email SMTP
   - **Password** : votre mot de passe SMTP
   - **Sender email** : email qui envoie (doit correspondre au username)
   - **Sender name** : "BROQUES" (optionnel)

4. **Testez** la configuration avec le bouton "Send test email"
5. **Sauvegardez**

➡️ Si le test email fonctionne, l'inscription devrait aussi fonctionner.

---

### ✅ Solution 3 : Vérifier les logs Supabase

Pour comprendre l'erreur exacte :

1. **Dashboard Supabase** > **Logs** (menu gauche)
2. Filtrez par **"Auth"** ou **"Authentication"**
3. Cherchez les erreurs récentes liées à l'inscription
4. Les logs vous donneront l'erreur exacte (ex: "SMTP connection failed", "Invalid credentials", etc.)

---

### ✅ Solution 4 : Utiliser le template par défaut de Supabase

Si le problème persiste même avec un template simple :

1. **Authentication** > **Email Templates**
2. Sélectionnez **"Confirm signup"**
3. Cliquez sur **"Reset to default"**
4. Testez l'inscription
5. Si ça fonctionne, le problème vient de votre template personnalisé
6. Recréez votre template en partant du template par défaut

---

### ✅ Solution 5 : Vérifier la configuration Site URL

L'URL de redirection doit être correcte :

1. **Settings** > **Auth** > **URL Configuration**
2. Vérifiez **"Site URL"** :
   - Dev local : `http://localhost:3000`
   - Production : `https://votre-domaine.com`
3. Vérifiez **"Redirect URLs"** :
   - Ajoutez toutes les URLs autorisées (localhost, production, etc.)
4. **Sauvegardez**

---

## 🔍 Diagnostic avec le code amélioré

Le code a été amélioré pour mieux diagnostiquer les erreurs. Regardez la console du navigateur (F12) lors de l'inscription pour voir :

- L'erreur exacte retournée par Supabase
- Si le compte a été créé malgré l'erreur
- Les détails complets de l'erreur

Ces informations vous aideront à comprendre pourquoi l'envoi d'email échoue.

---

## 📝 Résumé rapide

**Pour débloquer immédiatement :**
→ Désactivez "Enable email confirmations" dans Supabase

**Pour une solution durable :**
→ Configurez SMTP correctement dans Settings > Auth > SMTP Settings

**Pour comprendre l'erreur :**
→ Consultez les logs Supabase (Logs > Auth)

---

## 💡 Pourquoi le preview fonctionne mais pas l'envoi ?

Le preview teste uniquement le **rendu du template** (HTML/CSS/variables), mais pas l'**envoi réel** de l'email. Si le preview fonctionne, le template est correct, mais Supabase a un problème pour **envoyer** l'email via SMTP.

