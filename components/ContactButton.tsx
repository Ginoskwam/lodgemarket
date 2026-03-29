'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

/**
 * Bouton pour contacter le propriétaire d'une annonce
 * Gère la création de conversation si nécessaire et redirige vers la messagerie
 */
export function ContactButton({
  annonceId,
  proprietaireId,
}: {
  annonceId: string
  proprietaireId: string
}) {
  const locale = useLocale()
  const t = useTranslations('common')
  const tContact = useTranslations('contact')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      
      // Vérifier si l'utilisateur est le propriétaire
      if (user && user.id === proprietaireId) {
        setIsOwner(true)
      } else {
        setIsOwner(false)
      }
    }
    
    checkAuth()

    // Écouter les changements d'authentification
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true)
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [proprietaireId])

  // Ne pas afficher le bouton si l'utilisateur est le propriétaire
  if (isOwner) {
    return null
  }

  async function handleContact() {
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Attendre un peu et réessayer plusieurs fois pour s'assurer que la session est bien établie
      let user = null
      let attempts = 0
      const maxAttempts = 5
      
      while (!user && attempts < maxAttempts) {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authUser && !authError) {
          user = authUser
          break
        }
        
        attempts++
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 400))
        }
      }

      if (!user) {
        console.log('User not authenticated after', maxAttempts, 'attempts, redirecting to login')
        router.push(`/${locale}/auth/login?redirect=/${locale}/annonces/${annonceId}`)
        setLoading(false)
        return
      }

      console.log('User authenticated:', user.id)

      // Vérifier si une conversation existe déjà
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('annonce_id', annonceId)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .single()

      if (existingConversation) {
        // Conversation existante, rediriger vers celle-ci
        // Utiliser window.location pour forcer un refresh complet et synchroniser la session serveur
        window.location.href = `/${locale}/messages/${existingConversation.id}`
        return
      }

      // Créer une nouvelle conversation
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          annonce_id: annonceId,
          participant1_id: proprietaireId,
          participant2_id: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur création conversation:', error)
        alert('Erreur lors de la création de la conversation: ' + error.message)
        setLoading(false)
        return
      }

      // Attendre un peu pour que la conversation soit bien créée
      await new Promise(resolve => setTimeout(resolve, 300))

      // Rediriger vers la nouvelle conversation
      // Utiliser window.location pour forcer un refresh complet et synchroniser la session serveur
      window.location.href = `/${locale}/messages/${newConversation.id}`
    } catch (err) {
      console.error('Erreur:', err)
      alert(t('error'))
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className="btn-primary w-full"
    >
      {loading ? t('loading') : tContact('contactOwner')}
    </button>
  )
}

