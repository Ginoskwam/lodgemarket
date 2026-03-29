'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LodgemarketLogo } from '@/components/LodgemarketLogo'

/**
 * Composant interne pour utiliser useSearchParams
 */
function ResetPasswordConfirmForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [validToken, setValidToken] = useState<boolean | null>(null)

  useEffect(() => {
    // Vérifier si on a un token valide dans l'URL
    // Supabase ajoute les paramètres dans le hash (#access_token=...&type=recovery)
    async function checkToken() {
      // Attendre que le hash soit disponible (client-side)
      if (typeof window === 'undefined') return
      
      const supabase = createClient()
      
      // Récupérer le hash de l'URL
      const hash = window.location.hash
      if (!hash) {
        setError('Lien de réinitialisation invalide.')
        setValidToken(false)
        return
      }
      
      const hashParams = new URLSearchParams(hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const type = hashParams.get('type')
      
      if (accessToken && type === 'recovery') {
        // Vérifier que le token est valide en essayant de récupérer la session
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: '', // Pas nécessaire pour la réinitialisation
        })
        
        if (sessionError) {
          setError('Le lien de réinitialisation est invalide ou a expiré.')
          setValidToken(false)
        } else {
          setValidToken(true)
        }
      } else {
        setError('Lien de réinitialisation invalide.')
        setValidToken(false)
      }
    }
    
    checkToken()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      
      // Récupérer le token depuis l'URL
      const hash = window.location.hash
      if (!hash) {
        setError('Token invalide.')
        setLoading(false)
        return
      }
      
      const hashParams = new URLSearchParams(hash.substring(1))
      const accessToken = hashParams.get('access_token')
      
      if (!accessToken) {
        setError('Token invalide.')
        setLoading(false)
        return
      }

      // Définir la session avec le token de récupération
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '',
      })

      if (sessionError) {
        setError('Le lien de réinitialisation est invalide ou a expiré.')
        setLoading(false)
        return
      }

      // Mettre à jour le mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push('/auth/login?password_reset=success')
      }, 2000)
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  if (validToken === null) {
    return (
      <div className="min-h-screen flex items-center">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 md:p-10">
            <div className="text-center">
              <div className="mx-auto mb-4 flex justify-center">
                <LodgemarketLogo size={64} className="drop-shadow-md" />
              </div>
              <p className="body-text text-charbon-secondary">Vérification du lien...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (validToken === false) {
    return (
      <div className="min-h-screen flex items-center">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex justify-center">
                <LodgemarketLogo size={64} className="drop-shadow-md" />
              </div>
              <h1 className="heading-2 mb-2">Lien invalide</h1>
              <p className="body-text text-gray-secondary">
                Le lien de réinitialisation est invalide ou a expiré.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <Link
              href="/auth/reset-password"
              className="btn-primary w-full block text-center"
            >
              Demander un nouveau lien
            </Link>

            <p className="mt-6 text-center text-small">
              <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium">
                ← Retour à la connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex justify-center">
                <LodgemarketLogo size={64} className="drop-shadow-md" />
              </div>
              <h1 className="heading-2 mb-2">Mot de passe réinitialisé</h1>
              <p className="body-text text-gray-secondary">
                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex justify-center">
              <LodgemarketLogo size={64} className="drop-shadow-md" />
            </div>
            <h1 className="heading-2 mb-2">Nouveau mot de passe</h1>
            <p className="body-text text-gray-secondary">
              Entrez votre nouveau mot de passe ci-dessous.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-text mb-2">
                Nouveau mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input"
                placeholder="••••••••"
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-secondary">
                Minimum 6 caractères
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-text mb-2">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>

          <p className="mt-6 text-center text-small">
            <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium">
              ← Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Page de confirmation de réinitialisation de mot de passe
 */
export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 md:p-10">
            <div className="text-center">
              <div className="mx-auto mb-4 flex justify-center">
                <LodgemarketLogo size={64} className="drop-shadow-md" />
              </div>
              <p className="body-text text-charbon-secondary">Chargement...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordConfirmForm />
    </Suspense>
  )
}

