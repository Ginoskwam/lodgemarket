'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LodgemarketLogo } from '@/components/LodgemarketLogo'

/**
 * Page de demande de réinitialisation de mot de passe
 */
export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Encoder l'email pour l'URL
      const encodedEmail = encodeURIComponent(email)
      
      // Construire l'URL de redirection avec le token
      // Supabase va ajouter automatiquement les paramètres #access_token et #type=recovery
      const redirectTo = `${window.location.origin}/auth/reset-password/confirm?email=${encodedEmail}`
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (resetError) {
        setError(resetError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
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
              <h1 className="heading-2 mb-2">Email envoyé</h1>
              <p className="body-text text-gray-secondary">
                Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">
                <strong>Vérifiez votre boîte de réception</strong> (et vos spams) pour le lien de réinitialisation.
              </p>
            </div>

            <Link
              href="/auth/login"
              className="btn-primary w-full block text-center"
            >
              Retour à la connexion
            </Link>
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
            <h1 className="heading-2 mb-2">Mot de passe oublié</h1>
            <p className="body-text text-gray-secondary">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-text mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="votre@email.com"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
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

