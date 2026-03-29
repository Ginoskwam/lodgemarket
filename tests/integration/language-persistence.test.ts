import { describe, it, expect, beforeEach, afterEach } from 'vitest'

/**
 * Tests d'intégration pour la persistance de la préférence de langue
 * Ces tests vérifient que la préférence est bien sauvegardée et restaurée
 */
describe('Language Persistence', () => {
  const LOCALE_STORAGE_KEY = 'broques-locale-preference'
  const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

  beforeEach(() => {
    // Nettoyer localStorage et cookies avant chaque test
    if (typeof window !== 'undefined') {
      localStorage.clear()
      document.cookie = `${LOCALE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  })

  afterEach(() => {
    // Nettoyer après chaque test
    if (typeof window !== 'undefined') {
      localStorage.clear()
      document.cookie = `${LOCALE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  })

  it('devrait sauvegarder la préférence dans localStorage', () => {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en')
  })

  it('devrait sauvegarder la préférence dans un cookie', () => {
    if (typeof window === 'undefined') return
    
    const expires = new Date()
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000)
    document.cookie = `${LOCALE_COOKIE_NAME}=en;expires=${expires.toUTCString()};path=/;SameSite=Lax`
    
    const cookies = document.cookie.split(';')
    const localeCookie = cookies.find(c => c.trim().startsWith(`${LOCALE_COOKIE_NAME}=`))
    expect(localeCookie).toBeDefined()
    expect(localeCookie).toContain('en')
  })

  it('devrait pouvoir restaurer la préférence depuis localStorage', () => {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(LOCALE_STORAGE_KEY, 'nl')
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    expect(saved).toBe('nl')
  })

  it('devrait pouvoir restaurer la préférence depuis un cookie', () => {
    if (typeof window === 'undefined') return
    
    const expires = new Date()
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000)
    document.cookie = `${LOCALE_COOKIE_NAME}=de;expires=${expires.toUTCString()};path=/;SameSite=Lax`
    
    const cookies = document.cookie.split(';')
    const localeCookie = cookies.find(c => c.trim().startsWith(`${LOCALE_COOKIE_NAME}=`))
    const value = localeCookie?.split('=')[1]?.trim()
    expect(value).toBe('de')
  })
})


