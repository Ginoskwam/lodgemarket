# Rapport de Bug - Template

## 📋 Informations Générales

**Titre:** [Description concise du bug]

**Sévérité:** 
- [ ] S1 - Bloquant (empêche l'utilisation de la fonctionnalité)
- [ ] S2 - Majeur (impact significatif sur l'expérience utilisateur)
- [ ] S3 - Mineur (impact limité, contournable)
- [ ] S4 - Cosmétique (problème visuel mineur)

**Date:** [YYYY-MM-DD HH:MM]
**Test:** [Nom du test qui a échoué]
**Environnement:** [local / staging / production]

---

## 🌍 Environnement

**Commit:** `[hash du commit]`
**Branche:** `[nom de la branche]`
**Navigateur:** [Chrome 120 / Firefox 121 / Safari 17 / etc.]
**OS:** [macOS 14 / Windows 11 / Linux]
**URL:** [URL de la page concernée]

**Variables d'environnement:**
```bash
NEXT_PUBLIC_SUPABASE_URL=[valeur]
NODE_ENV=[valeur]
# ... autres variables pertinentes
```

---

## 🔄 Étapes de Reproduction

1. [Action 1]
2. [Action 2]
3. [Action 3]
4. ...

**Données de test utilisées:**
- Email: `[email de test]`
- Annonce ID: `[id si applicable]`
- ...

---

## ✅ Résultat Attendu

[Description du comportement attendu]

**Exemple:**
- L'utilisateur doit être redirigé vers `/annonces` après connexion
- Le message doit apparaître dans la conversation immédiatement
- ...

---

## ❌ Résultat Observé

[Description du comportement réel observé]

**Exemple:**
- L'utilisateur reste sur la page de login
- Le message n'apparaît pas, erreur 500 dans la console
- ...

---

## 👥 Impact Utilisateur

**Pages/Features Impactées:**
- [ ] Page d'accueil
- [ ] Authentification (login/register)
- [ ] Annonces (liste/création/modification)
- [ ] Messagerie
- [ ] Profil
- [ ] Notifications
- [ ] Autre: [préciser]

**Impact:**
- [ ] Empêche complètement l'utilisation
- [ ] Ralentit significativement l'utilisation
- [ ] Impacte l'expérience mais contournable
- [ ] Impact cosmétique uniquement

**Utilisateurs affectés:**
- [ ] Tous les utilisateurs
- [ ] Utilisateurs non authentifiés
- [ ] Utilisateurs authentifiés
- [ ] Propriétaires d'annonces uniquement
- [ ] Autre: [préciser]

---

## 🔍 Preuves

### Screenshot
![Screenshot du bug](test-results/screenshots/bug-[date]-[hash].png)

### Vidéo/Trace Playwright
- **Trace:** `test-results/traces/[test-name]-trace.zip`
- **Vidéo:** `test-results/videos/[test-name].webm`

### Logs Console
```
[Coller les logs de la console du navigateur]
```

### Logs Serveur
```
[Coller les logs du serveur Next.js]
```

### Logs Supabase
```
[Coller les logs Supabase si applicable]
```

### Stack Trace
```
[Coller la stack trace complète]
```

---

## 🔬 Hypothèse de Cause

[Si identifiable, décrire l'hypothèse sur la cause du bug]

**Fichiers concernés:**
- `app/[route]/page.tsx` (ligne X)
- `lib/[module].ts` (ligne Y)
- `app/api/[route]/route.ts` (ligne Z)

**Hypothèse:**
- [ ] Problème de validation (Zod schema)
- [ ] Erreur d'authentification (session expirée)
- [ ] Problème de base de données (requête Supabase)
- [ ] Erreur réseau (timeout, CORS)
- [ ] Problème de state management (React)
- [ ] Erreur de configuration (variables d'environnement)
- [ ] Autre: [préciser]

---

## 📝 Notes Additionnelles

[Informations complémentaires, contexte, liens vers issues GitHub, etc.]

---

## ✅ Checklist de Résolution

- [ ] Bug reproduit localement
- [ ] Cause identifiée
- [ ] Fix implémenté
- [ ] Tests ajoutés/mis à jour
- [ ] Tests passent
- [ ] Code review effectué
- [ ] Documentation mise à jour si nécessaire
- [ ] Bug vérifié en staging

---

**Rapporté par:** [Nom / Email]  
**Assigné à:** [Nom / Email]  
**Statut:** [Nouveau / En cours / Résolu / Fermé]

