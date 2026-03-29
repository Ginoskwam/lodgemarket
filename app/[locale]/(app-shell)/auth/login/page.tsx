'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LodgemarketLogo } from '@/components/LodgemarketLogo'

/**
 * Composant interne pour utiliser useSearchParams
 */
function LoginForm() {
  const locale = useLocale()
  const t = useTranslations('auth.login')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const redirectTo = searchParams.get('redirect') || `/${locale}/annonces/mes-annonces`
  
  // Vérifier si l'utilisateur est déjà connecté et le rediriger
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // L'utilisateur est déjà connecté, rediriger
        router.push(redirectTo)
      }
    }
    
    checkAuth()
  }, [router, redirectTo])
  
  useEffect(() => {
    const registered = searchParams.get('registered')
    const emailParam = searchParams.get('email')
    const confirmRequired = searchParams.get('confirm')
    const passwordReset = searchParams.get('password_reset')
    
    if (registered === 'true') {
      if (confirmRequired === 'required') {
        setSuccessMessage(t('accountCreatedConfirm'))
      } else {
        setSuccessMessage(t('accountCreated'))
      }
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam))
      }
    }
    
    if (passwordReset === 'success') {
      setSuccessMessage(t('passwordResetSuccess'))
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        setError(t('sessionError'))
        setLoading(false)
        return
      }

      // Attendre que la session soit bien établie
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Vérifier à nouveau que la session est bien établie avant de rediriger
      const { data: { session: finalSession } } = await supabase.auth.getSession()
      
      if (finalSession) {
        // Forcer un refresh complet pour synchroniser la session
        window.location.href = redirectTo
      } else {
        setError(t('sessionError'))
        setLoading(false)
      }
    } catch (err) {
      setError(t('sessionError'))
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
              <h1 className="heading-2 mb-2">{t('title')}</h1>
              <p className="body-text text-gray-secondary">
                {t('subtitle')}
              </p>
            </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {successMessage}
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
                {t('email')}
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
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-text">
                  {t('password')}
                </label>
                <Link 
                  href={`/${locale}/auth/reset-password`} 
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? t('loggingIn') : t('loginButton')}
            </button>
          </form>

          <p className="mt-6 text-center text-small">
            {t('noAccount')}{' '}
            <Link href={`/${locale}/auth/register`} className="text-primary hover:text-primary-dark font-medium">
              {t('createAccount')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Page de connexion
 * Design moderne et clair
 */
export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  )
}
