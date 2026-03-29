# Configuration du Nom de Domaine OVH avec Vercel

Guide étape par étape pour configurer votre domaine OVH avec votre site Vercel.

## 📋 Prérequis

- ✅ Domaine acheté sur OVH
- ✅ Site déjà déployé sur Vercel
- ✅ Accès à votre compte OVH

---

## 🚀 Étape 1 : Ajouter le domaine dans Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Ouvrez votre projet **tonmatos**
3. Cliquez sur l'onglet **Settings** (Paramètres)
4. Dans le menu de gauche, cliquez sur **Domains**
5. Cliquez sur le bouton **Add Domain** (Ajouter un domaine)
6. Entrez votre nom de domaine (ex: `votredomaine.com`)
7. Cliquez sur **Add**

**Important** : Vercel va vous afficher les instructions DNS. Notez-les ou gardez cette page ouverte.

8. Ajoutez aussi la version `www` :
   - Cliquez à nouveau sur **Add Domain**
   - Entrez `www.votredomaine.com`
   - Cliquez sur **Add**

---

## 🔧 Étape 2 : Configurer les DNS dans OVH

### Option A : Utiliser les Nameservers Vercel (RECOMMANDÉ - Le plus simple)

Cette option est la plus simple car Vercel gère tout automatiquement.

1. **Connectez-vous à votre compte OVH** :
   - Allez sur [ovh.com](https://www.ovh.com)
   - Cliquez sur **Connexion** en haut à droite
   - Connectez-vous avec vos identifiants

2. **Accédez à la gestion de votre domaine** :
   - Cliquez sur votre nom en haut à droite
   - Sélectionnez **Web Cloud** > **Domaines**
   - Cliquez sur votre domaine dans la liste

3. **Modifier les serveurs DNS** :
   - Dans le menu de gauche, cliquez sur **Serveurs DNS**
   - Cliquez sur **Modifier les serveurs DNS**
   - Remplacez les serveurs actuels par :
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Cliquez sur **Valider**
   - Confirmez la modification

4. **Attendre la propagation** (5-30 minutes généralement)

### Option B : Utiliser les enregistrements DNS OVH (Garder les serveurs OVH)

Si vous préférez garder les serveurs DNS d'OVH :

1. **Connectez-vous à votre compte OVH**

2. **Accédez à la zone DNS** :
   - Allez dans **Web Cloud** > **Domaines**
   - Cliquez sur votre domaine
   - Dans le menu de gauche, cliquez sur **Zone DNS**

3. **Ajouter l'enregistrement A pour le domaine principal** :
   - Cliquez sur **Ajouter une entrée**
   - Sélectionnez **A**
   - Laissez le champ **Sous-domaine** vide (ou mettez `@`)
   - Dans **Cible**, entrez : `76.76.21.21`
   - Cliquez sur **Suivant** puis **Confirmer**

4. **Ajouter l'enregistrement CNAME pour www** :
   - Cliquez sur **Ajouter une entrée**
   - Sélectionnez **CNAME**
   - Dans **Sous-domaine**, entrez : `www`
   - Dans **Cible**, entrez : `cname.vercel-dns.com`
   - Cliquez sur **Suivant** puis **Confirmer**

5. **Vérifier les enregistrements** :
   Vous devriez voir dans votre zone DNS :
   ```
   Type    Sous-domaine    Cible
   A       @               76.76.21.21
   CNAME   www             cname.vercel-dns.com
   ```

---

## ⏳ Étape 3 : Attendre la propagation DNS

La propagation DNS peut prendre :
- **Minimum** : 5-10 minutes
- **Moyenne** : 15-30 minutes
- **Maximum** : 24-48 heures (rare)

### Vérifier la propagation

Vous pouvez vérifier si les DNS sont propagés sur :
- [whatsmydns.net](https://www.whatsmydns.net) - Entrez votre domaine
- [dnschecker.org](https://dnschecker.org) - Entrez votre domaine

---

## ✅ Étape 4 : Vérifier dans Vercel

1. Retournez dans **Settings** > **Domains** de votre projet Vercel
2. Vérifiez l'état de votre domaine :
   - ⏳ **Pending** = En attente (DNS pas encore propagés)
   - ✅ **Valid** = Domaine configuré et actif ! 🎉
   - ⚠️ **Invalid** = Problème de configuration (cliquez pour voir les détails)

3. Une fois que le statut passe à **Valid**, votre domaine est actif !

---

## 🔒 SSL/HTTPS automatique

✅ **Bonne nouvelle** : Vercel configure automatiquement le certificat SSL (HTTPS) pour votre domaine. Aucune action de votre part n'est nécessaire !

Le certificat SSL est généralement déployé automatiquement dans les minutes qui suivent l'activation du domaine.

---

## 🧪 Tester votre site

Une fois configuré, testez votre site :

1. Ouvrez votre navigateur
2. Allez sur `https://votredomaine.com`
3. Vérifiez que :
   - ✅ Le site se charge correctement
   - ✅ Le cadenas vert (HTTPS) est présent
   - ✅ La redirection www fonctionne (si configurée)

---

## 🐛 Problèmes courants et solutions

### Le domaine reste en "Pending" dans Vercel

**Solutions** :
1. Vérifiez que les DNS sont bien configurés dans OVH
2. Attendez un peu plus (la propagation peut prendre jusqu'à 48h)
3. Vérifiez sur [whatsmydns.net](https://www.whatsmydns.net) que les DNS pointent bien vers Vercel
4. Vérifiez que vous avez bien enregistré le domaine dans Vercel (avec et sans www)

### Erreur "Invalid Configuration" dans Vercel

**Solutions** :
1. Cliquez sur le domaine dans Vercel pour voir les détails de l'erreur
2. Vérifiez que les enregistrements DNS dans OVH correspondent exactement à ce que Vercel demande
3. Si vous utilisez les nameservers Vercel, assurez-vous qu'ils sont bien configurés dans OVH
4. Vérifiez qu'il n'y a pas de conflit avec d'autres configurations DNS

### Le site ne charge pas après configuration

**Solutions** :
1. Vérifiez que votre projet Vercel est bien déployé et fonctionne sur `broques.vercel.app`
2. Vérifiez les logs de déploiement dans Vercel
3. Assurez-vous que le domaine est bien lié au bon projet Vercel
4. Videz le cache de votre navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
5. Attendez quelques minutes supplémentaires pour la propagation complète

### Erreur "DNS_PROBE_FINISHED_NXDOMAIN"

**Solutions** :
1. Les DNS ne sont pas encore propagés - attendez un peu plus
2. Vérifiez que les enregistrements DNS sont corrects dans OVH
3. Vérifiez que vous avez bien sauvegardé les modifications dans OVH

---

## 📞 Support

Si vous rencontrez des problèmes :

- **Documentation Vercel** : [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- **Support Vercel** : [vercel.com/support](https://vercel.com/support)
- **Documentation OVH** : [docs.ovh.com](https://docs.ovh.com)
- **Support OVH** : Via votre espace client OVH

---

## 📝 Checklist finale

Avant de terminer, vérifiez que :

- [ ] Le domaine est ajouté dans Vercel (avec et sans www)
- [ ] Les DNS sont configurés dans OVH (nameservers ou enregistrements)
- [ ] Le statut dans Vercel est "Valid"
- [ ] Le site est accessible via `https://votredomaine.com`
- [ ] Le certificat SSL est actif (cadenas vert)
- [ ] La redirection www fonctionne (si configurée)

🎉 **Félicitations ! Votre domaine personnalisé est maintenant configuré !**

