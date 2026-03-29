/**
 * Utilitaires pour gérer les notifications APNs (Apple Push Notification Service)
 * Pour iOS et Safari
 */

import webpush from 'web-push'

/**
 * Configure web-push pour utiliser les certificats APNs
 * Nécessite une clé APNs (p8) depuis le compte développeur Apple
 */
export function configureAPNs() {
  const apnsKeyId = process.env.APNS_KEY_ID
  const apnsTeamId = process.env.APNS_TEAM_ID
  const apnsKey = process.env.APNS_KEY // Clé p8 en base64 ou texte

  if (!apnsKeyId || !apnsTeamId || !apnsKey) {
    console.warn('Certificats APNs non configurés')
    return false
  }

  try {
    // Pour APNs, web-push utilise les clés VAPID mais avec une configuration spéciale
    // Note: web-push supporte APNs via les certificats p8
    // La configuration se fait via setVapidDetails avec les clés APNs
    
    // Convertir la clé p8 si nécessaire
    const vapidEmail = `mailto:${apnsTeamId}@broques.fr`
    
    // Pour APNs, on utilise la clé publique dérivée de la clé privée
    // web-push gère cela automatiquement si on configure correctement
    webpush.setVapidDetails(vapidEmail, apnsKeyId, apnsKey)
    
    return true
  } catch (error) {
    console.error('Erreur lors de la configuration APNs:', error)
    return false
  }
}

/**
 * Détecte si une subscription est pour iOS/Safari
 */
export function isIOSSubscription(subscription: { endpoint: string }): boolean {
  // Les endpoints iOS/Safari contiennent généralement "safari" ou "apple"
  return (
    subscription.endpoint.includes('safari') ||
    subscription.endpoint.includes('apple') ||
    subscription.endpoint.includes('push.apple.com')
  )
}

/**
 * Envoie une notification via APNs
 * Note: web-push gère automatiquement APNs si les certificats sont configurés
 */
export async function sendAPNsNotification(
  subscription: webpush.PushSubscription,
  payload: string
): Promise<void> {
  try {
    // web-push détecte automatiquement si c'est APNs et utilise les bons certificats
    await webpush.sendNotification(subscription, payload, {
      // Options spécifiques APNs si nécessaire
      headers: {
        'apns-priority': '10',
        'apns-push-type': 'alert'
      }
    })
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi APNs:', error)
    throw error
  }
}

