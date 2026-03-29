'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CityAutocomplete } from '@/components/AddressAutocomplete'
import { LodgemarketLogo } from '@/components/LodgemarketLogo'

/**
 * Page d'inscription
 * Design moderne et clair
 */
export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [ville, setVille] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    // Vérifier la longueur minimale du mot de passe
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login?registered=true&email=${encodeURIComponent(email)}`
        }
      })

      if (signUpError) {
        // Gestion spécifique de l'erreur d'envoi d'email
        if (signUpError.message.includes('confirmation email') || 
            signUpError.message.includes('Error sending') ||
            signUpError.message.toLowerCase().includes('email')) {
          console.error('Erreur envoi email confirmation:', signUpError)
          // Si le compte a été créé malgré l'erreur d'email, on continue
          if (authData?.user) {
            console.warn('Compte créé mais email de confirmation non envoyé. Continuation de l\'inscription...')
            // On continue quand même avec la création du profil et la connexion
            // L'utilisateur pourra se connecter même sans confirmation si c'est configuré ainsi
          } else {
            setError('Erreur lors de l\'envoi de l\'email de confirmation. Le compte n\'a pas pu être créé. Vérifiez la configuration des emails dans Supabase (voir FIX_EMAIL_CONFIRMATION.md) ou contactez le support.')
            setLoading(false)
            return
          }
        } else {
          setError(signUpError.message)
          setLoading(false)
          return
        }
      }

      if (!authData.user) {
        setError('Erreur lors de la création du compte')
        setLoading(false)
        return
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          pseudo,
          ville: ville || null,
          description: null,
          telephone_verifie: false,
          is_active: true,
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('Erreur mise à jour profil:', profileError)
      }

      setSuccess(true)
      setLoading(false)

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('Compte créé ! Veuillez vous connecter.')
        setSuccess(false)
        setTimeout(() => {
          router.push('/auth/login?registered=true&email=' + encodeURIComponent(email))
        }, 2000)
        return
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Vérifier que la session est bien établie avant de rediriger
      const { data: { session: finalSession } } = await supabase.auth.getSession()
      
      if (finalSession) {
        setTimeout(() => {
          window.location.href = '/annonces/mes-annonces'
        }, 1000)
      } else {
        setError('Compte créé ! Veuillez vous connecter.')
        setSuccess(false)
        setTimeout(() => {
          router.push('/auth/login?registered=true&email=' + encodeURIComponent(email))
        }, 2000)
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

    return (
      <div className="min-h-screen flex items-center">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex justify-center">
                <LodgemarketLogo size={64} className="drop-shadow-md" />
              </div>
              <h1 className="heading-2 mb-2">Inscription</h1>
              <p className="body-text text-gray-secondary">
                Rejoignez la communauté Lodgemarket
              </p>
            </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              Compte créé avec succès ! Connexion en cours...
            </div>
          )}

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
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-text mb-2">
                Mot de passe
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
              />
              <p className="mt-1 text-small text-gray-secondary">Minimum 6 caractères</p>
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
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-small text-red-600">Les mots de passe ne correspondent pas</p>
              )}
              {confirmPassword && password === confirmPassword && password.length >= 6 && (
                <p className="mt-1 text-small text-green-600">✓ Les mots de passe correspondent</p>
              )}
            </div>

            <div>
              <label htmlFor="pseudo" className="block text-sm font-medium text-gray-text mb-2">
                Pseudo *
              </label>
              <input
                id="pseudo"
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                required
                className="input"
                placeholder="Votre pseudo"
              />
            </div>

            <div>
              <label htmlFor="ville" className="block text-sm font-medium text-gray-text mb-2">
                Ville (optionnel)
              </label>
              <CityAutocomplete
                value={ville}
                onChange={setVille}
                placeholder="Votre ville"
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-small">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
