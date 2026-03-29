/**
 * Utilitaires pour gérer le badge de l'application
 * Compatible avec iOS 16.4+ et les autres navigateurs supportant Badge API
 */

/**
 * Met à jour le badge avec le nombre de messages non lus
 * @param count Nombre de messages non lus (0 pour effacer le badge)
 */
export async function updateAppBadge(count: number): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }

  // Utiliser l'API Badge si disponible (iOS 16.4+, Chrome, etc.)
  if ('setAppBadge' in navigator) {
    try {
      if (count > 0) {
        await navigator.setAppBadge(count)
        console.log('Badge mis à jour:', count)
      } else {
        await navigator.clearAppBadge()
        console.log('Badge effacé')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du badge:', error)
    }
    return
  }

  // Fallback: utiliser le service worker si disponible
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await (navigator as any).serviceWorker.ready
      if (registration.active) {
        registration.active.postMessage({
          type: 'UPDATE_BADGE',
          count: count
        })
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message au service worker:', error)
    }
  }
}

/**
 * Récupère le nombre de messages non lus et met à jour le badge
 * @param userId ID de l'utilisateur connecté
 */
export async function updateBadgeFromUnreadMessages(userId: string): Promise<void> {
  if (typeof window === 'undefined' || !userId) {
    return
  }

  try {
    const response = await fetch(`/api/messages/unread-count?userId=${userId}`)
    if (!response.ok) {
      console.warn('Impossible de récupérer le nombre de messages non lus')
      return
    }

    const data = await response.json()
    const unreadCount = data.count || 0

    await updateAppBadge(unreadCount)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du badge depuis les messages non lus:', error)
  }
}

/**
 * Efface le badge
 */
export async function clearAppBadge(): Promise<void> {
  await updateAppBadge(0)
}

