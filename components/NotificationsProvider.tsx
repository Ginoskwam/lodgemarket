'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useNotifications } from '@/hooks/useNotifications'
import { updateAppBadge } from '@/lib/badge'
import { usePathname } from 'next/navigation'
import {
  registerServiceWorker,
  requestPushPermission,
  subscribeToPush,
  getPushSubscription
} from '@/lib/push-notifications'

/**
 * Composant provider pour gérer les notifications système et push
 * S'intègre dans le layout pour écouter les nouveaux messages sur toutes les pages
 */
export function NotificationsProvider() {
  const [userId, setUserId] = useState<string | null>(null)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const pathname = usePathname()
  const supabase = createClient()

  // Extraire l'ID de conversation depuis l'URL si on est sur une page de conversation
  const activeConversationId = pathname?.match(/\/messages\/([^\/]+)/)?.[1] || null

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          setUserId(null)
          return
        }
        setUserId(user?.id || null)
      } catch (error) {
        setUserId(null)
      }
    }

    getUser()

    // Écouter les changements d'authentification
    let subscription: any = null
    try {
      const result = supabase.auth.onAuthStateChange(() => {
        getUser()
      })
      subscription = result?.data?.subscription
    } catch (error) {
      // Ignorer les erreurs
    }

    return () => {
      try {
        if (subscription) {
          subscription.unsubscribe()
        }
      } catch (error) {
        // Ignorer les erreurs de nettoyage
      }
    }
  }, [])

  // Enregistrer le service worker et la subscription push
  useEffect(() => {
    async function setupPushNotifications() {
      if (!userId || typeof window === 'undefined') {
        return
      }

      // Détecter iOS/Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      const hasServiceWorker = 'serviceWorker' in navigator

      console.log('Configuration des notifications:', {
        userId,
        isIOS,
        isSafari,
        hasServiceWorker,
        userAgent: navigator.userAgent
      })

      // Sur iOS/Safari, les notifications push nécessitent un service worker
      // Mais les notifications natives peuvent fonctionner sans
      if (!hasServiceWorker) {
        console.warn('Service Worker non supporté. Les notifications push ne seront pas disponibles, mais les notifications natives peuvent fonctionner.')
        // On continue quand même pour permettre les notifications natives
      }

      try {
        // Enregistrer le service worker si disponible
        let registration: ServiceWorkerRegistration | null = null
        if (hasServiceWorker) {
          registration = await registerServiceWorker()
          if (registration) {
            setSwRegistration(registration)
            console.log('Service Worker enregistré avec succès')
          } else {
            console.warn('Échec de l\'enregistrement du Service Worker')
          }
        }

        // Demander la permission pour les notifications natives
        // Sur iOS/Safari, cela doit être fait dans un contexte utilisateur
        const hasPermission = await requestPushPermission()
        if (!hasPermission) {
          console.log('Permission de notification refusée ou non accordée')
          // On continue quand même, la permission peut être demandée plus tard
        }

        // Pour les push notifications (nécessite service worker)
        if (registration && hasPermission) {
          try {
            // Récupérer la clé publique VAPID
            const response = await fetch('/api/push/vapid-public-key')
            if (!response.ok) {
              console.warn('Impossible de récupérer la clé VAPID publique')
              return
            }

            const { publicKey } = await response.json()

            if (!publicKey) {
              console.warn('Clé VAPID publique non disponible')
              return
            }

            // Vérifier si on a déjà une subscription
            let pushSubscription = await getPushSubscription(registration)

            // Si pas de subscription, en créer une
            if (!pushSubscription) {
              pushSubscription = await subscribeToPush(registration, publicKey)
            }

            // Enregistrer la subscription sur le serveur
            if (pushSubscription) {
              // Convertir les clés en base64
              const p256dhKey = pushSubscription.getKey('p256dh')
              const authKey = pushSubscription.getKey('auth')
              
              const subscriptionData = {
                endpoint: pushSubscription.endpoint,
                keys: {
                  p256dh: p256dhKey 
                    ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(p256dhKey))))
                    : '',
                  auth: authKey
                    ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(authKey))))
                    : ''
                }
              }

              const subscribeResponse = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription: subscriptionData }),
              })

              if (subscribeResponse.ok) {
                console.log('Subscription push enregistrée avec succès')
              } else {
                console.warn('Erreur lors de l\'enregistrement de la subscription push')
              }
            }
          } catch (pushError) {
            console.error('Erreur lors de la configuration des push notifications:', pushError)
            // On continue quand même, les notifications natives peuvent fonctionner
          }
        } else {
          console.log('Push notifications non configurées (service worker ou permission manquante), mais notifications natives disponibles')
        }
      } catch (error) {
        console.error('Erreur lors de la configuration des notifications:', error)
        // On continue quand même, les notifications natives peuvent fonctionner
      }
    }

    setupPushNotifications()
  }, [userId])

  // Utiliser le hook de notifications
  useNotifications(userId, activeConversationId)

  // Écouter les messages du service worker pour mettre à jour le badge
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.data && event.data.type === 'UPDATE_BADGE') {
          const count = event.data.count || 0
          updateAppBadge(count).catch((error) => {
            console.warn('Erreur lors de la mise à jour du badge depuis le service worker:', error)
          })
        }
      } catch (error) {
        console.warn('Erreur lors du traitement du message du service worker:', error)
      }
    }

    try {
      navigator.serviceWorker.addEventListener('message', handleMessage)
    } catch (error) {
      console.warn('Impossible d\'écouter les messages du service worker:', error)
    }

    return () => {
      try {
        navigator.serviceWorker.removeEventListener('message', handleMessage)
      } catch (error) {
        // Ignorer les erreurs lors du nettoyage
      }
    }
  }, [])

  return null // Ce composant ne rend rien visuellement
}

