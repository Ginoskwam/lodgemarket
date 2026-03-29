'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Annonce } from '@/types/database'

/**
 * Page de gestion des annonces de l'utilisateur
 * Design moderne et clair
 */
type ViewSize = 'small' | 'medium' | 'large'

export default function MesAnnoncesPage() {
  const router = useRouter()
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [allAnnonces, setAllAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewSize, setViewSize] = useState<ViewSize>('medium')
  
  // Filtres
  const [filtreCategorie, setFiltreCategorie] = useState<string>('')
  const [filtrePrixMax, setFiltrePrixMax] = useState<string>('')
  const [filtreDisponible, setFiltreDisponible] = useState<string>('')
  
  const categories = ['Bricolage & Outils', 'Jardinage & Extérieur', 'Événementiel & Fêtes', 'Audio & Musique', 'Sport & Loisirs', 'Transport & Mobilité', 'Multimédia & Électronique', 'Maison & Décoration', 'Cuisine & Électroménager', 'Autre']

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/auth/login?redirect=/annonces/mes-annonces')
        return
      }

      setUser(currentUser)

      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('proprietaire_id', currentUser.id)
        .order('date_creation', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des annonces:', error)
      } else {
        setAllAnnonces(data || [])
        setAnnonces(data || [])
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...allAnnonces]

    if (filtreCategorie) {
      filtered = filtered.filter(a => a.categorie === filtreCategorie)
    }

    if (filtrePrixMax) {
      const prixMax = parseFloat(filtrePrixMax)
      if (!isNaN(prixMax)) {
        filtered = filtered.filter(a => a.prix_jour <= prixMax)
      }
    }

    if (filtreDisponible !== '') {
      const disponible = filtreDisponible === 'true'
      filtered = filtered.filter(a => a.disponible === disponible)
    }

    setAnnonces(filtered)
  }, [allAnnonces, filtreCategorie, filtrePrixMax, filtreDisponible])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.')) {
      return
    }

    setDeletingId(id)
    const supabase = createClient()

    try {
      const annonce = annonces.find(a => a.id === id)
      if (annonce?.photos && annonce.photos.length > 0) {
        const photoPaths = annonce.photos.map(url => {
          const parts = url.split('/')
          const bucketIndex = parts.indexOf('photos')
          if (bucketIndex > -1 && parts.length > bucketIndex + 1) {
            return parts.slice(bucketIndex + 1).join('/')
          }
          return null
        }).filter(Boolean) as string[]

        if (photoPaths.length > 0) {
          await supabase.storage
            .from('photos')
            .remove(photoPaths)
        }
      }

      const { error } = await supabase
        .from('annonces')
        .delete()
        .eq('id', id)
        .eq('proprietaire_id', user?.id)

      if (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression de l\'annonce')
      } else {
        const updatedAnnonces = annonces.filter(a => a.id !== id)
        setAnnonces(updatedAnnonces)
        setAllAnnonces(allAnnonces.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression de l\'annonce')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-secondary">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="heading-1 mb-3">Mes annonces</h1>
          <p className="body-text text-charbon-secondary">
            {annonces.length} annonce{annonces.length > 1 ? 's' : ''}
            {annonces.length !== allAnnonces.length && ` (filtrée${annonces.length > 1 ? 's' : ''})`}
          </p>
        </div>

        {allAnnonces.length > 0 && (
          <>
            {/* Filtres et sélecteur de taille */}
            <div className="card p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Filtres */}
                <div className="flex flex-wrap gap-3 flex-1">
                  <select
                    value={filtreCategorie}
                    onChange={(e) => setFiltreCategorie(e.target.value)}
                    className="input text-sm"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={filtrePrixMax}
                    onChange={(e) => setFiltrePrixMax(e.target.value)}
                    placeholder="Prix max (€)"
                    className="input text-sm w-32"
                  />

                  <select
                    value={filtreDisponible}
                    onChange={(e) => setFiltreDisponible(e.target.value)}
                    className="input text-sm"
                  >
                    <option value="">Toutes</option>
                    <option value="true">Disponibles</option>
                    <option value="false">Indisponibles</option>
                  </select>

                  {(filtreCategorie || filtrePrixMax || filtreDisponible) && (
                    <button
                      onClick={() => {
                        setFiltreCategorie('')
                        setFiltrePrixMax('')
                        setFiltreDisponible('')
                      }}
                      className="btn-ghost text-sm whitespace-nowrap"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>

                {/* Sélecteur de taille */}
                <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200 shadow-soft">
                  <button
                    onClick={() => setViewSize('small')}
                    className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                      viewSize === 'small'
                        ? 'bg-primary text-white shadow-warm'
                        : 'text-charbon-secondary hover:text-charbon-text'
                    }`}
                    title="Petites vignettes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewSize('medium')}
                    className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                      viewSize === 'medium'
                        ? 'bg-primary text-white shadow-warm'
                        : 'text-charbon-secondary hover:text-charbon-text'
                    }`}
                    title="Moyennes vignettes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewSize('large')}
                    className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                      viewSize === 'large'
                        ? 'bg-primary text-white shadow-warm'
                        : 'text-charbon-secondary hover:text-charbon-text'
                    }`}
                    title="Grandes vignettes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {annonces.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="heading-3 mb-2">Aucune annonce</h2>
            <p className="body-text text-gray-secondary mb-8">
              Créez votre première annonce pour commencer à louer votre matériel
            </p>
            <Link href="/annonces/nouvelle" className="btn-primary inline-block">
              Créer une annonce
            </Link>
          </div>
        ) : allAnnonces.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="heading-3 mb-2">Aucune annonce</h2>
            <p className="body-text text-gray-secondary mb-8">
              Créez votre première annonce pour commencer à louer votre matériel
            </p>
            <Link href="/annonces/nouvelle" className="btn-primary inline-block">
              Créer une annonce
            </Link>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewSize === 'small' 
              ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8' 
              : viewSize === 'medium'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {annonces.map((annonce) => (
              <Link
                key={annonce.id}
                href={`/annonces/${annonce.id}`}
                className="card overflow-hidden group flex flex-col h-full hover:scale-[1.02] transition-transform cursor-pointer"
              >
                {/* Photo */}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden rounded-t-xl flex-shrink-0">
                  {annonce.photos && annonce.photos.length > 0 ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={annonce.photos[0]}
                        alt={annonce.titre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes={
                          viewSize === 'small'
                            ? "(max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
                            : viewSize === 'medium'
                            ? "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                            : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        }
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className={viewSize === 'small' ? 'text-xl' : viewSize === 'medium' ? 'text-2xl' : 'text-3xl'}>📷</span>
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 z-10 ${viewSize === 'small' ? 'scale-75' : ''}`}>
                    <div className={`bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg font-semibold text-charbon-text shadow-soft ${
                      viewSize === 'small' ? 'text-[10px]' : 'text-xs'
                    }`}>
                      {annonce.prix_jour}€
                    </div>
                  </div>
                  {!annonce.disponible && (
                    <div className={`absolute top-2 left-2 z-10 ${viewSize === 'small' ? 'scale-75' : ''}`}>
                      <span className={`bg-red-500 text-white px-2 py-1 rounded-lg font-semibold shadow-soft ${
                        viewSize === 'small' ? 'text-[10px]' : 'text-xs'
                      }`}>
                        Indisponible
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className={`flex flex-col flex-1 ${viewSize === 'small' ? 'p-2' : viewSize === 'medium' ? 'p-3' : 'p-4'}`}>
                  <div className="flex-1">
                    <h2 className={`font-semibold text-charbon-text line-clamp-2 mb-2 ${
                      viewSize === 'small' ? 'text-[10px]' : viewSize === 'medium' ? 'text-sm' : 'text-base'
                    }`}>
                      {annonce.titre}
                    </h2>
                    <div className={`flex items-center gap-1.5 flex-wrap ${
                      viewSize === 'small' ? 'mb-1' : viewSize === 'medium' ? 'mb-1.5' : 'mb-2'
                    }`}>
                      <span className={`badge-primary ${
                        viewSize === 'small' ? 'text-[9px] px-1 py-0.5' : 'text-xs px-2 py-0.5'
                      }`}>
                        {annonce.categorie.split(' & ')[0]}
                      </span>
                      {viewSize !== 'small' && (
                        <>
                          <span className={`text-charbon-secondary flex items-center gap-1 ${
                            viewSize === 'medium' ? 'text-xs' : 'text-sm'
                          }`}>
                            <span>📍</span> {annonce.ville}
                          </span>
                          {viewSize === 'large' && (
                            <span className="text-xs text-charbon-400">
                              👁️ {annonce.nombre_vues || 0}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {viewSize !== 'small' && (
                      <p className={`text-charbon-secondary line-clamp-2 ${
                        viewSize === 'medium' ? 'text-xs mb-2' : 'text-sm mb-3'
                      }`}>
                        {annonce.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className={`flex gap-1 mt-auto ${viewSize === 'small' ? 'flex-col gap-1' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/annonces/${annonce.id}/modifier`}
                      onClick={(e) => e.stopPropagation()}
                      className={`${viewSize === 'small' 
                        ? 'w-full text-[10px] py-1' 
                        : viewSize === 'medium' 
                        ? 'flex-1 text-[10px] py-1 px-1.5 min-w-0' 
                        : 'flex-1 text-xs py-1.5 px-2'} btn-primary text-center whitespace-nowrap overflow-hidden`}
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDelete(annonce.id)
                      }}
                      disabled={deletingId === annonce.id}
                      className={`${viewSize === 'small' 
                        ? 'w-full px-2 py-1 text-[10px]' 
                        : viewSize === 'medium' 
                        ? 'px-1.5 py-1 text-[12px] flex-shrink-0 min-w-[32px]' 
                        : 'px-2 py-1.5 text-xs flex-shrink-0 min-w-[36px]'} bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                      title="Supprimer"
                    >
                      {deletingId === annonce.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
