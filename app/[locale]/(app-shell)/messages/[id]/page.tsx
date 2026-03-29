'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { updateBadgeFromUnreadMessages } from '@/lib/badge'
import { ConversationView } from '@/components/ConversationView'
import { ProfileModal } from '@/components/ProfileModal'
import type { Annonce, Profile } from '@/types/database'

/**
 * Page de conversation
 * Design moderne et clair
 */
export default function ConversationPage({
  params,
}: {
  params: { id: string }
}) {
  const locale = useLocale()
  const t = useTranslations('conversation')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [conversation, setConversation] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [annoncesCount, setAnnoncesCount] = useState(0)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        router.push(`/${locale}/auth/login?redirect=/${locale}/messages/${params.id}`)
        return
      }

      setUser(authUser)

      // Récupérer la conversation
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          annonce_id,
          participant1_id,
          participant2_id,
          date_creation,
          derniere_activite,
          dernier_email_notif,
          annonce:annonces(*),
          participant1:profiles!conversations_participant1_id_fkey(*),
          participant2:profiles!conversations_participant2_id_fkey(*)
        `)
        .eq('id', params.id)
        .single()

      if (convError || !convData) {
        setError(t('error'))
        setLoading(false)
        return
      }

      if (
        convData.participant1_id !== authUser.id &&
        convData.participant2_id !== authUser.id
      ) {
        router.push(`/${locale}/messages`)
        return
      }

      // Vérifier si la conversation est supprimée pour cet utilisateur (si les colonnes existent)
      const convDataAny = convData as any
      const hasSoftDelete = 'deleted_by_participant1' in convDataAny || 'deleted_by_participant2' in convDataAny
      if (hasSoftDelete) {
        const isDeleted = 
          (convDataAny.participant1_id === authUser.id && convDataAny.deleted_by_participant1 === true) ||
          (convDataAny.participant2_id === authUser.id && convDataAny.deleted_by_participant2 === true)

        if (isDeleted) {
          router.push(`/${locale}/messages`)
          return
        }
      }

      setConversation(convData)

      // Compter les annonces actives de l'autre participant
      const otherParticipantId = 
        convData.participant1_id === authUser.id
          ? convData.participant2_id
          : convData.participant1_id

      const { count } = await supabase
        .from('annonces')
        .select('*', { count: 'exact', head: true })
        .eq('proprietaire_id', otherParticipantId)
        .eq('disponible', true)

      setAnnoncesCount(count || 0)

      // Marquer les messages comme lus
      await supabase
        .from('messages')
        .update({ lu: true })
        .eq('conversation_id', convData.id)
        .eq('destinataire_id', authUser.id)
        .eq('lu', false)

      // Mettre à jour le badge après avoir marqué les messages comme lus
      await updateBadgeFromUnreadMessages(authUser.id)

      setLoading(false)
    }

    loadData()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-secondary">{t('loading')}</div>
      </div>
    )
  }

  if (error || !conversation) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-12 text-center">
          <h1 className="heading-2 mb-4">{error || t('error')}</h1>
          <Link href={`/${locale}/messages`} className="btn-primary">
            {t('backToMessages')}
          </Link>
        </div>
      </div>
    )
  }

  const annonce = conversation.annonce as Annonce
  const otherParticipant =
    conversation.participant1_id === user.id
      ? (conversation.participant2 as Profile)
      : (conversation.participant1 as Profile)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link
          href={`/${locale}/messages`}
          className="text-primary hover:text-primary-dark mb-6 inline-block text-sm font-medium"
        >
          {t('backToMessages')}
        </Link>

        {/* Rappel de l'annonce */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-4">
            {annonce.photos && annonce.photos.length > 0 && (
              <div className="w-20 h-20 bg-gray-100 rounded-xl relative flex-shrink-0 overflow-hidden">
                <Image
                  src={annonce.photos[0]}
                  alt={annonce.titre}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link
                href={`/${locale}/annonces/${annonce.id}`}
                className="font-semibold text-gray-text hover:text-primary transition-colors block truncate"
              >
                {annonce.titre}
              </Link>
              <p className="text-small text-gray-secondary mt-1">
                {annonce.ville} • {annonce.prix_jour}€/jour
              </p>
            </div>
          </div>
        </div>

        {/* En-tête conversation */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer group relative"
              title="Voir le profil"
            >
              {otherParticipant.photo_profil ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-colors">
                  <Image
                    src={otherParticipant.photo_profil}
                    alt={otherParticipant.pseudo}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold group-hover:bg-primary-dark transition-colors">
                  {otherParticipant.pseudo.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-2.5 h-2.5 text-white m-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-text">{otherParticipant.pseudo}</h2>
              {otherParticipant.ville && (
                <p className="text-small text-gray-secondary">📍 {otherParticipant.ville}</p>
              )}
            </div>
          </div>
        </div>

        {/* Conversation */}
        <ConversationView
          conversationId={conversation.id}
          currentUserId={user.id}
          otherParticipant={otherParticipant}
          onProfileClick={() => setShowProfileModal(true)}
        />

        {/* Modal profil */}
        <ProfileModal
          profile={otherParticipant}
          annoncesCount={annoncesCount}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      </div>
    </div>
  )
}
