/**
 * Service Worker Lodgemarket
 * Gère les notifications push et le badge de l'application
 */

const CACHE_NAME = 'lodgemarket-v1'
const STATIC_CACHE = 'lodgemarket-static-v1'

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation')
  self.skipWaiting() // Activer immédiatement le nouveau service worker
})

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            console.log('[Service Worker] Suppression du cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim() // Prendre le contrôle immédiatement
})

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Notification push reçue:', event)

  let notificationData = {
    title: 'Nouveau message',
    body: 'Vous avez reçu un nouveau message',
    icon: '/icon.png',
    badge: '/icon.png',
    tag: 'new-message',
    data: {}
  }

  // Parser les données de la notification
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        tag: data.tag || notificationData.tag,
        data: data.data || notificationData.data,
        url: data.url || '/messages'
      }
    } catch (e) {
      // Si ce n'est pas du JSON, essayer comme texte
      notificationData.body = event.data.text() || notificationData.body
    }
  }

  // Récupérer le nombre de messages non lus pour le badge
  const badgeCount = notificationData.data?.badgeCount || notificationData.data?.unreadCount || 1

  event.waitUntil(
    Promise.all([
      // Afficher la notification
      self.registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        tag: notificationData.tag,
        data: {
          ...notificationData.data,
          badgeCount: badgeCount
        },
        requireInteraction: false,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'open',
            title: 'Ouvrir'
          },
          {
            action: 'close',
            title: 'Fermer'
          }
        ]
      }),
      // Envoyer un message aux clients pour mettre à jour le badge
      // Le badge doit être mis à jour depuis le client car l'API Badge n'est pas disponible dans le service worker
      notifyClientsToUpdateBadge(badgeCount)
    ])
  )
})

// Gestion du clic sur une notification
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Clic sur notification:', event)

  event.notification.close()

  const action = event.action
  const notificationData = event.notification.data || {}
  const url = notificationData.url || '/messages'

  if (action === 'close') {
    return
  }

  // Ouvrir ou focuser la fenêtre
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si une fenêtre est déjà ouverte, la focuser
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      // Sinon, ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// Fonction pour notifier les clients de mettre à jour le badge
// Le badge doit être mis à jour depuis le client car l'API Badge n'est pas disponible dans le service worker
async function notifyClientsToUpdateBadge(count) {
  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    clients.forEach((client) => {
      client.postMessage({
        type: 'UPDATE_BADGE',
        count: count
      })
    })
    console.log('[Service Worker] Message de mise à jour du badge envoyé aux clients:', count)
  } catch (error) {
    console.error('[Service Worker] Erreur lors de l\'envoi du message aux clients:', error)
  }
}

// Message handler pour recevoir des messages depuis le client
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message reçu:', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Gestion des erreurs
self.addEventListener('error', (event) => {
  console.error('[Service Worker] Erreur:', event.error)
})

self.addEventListener('unhandledrejection', (event) => {
  console.error('[Service Worker] Rejection non gérée:', event.reason)
})
