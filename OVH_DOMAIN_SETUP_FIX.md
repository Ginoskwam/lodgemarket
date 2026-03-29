# Solution : Configuration DNS OVH avec Vercel (Option B)

OVH ne permet pas toujours de changer les nameservers directement. Utilisons plutôt les enregistrements DNS.

## ✅ Solution : Utiliser les enregistrements DNS (Option B)

Puisque le changement de nameservers a échoué, nous allons garder les serveurs DNS OVH et ajouter les enregistrements nécessaires.

---

## 🔧 Étapes détaillées pour OVH

### 1. Dans Vercel (si pas déjà fait)

1. Allez sur [vercel.com](https://vercel.com) → votre projet
2. **Settings** → **Domains**
3. Ajoutez votre domaine : `broques.be`
4. Ajoutez aussi : `www.broques.be`

Vercel vous affichera les instructions DNS. Notez-les.

---

### 2. Dans OVH - Configurer la Zone DNS

1. **Connectez-vous à votre compte OVH** :
   - Allez sur [ovh.com](https://www.ovh.com)
   - Connectez-vous

2. **Accédez à la Zone DNS** :
   - Cliquez sur votre nom en haut à droite
   - **Web Cloud** → **Domaines**
   - Cliquez sur **broques.be** dans la liste
   - Dans le menu de gauche, cliquez sur **Zone DNS**

3. **Vérifier les enregistrements existants** :
   - Vous devriez voir une liste d'enregistrements DNS
   - Notez les enregistrements existants (ne les supprimez pas)

---

### 3. Ajouter l'enregistrement A pour le domaine principal

1. Dans la **Zone DNS**, cliquez sur **Ajouter une entrée**
2. Sélectionnez **A** dans le menu déroulant
3. Remplissez les champs :
   - **Sous-domaine** : Laissez **vide** (ou mettez `@` si OVH le demande)
   - **Cible** : `76.76.21.21`
   - **TTL** : Laissez la valeur par défaut (3600)
4. Cliquez sur **Suivant**
5. Cliquez sur **Confirmer**

**Important** : Si un enregistrement A existe déjà pour `@` (domaine racine), vous devez le **modifier** au lieu d'en créer un nouveau :
   - Cliquez sur l'enregistrement A existant
   - Modifiez la **Cible** pour mettre `76.76.21.21`
   - Sauvegardez

---

### 4. Ajouter l'enregistrement CNAME pour www

1. Dans la **Zone DNS**, cliquez sur **Ajouter une entrée**
2. Sélectionnez **CNAME** dans le menu déroulant
3. Remplissez les champs :
   - **Sous-domaine** : `www`
   - **Cible** : `cname.vercel-dns.com`
   - **TTL** : Laissez la valeur par défaut (3600)
4. Cliquez sur **Suivant**
5. Cliquez sur **Confirmer**

**Note** : Si un enregistrement CNAME existe déjà pour `www`, modifiez-le au lieu d'en créer un nouveau.

---

### 5. Vérifier votre Zone DNS

Votre zone DNS devrait maintenant contenir (au minimum) :

```
Type    Sous-domaine    Cible                    TTL
A       @               76.76.21.21              3600
CNAME   www             cname.vercel-dns.com     3600
```

**Important** : Ne supprimez pas les autres enregistrements existants (MX pour les emails, TXT pour la vérification, etc.)

---

### 6. Attendre la propagation DNS

- **Temps moyen** : 5-30 minutes
- **Maximum** : 24-48 heures (rare)

**Vérifier la propagation** :
- Allez sur [whatsmydns.net](https://www.whatsmydns.net)
- Entrez `broques.be`
- Vérifiez que l'enregistrement A pointe vers `76.76.21.21`

---

### 7. Vérifier dans Vercel

1. Retournez dans **Settings** > **Domains** de votre projet Vercel
2. Le statut devrait passer de **Pending** à **Valid** une fois les DNS propagés
3. Si le statut reste **Pending**, attendez encore quelques minutes

---

## 🐛 Si ça ne fonctionne toujours pas

### Vérifications à faire :

1. **Vérifiez que les enregistrements sont corrects** :
   - L'enregistrement A pour `@` doit pointer vers `76.76.21.21`
   - L'enregistrement CNAME pour `www` doit pointer vers `cname.vercel-dns.com`
   - Pas d'espace ou de caractère supplémentaire

2. **Vérifiez qu'il n'y a pas de conflit** :
   - Si vous avez plusieurs enregistrements A pour `@`, gardez seulement celui qui pointe vers `76.76.21.21`
   - Supprimez les anciens enregistrements A qui pointent vers d'autres IP

3. **Vérifiez la propagation DNS** :
   - Utilisez [whatsmydns.net](https://www.whatsmydns.net)
   - Entrez `broques.be`
   - Vérifiez que l'IP affichée est `76.76.21.21`

4. **Contactez le support OVH** si nécessaire :
   - Via votre espace client OVH
   - Ou par téléphone : 1007 (gratuit depuis la France)

---

## ✅ Checklist finale

- [ ] Domaine `broques.be` ajouté dans Vercel
- [ ] Domaine `www.broques.be` ajouté dans Vercel
- [ ] Enregistrement A pour `@` créé/modifié dans OVH → `76.76.21.21`
- [ ] Enregistrement CNAME pour `www` créé/modifié dans OVH → `cname.vercel-dns.com`
- [ ] Propagation DNS vérifiée sur whatsmydns.net
- [ ] Statut "Valid" dans Vercel
- [ ] Site accessible sur `https://broques.be`

---

## 📞 Besoin d'aide ?

Si vous avez encore des problèmes, dites-moi :
- Ce que vous voyez dans votre Zone DNS OVH
- Le statut dans Vercel
- Les erreurs éventuelles

Je pourrai vous aider plus précisément !

