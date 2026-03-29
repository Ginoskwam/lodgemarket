import { useLocale } from 'next-intl'

/**
 * Hook pour obtenir un lien localisé
 * Usage: const link = useLocalizedLink('/annonces') // retourne '/fr/annonces'
 */
export function useLocalizedLink(path: string): string {
  const locale = useLocale()
  // Enlever le slash initial si présent
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `/${locale}/${cleanPath}`
}

/**
 * Fonction utilitaire pour créer un lien localisé (pour Server Components)
 */
export function getLocalizedLink(locale: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `/${locale}/${cleanPath}`
}


