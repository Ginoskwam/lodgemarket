'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Composant pour protéger une page et rediriger vers la connexion si l'utilisateur n'est pas authentifié
 */
export function AuthGuard({ children, redirectTo }: { children: React.ReactNode; redirectTo?: string }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        const currentPath = window.location.pathname + window.location.search
        const redirect = redirectTo || `/auth/login?redirect=${encodeURIComponent(currentPath)}`
        router.push(redirect)
        return
      }
      
      setIsAuthenticated(true)
    }

    checkAuth()

    // Écouter les changements d'authentification
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true)
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        const currentPath = window.location.pathname + window.location.search
        const redirect = redirectTo || `/auth/login?redirect=${encodeURIComponent(currentPath)}`
        router.push(redirect)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, redirectTo])

  if (isAuthenticated === null) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-secondary">Chargement...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

