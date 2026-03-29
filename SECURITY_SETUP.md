# Guide de Sécurisation du Site

Maintenant que votre domaine fonctionne, voici comment vous assurer que tout est bien sécurisé.

## 🔒 SSL/HTTPS avec Vercel

### ✅ Bonne nouvelle : C'est automatique !

Vercel configure **automatiquement** le certificat SSL (HTTPS) pour votre domaine personnalisé. Aucune action de votre part n'est nécessaire !

### Vérifier que le SSL est actif

1. **Ouvrez votre site** : `https://broques.be`
2. **Vérifiez le cadenas** : Vous devriez voir un **cadenas vert** 🔒 dans la barre d'adresse
3. **Vérifiez l'URL** : Elle doit commencer par `https://` (pas `http://`)

### Si le SSL n'est pas encore actif

Le certificat SSL peut prendre quelques minutes à être déployé après l'activation du domaine. Si après 10-15 minutes le cadenas n'apparaît pas :

1. Allez dans **Vercel** → votre projet → **Settings** → **Domains**
2. Vérifiez que le statut du domaine est **Valid**
3. Cliquez sur votre domaine pour voir les détails
4. Si nécessaire, Vercel vous indiquera les actions à faire

---

## 🛡️ Sécurisation supplémentaire

### 1. Forcer HTTPS (Redirection automatique)

Vercel redirige automatiquement `http://` vers `https://`, mais vous pouvez le vérifier dans votre code.

**Vérification dans Next.js** :

Votre `next.config.js` peut inclure des headers de sécurité :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... votre config existante
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 2. Variables d'environnement sécurisées

Assurez-vous que vos variables d'environnement sensibles sont bien configurées dans Vercel :

1. Allez dans **Vercel** → votre projet → **Settings** → **Environment Variables**
2. Vérifiez que toutes vos clés secrètes sont bien configurées :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Toutes les autres clés API

**Important** : Ne commitez **JAMAIS** vos variables d'environnement dans Git !

### 3. Configuration Supabase

Vérifiez que votre configuration Supabase est sécurisée :

1. **Dans Supabase** :
   - Allez dans **Settings** → **API**
   - Vérifiez que les **URLs autorisées** incluent votre nouveau domaine :
     - `https://broques.be`
     - `https://www.broques.be`
   - Ajoutez-les si nécessaire

2. **Row Level Security (RLS)** :
   - Assurez-vous que les politiques RLS sont activées sur vos tables
   - Vérifiez que les utilisateurs ne peuvent accéder qu'à leurs propres données

### 4. Headers de sécurité

Vercel ajoute automatiquement certains headers, mais vous pouvez en ajouter d'autres via `next.config.js` (voir exemple ci-dessus).

---

## 🔍 Vérifications de sécurité

### Testez votre site avec ces outils :

1. **SSL Labs** : [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)
   - Entrez votre domaine : `broques.be`
   - Vérifiez que vous obtenez au moins un **A** ou **A+**

2. **Security Headers** : [securityheaders.com](https://securityheaders.com)
   - Entrez votre URL : `https://broques.be`
   - Vérifiez votre score de sécurité

3. **Mozilla Observatory** : [observatory.mozilla.org](https://observatory.mozilla.org)
   - Testez votre site pour voir les recommandations de sécurité

---

## 📋 Checklist de sécurité

- [ ] ✅ HTTPS actif (cadenas vert dans le navigateur)
- [ ] ✅ Redirection HTTP → HTTPS automatique
- [ ] ✅ Variables d'environnement configurées dans Vercel (pas dans le code)
- [ ] ✅ URLs autorisées mises à jour dans Supabase
- [ ] ✅ Headers de sécurité configurés (optionnel mais recommandé)
- [ ] ✅ RLS activé sur les tables Supabase
- [ ] ✅ Test SSL Labs : Score A ou A+
- [ ] ✅ Pas de données sensibles dans le code source

---

## 🚨 Bonnes pratiques de sécurité

### 1. Mots de passe et authentification
- Utilisez des mots de passe forts
- Activez l'authentification à deux facteurs (2FA) si disponible
- Ne partagez jamais vos clés API

### 2. Mises à jour
- Gardez vos dépendances à jour : `npm audit` et `npm update`
- Surveillez les vulnérabilités : `npm audit fix`

### 3. Logs et monitoring
- Surveillez les logs Vercel pour détecter les activités suspectes
- Configurez des alertes si possible

### 4. Backups
- Vérifiez que Supabase fait des backups automatiques
- Testez la restauration de données si nécessaire

---

## 🔧 Commandes utiles

### Vérifier les vulnérabilités dans vos dépendances :

```bash
npm audit
npm audit fix
```

### Vérifier que le site utilise bien HTTPS :

```bash
curl -I https://broques.be
# Devrait retourner "HTTP/2 200" et des headers de sécurité
```

---

## 📞 Support

Si vous avez des questions sur la sécurité :
- **Documentation Vercel** : [vercel.com/docs/security](https://vercel.com/docs/security)
- **Documentation Next.js** : [nextjs.org/docs/going-to-production](https://nextjs.org/docs/going-to-production)
- **Documentation Supabase** : [supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)

---

## ✅ Résumé

Avec Vercel, la sécurité de base est **automatique** :
- ✅ SSL/HTTPS configuré automatiquement
- ✅ Redirection HTTP → HTTPS automatique
- ✅ Certificats renouvelés automatiquement

Vous devez juste vérifier :
- ✅ Configuration Supabase (URLs autorisées)
- ✅ Variables d'environnement sécurisées
- ✅ Headers de sécurité (optionnel)

Votre site devrait déjà être sécurisé ! 🎉

