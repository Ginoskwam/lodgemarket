# Guide de Configuration du Nom de Domaine

Ce guide vous explique comment configurer votre nom de domaine pour votre application Next.js.

## Option 1 : Déploiement sur Vercel (Recommandé)

Vercel est la plateforme recommandée pour Next.js et offre une configuration simple des domaines personnalisés.

### Étapes :

1. **Déployer sur Vercel** (si ce n'est pas déjà fait) :
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Ajouter votre domaine dans Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Ouvrez votre projet
   - Allez dans **Settings** > **Domains**
   - Cliquez sur **Add Domain**
   - Entrez votre nom de domaine (ex: `votredomaine.com` et `www.votredomaine.com`)

3. **Configurer les DNS chez votre registrar** :
   Vercel vous donnera des enregistrements DNS à configurer. Ajoutez-les chez votre registrar :

   **Option A - Utiliser les nameservers Vercel (Recommandé)** :
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **Option B - Utiliser des enregistrements CNAME** :
   ```
   Type: CNAME
   Name: @ (ou votre sous-domaine)
   Value: cname.vercel-dns.com
   ```

   **Option B - Utiliser des enregistrements A** :
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

4. **Attendre la propagation DNS** (peut prendre jusqu'à 48h, généralement quelques minutes)

5. **Vercel configure automatiquement le SSL/HTTPS**

---

## Option 2 : Serveur VPS/Dédié

Si vous hébergez sur votre propre serveur (VPS, serveur dédié, etc.)

### Prérequis :
- Serveur avec IP publique
- Accès root/administrateur
- Nginx ou Apache installé

### Étapes :

1. **Configurer les DNS chez votre registrar** :
   ```
   Type: A
   Name: @
   Value: VOTRE_IP_SERVEUR
   
   Type: A
   Name: www
   Value: VOTRE_IP_SERVEUR
   ```

2. **Installer et configurer Nginx** :
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

3. **Créer la configuration Nginx** (`/etc/nginx/sites-available/tonmatos`) :
   ```nginx
   server {
       listen 80;
       server_name votredomaine.com www.votredomaine.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Activer le site** :
   ```bash
   sudo ln -s /etc/nginx/sites-available/tonmatos /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Configurer SSL avec Let's Encrypt** :
   ```bash
   sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com
   ```

6. **Configurer Next.js pour le domaine** :
   Mettez à jour `next.config.js` :
   ```javascript
   const nextConfig = {
     // ... votre config existante
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'X-Forwarded-Proto',
               value: 'https',
             },
           ],
         },
       ];
     },
   };
   ```

7. **Démarrer l'application en production** :
   ```bash
   npm run build
   npm start
   # Ou utiliser PM2 pour la gestion des processus
   pm2 start npm --name "tonmatos" -- start
   ```

---

## Option 3 : Autres plateformes (Netlify, Railway, etc.)

### Netlify :
1. Allez dans **Site settings** > **Domain management**
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions DNS fournies

### Railway :
1. Allez dans **Settings** > **Domains**
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions

---

## Configuration Next.js pour le domaine personnalisé

### Mettre à jour `next.config.js` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'votredomaine.com', 'www.votredomaine.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // ... reste de votre config
}
```

### Variables d'environnement :

Assurez-vous que vos variables d'environnement incluent le nouveau domaine si nécessaire :

```env
NEXT_PUBLIC_SITE_URL=https://votredomaine.com
```

---

## Vérification

1. **Vérifier la propagation DNS** :
   ```bash
   dig votredomaine.com
   # ou
   nslookup votredomaine.com
   ```

2. **Tester l'accès** :
   - Ouvrez `https://votredomaine.com` dans votre navigateur
   - Vérifiez que le certificat SSL est valide (cadenas vert)

3. **Vérifier les redirections** :
   - `http://votredomaine.com` → `https://votredomaine.com`
   - `http://www.votredomaine.com` → `https://www.votredomaine.com`

---

## Problèmes courants

### DNS ne se propage pas :
- Attendez 24-48h (généralement quelques minutes)
- Vérifiez que les enregistrements DNS sont corrects
- Utilisez des outils comme [whatsmydns.net](https://www.whatsmydns.net)

### Certificat SSL ne fonctionne pas :
- Vérifiez que le domaine pointe bien vers votre serveur
- Relancez certbot si nécessaire
- Vérifiez que le port 443 est ouvert

### Site ne se charge pas :
- Vérifiez que l'application Next.js tourne
- Vérifiez les logs Nginx/serveur
- Vérifiez les règles de firewall

---

## Support

Pour plus d'aide :
- **Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Next.js** : [nextjs.org/docs](https://nextjs.org/docs)
- **Let's Encrypt** : [letsencrypt.org/docs](https://letsencrypt.org/docs)

