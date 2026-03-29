'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { ContactButton } from '@/components/ContactButton'
import { EditAnnonceButton } from '@/components/EditAnnonceButton'
import { IncrementVues } from '@/components/IncrementVues'
import { AuthGuard } from '@/components/AuthGuard'
import type { Annonce, Profile } from '@/types/database'

interface AnnonceDetailContentProps {
  annonce: Annonce & { proprietaire: Profile }
  isOwner: boolean
  count: number | null
}

export function AnnonceDetailContent({ annonce, isOwner, count }: AnnonceDetailContentProps) {
  const proprietaire = annonce.proprietaire as Profile
  const locale = useLocale()
  const t = useTranslations('announcements')
  const tCommon = useTranslations('common')
  const tCategories = useTranslations('categories')
  
  // Mapping des catégories
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

  return (
    <AuthGuard>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <IncrementVues annonceId={annonce.id} proprietaireId={proprietaire.id} />
        
          {/* Breadcrumb */}
          <Link
            href={`/${locale}/annonces`}
            className="text-primary hover:text-primary-dark mb-6 inline-block text-sm font-medium"
          >
            {t('backToAnnouncements')}
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photo principale */}
              {annonce.photos && annonce.photos.length > 0 && (
                <div className="card overflow-hidden p-0">
                  <div className="aspect-video bg-gray-100 relative">
                    <Image
                      src={annonce.photos[0]}
                      alt={annonce.titre}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Titre et infos */}
              <div className="card p-6 md:p-8">
                <h1 className="heading-2 mb-4">{annonce.titre}</h1>
                <div className="flex items-center gap-4 flex-wrap mb-6">
                  <span className="badge-primary">
                    {translateCategory(annonce.categorie)}
                  </span>
                  <span className="text-secondary flex items-center gap-1">
                    <span>📍</span> {annonce.ville}
                  </span>
                  <span className="text-small text-gray-400">
                    👁️ {annonce.nombre_vues || 0} {t('views', { count: annonce.nombre_vues || 0 })}
                  </span>
                </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h2 className="heading-3 mb-3">{t('description')}</h2>
                    <p className="body-text whitespace-pre-line text-gray-secondary">
                      {annonce.description}
                    </p>
                  </div>

                  {/* Règles spécifiques */}
                  {annonce.regles_specifiques && (
                    <div className="mb-6 pt-6 border-t border-gray-200">
                      <h2 className="heading-3 mb-3">{t('specificRules')}</h2>
                      <p className="body-text whitespace-pre-line text-gray-secondary">
                        {annonce.regles_specifiques}
                      </p>
                    </div>
                  )}

                  {/* Informations pratiques */}
                  <div className="rounded-xl p-6 border" style={{ backgroundColor: 'rgba(254, 242, 242, 0.5)', borderColor: '#FECACA' }}>
                    <h2 className="heading-3 mb-4">{t('practicalInfo')}</h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">{t('numberOfItemsAvailable')}</span>
                        <span className="font-semibold text-charbon-text">{annonce.nombre_articles || 1} {t('items', { count: annonce.nombre_articles || 1 })}</span>
                      </div>
                      {annonce.caution_indicative && (
                        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#FECACA' }}>
                          <span className="text-secondary">{t('indicativeDeposit')}</span>
                          <span className="font-semibold text-charbon-text">{annonce.caution_indicative}€</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2 pt-2 border-t" style={{ borderColor: '#FECACA' }}>
                        <span className="text-secondary">ℹ️</span>
                        <p className="text-small text-charbon-secondary">
                          {t('handoverInfo')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Carte prix et contact */}
                <div className="card p-6 sticky top-24">
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="text-small text-gray-secondary mb-2">{t('pricePerDay')}</div>
                    <div className="text-4xl font-bold text-primary">{annonce.prix_jour}€</div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="space-y-3">
                    {!isOwner && (
                      <ContactButton annonceId={annonce.id} proprietaireId={proprietaire.id} />
                    )}
                    <EditAnnonceButton annonceId={annonce.id} proprietaireId={proprietaire.id} />
                  </div>
                </div>

                {/* Carte propriétaire */}
                <div className="card p-6">
                  <h2 className="heading-3 mb-4">{t('owner')}</h2>
                  <div className="flex items-center gap-3 mb-4">
                    {proprietaire.photo_profil ? (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200">
                        <Image
                          src={proprietaire.photo_profil}
                          alt={proprietaire.pseudo}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg shadow-warm">
                        {proprietaire.pseudo.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-text">{proprietaire.pseudo}</p>
                      {proprietaire.ville && (
                        <p className="text-small text-gray-secondary">📍 {proprietaire.ville}</p>
                      )}
                    </div>
                  </div>
                  {count !== null && count > 0 && (
                    <p className="text-small text-gray-secondary">
                      {t('otherAnnouncementsCount', { count })}
                    </p>
                  )}
                </div>
              </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

