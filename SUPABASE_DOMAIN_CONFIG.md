# Configuration du Domaine dans Supabase

Guide pour ajouter votre domaine personnalisé dans Supabase pour l'authentification.

## 🔍 Où trouver les paramètres dans Supabase

### Option 1 : Dans Authentication Settings (Nouvelle interface)

1. **Connectez-vous à Supabase** : [supabase.com](https://supabase.com)
2. **Sélectionnez votre projet**
3. Dans le menu de gauche, cliquez sur **Authentication**
4. Cliquez sur **URL Configuration** (ou **Settings** dans le sous-menu Authentication)
5. Vous devriez voir :
   - **Site URL** : URL de base de votre site
   - **Redirect URLs** : Liste des URLs autorisées pour les redirections après authentification

### Option 2 : Dans Project Settings (Ancienne interface)

1. **Connectez-vous à Supabase**
2. **Sélectionnez votre projet**
3. Dans le menu de gauche, cliquez sur **Settings** (⚙️)
4. Cliquez sur **API** dans le sous-menu
5. Cherchez la section **Auth** ou **Authentication**
6. Vous devriez voir les champs pour les URLs

### Option 3 : Dans Authentication > Providers

1. **Authentication** → **Providers**
2. Cherchez les paramètres de configuration pour chaque provider (Email, Google, etc.)
3. Chaque provider peut avoir ses propres URLs de redirection

---

## 📝 Configuration à faire

### 1. Site URL

Ajoutez ou modifiez la **Site URL** pour mettre :
```
https://broques.be
```

### 2. Redirect URLs

Ajoutez ces URLs dans la liste des **Redirect URLs** (une par ligne ou séparées par des virgules) :
```
https://broques.be
https://www.broques.be
https://broques.be/auth/callback
https://www.broques.be/auth/callback
https://broques.be/**/*
https://www.broques.be/**/*
```

**Note** : Certaines versions de Supabase utilisent `**/*` pour autoriser toutes les routes, d'autres nécessitent d'ajouter chaque route spécifique.

---

## 🔍 Si vous ne trouvez toujours pas

### Vérifiez dans différents endroits :

1. **Authentication** → **URL Configuration**
2. **Authentication** → **Settings** → **URL Configuration**
3. **Settings** → **API** → Section **Auth**
4. **Settings** → **Auth** → **URL Configuration**
5. **Project Settings** → **Auth** → **URL Configuration**

### Dans l'interface Supabase, cherchez :

- Un champ **"Site URL"** ou **"Site URL"**
- Un champ **"Redirect URLs"** ou **"Redirect URLs"** ou **"Allowed Redirect URLs"**
- Une section **"URL Configuration"** ou **"Auth URLs"**

---

## 📸 À quoi ça ressemble

L'interface peut varier, mais vous devriez voir quelque chose comme :

```
┌─────────────────────────────────────┐
│ URL Configuration                   │
├─────────────────────────────────────┤
│ Site URL                            │
│ https://broques.be                  │
│                                     │
│ Redirect URLs                       │
│ https://broques.be                  │
│ https://www.broques.be              │
│ https://broques.be/auth/callback    │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

---

## 🎯 URLs importantes à ajouter

Selon votre application, vous devrez peut-être ajouter :

- `https://broques.be` (domaine principal)
- `https://www.broques.be` (version www)
- `https://broques.be/auth/callback` (callback OAuth si vous utilisez Google, etc.)
- `https://broques.be/auth/login` (si vous avez une page de login)
- `https://broques.be/auth/register` (si vous avez une page d'inscription)
- `https://broques.be/**/*` (pour autoriser toutes les routes - si supporté)

---

## ⚠️ Important

- **Ne supprimez pas** les URLs existantes (comme `localhost:3000` pour le développement)
- **Ajoutez** simplement les nouvelles URLs
- **Sauvegardez** après chaque modification

---

## 🐛 Si vous ne trouvez toujours pas

1. **Vérifiez la version de Supabase** : L'interface peut varier selon la version
2. **Cherchez dans la documentation** : [supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
3. **Contactez le support Supabase** : Via votre dashboard Supabase

---

## 📞 Alternative : Configuration via SQL (Avancé)

Si vous ne trouvez pas l'interface, vous pouvez configurer via SQL dans l'éditeur SQL de Supabase :

```sql
-- Vérifier la configuration actuelle
SELECT * FROM auth.config;

-- Note: La modification directe via SQL n'est généralement pas recommandée
-- Utilisez l'interface si possible
```

---

## ✅ Vérification

Après avoir ajouté les URLs :

1. **Testez la connexion** sur votre site `https://broques.be`
2. **Vérifiez les logs** dans Supabase → **Logs** → **Auth Logs**
3. Si vous voyez des erreurs de redirection, ajoutez l'URL manquante

---

## 💡 Astuce

Si vous développez en local ET en production, gardez les deux :
- URLs de développement : `http://localhost:3000`, `http://localhost:3000/**/*`
- URLs de production : `https://broques.be`, `https://www.broques.be`, etc.

Cela vous permettra de tester en local et en production sans problème.

---

Dites-moi ce que vous voyez dans votre interface Supabase et je pourrai vous guider plus précisément !

