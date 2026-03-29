'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { Annonce, Profile } from '@/types/database'

interface ConversationItemProps {
  conversation: any
  user: any
  onDelete: (conversationId: string) => void
  deletingId: string | null
}

/**
 * Composant pour afficher une conversation avec support du swipe left sur mobile
 */
export function ConversationItem({ conversation, user, onDelete, deletingId }: ConversationItemProps) {
  const locale = useLocale()
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const itemRef = useRef<HTMLDivElement>(null)
  const deleteButtonWidth = 80 // Largeur du bouton de suppression

  // Protection contre les données manquantes - retourner un placeholder au lieu de null
  if (!conversation || !user) {
    return (
      <div className="card p-4 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  // Utiliser des valeurs par défaut si les données sont incomplètes
  const annonce = conversation.annonce as Annonce | undefined
  const otherParticipant =
    conversation.participant1_id === user.id
      ? (conversation.participant2 as Profile | undefined)
      : (conversation.participant1 as Profile | undefined)

  const hasUnread = (conversation.unreadCount || 0) > 0
  
  // Si les données essentielles manquent, afficher un placeholder
  if (!annonce || !otherParticipant) {
    return (
      <div className="card p-4 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }
  
  // Utiliser des valeurs par défaut pour éviter les erreurs
  const annonceTitle = annonce.titre || 'Annonce'
  const participantPseudo = otherParticipant.pseudo || 'Utilisateur'
  const participantPhoto = otherParticipant.photo_profil || null

  // Formater la date du dernier message
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (days === 1) {
      return 'Hier'
    } else if (days < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      })
    }
  }

  // Gestion du swipe sur mobile/tablette
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || !e.touches || e.touches.length === 0) return
    
    const newX = e.touches[0].clientX
    setCurrentX(newX)
    
    const diff = startX - newX
    
    // Swipe vers la gauche seulement (diff > 0)
    if (diff > 0) {
      // Limiter le swipe à la largeur du bouton de suppression avec un peu de résistance
      const maxSwipe = Math.min(diff, deleteButtonWidth * 1.2)
      // Appliquer une résistance pour un effet plus naturel
      const resistance = maxSwipe > deleteButtonWidth 
        ? deleteButtonWidth + (maxSwipe - deleteButtonWidth) * 0.3
        : maxSwipe
      setSwipeOffset(resistance)
    } else {
      // Swipe vers la droite - utiliser la fonction de mise à jour pour avoir la valeur actuelle
      setSwipeOffset((currentOffset) => {
        const newOffset = currentOffset + diff * 0.5
        return Math.max(0, newOffset)
      })
    }
  }

  const handleTouchEnd = () => {
    setIsSwiping(false)
    
    // Utiliser la fonction de mise à jour pour avoir la valeur actuelle
    setSwipeOffset((currentOffset) => {
      // Si on a swipé plus de 40% de la largeur du bouton, révéler complètement le bouton
      // Sinon, revenir à 0 (fermer)
      if (currentOffset > deleteButtonWidth * 0.4) {
        return deleteButtonWidth
      } else {
        return 0
      }
    })
  }

  // Réinitialiser le swipe si on clique ailleurs ou si on scroll
  useEffect(() => {
    if (swipeOffset === 0) return

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setSwipeOffset(0)
      }
    }

    const handleScroll = () => {
      // Fermer le bouton si l'utilisateur scroll
      setSwipeOffset(0)
    }

    document.addEventListener('click', handleClickOutside, true)
    document.addEventListener('touchstart', handleClickOutside, true)
    window.addEventListener('scroll', handleScroll, true)
    
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('touchstart', handleClickOutside, true)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [swipeOffset])

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Fermer le bouton et appeler la fonction de suppression
    // (la confirmation sera gérée dans handleDeleteConversation)
    setSwipeOffset(0)
    onDelete(conversation.id)
  }

  return (
    <div
      ref={itemRef}
      className="relative overflow-hidden"
      style={{
        // Empêcher le scroll horizontal sur le conteneur parent
        touchAction: 'pan-y',
        backgroundColor: '#f9fafb' // bg-gray-50
      }}
    >
      {/* Bouton de suppression (caché derrière le contenu, révélé par le swipe) */}
      <div
        className="absolute right-0 top-0 h-full flex items-center justify-end pr-4 z-0"
        style={{ 
          width: `${deleteButtonWidth}px`,
        }}
      >
        <button
          onClick={handleDeleteClick}
          disabled={deletingId === conversation.id}
          className="w-full h-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors shadow-lg"
          style={{ minWidth: `${deleteButtonWidth}px` }}
          aria-label="Supprimer la conversation"
        >
          {deletingId === conversation.id ? (
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Conteneur du contenu avec swipe */}
      <div
        className="relative z-10 bg-white"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(-${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
      >

      {/* Contenu de la conversation */}
      <Link
        href={`/${locale}/messages/${conversation.id}`}
        className={`block card p-4 hover:shadow-medium transition-all ${
          hasUnread 
            ? 'bg-primary-50 border-2 border-primary-200' 
            : 'bg-white border border-gray-200'
        }`}
        onClick={(e) => {
          // Si le bouton delete est visible (swipe effectué), ne pas ouvrir la conversation
          // L'utilisateur doit d'abord cliquer sur le bouton ou refermer en swipant vers la droite
          const currentOffset = swipeOffset
          if (currentOffset > 0) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        style={{
          // Empêcher le clic sur le lien si le bouton est visible
          pointerEvents: swipeOffset > 0 ? 'none' : 'auto'
        }}
      >
        <div className="flex items-start gap-4">
          {/* Photo avec badge non lu */}
          <div className="flex-shrink-0 relative">
            {participantPhoto ? (
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={participantPhoto}
                  alt={participantPseudo}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg">
                {participantPseudo.charAt(0).toUpperCase()}
              </div>
            )}
            {hasUnread && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                </span>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold truncate ${
                    hasUnread ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {annonceTitle}
                  </h3>
                  {hasUnread && (
                    <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {participantPseudo}
                </p>
              </div>
              {conversation.lastMessage && (
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                  <span className={`text-xs ${
                    hasUnread ? 'text-primary font-semibold' : 'text-gray-500'
                  }`}>
                    {formatDate(conversation.lastMessage.date_envoi)}
                  </span>
                </div>
              )}
            </div>
            {conversation.lastMessage && (
              <p className={`text-sm line-clamp-2 ${
                hasUnread 
                  ? 'font-medium text-gray-900' 
                  : 'text-gray-600'
              }`}>
                {conversation.lastMessage.contenu}
              </p>
            )}
            {!conversation.lastMessage && (
              <p className="text-sm text-gray-500 italic">
                Aucun message pour le moment
              </p>
            )}
          </div>
        </div>
      </Link>
      </div>
    </div>
  )
}

