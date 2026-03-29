/**
 * Utilitaires pour gérer les notifications push
 * Gère l'enregistrement du service worker et des subscriptions push
 */

/**
 * Enregistre le service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Workers ne sont pas supportés')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })

    console.log('Service Worker enregistré:', registration)
    return registration
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du Service Worker:', error)
    return null
  }
}

/**
 * Demande la permission pour les notifications push
 */
export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Les notifications ne sont pas supportées')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    console.warn('Les notifications sont refusées')
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('Erreur lors de la demande de permission:', error)
    return false
  }
}

/**
 * Génère une clé publique VAPID (à utiliser côté serveur)
 * Cette fonction est juste pour référence - les clés doivent être générées côté serveur
 */
export async function urlBase64ToUint8Array(base64String: string): Promise<Uint8Array> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

/**
 * Crée une subscription push
 */
export async function subscribeToPush(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const keyArray = await urlBase64ToUint8Array(vapidPublicKey)
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: keyArray as any // Type assertion nécessaire pour compatibilité
    })

    console.log('Subscription push créée:', subscription)
    return subscription
  } catch (error) {
    console.error('Erreur lors de la création de la subscription:', error)
    return null
  }
}

/**
 * Récupère la subscription existante
 */
export async function getPushSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    return await registration.pushManager.getSubscription()
  } catch (error) {
    console.error('Erreur lors de la récupération de la subscription:', error)
    return null
  }
}

/**
 * Désabonne de la push notification
 */
export async function unsubscribeFromPush(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  try {
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      console.log('Désabonnement réussi')
      return true
    }
    return false
  } catch (error) {
    console.error('Erreur lors du désabonnement:', error)
    return false
  }
}

