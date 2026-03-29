'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Composant d'autocomplétion pour les adresses
 * Utilise Nominatim (OpenStreetMap) pour suggérer des adresses réelles
 */
export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Commencez à taper une adresse...",
  className = "",
  onSelect,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onSelect?: (address: string, lat?: number, lon?: number) => void
}) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function searchAddresses(query: string) {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)

    try {
      // Rechercher avec Nominatim, prioriser la Belgique
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Belgique')}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'lodgemarket-app'
          }
        }
      )

      const data = await response.json()

      if (data && Array.isArray(data)) {
        setSuggestions(data)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Erreur recherche adresse:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    onChange(newValue)
    searchAddresses(newValue)
  }

  function handleSelect(suggestion: any) {
    const displayName = suggestion.display_name.split(',')[0] + ', ' + 
                        suggestion.display_name.split(',').slice(1, 3).join(', ')
    onChange(displayName)
    setShowSuggestions(false)
    
    if (onSelect) {
      onSelect(displayName, parseFloat(suggestion.lat), parseFloat(suggestion.lon))
    }
  }

  function formatSuggestion(suggestion: any) {
    const parts = suggestion.display_name.split(',')
    // Prendre les 3 premières parties (rue, ville, pays)
    return parts.slice(0, 3).join(', ')
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true)
          }
        }}
        placeholder={placeholder}
        className={className}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900 text-sm">
                {formatSuggestion(suggestion)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {suggestion.display_name.split(',').slice(-2).join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

/**
 * Composant d'autocomplétion pour les villes
 * Plus simple, suggère uniquement des villes
 */
export function CityAutocomplete({
  value,
  onChange,
  placeholder = "Commencez à taper une ville...",
  className = "",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function searchCities(query: string) {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)

    try {
      // Rechercher des villes en Belgique
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Belgique')}&limit=8&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'lodgemarket-app'
          }
        }
      )

      const data = await response.json()

      if (data && Array.isArray(data)) {
        // Extraire uniquement les noms de villes uniques
        const cities = data
          .map((item: any) => {
            const address = item.address || {}
            // Prioriser city, puis town, puis village, puis le premier élément du display_name
            const cityName = address.city || address.town || address.village || address.municipality || item.display_name.split(',')[0]
            return cityName ? cityName.trim() : null
          })
          .filter((city: string | null): city is string => 
            city !== null && city.length > 0
          )
          .filter((city: string, index: number, self: string[]) => 
            self.indexOf(city) === index
          )
          .slice(0, 5)
          .map((city: string) => ({ name: city }))

        setSuggestions(cities)
        setShowSuggestions(cities.length > 0)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Erreur recherche ville:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    onChange(newValue)
    searchCities(newValue)
  }

  function handleSelect(cityName: string) {
    onChange(cityName)
    setShowSuggestions(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true)
          }
        }}
        placeholder={placeholder}
        className={className}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(suggestion.name)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900 text-sm">
                {suggestion.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

