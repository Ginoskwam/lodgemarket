'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import type { Profile } from '@/types/database'
import { LodgemarketLogo } from '@/components/LodgemarketLogo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

/**
 * Header principal de l'application
 * Design moderne et épuré
 */
export function Header() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('header')
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient()
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          setUser(null)
          setUnreadCount(0)
          return
        }
        
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()
          
          if (profile) {
            setUser(profile)
            
            // Charger le nombre de messages non lus (en arrière-plan, ne pas bloquer)
            try {
              const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('destinataire_id', authUser.id)
                .eq('lu', false)
              setUnreadCount(count || 0)
            } catch (error) {
              setUnreadCount(0)
            }
          } else {
            setUser(null)
            setUnreadCount(0)
          }
        } catch (error) {
          setUser(null)
          setUnreadCount(0)
        }
      } catch (error) {
        setUser(null)
        setUnreadCount(0)
      }
    }
    
    loadUser()

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setUnreadCount(0)
      }
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  // Écouter les nouveaux messages en temps réel et les mises à jour
  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    const supabase = createClient()
    const userId = user.id // Stocker l'ID pour éviter les problèmes de typage
    
    async function updateUnreadCount() {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('destinataire_id', userId)
        .eq('lu', false)
      
      setUnreadCount(count || 0)
    }
    
    // Écouter les nouveaux messages et les mises à jour
    let channel: any = null
    let interval: NodeJS.Timeout | null = null
    
    try {
      channel = supabase
        .channel('unread-messages-header')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `destinataire_id=eq.${userId}`,
          },
          () => {
            updateUnreadCount()
          }
        )
        .subscribe()

      // Mettre à jour le compteur toutes les 30 secondes aussi (fallback)
      interval = setInterval(updateUnreadCount, 30000)
    } catch (error) {
      console.warn('Erreur lors de la configuration du channel:', error)
    }

    return () => {
      try {
        if (channel) {
          supabase.removeChannel(channel)
        }
        if (interval) {
          clearInterval(interval)
        }
      } catch (error) {
        // Ignorer les erreurs de nettoyage
      }
    }
  }, [user])

  // Fermer le menu mobile quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        // Vérifier aussi si on ne clique pas sur le bouton hamburger
        const target = event.target as HTMLElement
        if (!target.closest('button[aria-label="Menu"]')) {
          setMobileMenuOpen(false)
        }
      }
    }

    if (mobileMenuOpen) {
      // Petit délai pour éviter que le clic qui ouvre le menu ne le ferme immédiatement
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 100)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [mobileMenuOpen])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push(`/${locale}`)
    router.refresh()
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3 group">
            <div className="group-hover:scale-110 transition-transform">
              <LodgemarketLogo size={40} className="drop-shadow-md" />
            </div>
            <span className="text-xl font-bold text-charbon">
              Lodgemarket
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href={`/${locale}/annonces`}
              className="text-gray-text hover:text-primary font-medium transition-colors"
            >
              {t('announcements')}
            </Link>
            
            {user ? (
              <>
                <Link
                  href={`/${locale}/messages`}
                  className="text-gray-text hover:text-primary font-medium transition-colors relative"
                >
                  {t('messages')}
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href={`/${locale}/annonces/mes-annonces`}
                  className="text-gray-text hover:text-primary font-medium transition-colors"
                >
                  {t('myAnnouncements')}
                </Link>
                <Link
                  href={`/${locale}/annonces/nouvelle`}
                  className="btn-primary text-sm px-4 py-2"
                >
                  {t('publish')}
                </Link>
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <LanguageSwitcher />
                  <Link
                    href={`/${locale}/profil/modifier`}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    {user.photo_profil ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={user.photo_profil}
                          alt={user.pseudo}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xs">
                        {user.pseudo.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-text">
                      {user.pseudo}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost text-sm"
                  >
                    {t('logout')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <LanguageSwitcher />
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-gray-text hover:text-primary font-medium transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="btn-primary text-sm px-4 py-2"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </nav>

          {/* Menu mobile */}
          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitcher />
            {/* Bouton Annonces avec icône loupe */}
            <Link
              href={`/${locale}/annonces`}
              className="p-2 text-gray-text hover:text-primary transition-colors"
              aria-label="Rechercher des annonces"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>

            {user ? (
              <>
                {/* Menu Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-gray-text hover:text-primary transition-colors"
                  aria-label="Menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </>
            ) : (
              <Link href={`/${locale}/auth/login`} className="btn-primary text-sm px-4 py-2">
                {t('login')}
              </Link>
            )}
          </div>

          {/* Menu déroulant mobile */}
          {mobileMenuOpen && user && (
            <div ref={mobileMenuRef} className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-3">
                  <Link
                    href={`/${locale}/profil/modifier`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {user.photo_profil ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={user.photo_profil}
                          alt={user.pseudo}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                        {user.pseudo.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-text">{user.pseudo}</span>
                      <span className="text-sm text-gray-secondary">{t('profile')}</span>
                    </div>
                  </Link>

                  <Link
                    href={`/${locale}/messages`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors relative"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-text"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="font-medium text-gray-text">{t('messages')}</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full px-2 py-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href={`/${locale}/annonces/mes-annonces`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-text"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="font-medium text-gray-text">{t('myAnnouncements')}</span>
                  </Link>

                  <Link
                    href={`/${locale}/annonces/nouvelle`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors mt-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>{t('publish')}</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-medium text-red-600">{t('logout')}</span>
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
