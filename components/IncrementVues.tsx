'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Composant pour incrémenter le compteur de vues d'une annonce
 * S'exécute automatiquement quand le composant est monté
 * Ne compte pas si c'est le propriétaire qui consulte
 */
export function IncrementVues({ annonceId, proprietaireId }: { annonceId: string; proprietaireId: string }) {
  const [shouldIncrement, setShouldIncrement] = useState(false)

  useEffect(() => {
    async function checkIfShouldIncrement() {
      const supabase = createClient()
      
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser()
      
      // Ne pas incrémenter si :
      // - L'utilisateur n'est pas connecté (on compte quand même, c'est une vue)
      // - L'utilisateur est le propriétaire de l'annonce
      if (user && user.id === proprietaireId) {
        setShouldIncrement(false)
        return
      }
      
      setShouldIncrement(true)
    }

    checkIfShouldIncrement()
  }, [proprietaireId])

  useEffect(() => {
    // Ne pas incrémenter si c'est le propriétaire
    if (!shouldIncrement) {
      return
    }

    async function incrementVues() {
      const supabase = createClient()
      
      try {
        // Essayer d'utiliser la fonction RPC si elle existe
        const { error: rpcError } = await supabase.rpc('increment_vues', { annonce_id: annonceId })
        
        if (rpcError) {
          // Si la fonction RPC n'existe pas, récupérer la valeur actuelle puis l'incrémenter
          const { data: currentAnnonce } = await supabase
            .from('annonces')
            .select('nombre_vues')
            .eq('id', annonceId)
            .single()
          
          if (currentAnnonce) {
            const newVues = (currentAnnonce.nombre_vues || 0) + 1
            await supabase
              .from('annonces')
              .update({ nombre_vues: newVues })
              .eq('id', annonceId)
          }
        }
      } catch (error) {
        console.error('Erreur incrément vues:', error)
      }
    }

    // Attendre un peu avant d'incrémenter pour éviter les doubles comptages
    const timer = setTimeout(() => {
      incrementVues()
    }, 1000)

    return () => clearTimeout(timer)
  }, [annonceId, shouldIncrement])

  return null
}

