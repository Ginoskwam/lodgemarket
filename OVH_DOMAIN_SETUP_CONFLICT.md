# Solution : Résoudre le conflit DNS dans OVH

L'erreur indique qu'il y a déjà un enregistrement pour `www` qui entre en conflit avec le CNAME.

## 🔍 Solution : Vérifier et modifier les enregistrements existants

### Étape 1 : Vérifier ce qui existe déjà

1. Dans OVH, allez dans **Zone DNS** de votre domaine `broques.be`
2. Regardez tous les enregistrements existants
3. **Cherchez spécifiquement** :
   - Un enregistrement **A** pour `www`
   - Un enregistrement **CNAME** pour `www`
   - Tout autre enregistrement pour `www`

### Étape 2 : Résoudre le conflit

Vous avez **2 options** :

---

## ✅ Option A : Supprimer l'ancien enregistrement www et ajouter le CNAME

1. **Trouvez l'enregistrement existant pour `www`** dans votre Zone DNS
2. **Cliquez dessus** puis **Supprimez-le**
3. **Attendez quelques secondes** que la suppression soit prise en compte
4. **Ajoutez maintenant le CNAME** :
   - Type : **CNAME**
   - Sous-domaine : `www`
   - Cible : `cname.vercel-dns.com`
   - Validez

---

## ✅ Option B : Utiliser un enregistrement A pour www (Alternative)

Si vous préférez garder l'enregistrement existant ou si le CNAME pose problème, utilisez un enregistrement A :

1. **Supprimez l'enregistrement CNAME pour `www`** (s'il existe)
2. **Ajoutez un enregistrement A** :
   - Type : **A**
   - Sous-domaine : `www`
   - Cible : `76.76.21.21` (même IP que pour le domaine principal)
   - Validez

**Note** : Cette option fonctionne aussi bien que le CNAME pour Vercel.

---

## 📋 Configuration finale attendue

Votre Zone DNS devrait contenir :

```
Type    Sous-domaine    Cible                    TTL
A       @               76.76.21.21              3600
A       www             76.76.21.21              3600
```

**OU**

```
Type    Sous-domaine    Cible                    TTL
A       @               76.76.21.21              3600
CNAME   www             cname.vercel-dns.com     3600
```

**Important** : Il ne doit y avoir **QU'UN SEUL** enregistrement pour `www`, pas plusieurs !

---

## 🔧 Étapes détaillées dans OVH

### Pour supprimer un enregistrement existant :

1. Dans **Zone DNS**, trouvez l'enregistrement pour `www`
2. Cliquez sur l'icône **poubelle** ou **Supprimer** à côté de l'enregistrement
3. Confirmez la suppression
4. Attendez que la modification soit sauvegardée

### Pour ajouter le nouvel enregistrement :

1. Cliquez sur **Ajouter une entrée**
2. Choisissez le type (**A** ou **CNAME** selon l'option choisie)
3. Remplissez les champs
4. Validez

---

## ⚠️ Points importants

- **Un sous-domaine ne peut avoir qu'UN SEUL type d'enregistrement** (A, CNAME, MX, etc.)
- **Un CNAME ne peut pas coexister avec un A** sur le même sous-domaine
- **Supprimez toujours l'ancien enregistrement avant d'en ajouter un nouveau**

---

## ✅ Vérification

Après avoir fait les modifications :

1. Vérifiez que votre Zone DNS ne contient **qu'un seul enregistrement pour `www`**
2. Vérifiez que l'enregistrement A pour `@` pointe vers `76.76.21.21`
3. Attendez 5-30 minutes pour la propagation DNS
4. Vérifiez dans Vercel que le statut passe à **Valid**

---

## 🐛 Si l'erreur persiste

1. **Videz le cache de votre navigateur** et rechargez la page OVH
2. **Attendez 2-3 minutes** après une suppression avant d'ajouter un nouvel enregistrement
3. **Vérifiez qu'il n'y a pas d'enregistrement caché** : regardez tous les enregistrements de votre zone DNS
4. **Contactez le support OVH** si le problème persiste

---

## 📞 Besoin d'aide ?

Dites-moi :
- Quels enregistrements vous voyez actuellement dans votre Zone DNS pour `www`
- Si vous avez réussi à supprimer l'ancien enregistrement
- Si l'erreur persiste après la suppression

Je pourrai vous aider plus précisément !

