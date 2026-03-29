'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { CityAutocomplete, AddressAutocomplete } from '@/components/AddressAutocomplete'

/**
 * Page de modification du profil utilisateur
 * Permet de modifier ses informations personnelles
 */
export default function ModifierProfilPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // États du formulaire
  const [pseudo, setPseudo] = useState('')
  const [ville, setVille] = useState('')
  const [adresse, setAdresse] = useState('')
  const [description, setDescription] = useState('')
  const [passions, setPassions] = useState('')
  const [photoProfil, setPhotoProfil] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()

      // Vérifier l'authentification
      const { data: { user: currentUser } } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push('/auth/login?redirect=/profil/modifier')
        return
      }

      setUser(currentUser)

      // Charger le profil
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error || !data) {
        setError('Erreur lors du chargement du profil')
        setLoading(false)
        return
      }

      setProfile(data)
      setPseudo(data.pseudo || '')
      setVille(data.ville || '')
      setAdresse(data.adresse || '')
      setDescription(data.description || '')
      setPassions(data.passions || '')
      setPhotoProfil(data.photo_profil || null)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La photo est trop volumineuse (maximum 5MB)')
      return
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image')
      return
    }

    setUploadingPhoto(true)
    setError(null)
    const supabase = createClient()

    try {
      // Supprimer l'ancienne photo si elle existe
      if (photoProfil) {
        try {
          // Extraire le chemin du fichier depuis l'URL
          const oldPath = photoProfil.split('/').slice(-2).join('/')
          await supabase.storage
            .from('photos')
            .remove([`profiles/${oldPath}`])
        } catch (error) {
          // Ignorer les erreurs de suppression (le fichier peut ne plus exister)
          console.log('Ancienne photo non trouvée, on continue')
        }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `profiles/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)

      setPhotoProfil(publicUrl)
      
      // Sauvegarder immédiatement la nouvelle photo
      // On essaie d'abord avec photo_profil, sinon on ignore l'erreur si la colonne n'existe pas encore
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_profil: publicUrl })
        .eq('id', user?.id)

      if (updateError) {
        // Si l'erreur est liée à la colonne manquante, on affiche un message plus clair
        if (updateError.message?.includes('photo_profil') || updateError.message?.includes('schema cache')) {
          console.warn('La colonne photo_profil n\'existe pas encore. Veuillez exécuter le script SQL dans Supabase.')
          // On continue quand même, la photo est uploadée dans le storage
          // L'utilisateur devra juste exécuter le script SQL et recharger la page
        } else {
          throw updateError
        }
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      console.error('Erreur upload photo:', error)
      setError('Erreur lors de l\'upload de la photo: ' + (error.message || 'Erreur inconnue'))
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = async () => {
    if (!photoProfil) return

    if (!confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      return
    }

    setUploadingPhoto(true)
    setError(null)
    const supabase = createClient()

    try {
      // Supprimer le fichier du storage
      try {
        const oldPath = photoProfil.split('/').slice(-2).join('/')
        await supabase.storage
          .from('photos')
          .remove([`profiles/${oldPath}`])
      } catch (error) {
        console.log('Erreur suppression fichier:', error)
      }

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_profil: null })
        .eq('id', user?.id)

      if (updateError) {
        // Si l'erreur est liée à la colonne manquante, on ignore
        if (updateError.message?.includes('photo_profil') || updateError.message?.includes('schema cache')) {
          console.warn('La colonne photo_profil n\'existe pas encore.')
          // On continue quand même
        } else {
          throw updateError
        }
      }

      setPhotoProfil(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      console.error('Erreur suppression photo:', error)
      setError('Erreur lors de la suppression de la photo: ' + (error.message || 'Erreur inconnue'))
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!pseudo.trim()) {
      setError('Le pseudo est obligatoire')
      return
    }

    setSaving(true)
    const supabase = createClient()

    try {
      // Construire l'objet de mise à jour avec seulement les colonnes de base
      const updateData: any = {
        pseudo: pseudo.trim(),
        ville: ville.trim() || null,
        description: description.trim() || null,
      }
      
      // Ajouter les colonnes optionnelles seulement si elles existent probablement
      // On essaie quand même, mais on gère les erreurs gracieusement
      try {
        // Essayer d'ajouter adresse
        updateData.adresse = adresse.trim() || null
      } catch (e) {
        // Ignorer si la colonne n'existe pas
      }
      
      try {
        // Essayer d'ajouter passions
        updateData.passions = passions.trim() || null
      } catch (e) {
        // Ignorer si la colonne n'existe pas
      }
      
      try {
        // Essayer d'ajouter photo_profil
        if (photoProfil !== undefined) {
          updateData.photo_profil = photoProfil || null
        }
      } catch (e) {
        // Ignorer si la colonne n'existe pas
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user?.id)

      if (updateError) {
        // Si l'erreur est liée à des colonnes manquantes, on essaie de mettre à jour seulement les colonnes de base
        if (updateError.message?.includes('schema cache') || 
            updateError.message?.includes('Could not find') ||
            updateError.message?.includes('adresse') ||
            updateError.message?.includes('passions') ||
            updateError.message?.includes('photo_profil')) {
          
          console.warn('Certaines colonnes n\'existent pas encore. Mise à jour avec les colonnes de base uniquement.')
          
          // Réessayer avec seulement les colonnes de base
          const { error: retryError } = await supabase
            .from('profiles')
            .update({
              pseudo: pseudo.trim(),
              ville: ville.trim() || null,
              description: description.trim() || null,
            })
            .eq('id', user?.id)
          
          if (retryError) {
            throw retryError
          } else {
            // Afficher un message informatif
            setError('Profil mis à jour partiellement. Veuillez exécuter le script SQL dans Supabase pour activer tous les champs (adresse, passions, photo de profil), puis rechargez la page.')
            setSuccess(false)
            return
          }
        } else {
          throw updateError
        }
      }

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      
      // Rafraîchir le profil dans le state
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      
      if (updatedProfile) {
        setProfile(updatedProfile)
      }

      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error)
      setError('Erreur lors de la mise à jour du profil: ' + (error.message || 'Erreur inconnue'))
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

  if (error && !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-700 font-semibold mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-2">
          Modifier mon profil
        </h1>
        <p className="text-gray-600">Mettez à jour vos informations personnelles</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm font-semibold">
              ✅ Profil mis à jour avec succès !
            </p>
          </div>
        )}

        {/* Photo de profil */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Photo de profil
          </label>
          <div className="flex items-start space-x-6">
            <div className="relative">
              {photoProfil ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-sm">
                  <Image
                    src={photoProfil}
                    alt="Photo de profil"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-semibold shadow-sm border-4 border-gray-200">
                  {pseudo.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <label className="inline-block cursor-pointer">
                <span className={`bg-primary text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all inline-block ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {uploadingPhoto ? '⏳ Upload...' : '📷 Changer la photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
              {photoProfil && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploadingPhoto}
                  className="block text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🗑️ Supprimer la photo
                </button>
              )}
              <p className="text-xs text-gray-500">
                Formats acceptés : JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Pseudo */}
        <div className="mb-6">
          <label htmlFor="pseudo" className="block text-sm font-medium text-gray-700 mb-2">
            Pseudo *
          </label>
          <input
            type="text"
            id="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Votre nom d'utilisateur visible par les autres membres
          </p>
        </div>

        {/* Ville */}
        <div className="mb-6">
          <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-2">
            Ville
          </label>
          <CityAutocomplete
            value={ville}
            onChange={setVille}
            placeholder="Ex: Bruxelles"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
          />
        </div>

        {/* Adresse */}
        <div className="mb-6">
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse complète
          </label>
          <AddressAutocomplete
            value={adresse}
            onChange={setAdresse}
            placeholder="Ex: Rue de la Loi 16, 1000 Bruxelles"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
          />
          <p className="mt-1 text-xs text-gray-500">
            Cette information n'est pas visible publiquement, elle sert uniquement pour la géolocalisation
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
            placeholder="Parlez un peu de vous..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Une courte présentation visible sur votre profil
          </p>
        </div>

        {/* Passions */}
        <div className="mb-6">
          <label htmlFor="passions" className="block text-sm font-medium text-gray-700 mb-2">
            Passions et centres d'intérêt
          </label>
          <textarea
            id="passions"
            value={passions}
            onChange={(e) => setPassions(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white transition-all"
            placeholder="Ex: Bricolage, musique, randonnée, événementiel..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Vos passions et centres d'intérêt (séparés par des virgules)
          </p>
        </div>

        {/* Informations système */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Informations système</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Date d'inscription :</span>{' '}
              {profile?.date_inscription 
                ? new Date(profile.date_inscription).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'Non disponible'}
            </p>
            <p>
              <span className="font-medium">Email :</span> {user?.email || 'Non disponible'}
              <span className="ml-2 text-xs text-gray-500">(non modifiable)</span>
            </p>
          </div>
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
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

