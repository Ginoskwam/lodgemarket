import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// Mock next-intl
let currentLocale = 'fr'
const mockUseLocale = vi.fn(() => currentLocale)
vi.mock('next-intl', () => ({
  useLocale: () => mockUseLocale(),
}))

// Mock next/navigation
const mockPush = vi.fn()
const mockRefresh = vi.fn()
let mockPathname = '/fr/annonces'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => mockPathname,
}))

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Nettoyer localStorage et cookies avant chaque test
    localStorage.clear()
    document.cookie = ''
    mockPush.mockClear()
    mockRefresh.mockClear()
  })

  it('devrait afficher le drapeau de la locale actuelle', async () => {
    render(<LanguageSwitcher />)
    
    // Attendre que le composant soit monté
    await waitFor(() => {
      const select = screen.getByLabelText('Sélectionner la langue')
      expect(select).toBeInTheDocument()
    })

    // Vérifier que le drapeau français est affiché (locale par défaut)
    await waitFor(() => {
      const flagDisplay = document.querySelector('.absolute.left-2')
      expect(flagDisplay?.textContent).toContain('🇫🇷')
    })
  })

  it('devrait sauvegarder la préférence dans localStorage lors du changement', async () => {
    render(<LanguageSwitcher />)
    
    await waitFor(() => {
      const select = screen.getByLabelText('Sélectionner la langue') as HTMLSelectElement
      expect(select).toBeInTheDocument()
      
      // Changer la langue vers l'anglais
      fireEvent.change(select, { target: { value: 'en' } })
    })

    // Vérifier que la préférence est sauvegardée
    await waitFor(() => {
      expect(localStorage.getItem('broques-locale-preference')).toBe('en')
    })
  })

  it('devrait définir un cookie lors du changement de langue', async () => {
    render(<LanguageSwitcher />)
    
    await waitFor(() => {
      const select = screen.getByLabelText('Sélectionner la langue') as HTMLSelectElement
      expect(select).toBeInTheDocument()
      
      // Changer la langue vers le néerlandais
      fireEvent.change(select, { target: { value: 'nl' } })
    })

    // Vérifier que le cookie est défini
    await waitFor(() => {
      expect(document.cookie).toContain('NEXT_LOCALE=nl')
    })
  })

  it('devrait rediriger vers la nouvelle locale lors du changement', async () => {
    render(<LanguageSwitcher />)
    
    await waitFor(() => {
      const select = screen.getByLabelText('Sélectionner la langue') as HTMLSelectElement
      expect(select).toBeInTheDocument()
      
      // Changer la langue vers l'allemand
      fireEvent.change(select, { target: { value: 'de' } })
    })

    // Vérifier que router.push est appelé avec le bon chemin
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/de/annonces')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('devrait afficher tous les drapeaux dans les options', async () => {
    render(<LanguageSwitcher />)
    
    await waitFor(() => {
      const select = screen.getByLabelText('Sélectionner la langue') as HTMLSelectElement
      expect(select).toBeInTheDocument()
    })
    
    // Vérifier que toutes les options sont présentes avec leurs drapeaux
    const select = screen.getByLabelText('Sélectionner la langue') as HTMLSelectElement
    const options = Array.from(select.options)
    expect(options.length).toBe(4)
    
    const optionTexts = options.map(opt => opt.textContent?.trim())
    expect(optionTexts.some(text => text?.includes('🇫🇷') && text?.includes('FR'))).toBe(true)
    expect(optionTexts.some(text => text?.includes('🇬🇧') && text?.includes('EN'))).toBe(true)
    expect(optionTexts.some(text => text?.includes('🇳🇱') && text?.includes('NL'))).toBe(true)
    expect(optionTexts.some(text => text?.includes('🇩🇪') && text?.includes('DE'))).toBe(true)
  })

  it('devrait gérer correctement les chemins sans locale', async () => {
    // Mock un pathname sans locale
    mockPathname = '/annonces'
    
    render(<LanguageSwitcher />)
    
    await waitFor(() => {
      const select = screen.getByLabelText('Sélectionner la langue') as HTMLSelectElement
      expect(select).toBeInTheDocument()
      
      // Changer la langue
      fireEvent.change(select, { target: { value: 'en' } })
    })

    // Vérifier que la locale est ajoutée au chemin
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en/annonces')
    })
    
    // Restaurer le pathname par défaut
    mockPathname = '/fr/annonces'
  })
})

