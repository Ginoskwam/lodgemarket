'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateBadgeFromUnreadMessages } from '@/lib/badge'
import type { Message } from '@/types/database'

/**
 * Hook pour gérer les notifications système des nouveaux messages
 * 
 * Fonctionnalités :
 * - Demande la permission de notification
 * - Écoute les nouveaux messages via Supabase Realtime
 * - Affiche une notification système quand un nouveau message arrive
 * - Évite les notifications si l'utilisateur est sur la conversation active
 */
export function useNotifications(currentUserId: string | null, activeConversationId: string | null = null) {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)
  const supabaseRef = useRef(createClient())
  const channelRef = useRef<any>(null)
  const notifiedMessagesRef = useRef<Set<string>>(new Set())

  // Vérifier si les notifications sont supportées
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
      
      // Log pour le débogage
      console.log('Notifications supportées:', {
        permission: Notification.permission,
        userAgent: navigator.userAgent,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        serviceWorker: 'serviceWorker' in navigator
      })
    }
  }, [])

  // Demander la permission si nécessaire
  const requestPermission = async () => {
    if (!isSupported) {
      console.warn('Les notifications ne sont pas supportées par ce navigateur')
      return false
    }

    if (Notification.permission === 'granted') {
      setPermission('granted')
      return true
    }

    if (Notification.permission === 'denied') {
      setPermission('denied')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error)
      return false
    }
  }

  // Afficher une notification
  const showNotification = useCallback(async (message: Message & { expediteur?: { pseudo: string } }) => {
    if (!isSupported || permission !== 'granted') {
      console.log('Notification non affichée:', { isSupported, permission })
      return
    }

    // Éviter les doublons
    if (notifiedMessagesRef.current.has(message.id)) {
      return
    }

    // Ne pas notifier si l'utilisateur est sur la conversation active
    if (activeConversationId === message.conversation_id) {
      return
    }

    // Ne pas notifier si le message vient de l'utilisateur actuel
    if (message.expediteur_id === currentUserId) {
      return
    }

    try {
      const senderName = message.expediteur?.pseudo || 'Quelqu\'un'
      const messagePreview = message.contenu.length > 100 
        ? message.contenu.substring(0, 100) + '...'
        : message.contenu

      // Détecter iOS/Safari pour adapter les options
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      
      // Options de notification compatibles avec tous les navigateurs
      // Utiliser 'any' pour permettre les propriétés non standard comme 'vibrate'
      const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
        body: messagePreview,
        tag: `message-${message.conversation_id}`, // Grouper les notifications par conversation
        requireInteraction: false,
        silent: false,
        data: {
          conversationId: message.conversation_id,
          url: `/messages/${message.conversation_id}`
        }
      }

      // Ajouter l'icône si supportée (pas toujours supporté sur iOS)
      if (!isIOS || (isIOS && 'icon' in Notification.prototype)) {
        notificationOptions.icon = '/icon.png'
      }

      // Badge supporté sur iOS 16.4+
      if ('badge' in Notification.prototype) {
        notificationOptions.badge = '/icon.png'
      }

      // Vibrate n'est pas supporté sur iOS (propriété non standard mais supportée par certains navigateurs)
      if ('vibrate' in Notification.prototype && !isIOS) {
        (notificationOptions as any).vibrate = [200, 100, 200]
      }

      const notification = new Notification(`${senderName} vous a envoyé un message`, notificationOptions)

      // Marquer comme notifié
      notifiedMessagesRef.current.add(message.id)

      // Nettoyer après 5 secondes pour éviter l'accumulation en mémoire
      setTimeout(() => {
        notifiedMessagesRef.current.delete(message.id)
      }, 5000)

      // Gérer le clic sur la notification
      notification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        // Rediriger vers la conversation
        if (typeof window !== 'undefined') {
          const url = notification.data?.url || `/messages/${message.conversation_id}`
          window.location.href = url
        }
        notification.close()
      }

      // Gérer les erreurs de notification
      notification.onerror = (error) => {
        console.error('Erreur sur la notification:', error)
      }

      // Fermer automatiquement après 5 secondes (sauf sur iOS où c'est géré par le système)
      if (!isIOS) {
        setTimeout(() => {
          notification.close()
        }, 5000)
      }

      console.log('Notification affichée avec succès:', { senderName, messageId: message.id })
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification:', error)
      // Essayer de demander la permission si elle n'est pas accordée
      if (error instanceof TypeError && error.message.includes('permission')) {
        console.log('Tentative de demande de permission...')
        await requestPermission()
      }
    }
  }, [isSupported, permission, activeConversationId, currentUserId])

  // Écouter les nouveaux messages
  useEffect(() => {
    if (!currentUserId || !isSupported) {
      return
    }

    // Sur iOS/Safari, la permission doit être demandée dans un contexte utilisateur
    // On ne peut pas la demander automatiquement, il faut attendre une interaction
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    
    // Demander la permission automatiquement au premier chargement (sauf iOS/Safari)
    if (permission === 'default' && !isIOS && !isSafari) {
      requestPermission()
    } else if (permission === 'default' && (isIOS || isSafari)) {
      // Sur iOS/Safari, on attend une interaction utilisateur
      // On peut afficher un message ou un bouton pour demander la permission
      console.log('Permission de notification non demandée automatiquement sur iOS/Safari. Attente d\'une interaction utilisateur.')
    }

    // Écouter tous les nouveaux messages destinés à l'utilisateur
    const channel = supabaseRef.current
      .channel(`notifications:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `destinataire_id=eq.${currentUserId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message

          // Récupérer les informations de l'expéditeur
          const { data: sender } = await supabaseRef.current
            .from('profiles')
            .select('pseudo')
            .eq('id', newMessage.expediteur_id)
            .single()

          // Afficher la notification
          await showNotification({
            ...newMessage,
            expediteur: sender ? { pseudo: sender.pseudo } : undefined,
          })

          // Mettre à jour le badge avec le nombre de messages non lus
          if (currentUserId) {
            await updateBadgeFromUnreadMessages(currentUserId)
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabaseRef.current.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [currentUserId, isSupported, permission, activeConversationId, showNotification])

  // Mettre à jour le badge au chargement et périodiquement
  useEffect(() => {
    if (!currentUserId) {
      return
    }

    // Mettre à jour le badge au chargement (avec gestion d'erreur)
    updateBadgeFromUnreadMessages(currentUserId).catch((error) => {
      console.warn('Erreur lors de la mise à jour du badge:', error)
      // Ne pas bloquer l'application si le badge ne peut pas être mis à jour
    })

    // Mettre à jour le badge toutes les 30 secondes
    const interval = setInterval(() => {
      updateBadgeFromUnreadMessages(currentUserId).catch((error) => {
        console.warn('Erreur lors de la mise à jour du badge:', error)
      })
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [currentUserId])

  return {
    permission,
    isSupported,
    requestPermission,
  }
}

