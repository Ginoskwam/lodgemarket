'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { CityAutocomplete } from '@/components/AddressAutocomplete'

/**
 * Page de création d'annonce
 * Design moderne et clair
 */
export default function NouvelleAnnoncePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [titre, setTitre] = useState('')
  const [categorie, setCategorie] = useState<'Bricolage & Outils' | 'Jardinage & Extérieur' | 'Événementiel & Fêtes' | 'Audio & Musique' | 'Sport & Loisirs' | 'Transport & Mobilité' | 'Multimédia & Électronique' | 'Maison & Décoration' | 'Cuisine & Électroménager' | 'Autre'>('Bricolage & Outils')
  const [ville, setVille] = useState('')
  const [prixJour, setPrixJour] = useState('')
  const [cautionIndicative, setCautionIndicative] = useState('')
  const [nombreArticles, setNombreArticles] = useState('1')
  const [description, setDescription] = useState('')
  const [reglesSpecifiques, setReglesSpecifiques] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const categories: Array<'Bricolage & Outils' | 'Jardinage & Extérieur' | 'Événementiel & Fêtes' | 'Audio & Musique' | 'Sport & Loisirs' | 'Transport & Mobilité' | 'Multimédia & Électronique' | 'Maison & Décoration' | 'Cuisine & Électroménager' | 'Autre'> = [
    'Bricolage & Outils',
    'Jardinage & Extérieur',
    'Événementiel & Fêtes',
    'Audio & Musique',
    'Sport & Loisirs',
    'Transport & Mobilité',
    'Multimédia & Électronique',
    'Maison & Décoration',
    'Cuisine & Électroménager',
    'Autre',
  ]

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setLoading(false)

      if (!user) {
        router.push('/auth/login?redirect=/annonces/nouvelle')
      }
    }
    checkAuth()
  }, [router])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length > 5) {
      setError('Maximum 5 photos autorisées')
      return
    }
    setPhotos(files)
    setError(null)
    
    // Créer des aperçus
    const previews = files.map(file => URL.createObjectURL(file))
    setPhotoPreviews(previews)
  }

  function removePhoto(index: number) {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newPreviews = photoPreviews.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPhotoPreviews(newPreviews)
    
    // Libérer les URLs d'aperçu
    URL.revokeObjectURL(photoPreviews[index])
  }

  async function uploadPhotos(supabase: ReturnType<typeof createClient>, userId: string): Promise<string[]> {
    const uploadedUrls: string[] = []

    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `annonces/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, photo, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        if (uploadError.message.includes('policy') || uploadError.message.includes('permission')) {
          throw new Error(`Erreur de permission. Vérifiez les politiques de stockage dans Supabase.`)
        }
        throw new Error(`Erreur upload: ${uploadError.message}`)
      }

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)

      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl)
      }
    }

    return uploadedUrls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!titre.trim() || !description.trim() || !ville.trim() || !prixJour) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (photos.length === 0) {
      setError('Veuillez ajouter au moins une photo')
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      let photoUrls: string[] = []
      try {
        photoUrls = await uploadPhotos(supabase, user.id)
      } catch (uploadErr: any) {
        setError(uploadErr.message || 'Erreur lors de l\'upload des photos')
        setUploading(false)
        return
      }

      if (photoUrls.length === 0) {
        setError('Aucune photo n\'a pu être uploadée')
        setUploading(false)
        return
      }

      const { data: annonce, error: insertError } = await supabase
        .from('annonces')
        .insert({
          titre: titre.trim(),
          description: description.trim(),
          categorie,
          ville: ville.trim(),
          prix_jour: parseFloat(prixJour),
          caution_indicative: cautionIndicative ? parseFloat(cautionIndicative) : null,
          nombre_articles: parseInt(nombreArticles) || 1,
          regles_specifiques: reglesSpecifiques.trim() || null,
          photos: photoUrls,
          disponible: true,
          proprietaire_id: user.id,
        })
        .select()
        .single()

      if (insertError) {
        setError('Erreur lors de la création de l\'annonce')
        setUploading(false)
        return
      }

      router.push(`/annonces/${annonce.id}`)
    } catch (err) {
      setError('Une erreur est survenue')
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-secondary">Chargement...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link
          href="/annonces"
          className="text-primary hover:text-primary-dark mb-6 inline-block text-sm font-medium"
        >
          ← Retour aux annonces
        </Link>

        <div className="card p-6 md:p-8">
          <div className="mb-8">
            <h1 className="heading-1 mb-3">Publier une annonce</h1>
            <p className="body-text text-gray-secondary">
              Partagez votre matériel avec la communauté
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label htmlFor="titre" className="block text-sm font-medium text-gray-text mb-2">
                Titre de l'annonce *
              </label>
              <input
                id="titre"
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                className="input"
                placeholder="Ex: Perceuse visseuse Bosch professionnelle"
              />
            </div>

            {/* Catégorie et Ville */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categorie" className="block text-sm font-medium text-gray-text mb-2">
                  Catégorie *
                </label>
                <select
                  id="categorie"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value as typeof categorie)}
                  required
                  className="input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ville" className="block text-sm font-medium text-gray-text mb-2">
                  Ville *
                </label>
                <CityAutocomplete
                  value={ville}
                  onChange={setVille}
                  placeholder="Ex: Bruxelles"
                  className="input"
                />
              </div>
            </div>

            {/* Prix */}
            <div className="grid md:grid-cols-3 gap-4 items-start">
              <div className="flex flex-col">
                <label htmlFor="prix_jour" className="block text-sm font-medium text-charbon-text mb-2 min-h-[1.5rem]">
                  Prix par jour (€) *
                </label>
                <input
                  id="prix_jour"
                  type="number"
                  step="0.01"
                  min="0"
                  value={prixJour}
                  onChange={(e) => setPrixJour(e.target.value)}
                  required
                  className="input"
                  placeholder="15"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="caution" className="block text-sm font-medium text-charbon-text mb-2 min-h-[1.5rem]">
                  Caution indicative (€)
                </label>
                <input
                  id="caution"
                  type="number"
                  step="0.01"
                  min="0"
                  value={cautionIndicative}
                  onChange={(e) => setCautionIndicative(e.target.value)}
                  className="input"
                  placeholder="100"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="nombre_articles" className="block text-sm font-medium text-charbon-text mb-2 min-h-[1.5rem]">
                  Nombre d'articles disponibles *
                </label>
                <input
                  id="nombre_articles"
                  type="number"
                  min="1"
                  value={nombreArticles}
                  onChange={(e) => setNombreArticles(e.target.value)}
                  required
                  className="input"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-text mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className="input"
                placeholder="Décrivez votre matériel, son état, son utilisation..."
              />
            </div>

            {/* Règles spécifiques */}
            <div>
              <label htmlFor="regles" className="block text-sm font-medium text-gray-text mb-2">
                Règles spécifiques
              </label>
              <textarea
                id="regles"
                value={reglesSpecifiques}
                onChange={(e) => setReglesSpecifiques(e.target.value)}
                rows={3}
                className="input"
                placeholder="Ex: Retour sous 48h, utilisation en intérieur uniquement..."
              />
            </div>

            {/* Photos */}
            <div>
              <label htmlFor="photos" className="block text-sm font-medium text-gray-text mb-2">
                Photos (1 à 5) *
              </label>
              
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                      <Image
                        src={preview}
                        alt={`Aperçu ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                required
                className="input"
              />
              <p className="mt-2 text-small text-gray-secondary">
                {photos.length} / 5 photo{photos.length > 1 ? 's' : ''} sélectionnée{photos.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="btn-primary flex-1"
              >
                {uploading ? 'Publication...' : 'Publier l\'annonce'}
              </button>
              <Link href="/annonces" className="btn-secondary">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
