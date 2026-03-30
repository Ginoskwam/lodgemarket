'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { CityAutocomplete } from '@/components/AddressAutocomplete'

/**
 * Page de création d'annonce
 * Design moderne et clair
 */
export default function NouvelleAnnoncePage() {
  const locale = useLocale()
  const t = useTranslations('announcements')
  const tCategories = useTranslations('categories')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [titre, setTitre] = useState('')
  const [categorie, setCategorie] = useState<'Bricolage & Outils' | 'Jardinage & Extérieur' | 'Événementiel & Fêtes' | 'Audio & Musique' | 'Sport & Loisirs' | 'Transport & Mobilité' | 'Multimédia & Électronique' | 'Maison & Décoration' | 'Cuisine & Électroménager' | 'Autre'>('Bricolage & Outils')
  const [ville, setVille] = useState('')
  const [prixVente, setPrixVente] = useState('')
  const [cautionIndicative, setCautionIndicative] = useState('')
  const [nombreArticles, setNombreArticles] = useState('1')
  const [description, setDescription] = useState('')
  const [reglesSpecifiques, setReglesSpecifiques] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Catégories en français (pour la base de données)
  const categoriesFr: Array<'Bricolage & Outils' | 'Jardinage & Extérieur' | 'Événementiel & Fêtes' | 'Audio & Musique' | 'Sport & Loisirs' | 'Transport & Mobilité' | 'Multimédia & Électronique' | 'Maison & Décoration' | 'Cuisine & Électroménager' | 'Autre'> = [
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
  
  // Mapping pour traduire les catégories
  const categoryMapping: Record<string, string> = {
    'Bricolage & Outils': 'bricolage',
    'Jardinage & Extérieur': 'jardinage',
    'Événementiel & Fêtes': 'evenementiel',
    'Audio & Musique': 'audio',
    'Sport & Loisirs': 'sport',
    'Transport & Mobilité': 'transport',
    'Multimédia & Électronique': 'multimedia',
    'Maison & Décoration': 'maison',
    'Cuisine & Électroménager': 'cuisine',
    'Autre': 'autre'
  }
  
  const translateCategory = (cat: string) => {
    const key = categoryMapping[cat]
    return key ? tCategories(key) : cat
  }

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
      setError(t('max5Photos'))
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

      if (!titre.trim() || !description.trim() || !ville.trim() || !prixVente.trim()) {
        setError(t('fillAllFields'))
        return
      }

      const prixVenteNum = parseFloat(prixVente.replace(/\s/g, '').replace(',', '.'))
      if (Number.isNaN(prixVenteNum) || prixVenteNum <= 0) {
        setError(t('invalidSalePrice'))
        return
      }

      if (photos.length === 0) {
        setError(t('addAtLeastOnePhoto'))
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
        setError(uploadErr.message || t('uploadError'))
        setUploading(false)
        return
      }

      if (photoUrls.length === 0) {
        setError(t('noPhotosUploaded'))
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
          prix_jour: 0,
          prix_vente: prixVenteNum,
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
        setError(t('creationError'))
        setUploading(false)
        return
      }

      router.push(`/${locale}/annonces/${annonce.id}`)
    } catch (err) {
      setError(t('errorOccurred'))
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-secondary">{tCommon('loading')}</div>
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
          href={`/${locale}/annonces`}
          className="text-primary hover:text-primary-dark mb-6 inline-block text-sm font-medium"
        >
          ← {t('backToAnnouncements')}
        </Link>

        <div className="card p-6 md:p-8">
          <div className="mb-8">
            <h1 className="heading-1 mb-3">{t('publishTitle')}</h1>
            <p className="body-text text-gray-secondary">
              {t('publishSubtitle')}
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
                {t('announcementTitle')} *
              </label>
              <input
                id="titre"
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                className="input"
                placeholder={t('announcementTitlePlaceholder')}
              />
            </div>

            {/* Catégorie et Ville */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categorie" className="block text-sm font-medium text-gray-text mb-2">
                  {t('category')} *
                </label>
                <select
                  id="categorie"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value as typeof categorie)}
                  required
                  className="input"
                >
                  {categoriesFr.map((cat) => (
                    <option key={cat} value={cat}>
                      {translateCategory(cat)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ville" className="block text-sm font-medium text-gray-text mb-2">
                  {t('city')} *
                </label>
                <CityAutocomplete
                  value={ville}
                  onChange={setVille}
                  placeholder="Ex: Bruxelles"
                  className="input"
                />
              </div>
            </div>

            {/* Prix de vente */}
            <div className="grid md:grid-cols-3 gap-4 items-start">
              <div className="flex flex-col">
                <label htmlFor="prix_vente" className="block text-sm font-medium text-charbon-text mb-2 min-h-[1.5rem]">
                  {t('salePrice')} *
                </label>
                <input
                  id="prix_vente"
                  type="number"
                  step="1000"
                  min="1"
                  value={prixVente}
                  onChange={(e) => setPrixVente(e.target.value)}
                  required
                  className="input"
                  placeholder={t('salePricePlaceholder')}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="caution" className="block text-sm font-medium text-charbon-text mb-2 min-h-[1.5rem]">
                  {t('indicativeDeposit')}
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
                  {t('numberOfItems')} *
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
                {t('description')} *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className="input"
                placeholder={t('descriptionPlaceholder')}
              />
            </div>

            {/* Règles spécifiques */}
            <div>
              <label htmlFor="regles" className="block text-sm font-medium text-gray-text mb-2">
                {t('specificRules')}
              </label>
              <textarea
                id="regles"
                value={reglesSpecifiques}
                onChange={(e) => setReglesSpecifiques(e.target.value)}
                rows={3}
                className="input"
                placeholder={t('specificRulesPlaceholder')}
              />
            </div>

            {/* Photos */}
            <div>
              <label htmlFor="photos" className="block text-sm font-medium text-gray-text mb-2">
                {t('photos')} *
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
                {t('photosSelected', { count: photos.length })}
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="btn-primary flex-1"
              >
                {uploading ? t('publishing') : t('publishButton')}
              </button>
              <Link href={`/${locale}/annonces`} className="btn-secondary">
                {tCommon('cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
