# Configuration des Variables d'Environnement dans Vercel

Guide pour ajouter vos variables d'environnement (clés API, etc.) dans Vercel.

## 🔑 Pourquoi configurer les variables d'environnement ?

Les variables d'environnement contiennent des informations sensibles (clés API, URLs, etc.) qui ne doivent **JAMAIS** être dans le code source. Vercel les utilise lors du déploiement.

---

## 📝 Étapes pour ajouter les variables dans Vercel

### 1. Identifier vos variables d'environnement

Vos variables sont probablement dans `.env.local`. Les variables importantes sont généralement :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY` (si vous utilisez Resend pour les emails)
- `RESEND_FROM_EMAIL` (si vous utilisez Resend)
- Toute autre clé API que vous utilisez

### 2. Accéder aux paramètres Vercel

1. **Allez sur [vercel.com](https://vercel.com)** et connectez-vous
2. **Sélectionnez votre projet** (tonmatos ou broques)
3. Cliquez sur l'onglet **Settings** (Paramètres)
4. Dans le menu de gauche, cliquez sur **Environment Variables**

### 3. Ajouter une variable

Pour chaque variable à ajouter :

1. **Cliquez sur "Add New"** ou **"Add"**
2. **Remplissez les champs** :
   - **Key** : Le nom de la variable (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value** : La valeur de la variable (ex: `https://bhuoyearxjeucjpygrhh.supabase.co`)
   - **Environment** : Cochez les environnements où elle doit être disponible :
     - ✅ **Production** (pour le site en production)
     - ✅ **Preview** (pour les previews de branches)
     - ✅ **Development** (pour le développement local avec `vercel dev`)
3. **Cliquez sur "Save"**

### 4. Répéter pour toutes les variables

Ajoutez toutes les variables nécessaires une par une.

---

## 🔍 Variables à ajouter (basé sur votre projet)

### Variables Supabase (OBLIGATOIRES)

```
NEXT_PUBLIC_SUPABASE_URL=https://bhuoyearxjeucjpygrhh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJodW95ZWFyeGpldWNqcHlncmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDE3ODksImV4cCI6MjA4MTkxNzc4OX0.ty7BYZ5RFtkOR_kWYSFLlMTk9yQDtb6-SBKnCENqwf0
```

### Variables Email (si vous utilisez Resend)

```
RESEND_API_KEY=votre_clé_resend
RESEND_FROM_EMAIL=noreply@broques.be
```

**Note** : Remplacez `votre_clé_resend` par votre vraie clé API Resend si vous en avez une.

---

## 📋 Checklist des variables

Vérifiez que vous avez ajouté :

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `RESEND_API_KEY` (si utilisé)
- [ ] `RESEND_FROM_EMAIL` (si utilisé)
- [ ] Toute autre variable utilisée dans votre code

---

## 🔄 Après avoir ajouté les variables

### 1. Redéployer votre projet

Les variables d'environnement sont prises en compte lors du déploiement. Vous devez redéployer :

1. Dans Vercel, allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Cliquez sur **Redeploy**
4. Ou poussez un commit sur votre branche principale pour déclencher un nouveau déploiement

### 2. Vérifier que ça fonctionne

1. Allez sur votre site : `https://broques.be`
2. Vérifiez que tout fonctionne correctement
3. Si vous voyez des erreurs liées à Supabase, vérifiez que les variables sont bien configurées

---

## 🎯 Variables par environnement

Vous pouvez avoir des valeurs différentes selon l'environnement :

- **Production** : Pour `https://broques.be`
- **Preview** : Pour les branches de test
- **Development** : Pour `vercel dev` en local

**Exemple** :
- Production : `NEXT_PUBLIC_SUPABASE_URL=https://bhuoyearxjeucjpygrhh.supabase.co`
- Development : `NEXT_PUBLIC_SUPABASE_URL=http://localhost:3000` (si vous testez en local)

---

## 🔒 Sécurité

### ✅ À FAIRE :
- ✅ Ajouter les variables dans Vercel
- ✅ Utiliser des valeurs différentes pour chaque environnement si nécessaire
- ✅ Garder les variables secrètes (ne jamais les commiter dans Git)

### ❌ À NE PAS FAIRE :
- ❌ Commiter `.env.local` dans Git
- ❌ Partager vos clés API publiquement
- ❌ Utiliser les mêmes clés pour tous les environnements (sauf si c'est intentionnel)

---

## 🐛 Problèmes courants

### Le site ne fonctionne pas après le déploiement

**Solutions** :
1. Vérifiez que toutes les variables sont bien ajoutées dans Vercel
2. Vérifiez que les variables sont cochées pour l'environnement **Production**
3. Redéployez le projet après avoir ajouté les variables
4. Vérifiez les logs de déploiement dans Vercel pour voir les erreurs

### Les variables ne sont pas prises en compte

**Solutions** :
1. Assurez-vous d'avoir redéployé après avoir ajouté les variables
2. Vérifiez que les noms des variables correspondent exactement (sensible à la casse)
3. Vérifiez que les variables sont cochées pour le bon environnement

### Erreur "Environment variable not found"

**Solutions** :
1. Vérifiez que la variable est bien ajoutée dans Vercel
2. Vérifiez que le nom de la variable est exactement le même (y compris les majuscules/minuscules)
3. Vérifiez que la variable est cochée pour l'environnement concerné

---

## 📸 À quoi ça ressemble dans Vercel

L'interface devrait ressembler à :

```
┌─────────────────────────────────────────────┐
│ Environment Variables                       │
├─────────────────────────────────────────────┤
│                                             │
│ Key: NEXT_PUBLIC_SUPABASE_URL               │
│ Value: https://...supabase.co              │
│ ☑ Production  ☑ Preview  ☑ Development     │
│ [Save]                                      │
│                                             │
│ ─────────────────────────────────────────── │
│                                             │
│ [Add New]                                   │
└─────────────────────────────────────────────┘
```

---

## 📞 Support

Si vous avez des problèmes :
- **Documentation Vercel** : [vercel.com/docs/concepts/projects/environment-variables](https://vercel.com/docs/concepts/projects/environment-variables)
- **Support Vercel** : Via votre dashboard Vercel

---

## ✅ Résumé rapide

1. **Vercel** → Votre projet → **Settings** → **Environment Variables**
2. **Ajoutez** chaque variable une par une
3. **Cochez** les environnements (Production, Preview, Development)
4. **Sauvegardez**
5. **Redéployez** votre projet

C'est tout ! 🎉

