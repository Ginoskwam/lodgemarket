'use client'

import Image from 'next/image'
import type { Profile } from '@/types/database'

/**
 * Modal pour afficher le profil public d'un utilisateur
 */
export function ProfileModal({
  profile,
  annoncesCount,
  isOpen,
  onClose,
}: {
  profile: Profile
  annoncesCount: number
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-large max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-semibold text-gray-900">Profil</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6">
            {/* Photo et nom */}
            <div className="text-center mb-6 pb-6 border-b border-gray-200">
              {profile.photo_profil ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 mx-auto mb-4">
                  <Image
                    src={profile.photo_profil}
                    alt={profile.pseudo}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {profile.pseudo.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{profile.pseudo}</h3>
              {profile.ville && (
                <p className="text-gray-600 flex items-center justify-center gap-1 text-sm">
                  <span>📍</span> {profile.ville}
                </p>
              )}
            </div>

            {/* Informations */}
            <div className="space-y-5">
              {/* Description */}
              {profile.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">À propos</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{profile.description}</p>
                </div>
              )}

              {/* Passions */}
              {profile.passions && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Passions et centres d'intérêt</h4>
                  <p className="text-gray-600 text-sm">{profile.passions}</p>
                </div>
              )}

              {/* Statistiques */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{annoncesCount}</div>
                    <div className="text-xs text-gray-600">Annonce{annoncesCount > 1 ? 's' : ''} active{annoncesCount > 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {profile.date_inscription
                        ? new Date(profile.date_inscription).getFullYear()
                        : '—'}
                    </div>
                    <div className="text-xs text-gray-600">Membre depuis</div>
                  </div>
                </div>
              </div>

              {/* Date d'inscription complète */}
              {profile.date_inscription && (
                <div className="text-center pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Inscrit le {new Date(profile.date_inscription).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

