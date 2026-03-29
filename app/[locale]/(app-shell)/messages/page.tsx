'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { updateBadgeFromUnreadMessages } from '@/lib/badge'
import { ConversationItem } from '@/components/ConversationItem'
import type { Annonce, Profile } from '@/types/database'

type SortOption = 'recent' | 'oldest' | 'unread'
type FilterOption = 'all' | 'unread'

/**
 * Page inbox - Liste des conversations
 * Design amélioré avec tri, filtres et suppression
 */
export default function MessagesPage() {
  const locale = useLocale()
  const t = useTranslations('messages')
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<any[]>([])
  const [filteredConversations, setFilteredConversations] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        router.push(`/${locale}/auth/login?redirect=/${locale}/messages`)
        return
      }

      setUser(authUser)

      // Récupérer les conversations
      // Pour l'instant, on ne filtre pas les conversations supprimées car les colonnes n'existent peut-être pas encore
      const { data: convs, error } = await supabase
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
        .or(`participant1_id.eq.${authUser.id},participant2_id.eq.${authUser.id}`)
        .order('derniere_activite', { ascending: false })

      // Filtrer les conversations supprimées côté client si les colonnes existent
      // Pour l'instant, on inclut toutes les conversations
      const filteredConvs = (convs || []).filter((conv: any) => {
        // Vérifier si les colonnes de soft delete existent et sont définies
        const hasSoftDelete = 'deleted_by_participant1' in conv || 'deleted_by_participant2' in conv
        
        if (!hasSoftDelete) {
          // Si les colonnes n'existent pas, inclure toutes les conversations
          return true
        }
        
        // Si les colonnes existent, filtrer
        if (conv.participant1_id === authUser.id) {
          return conv.deleted_by_participant1 !== true
        } else if (conv.participant2_id === authUser.id) {
          return conv.deleted_by_participant2 !== true
        }
        return true
      })

      if (error) {
        console.error('Erreur lors du chargement des conversations:', error)
        setLoading(false)
        return
      }

      // Pour chaque conversation, récupérer le dernier message et compter les non lus
      const conversationsWithDetails = await Promise.all(
        filteredConvs.map(async (conv: any) => {
          // Dernier message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('date_envoi', { ascending: false })
            .limit(1)
            .single()

          // Compter les messages non lus
          // Pour l'instant, on ne filtre pas les messages supprimés car la colonne n'existe peut-être pas encore
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('destinataire_id', authUser.id)
            .eq('lu', false)

          return {
            ...conv,
            lastMessage: lastMessage || null,
            unreadCount: unreadCount || 0,
          }
        })
      )

      setConversations(conversationsWithDetails)
      setLoading(false)

      // Mettre à jour le badge avec le nombre de messages non lus
      await updateBadgeFromUnreadMessages(authUser.id)
    }

    loadData()
  }, [router])

  // Fonction de tri et filtrage
  useEffect(() => {
    let filtered = [...conversations]

    // Filtre par non lus
    if (filterBy === 'unread') {
      filtered = filtered.filter(conv => (conv.unreadCount || 0) > 0)
    }

    // Recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(conv => {
        const annonce = conv.annonce as Annonce
        const otherParticipant =
          conv.participant1_id === user?.id
            ? (conv.participant2 as Profile)
            : (conv.participant1 as Profile)
        
        return (
          annonce.titre.toLowerCase().includes(query) ||
          otherParticipant.pseudo.toLowerCase().includes(query) ||
          (conv.lastMessage?.contenu?.toLowerCase().includes(query) || false)
        )
      })
    }

    // Tri
    filtered.sort((a, b) => {
      const dateA = a.lastMessage?.date_envoi || a.derniere_activite || a.date_creation
      const dateB = b.lastMessage?.date_envoi || b.derniere_activite || b.date_creation
      
      if (sortBy === 'recent') {
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      } else if (sortBy === 'oldest') {
        return new Date(dateA).getTime() - new Date(dateB).getTime()
      } else if (sortBy === 'unread') {
        // D'abord les non lus, puis par date
        const unreadA = (a.unreadCount || 0) > 0 ? 1 : 0
        const unreadB = (b.unreadCount || 0) > 0 ? 1 : 0
        if (unreadA !== unreadB) {
          return unreadB - unreadA
        }
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      }
      return 0
    })

    setFilteredConversations(filtered)
  }, [conversations, sortBy, filterBy, searchQuery, user])

  // Fonction de suppression de conversation (soft delete)
  async function handleDeleteConversation(conversationId: string) {
    if (!confirm(t('deleteConfirm'))) {
      return
    }

    setDeletingId(conversationId)
    const supabase = createClient()

    try {
      // Récupérer la conversation pour déterminer quel participant supprime
      const { data: conversation, error: convFetchError } = await supabase
        .from('conversations')
        .select('participant1_id, participant2_id')
        .eq('id', conversationId)
        .single()

      if (convFetchError || !conversation) {
        console.error('Erreur lors de la récupération de la conversation:', convFetchError)
        alert('Erreur lors de la suppression')
        setDeletingId(null)
        return
      }

      // Vérifier si les colonnes de soft delete existent en essayant de les lire
      const { data: testConv } = await supabase
        .from('conversations')
        .select('deleted_by_participant1, deleted_by_participant2')
        .eq('id', conversationId)
        .limit(1)
        .single()

      const hasSoftDeleteColumns = testConv && ('deleted_by_participant1' in testConv || 'deleted_by_participant2' in testConv)

      if (!hasSoftDeleteColumns) {
        alert('La fonctionnalité de suppression nécessite une mise à jour de la base de données. Veuillez exécuter la migration SQL dans Supabase.')
        setDeletingId(null)
        return
      }

      // Déterminer quel champ mettre à jour selon l'utilisateur
      const isParticipant1 = conversation.participant1_id === user?.id
      const updateField = isParticipant1 ? 'deleted_by_participant1' : 'deleted_by_participant2'

      // Marquer la conversation comme supprimée pour cet utilisateur (soft delete)
      const { error: convError } = await supabase
        .from('conversations')
        .update({ [updateField]: true })
        .eq('id', conversationId)

      if (convError) {
        console.error('Erreur lors de la suppression de la conversation:', convError)
        alert('Erreur lors de la suppression')
        setDeletingId(null)
        return
      }

      // Marquer tous les messages de la conversation comme supprimés pour cet utilisateur
      try {
        // On marque les messages où l'utilisateur est expéditeur
        await supabase
          .from('messages')
          .update({ deleted_by_expediteur: true })
          .eq('conversation_id', conversationId)
          .eq('expediteur_id', user?.id)

        // On marque aussi les messages où l'utilisateur est destinataire
        await supabase
          .from('messages')
          .update({ deleted_by_destinataire: true })
          .eq('conversation_id', conversationId)
          .eq('destinataire_id', user?.id)
      } catch (e) {
        // Si les colonnes n'existent pas, on continue quand même
        console.warn('Les colonnes de soft delete pour les messages n\'existent pas encore')
      }

      // Retirer de la liste locale
      setConversations(conversations.filter(conv => conv.id !== conversationId))
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setDeletingId(null)
    }
  }

  // Calculer le total de messages non lus
  const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)

  const tCommon = useTranslations('common')
  
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">{tCommon('loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="heading-1 mb-2">{t('title')}</h1>
              <p className="body-text text-charbon-secondary">
                {t('conversationsCount', { count: conversations.length })}
                {totalUnread > 0 && (
                  <span className="ml-2">
                    • <span className="text-primary font-semibold">{t('unreadCount', { count: totalUnread })}</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="space-y-4">
            {/* Recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filtres et tri */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Filtre par statut */}
              <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
                <button
                  onClick={() => setFilterBy('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filterBy === 'all'
                      ? 'bg-primary text-white'
                      : 'text-charbon-secondary hover:text-charbon-text'
                  }`}
                >
                  {t('all')}
                </button>
                <button
                  onClick={() => setFilterBy('unread')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filterBy === 'unread'
                      ? 'bg-primary text-white'
                      : 'text-charbon-secondary hover:text-charbon-text'
                  }`}
                >
                  {t('unread')}
                </button>
              </div>

              {/* Tri */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-charbon-text whitespace-nowrap">{t('sortBy')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="input text-sm"
                >
                  <option value="recent">{t('mostRecent')}</option>
                  <option value="oldest">{t('oldest')}</option>
                  <option value="unread">{t('unreadFirst')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {!conversations || conversations.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="heading-3 mb-2">{t('noConversations')}</h2>
            <p className="body-text text-charbon-secondary mb-8">
              {t('noConversationsDescription')}
            </p>
            <Link href={`/${locale}/annonces`} className="btn-primary inline-block">
              {t('viewAnnouncements')}
            </Link>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="heading-3 mb-2">{t('noSearchResults')}</h2>
            <p className="body-text text-charbon-secondary mb-8">
              {t('noSearchResultsDescription')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterBy('all')
              }}
              className="btn-secondary inline-block"
            >
              {t('resetFilters')}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conv: any) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                user={user}
                onDelete={handleDeleteConversation}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
