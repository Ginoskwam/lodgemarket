'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { AnnoncesMap } from '@/components/AnnoncesMap'
import type { Annonce } from '@/types/database'

/**
 * Composant interne pour utiliser useSearchParams
 */
function AnnoncesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const categories = ['Bricolage & Outils', 'Jardinage & Extérieur', 'Événementiel & Fêtes', 'Audio & Musique', 'Sport & Loisirs', 'Transport & Mobilité', 'Multimédia & Électronique', 'Maison & Décoration', 'Cuisine & Électroménager', 'Autre']

  // Fonction pour calculer la distance entre deux coordonnées (formule de Haversine)
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Fonction pour géocoder une ville avec Nominatim
  async function geocodeCity(cityName: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName + ', Belgique')}&limit=1`,
        {
          headers: {
            'User-Agent': 'Lodgemarket App'
          }
        }
      )
      const data = await response.json()
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        }
      }
      return null
    } catch (error) {
      console.error('Erreur lors du géocodage:', error)
      return null
    }
  }

  // Vérifier l'authentification
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Rediriger vers la page de connexion avec le redirect
        const currentUrl = window.location.pathname + window.location.search
        router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)
        return
      }
      
      setIsAuthenticated(true)
    }
    
    checkAuth()
  }, [router])

  useEffect(() => {
    async function loadAnnonces() {
      const supabase = createClient()

      // Vérifier à nouveau l'authentification avant de charger les annonces
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      let query = supabase
        .from('annonces')
        .select('*')
        .eq('disponible', true)
        .order('date_creation', { ascending: false })

      const categorie = searchParams.get('categorie')
      const ville = searchParams.get('ville')
      const prixMax = searchParams.get('prix_max')
      const rayon = searchParams.get('rayon')

      if (categorie) {
        query = query.eq('categorie', categorie)
      }
      if (prixMax) {
        const prixMaxValue = parseFloat(prixMax)
        // Ignorer les prix négatifs
        if (prixMaxValue >= 0) {
          query = query.lte('prix_jour', prixMaxValue)
        }
      }

      // Si pas de rayon spécifié, recherche simple par nom de ville
      if (ville && !rayon) {
        query = query.ilike('ville', `%${ville}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erreur lors du chargement des annonces:', error)
        setAnnonces([])
        setLoading(false)
        return
      }

      let filteredAnnonces = data || []

      // Si un rayon est spécifié, filtrer par distance
      if (ville && rayon && parseFloat(rayon) > 0) {
        const searchCoords = await geocodeCity(ville)
        
        if (searchCoords) {
          // Cache pour éviter de géocoder plusieurs fois la même ville
          const geocodeCache = new Map<string, { lat: number; lon: number } | null>()
          
          // Géocoder toutes les villes des annonces et filtrer par distance
          const annoncesWithDistance = await Promise.all(
            filteredAnnonces.map(async (annonce) => {
              // Vérifier le cache
              let annonceCoords = geocodeCache.get(annonce.ville)
              if (annonceCoords === undefined) {
                annonceCoords = await geocodeCity(annonce.ville)
                geocodeCache.set(annonce.ville, annonceCoords)
              }
              
              if (annonceCoords) {
                const distance = calculateDistance(
                  searchCoords.lat,
                  searchCoords.lon,
                  annonceCoords.lat,
                  annonceCoords.lon
                )
                return { ...annonce, distance }
              }
              return { ...annonce, distance: Infinity }
            })
          )

          const rayonKm = parseFloat(rayon)
          filteredAnnonces = annoncesWithDistance
            .filter(a => a.distance <= rayonKm)
            .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity)) // Trier par distance croissante
        } else {
          // Si le géocodage échoue, fallback sur recherche par nom
          filteredAnnonces = filteredAnnonces.filter(a => 
            a.ville.toLowerCase().includes(ville.toLowerCase())
          )
        }
      } else if (ville && !rayon) {
        // Recherche simple par nom de ville (déjà fait dans la requête)
      }

      setAnnonces(filteredAnnonces)
      setLoading(false)
    }

    if (isAuthenticated) {
      loadAnnonces()
    }
  }, [searchParams, isAuthenticated])

  if (loading || !isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-secondary">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="heading-1 mb-3">Matériel disponible</h1>
          <p className="body-text text-gray-secondary">
            {annonces.length} annonce{annonces.length > 1 ? 's' : ''} disponible{annonces.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtres */}
        <div className="card p-6 mb-8">
          <form method="get" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="categorie" className="block text-sm font-medium text-charbon-text mb-2">
                  Catégorie
                </label>
                <select
                  id="categorie"
                  name="categorie"
                  defaultValue={searchParams.get('categorie') || ''}
                  className="input"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ville" className="block text-sm font-medium text-charbon-text mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  defaultValue={searchParams.get('ville') || ''}
                  placeholder="Ex: Bruxelles"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="rayon" className="block text-sm font-medium text-charbon-text mb-2">
                  Rayon (km)
                </label>
                <select
                  id="rayon"
                  name="rayon"
                  defaultValue={searchParams.get('rayon') || ''}
                  className="input"
                >
                  <option value="">Toute la Belgique</option>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="20">20 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                </select>
              </div>

              <div>
                <label htmlFor="prix_max" className="block text-sm font-medium text-charbon-text mb-2">
                  Prix max / jour
                </label>
                <input
                  type="number"
                  id="prix_max"
                  name="prix_max"
                  defaultValue={searchParams.get('prix_max') || ''}
                  placeholder="€"
                  min="0"
                  step="1"
                  className="input"
                  onKeyDown={(e) => {
                    // Empêcher la saisie du signe moins, des lettres, et des caractères décimaux
                    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '.' || e.key === ',') {
                      e.preventDefault()
                    }
                  }}
                  onChange={(e) => {
                    // Empêcher les valeurs négatives et arrondir les décimales
                    const value = parseFloat(e.target.value)
                    if (isNaN(value) || value < 0) {
                      e.target.value = ''
                    } else {
                      // Arrondir à l'entier le plus proche
                      e.target.value = Math.round(value).toString()
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                href="/annonces"
                className="btn-ghost text-sm"
              >
                Réinitialiser
              </Link>
              <button type="submit" className="btn-primary">
                Rechercher
              </button>
            </div>
          </form>
        </div>

        {/* Toggle vue vignette/carte */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200 shadow-soft">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                viewMode === 'grid'
                  ? 'bg-primary text-white shadow-warm'
                  : 'text-charbon-secondary hover:text-charbon-text'
              }`}
            >
              Vignettes
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                viewMode === 'map'
                  ? 'bg-primary text-white shadow-warm'
                  : 'text-charbon-secondary hover:text-charbon-text'
              }`}
            >
              Carte
            </button>
          </div>
        </div>

        {/* Résultats */}
        {!annonces || annonces.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="heading-3 mb-2">Aucun résultat</h2>
            <p className="body-text text-gray-secondary mb-8">
              Aucun matériel ne correspond à vos critères. Essayez de modifier vos filtres.
            </p>
            <Link href="/annonces/nouvelle" className="btn-primary inline-block">
              Publier une annonce
            </Link>
          </div>
        ) : viewMode === 'map' ? (
          <AnnoncesMap annonces={annonces} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {annonces.map((annonce: any) => (
              <Link
                key={annonce.id}
                href={`/annonces/${annonce.id}`}
                className="card-hover group"
              >
                {/* Photo */}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden rounded-t-xl">
                  {annonce.photos && annonce.photos.length > 0 ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={annonce.photos[0]}
                        alt={annonce.titre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-3xl">📷</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-charbon-text shadow-soft">
                      {annonce.prix_jour}€
                    </div>
                  </div>
                  {annonce.distance !== undefined && annonce.distance !== Infinity && (
                    <div className="absolute bottom-2 left-2 z-10">
                      <div className="bg-primary/90 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        {Math.round(annonce.distance)} km
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-3">
                  <h2 className="font-semibold text-charbon-text text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {annonce.titre}
                  </h2>
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <span className="badge-primary text-xs px-2 py-0.5">
                      {annonce.categorie.split(' & ')[0]}
                    </span>
                    <span className="text-xs text-charbon-secondary flex items-center gap-1">
                      <span>📍</span> {annonce.ville}
                    </span>
                  </div>
                  <p className="text-xs text-charbon-secondary line-clamp-2">
                    {annonce.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Page de liste des annonces
 */
export default function AnnoncesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-secondary">Chargement...</div>
      </div>
    }>
      <AnnoncesPageContent />
    </Suspense>
  )
}
