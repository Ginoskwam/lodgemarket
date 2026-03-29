'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { Annonce } from '@/types/database'

// Import dynamique de Leaflet pour éviter les erreurs SSR
// @ts-ignore - react-leaflet types issue with dynamic import
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false }) as any
// @ts-ignore - react-leaflet types issue with dynamic import
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false }) as any
// @ts-ignore - react-leaflet types issue with dynamic import
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false }) as any
// @ts-ignore - react-leaflet types issue with dynamic import
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false }) as any

// Créer une icône personnalisée pour les marqueurs (chargée dynamiquement)
const createCustomIcon = async () => {
  // @ts-ignore - Leaflet types are available but TypeScript can't resolve them in dynamic import
  const L = await import('leaflet')
  const Leaflet = L.default || L
  return Leaflet.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24s16-13 16-24C32 7.163 24.837 0 16 0z" fill="#f97316" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `),
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

/**
 * Composant de carte pour afficher les annonces géographiquement
 * Utilise Leaflet pour afficher une carte interactive
 * 
 * Note: Pour avoir les vraies coordonnées, il faudrait :
 * - Soit demander une adresse complète lors de la création d'annonce
 * - Soit utiliser un service de géocodage (ex: Nominatim) pour convertir les villes en coordonnées
 */
export function AnnoncesMap({ annonces }: { annonces: Annonce[] }) {
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)
  const [customIcon, setCustomIcon] = useState<any>(null)
  // Géocoder les villes pour obtenir les coordonnées
  // Pour simplifier, on utilise un cache et on géocode seulement les villes uniques
  const [coordinates, setCoordinates] = useState<Record<string, [number, number]>>({})
  // Centre par défaut basé sur la ville de l'utilisateur
  const [userCityCenter, setUserCityCenter] = useState<[number, number] | null>(null)

  // Coordonnées par défaut (Belgique)
  const defaultCenter: [number, number] = [50.5039, 4.4699]

  // Éviter les erreurs d'hydratation avec Leaflet
  useEffect(() => {
    setMounted(true)
    // Charger l'icône personnalisée
    createCustomIcon().then(icon => setCustomIcon(icon))
  }, [])

  // Récupérer la ville de l'utilisateur connecté et la géocoder
  useEffect(() => {
    async function loadUserCity() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Récupérer le profil de l'utilisateur
          const { data: profile } = await supabase
            .from('profiles')
            .select('ville')
            .eq('id', user.id)
            .single()

          if (profile?.ville) {
            // Géocoder la ville de l'utilisateur
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(profile.ville + ', Belgique')}&limit=1`,
                {
                  headers: {
                    'User-Agent': 'lodgemarket-app'
                  }
                }
              )
              const data = await response.json()
              
              if (data && data.length > 0) {
                setUserCityCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)])
              } else {
                // Si pas de résultat, essayer sans "Belgique"
                const response2 = await fetch(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(profile.ville)}&limit=1`,
                  {
                    headers: {
                      'User-Agent': 'lodgemarket-app'
                    }
                  }
                )
                const data2 = await response2.json()
                if (data2 && data2.length > 0) {
                  setUserCityCenter([parseFloat(data2[0].lat), parseFloat(data2[0].lon)])
                }
              }
            } catch (error) {
              console.error('Erreur géocodage ville utilisateur:', error)
            }
          }
        }
      } catch (error) {
        console.error('Erreur chargement profil utilisateur:', error)
      }
    }

    loadUserCity()
  }, [])

  useEffect(() => {
    async function geocodeVilles() {
      const villesUniques = Array.from(new Set(annonces.map(a => a.ville)))
      const coords: Record<string, [number, number]> = {}

      for (const ville of villesUniques) {
        try {
          // Utiliser Nominatim (OpenStreetMap) pour géocoder
          // Essayer d'abord avec "Belgique" puis sans
          let response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ville + ', Belgique')}&limit=1`,
            {
              headers: {
                'User-Agent': 'lodgemarket-app'
              }
            }
          )
          let data = await response.json()
          
          // Si pas de résultat avec "Belgique", essayer sans
          if (!data || data.length === 0) {
            response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ville)}&limit=1`,
              {
                headers: {
                  'User-Agent': 'lodgemarket-app'
                }
              }
            )
            data = await response.json()
          }
          
          if (data && data.length > 0) {
            coords[ville] = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
          } else {
            // Si pas de résultat, utiliser le centre par défaut
            coords[ville] = userCityCenter || defaultCenter
          }
        } catch (error) {
          console.error('Erreur géocodage pour', ville, error)
          coords[ville] = userCityCenter || defaultCenter
        }
        
        // Attendre un peu pour respecter le rate limit de Nominatim
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      setCoordinates(coords)
    }

    if (annonces.length > 0) {
      geocodeVilles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annonces, userCityCenter])

  // Calculer le centre de la carte
  // Priorité : ville de l'utilisateur > centre des annonces > Belgique par défaut
  const center = (() => {
    // Si on a la ville de l'utilisateur, l'utiliser
    if (userCityCenter) {
      return userCityCenter
    }
    
    // Sinon, si on a des annonces géocodées, calculer le centre
    if (annonces.length > 0 && Object.keys(coordinates).length > 0) {
      const lats = Object.values(coordinates).map(c => c[0])
      const lngs = Object.values(coordinates).map(c => c[1])
      return [
        (Math.max(...lats) + Math.min(...lats)) / 2,
        (Math.max(...lngs) + Math.min(...lngs)) / 2
      ] as [number, number]
    }
    
    // Sinon, utiliser la Belgique par défaut
    return defaultCenter
  })()
  
  // Calculer le zoom approprié
  const zoom = userCityCenter ? 10 : (annonces.length > 0 && Object.keys(coordinates).length > 0 ? 7 : 8)

  // Early return APRÈS tous les hooks
  if (!mounted) {
    return (
      <div className="h-[600px] bg-warm-100 rounded-2xl flex items-center justify-center border border-warm-100">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🗺️</div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[600px] rounded-2xl overflow-hidden border border-warm-100 shadow-soft">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {annonces.map((annonce) => {
          const position = coordinates[annonce.ville] || userCityCenter || defaultCenter
          
          return (
            <Marker
              key={annonce.id}
              position={position}
              icon={customIcon || undefined}
            >
              <Popup>
                <div className="w-64">
                  <Link href={`/${locale}/annonces/${annonce.id}`} className="block">
                    {annonce.photos && annonce.photos.length > 0 && (
                      <div className="w-full h-32 bg-gray-200 rounded-lg relative mb-2 overflow-hidden">
                        <Image
                          src={annonce.photos[0]}
                          alt={annonce.titre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-display font-semibold text-gray-900 mb-1 line-clamp-1">
                      {annonce.titre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      📍 {annonce.ville}
                    </p>
                    <p className="text-primary font-bold text-lg">
                      {annonce.prix_jour}€/jour
                    </p>
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
