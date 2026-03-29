# Configuration du Nom de Domaine Personnalisé sur Vercel

Votre site est déjà déployé sur Vercel. Voici comment ajouter votre nom de domaine personnalisé.

## Étapes à suivre

### 1. Ajouter le domaine dans Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Ouvrez votre projet **tonmatos** (ou le nom de votre projet)
3. Allez dans l'onglet **Settings** (Paramètres)
4. Cliquez sur **Domains** dans le menu de gauche
5. Cliquez sur le bouton **Add Domain** (Ajouter un domaine)
6. Entrez votre nom de domaine (ex: `votredomaine.com`)
7. Cliquez sur **Add**

### 2. Ajouter aussi la version www (optionnel mais recommandé)

1. Cliquez à nouveau sur **Add Domain**
2. Entrez `www.votredomaine.com`
3. Cliquez sur **Add**

Vercel configurera automatiquement la redirection entre les deux versions.

### 3. Configurer les DNS chez votre registrar

Vercel vous affichera les enregistrements DNS à configurer. Vous avez **2 options** :

#### Option A : Utiliser les nameservers Vercel (RECOMMANDÉ - Le plus simple)

1. Chez votre registrar (là où vous avez acheté le domaine), allez dans les paramètres DNS
2. Changez les **nameservers** pour utiliser ceux de Vercel :
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. Sauvegardez

**Avantages** : Vercel gère tout automatiquement, y compris les sous-domaines.

#### Option B : Utiliser des enregistrements DNS (si vous gardez vos nameservers actuels)

Chez votre registrar, ajoutez ces enregistrements :

**Pour le domaine principal** :
```
Type: A
Name: @ (ou laissez vide, selon votre registrar)
Value: 76.76.21.21
```

**Pour www** :
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Ou si votre registrar ne supporte pas @ pour A** :
```
Type: A
Name: (vide ou @)
Value: 76.76.21.21

Type: A
Name: www
Value: 76.76.21.21
```

### 4. Attendre la propagation DNS

- La propagation DNS peut prendre de **quelques minutes à 48 heures**
- Généralement, c'est actif en **5-30 minutes**
- Vous pouvez vérifier la propagation sur [whatsmydns.net](https://www.whatsmydns.net)

### 5. Vérifier dans Vercel

1. Retournez dans **Settings** > **Domains** de votre projet Vercel
2. Vous verrez l'état de votre domaine :
   - ⏳ **Pending** = En attente de configuration DNS
   - ✅ **Valid** = Domaine configuré et actif
   - ⚠️ **Invalid** = Problème de configuration (cliquez pour voir les détails)

### 6. SSL/HTTPS automatique

✅ **Bonne nouvelle** : Vercel configure automatiquement le certificat SSL (HTTPS) pour votre domaine personnalisé. Aucune action de votre part n'est nécessaire !

## Vérification

Une fois configuré, vous devriez pouvoir accéder à votre site via :
- `https://votredomaine.com`
- `https://www.votredomaine.com` (redirigera automatiquement vers la version sans www, ou vice-versa selon votre configuration)

## Problèmes courants

### Le domaine reste en "Pending"
- Vérifiez que les DNS sont bien configurés chez votre registrar
- Attendez un peu plus (la propagation peut prendre du temps)
- Vérifiez sur [whatsmydns.net](https://www.whatsmydns.net) que les DNS pointent bien vers Vercel

### Erreur "Invalid Configuration"
- Cliquez sur le domaine dans Vercel pour voir les détails de l'erreur
- Vérifiez que les enregistrements DNS correspondent exactement à ce que Vercel demande
- Assurez-vous qu'il n'y a pas de conflit avec d'autres configurations

### Le site ne charge pas
- Vérifiez que votre projet Vercel est bien déployé et fonctionne
- Vérifiez les logs de déploiement dans Vercel
- Assurez-vous que le domaine est bien lié au bon projet

## Support

Si vous rencontrez des problèmes :
- Documentation Vercel : [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- Support Vercel : [vercel.com/support](https://vercel.com/support)

