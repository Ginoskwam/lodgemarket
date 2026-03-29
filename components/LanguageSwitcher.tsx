'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales } from '@/i18n'

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'
const LOCALE_STORAGE_KEY = 'broques-locale-preference'

// Mapping des locales vers les drapeaux Unicode
const localeFlags: Record<string, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  nl: '🇳🇱',
  de: '🇩🇪',
}

/**
 * Fonction pour définir un cookie
 */
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

/**
 * Composant de sélection de langue avec drapeaux et persistance
 */
export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const fallbackLocale = useLocale() // Fallback si pas de locale dans l'URL
  const [mounted, setMounted] = useState(false)
  
  // Extraire la locale depuis le pathname pour qu'elle soit toujours à jour
  // Cela garantit que le dropdown reflète toujours la locale actuelle dans l'URL
  const segments = pathname.split('/').filter(Boolean)
  const localeFromPath = segments.length > 0 && locales.includes(segments[0] as any) 
    ? segments[0] 
    : fallbackLocale
  
  const locale = localeFromPath

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Le pathname change déclenchera automatiquement un re-render
  // car il est utilisé dans le calcul de `locale`, ce qui mettra à jour le dropdown

  function handleLanguageChange(newLocale: string) {
    // Sauvegarder la préférence dans localStorage (pour référence côté client)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
      // Définir aussi un cookie pour que le middleware puisse le lire
      setCookie(LOCALE_COOKIE_NAME, newLocale, 365)
    }
    
    // Remplacer la locale actuelle dans le chemin
    const segments = pathname.split('/').filter(Boolean)
    
    // Si le premier segment est une locale valide, la remplacer
    if (segments.length > 0 && locales.includes(segments[0] as any)) {
      segments[0] = newLocale
    } else {
      // Sinon, ajouter la locale au début
      segments.unshift(newLocale)
    }
    
    const newPath = '/' + segments.join('/')
    router.push(newPath)
    router.refresh()
  }

  // Ne pas rendre le select jusqu'à ce que le composant soit monté (évite l'hydratation mismatch)
  if (!mounted) {
    return (
      <div className="relative w-12 h-8">
        <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="input text-sm py-1.5 pl-8 pr-6 cursor-pointer appearance-none bg-transparent border-0 rounded-lg transition-colors h-8 w-12 overflow-hidden language-selector"
        aria-label="Sélectionner la langue"
        style={{ 
          color: 'transparent',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          backgroundImage: 'none', // Désactiver la flèche de background-image du CSS global
        }}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} style={{ color: '#000' }}>
            {localeFlags[loc]} {loc.toUpperCase()}
          </option>
        ))}
      </select>
      {/* Afficher le drapeau actuel dans le select (superposé) - centré entre le bord gauche et la flèche */}
      <div className="absolute left-[calc(50%-0.75rem)] top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-lg leading-none select-none z-10">
        {localeFlags[locale]}
      </div>
      {/* Flèche de dropdown - seulement celle-ci, pas la flèche native du select */}
      <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
        <svg
          className="w-3 h-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}

