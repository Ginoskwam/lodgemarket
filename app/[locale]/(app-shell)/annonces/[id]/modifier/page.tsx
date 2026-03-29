'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Annonce } from '@/types/database'
import { CityAutocomplete } from '@/components/AddressAutocomplete'

/**
 * Page de modification d'une annonce
 * Permet au propriétaire de modifier son annonce
 */
export default function ModifierAnnoncePage() {
  const router = useRouter()
  const params = useParams()
  const annonceId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [annonce, setAnnonce] = useState<Annonce | null>(null)
  const [error, setError] = useState<string | null>(null)

  // États du formulaire
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [categorie, setCategorie] = useState('')
  const [ville, setVille] = useState('')
  const [prixJour, setPrixJour] = useState('')
  const [cautionIndicative, setCautionIndicative] = useState('')
  const [nombreArticles, setNombreArticles] = useState('1')
  const [reglesSpecifiques, setReglesSpecifiques] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [photos, setPhotos] = useState<string[]>([])
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const categories = ['Bricolage & Outils', 'Jardinage & Extérieur', 'Événementiel & Fêtes', 'Audio & Musique', 'Sport & Loisirs', 'Transport & Mobilité', 'Multimédia & Électronique', 'Maison & Décoration', 'Cuisine & Électroménager', 'Autre']

  useEffect(() => {
    async function loadAnnonce() {
      const supabase = createClient()

      // Vérifier l'authentification
      const { data: { user: currentUser } } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push(`/auth/login?redirect=/annonces/${annonceId}/modifier`)
        return
      }

      setUser(currentUser)

      // Charger l'annonce
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('id', annonceId)
        .single()

      if (error || !data) {
        setError('Annonce introuvable')
        setLoading(false)
        return
      }

      // Vérifier que l'utilisateur est le propriétaire
      if (data.proprietaire_id !== currentUser.id) {
        setError('Vous n\'êtes pas autorisé à modifier cette annonce')
        setLoading(false)
        return
      }

      setAnnonce(data)
      setTitre(data.titre || '')
      setDescription(data.description || '')
      // Charger la catégorie depuis la base de données
      // La base de données validera avec la contrainte CHECK
      const categorieFromDb = (data.categorie || '').trim()
      setCategorie(categorieFromDb || categories[0] || '')
      setVille(data.ville || '')
      setPrixJour(data.prix_jour?.toString() || '')
      setCautionIndicative(data.caution_indicative?.toString() || '')
      setNombreArticles(data.nombre_articles?.toString() || '1')
      setReglesSpecifiques(data.regles_specifiques || '')
      setDisponible(data.disponible !== false)
      setPhotos(data.photos || [])
      setLoading(false)
    }

    loadAnnonce()
  }, [annonceId, router])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (photos.length >= 5) {
      alert('Vous ne pouvez pas ajouter plus de 5 photos')
      return
    }

    setUploadingPhoto(true)
    const supabase = createClient()

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `annonces/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)

      setPhotos([...photos, publicUrl])
    } catch (error: any) {
      console.error('Erreur upload photo:', error)
      alert('Erreur lors de l\'upload de la photo: ' + (error.message || 'Erreur inconnue'))
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!titre.trim() || !description.trim() || !categorie || !ville || !prixJour) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    const prix = parseFloat(prixJour)
    if (isNaN(prix) || prix <= 0) {
      setError('Le prix par jour doit être un nombre positif')
      return
    }

    setSaving(true)
    const supabase = createClient()

    try {
      // Valider que la catégorie n'est pas vide
      const categorieTrimmed = categorie.trim()
      if (!categorieTrimmed) {
        setError('Veuillez sélectionner une catégorie')
        setSaving(false)
        return
      }

      // Vérifier si la catégorie a changé
      const categorieActuelle = (annonce?.categorie || '').trim()
      const categorieAChangee = categorieTrimmed !== categorieActuelle
      
      // Préparer l'objet de mise à jour
      const updateData: any = {
        titre: titre.trim(),
        description: description.trim(),
        ville: ville.trim(),
        prix_jour: prix,
        caution_indicative: cautionIndicative ? parseFloat(cautionIndicative) : null,
        regles_specifiques: reglesSpecifiques.trim() || null,
        disponible,
        photos: photos.length > 0 ? photos : null,
      }
      
      // N'inclure la catégorie que si elle a changé
      // Cela évite de déclencher la contrainte CHECK si la catégorie est déjà valide
      if (categorieAChangee) {
        updateData.categorie = categorieTrimmed
      }
      
      // Log pour déboguer
      console.log('Données à envoyer à la base:', {
        categorieActuelle,
        categorieNouvelle: categorieTrimmed,
        categorieAChangee,
        categorie: updateData.categorie,
        categorieLength: updateData.categorie?.length,
        categoriesAutorisees: categories
      })

      // Essayer d'ajouter nombre_articles, mais gérer le cas où la colonne n'existe pas
      const nombreArticlesValue = parseInt(nombreArticles) || 1
      
      // Préparer les données de mise à jour complètes
      const updateDataComplete: any = {
        ...updateData,
        nombre_articles: nombreArticlesValue,
      }
      
      // N'inclure la catégorie QUE si elle a changé
      // Cela évite de déclencher la contrainte CHECK inutilement
      if (categorieAChangee) {
        updateDataComplete.categorie = categorieTrimmed
      }
      
      // Première tentative de mise à jour
      let { error: updateError } = await supabase
        .from('annonces')
        .update(updateDataComplete)
        .eq('id', annonceId)
        .eq('proprietaire_id', user?.id)

      // Si l'erreur concerne nombre_articles (colonne non trouvée), réessayer sans ce champ
      if (updateError) {
        const errorMessage = (updateError.message || '').toLowerCase()
        const isNombreArticlesError = 
          errorMessage.includes('nombre_articles') || 
          errorMessage.includes("could not find") ||
          (errorMessage.includes('column') && errorMessage.includes('nombre_articles'))
        
        if (isNombreArticlesError) {
          console.warn('Colonne nombre_articles non trouvée dans le schéma, mise à jour sans ce champ')
          const { error: retryError } = await supabase
            .from('annonces')
            .update(updateData)
            .eq('id', annonceId)
            .eq('proprietaire_id', user?.id)
          
          if (retryError) {
            throw retryError
          }
        } else {
          // Pour toute autre erreur, la lancer
          throw updateError
        }
      }

      // Rediriger vers la page de l'annonce
      router.push(`/annonces/${annonceId}`)
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error)
      console.error('Détails de l\'erreur:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        categorieEnvoyee: categorie,
        categorieTrimmed: categorie.trim(),
        categoriesAutorisees: categories
      })
      
      let errorMessage = error.message || 'Erreur inconnue'
      
      // Message d'erreur plus explicite pour les contraintes CHECK
      if (errorMessage.includes('check constraint') || errorMessage.includes('violates check constraint')) {
        if (errorMessage.includes('categorie') || errorMessage.includes('annonces_categorie_check')) {
          // Le problème vient d'une contrainte CHECK problématique dans Supabase
          errorMessage = `Erreur de contrainte CHECK sur la catégorie. 

SOLUTION RAPIDE:
1. Ouvrez le SQL Editor dans Supabase
2. Exécutez le script: supabase/remove_categorie_check.sql
3. Cela supprimera la contrainte CHECK problématique
4. Réessayez de sauvegarder

La validation de la catégorie sera gérée côté application.`
        } else {
          errorMessage = `Erreur de validation: ${errorMessage}`
        }
      }
      
      setError('Erreur lors de la mise à jour de l\'annonce: ' + errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  if (error && !annonce) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-700 font-semibold mb-4">{error}</p>
          <button
            onClick={() => router.push('/annonces/mes-annonces')}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold"
          >
            Retour à mes annonces
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-2">
          Modifier l'annonce
        </h1>
        <p className="text-gray-600">Modifiez les informations de votre annonce</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-8 border border-warm-100">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Titre */}
        <div className="mb-6">
          <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'annonce *
          </label>
          <input
            type="text"
            id="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
            required
          />
        </div>

        {/* Catégorie */}
        <div className="mb-6">
          <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            id="categorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Ville */}
        <div className="mb-6">
          <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-2">
            Ville *
          </label>
          <CityAutocomplete
            value={ville}
            onChange={setVille}
            placeholder="Ex: Bruxelles"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
          />
        </div>

        {/* Prix, caution et nombre d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="prix_jour" className="block text-sm font-medium text-gray-700 mb-2">
              Prix par jour (€) *
            </label>
            <input
              type="text"
              id="prix_jour"
              value={prixJour}
              onChange={(e) => {
                const value = e.target.value
                // Permettre uniquement les nombres, le point et la virgule
                if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
                  // Remplacer la virgule par un point
                  const normalizedValue = value.replace(',', '.')
                  setPrixJour(normalizedValue)
                }
              }}
              onBlur={(e) => {
                // Formater la valeur au blur pour avoir au plus 2 décimales
                const value = parseFloat(e.target.value)
                if (!isNaN(value) && value >= 0) {
                  setPrixJour(value.toFixed(2).replace(/\.?0+$/, ''))
                }
              }}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="caution_indicative" className="block text-sm font-medium text-gray-700 mb-2">
              Caution indicative (€)
            </label>
            <input
              type="text"
              id="caution_indicative"
              value={cautionIndicative}
              onChange={(e) => {
                const value = e.target.value
                // Permettre uniquement les nombres, le point et la virgule
                if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
                  // Remplacer la virgule par un point
                  const normalizedValue = value.replace(',', '.')
                  setCautionIndicative(normalizedValue)
                }
              }}
              onBlur={(e) => {
                // Formater la valeur au blur pour avoir au plus 2 décimales
                const value = parseFloat(e.target.value)
                if (!isNaN(value) && value >= 0) {
                  setCautionIndicative(value.toFixed(2).replace(/\.?0+$/, ''))
                } else if (e.target.value === '') {
                  setCautionIndicative('')
                }
              }}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
            />
          </div>
          <div>
            <label htmlFor="nombre_articles" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'articles disponibles *
            </label>
            <input
              type="number"
              id="nombre_articles"
              value={nombreArticles}
              onChange={(e) => setNombreArticles(e.target.value)}
              min="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
            required
          />
        </div>

        {/* Règles spécifiques */}
        <div className="mb-6">
          <label htmlFor="regles_specifiques" className="block text-sm font-medium text-gray-700 mb-2">
            Règles spécifiques (optionnel)
          </label>
          <textarea
            id="regles_specifiques"
            value={reglesSpecifiques}
            onChange={(e) => setReglesSpecifiques(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
            placeholder="Ex: Interdit de fumer, animaux acceptés, etc."
          />
        </div>

        {/* Photos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos ({photos.length}/5)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {photos.length < 5 && (
            <label className="inline-block cursor-pointer">
              <span className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all inline-block">
                {uploadingPhoto ? '⏳ Upload...' : '📷 Ajouter une photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Disponible */}
        <div className="mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              Annonce disponible
            </span>
          </label>
        </div>

        {/* Boutons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '⏳ Enregistrement...' : '💾 Enregistrer les modifications'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/annonces/${annonceId}`)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

