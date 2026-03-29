# Configuration de l'Environnement de Test

## ✅ Configuration Actuelle: STAGING

Le fichier `.env.test.local` est configuré pour utiliser votre environnement **staging**.

### Variables Configurées

✅ `NEXT_PUBLIC_SUPABASE_URL` - URL staging  
✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anon staging  
⏳ `SUPABASE_SERVICE_ROLE_KEY` - **À compléter** (voir ci-dessous)

### ⚠️ Action Requise: Service Role Key

Pour certains tests d'intégration, vous devez ajouter la **Service Role Key** de votre projet Supabase staging:

1. Aller sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionner votre projet staging
3. Aller dans **Settings** > **API**
4. Copier la **`service_role` key** (⚠️ gardez-la secrète!)
5. L'ajouter dans `.env.test.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
   ```

### Variables Optionnelles

Les variables suivantes sont optionnelles pour les tests:

- **VAPID Keys** - Si vous testez les notifications push
  - Générer avec: `npx web-push generate-vapid-keys`
- **RESEND_API_KEY** - Si vous testez l'envoi d'emails (généralement mocké)

### 📝 Note sur les Emails de Test

Les tests utilisent des emails avec le domaine `@tonmatos.test` par défaut.

**Options:**
1. **Accepter ces emails dans Supabase** (recommandé pour les tests)
   - Dans Supabase Dashboard > Authentication > Email Templates
   - Ou utiliser des emails réels de votre domaine

2. **Adapter les fixtures** si nécessaire:
   - Modifier `tests/fixtures/users.ts` pour utiliser un autre domaine

### ✅ Vérification

Une fois la Service Role Key ajoutée, tester la configuration:

```bash
# Lancer un test simple
npm run test

# Ou lancer les tests NRT
npm run test:nrt
```

### 🔄 Changer de Configuration

Si vous voulez passer à une autre option (projet de test séparé, Supabase local), voir les instructions dans `.env.test.local.example`.

---

**Dernière mise à jour:** Configuration staging appliquée
