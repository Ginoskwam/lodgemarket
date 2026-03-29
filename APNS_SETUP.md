# Configuration Apple Push Notification Service (APNs) pour iOS

Ce guide explique comment configurer les notifications push pour iOS/Safari via Apple Push Notification Service.

## Vue d'ensemble

Depuis iOS 16.4+, Safari supporte les **Web Push Notifications** standard via APNs. Cela signifie que vous pouvez utiliser soit :
1. **VAPID standard** (recommandé pour iOS 16.4+) - Plus simple, fonctionne avec les mêmes clés que les autres navigateurs
2. **Certificats APNs** (pour compatibilité avec versions antérieures ou configuration avancée)

## Option 1 : Utiliser VAPID (Recommandé pour iOS 16.4+)

Si vous ciblez iOS 16.4+, vous pouvez utiliser les mêmes clés VAPID que pour les autres navigateurs. Aucune configuration supplémentaire n'est nécessaire !

### Prérequis
- iOS 16.4 ou supérieur
- Safari sur iOS
- Les clés VAPID déjà configurées (voir `PUSH_NOTIFICATIONS_SETUP.md`)

### Configuration

Aucune configuration supplémentaire n'est nécessaire. Les notifications push fonctionneront automatiquement sur iOS 16.4+ avec les clés VAPID standard.

## Option 2 : Utiliser les certificats APNs (Configuration avancée)

Si vous avez besoin de support pour iOS < 16.4 ou souhaitez une configuration plus avancée, vous pouvez utiliser les certificats APNs.

### Étape 1 : Créer une clé APNs dans Apple Developer

1. Connectez-vous à [Apple Developer](https://developer.apple.com/account/)
2. Allez dans **Certificates, Identifiers & Profiles**
3. Sélectionnez **Keys** dans le menu de gauche
4. Cliquez sur le bouton **+** pour créer une nouvelle clé
5. Donnez un nom à votre clé (ex: "BROQUES Push Notifications")
6. Cochez **Apple Push Notifications service (APNs)**
7. Cliquez sur **Continue** puis **Register**
8. **Important** : Téléchargez le fichier `.p8` - vous ne pourrez le télécharger qu'une seule fois !
9. Notez le **Key ID** affiché

### Étape 2 : Récupérer votre Team ID

1. Dans Apple Developer, allez dans **Membership**
2. Notez votre **Team ID** (ex: ABC123DEF4)

### Étape 3 : Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Certificats APNs (optionnel, pour iOS < 16.4)
APNS_KEY_ID=votre_key_id_ici
APNS_TEAM_ID=votre_team_id_ici
APNS_KEY=contenu_du_fichier_p8_ici
```

**Note** : Pour `APNS_KEY`, vous pouvez soit :
- Mettre le contenu complet du fichier `.p8` (avec les sauts de ligne)
- Ou mettre le chemin vers le fichier (nécessite une modification du code)

### Étape 4 : Format du fichier .p8

Le fichier `.p8` ressemble à ceci :

```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
...
-----END PRIVATE KEY-----
```

Vous pouvez copier tout le contenu (y compris les lignes `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`) dans la variable `APNS_KEY`.

## Compatibilité iOS

| Version iOS | Support Web Push | Méthode recommandée |
|------------|------------------|---------------------|
| iOS < 16.4  | ❌ Non supporté  | Certificats APNs (nécessite app native) |
| iOS 16.4+   | ✅ Supporté       | VAPID standard |
| iOS 17+     | ✅ Supporté       | VAPID standard |

## Test sur iOS

### Prérequis
1. iPhone avec iOS 16.4 ou supérieur
2. Safari (pas Chrome ou Firefox sur iOS)
3. L'application doit être ajoutée à l'écran d'accueil (PWA)

### Étapes de test

1. **Ajouter à l'écran d'accueil** :
   - Ouvrez Safari sur iPhone
   - Allez sur votre site
   - Appuyez sur le bouton de partage
   - Sélectionnez "Sur l'écran d'accueil"

2. **Autoriser les notifications** :
   - Ouvrez l'application depuis l'écran d'accueil
   - Le navigateur demandera la permission pour les notifications
   - Acceptez la permission

3. **Tester** :
   - Envoyez un message depuis un autre appareil
   - Vous devriez recevoir une notification même si l'application est fermée

## Dépannage

### Les notifications ne fonctionnent pas sur iOS

1. **Vérifier la version iOS** :
   - Les Web Push Notifications nécessitent iOS 16.4+
   - Vérifiez dans Réglages > Général > À propos de

2. **Vérifier que c'est Safari** :
   - Chrome et Firefox sur iOS ne supportent pas les notifications push
   - Utilisez Safari uniquement

3. **Vérifier l'ajout à l'écran d'accueil** :
   - Les notifications push ne fonctionnent que si l'application est ajoutée à l'écran d'accueil
   - L'application doit être ouverte au moins une fois depuis l'écran d'accueil

4. **Vérifier les permissions** :
   - Allez dans Réglages > Safari > Notifications
   - Vérifiez que votre site a la permission

5. **Vérifier la console** :
   - Sur Mac, connectez l'iPhone et ouvrez Safari > Développement > [Votre iPhone]
   - Vérifiez les erreurs dans la console

### Erreur "Invalid APNs credentials"

- Vérifiez que les variables `APNS_KEY_ID`, `APNS_TEAM_ID` et `APNS_KEY` sont correctement configurées
- Vérifiez que le contenu du fichier `.p8` est correct (avec les lignes BEGIN/END)

## Notes importantes

- **iOS 16.4+** : Utilisez VAPID standard (plus simple)
- **iOS < 16.4** : Les Web Push Notifications ne sont pas supportées. Il faudrait une app native.
- **PWA requise** : Les notifications push ne fonctionnent que si l'application est ajoutée à l'écran d'accueil
- **Safari uniquement** : Chrome et Firefox sur iOS ne supportent pas les notifications push

## Ressources

- [Apple Developer - Push Notifications](https://developer.apple.com/notifications/)
- [Web Push Notifications sur iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [MDN - Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

