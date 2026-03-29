'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Message, Profile } from '@/types/database'

/**
 * Composant pour afficher et gérer une conversation
 * Design moderne style WhatsApp
 */
export function ConversationView({
  conversationId,
  currentUserId,
  otherParticipant,
  onProfileClick,
}: {
  conversationId: string
  currentUserId: string
  otherParticipant: Profile
  onProfileClick?: () => void
}) {
  const locale = useLocale()
  const t = useTranslations('conversation')
  const [messages, setMessages] = useState<Array<Message & { expediteur: Profile }>>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  useEffect(() => {
    loadMessages()

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          loadMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  // Ne pas scroller automatiquement vers le bas sur mobile/tablette
  // pour éviter que la page ne scroll vers le bas lors de l'ouverture
  useEffect(() => {
    // Vérifier si on est sur mobile/tablette (largeur < 1024px)
    const isMobileOrTablet = window.innerWidth < 1024
    
    if (!isMobileOrTablet) {
      // Sur desktop, on peut scroller vers le bas pour voir les nouveaux messages
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    // Sur mobile/tablette, on ne fait rien pour garder la conversation centrée
  }, [messages])

  async function loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        expediteur:profiles!messages_expediteur_id_fkey(*)
      `)
      .eq('conversation_id', conversationId)
      .order('date_envoi', { ascending: true })

    if (error) {
      console.error('Erreur chargement messages:', error)
      return
    }

    // Filtrer les messages supprimés pour l'utilisateur actuel (si les colonnes existent)
    const filteredMessages = (data || []).filter((msg: any) => {
      // Vérifier si les colonnes de soft delete existent
      const hasSoftDelete = 'deleted_by_expediteur' in msg || 'deleted_by_destinataire' in msg
      
      if (!hasSoftDelete) {
        // Si les colonnes n'existent pas, inclure tous les messages
        return true
      }
      
      // Si les colonnes existent, filtrer
      if (msg.expediteur_id === currentUserId) {
        return msg.deleted_by_expediteur !== true
      }
      if (msg.destinataire_id === currentUserId) {
        return msg.deleted_by_destinataire !== true
      }
      return true
    })

    setMessages(filteredMessages)
    setLoading(false)
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)

    try {
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          expediteur_id: currentUserId,
          destinataire_id: otherParticipant.id,
          contenu: newMessage.trim(),
          lu: false,
        })
        .select()
        .single()

      if (messageError) {
        console.error('Erreur envoi message:', messageError)
        alert(t('sendError'))
        setSending(false)
        return
      }

      await supabase
        .from('conversations')
        .update({ derniere_activite: new Date().toISOString() })
        .eq('id', conversationId)

      const { data: conversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()

      if (conversation) {
        const shouldSendEmail =
          !conversation.dernier_email_notif ||
          new Date(conversation.dernier_email_notif).getTime() <
            Date.now() - 10 * 60 * 1000

        if (shouldSendEmail) {
          const { data: annonce } = await supabase
            .from('annonces')
            .select('titre')
            .eq('id', conversation.annonce_id)
            .single()

          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('pseudo')
            .eq('id', currentUserId)
            .single()

          if (annonce && senderProfile) {
            await supabase
              .from('conversations')
              .update({ dernier_email_notif: new Date().toISOString() })
              .eq('id', conversationId)
          }
        }

        // Envoyer une notification push au destinataire
        try {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('pseudo')
            .eq('id', currentUserId)
            .single()

          const senderName = senderProfile?.pseudo || 'Quelqu\'un'
          const messagePreview = newMessage.trim().length > 100 
            ? newMessage.trim().substring(0, 100) + '...'
            : newMessage.trim()

          await fetch('/api/push/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: otherParticipant.id,
              title: `${senderName} vous a envoyé un message`,
              body: messagePreview,
              url: `/messages/${conversationId}`,
              data: {
                conversationId,
                messageId: message.id
              }
            }),
          })
        } catch (pushError) {
          // Ne pas bloquer l'envoi du message si la notification push échoue
          console.error('Erreur lors de l\'envoi de la notification push:', pushError)
        }
      }

      setNewMessage('')
      await loadMessages()
      setSending(false)
    } catch (err) {
      console.error('Erreur:', err)
      alert(t('error'))
      setSending(false)
    }
  }

  async function handleMarkAsUnread(messageId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ lu: false })
      .eq('id', messageId)

    if (error) {
      console.error('Erreur lors du marquage comme non lu:', error)
      alert('Erreur lors du marquage comme non lu')
      return
    }

    // Mettre à jour l'état local
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, lu: false } : msg
    ))
  }

  async function handleDeleteMessage(messageId: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ? Il sera masqué pour vous mais restera visible pour l\'autre personne.')) {
      return
    }

    try {
      // Récupérer le message pour déterminer si l'utilisateur est expéditeur ou destinataire
      const message = messages.find(msg => msg.id === messageId)
      if (!message) {
        return
      }

      // Vérifier si les colonnes de soft delete existent
      const { data: testMessage } = await supabase
        .from('messages')
        .select('deleted_by_expediteur, deleted_by_destinataire')
        .eq('id', messageId)
        .limit(1)
        .single()

      const hasSoftDeleteColumns = testMessage && ('deleted_by_expediteur' in testMessage || 'deleted_by_destinataire' in testMessage)

      if (!hasSoftDeleteColumns) {
        alert('La fonctionnalité de suppression nécessite une mise à jour de la base de données. Veuillez exécuter la migration SQL dans Supabase.')
        return
      }

      const isExpediteur = message.expediteur_id === currentUserId
      const updateField = isExpediteur ? 'deleted_by_expediteur' : 'deleted_by_destinataire'

      // Marquer le message comme supprimé pour cet utilisateur (soft delete)
      const { error } = await supabase
        .from('messages')
        .update({ [updateField]: true })
        .eq('id', messageId)

      if (error) {
        console.error('Erreur lors de la suppression du message:', error)
        alert('Erreur lors de la suppression')
        return
      }

      // Retirer le message de la liste locale
      setMessages(messages.filter(msg => msg.id !== messageId))
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-4xl mb-4 animate-pulse">💬</div>
        <p className="text-gray-600">Chargement des messages...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden" style={{ height: '600px' }}>
      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 flex flex-col">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👋</div>
            <p className="font-medium text-gray-900 mb-1">
              {t('noMessages')}
            </p>
            <p className="text-sm text-gray-500">
              {t('noMessagesDescription')}
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isFromCurrentUser = message.expediteur_id === currentUserId
            const canMarkUnread = isFromCurrentUser && message.lu

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 w-full group ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {!isFromCurrentUser && (
                  <button
                    onClick={onProfileClick}
                    className="flex-shrink-0 w-8 h-8 hover:opacity-80 transition-opacity cursor-pointer"
                    type="button"
                  >
                    {message.expediteur.photo_profil ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={message.expediteur.photo_profil}
                          alt={message.expediteur.pseudo}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
                        {message.expediteur.pseudo.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                )}
                
                <div className="relative">
                  <div
                    className={`max-w-xs lg:max-w-md px-5 py-3 rounded-xl ${
                      isFromCurrentUser
                        ? 'bg-primary text-white rounded-br-sm shadow-warm'
                        : 'bg-white text-gray-text border border-gray-200 rounded-bl-sm shadow-soft'
                    }`}
                  >
                    {!isFromCurrentUser && (
                      <p className="text-xs font-semibold mb-1.5 text-gray-600">
                        {message.expediteur.pseudo}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {message.contenu}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p
                        className={`text-xs ${
                          isFromCurrentUser ? 'text-white/80' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.date_envoi).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {isFromCurrentUser && (
                        <span className={`text-xs ml-2 ${
                          message.lu ? 'text-white/80' : 'text-white/60'
                        }`}>
                          {message.lu ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Boutons d'action (marquer comme non lu et supprimer) */}
                  {hoveredMessageId === message.id && (
                    <div className="absolute -right-24 top-1/2 transform -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      {canMarkUnread && (
                        <button
                          onClick={() => handleMarkAsUnread(message.id)}
                          className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-charbon-text hover:bg-gray-50 shadow-soft"
                          title="Marquer comme non lu"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="bg-white border border-red-200 rounded-lg px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 shadow-soft"
                        title="Supprimer le message"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {isFromCurrentUser && (
                  <div className="w-8 flex-shrink-0" />
                )}
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire d'envoi */}
      <div className="border-t border-gray-200/50 p-5 bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('typeMessage')}
            className="input flex-1"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="btn-primary"
          >
            {sending ? t('sending') : t('sendMessage')}
          </button>
        </form>
      </div>
    </div>
  )
}
