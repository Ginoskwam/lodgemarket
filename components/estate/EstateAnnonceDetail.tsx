import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ContactButton } from '@/components/ContactButton'
import { EditAnnonceButton } from '@/components/EditAnnonceButton'
import { IncrementVues } from '@/components/IncrementVues'
import type { Annonce, Profile } from '@/types/database'
import { EstateCertifiedBadge } from './EstateBadge'
import { EstateButton } from './EstateButton'
import { EstateIcon } from './EstateIcon'

type Props = {
  annonce: Annonce & { proprietaire: Profile }
  isOwner: boolean
  count: number | null
  locale: string
}

export async function EstateAnnonceDetail({ annonce, isOwner, count, locale }: Props) {
  const t = await getTranslations('announcements')
  const proprietaire = annonce.proprietaire
  const photos = annonce.photos ?? []
  const main = photos[0]
  const thumb1 = photos[1]
  const thumb2 = photos[2]

  const metrics = [
    {
      icon: 'analytics' as const,
      label: 'Catégorie',
      value: annonce.categorie.split('&')[0]?.trim() ?? annonce.categorie,
    },
    {
      icon: 'payments' as const,
      label: 'Prix / jour',
      value: `${annonce.prix_jour} €`,
    },
    {
      icon: 'history' as const,
      label: 'Articles',
      value: String(annonce.nombre_articles ?? 1),
    },
    {
      icon: 'star' as const,
      label: 'Vues',
      value: String(annonce.nombre_vues ?? 0),
    },
  ]

  return (
    <div className="bg-estate-surface font-estate text-estate-on-surface antialiased">
      <IncrementVues annonceId={annonce.id} proprietaireId={proprietaire.id} />

      <main className="mx-auto max-w-screen-2xl px-6 pb-20 pt-24 md:px-8">
        <Link
          href={`/${locale}/annonces`}
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-estate-primary hover:text-estate-on-tertiary-container"
        >
          <EstateIcon name="arrow_back" className="text-base" />
          {t('backToAnnouncements')}
        </Link>

        <section className="mb-12 grid h-[420px] grid-cols-12 gap-4 md:h-[600px]">
          <div className="relative col-span-12 overflow-hidden rounded-xl md:col-span-8">
            {main ? (
              <Image src={main} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 66vw" priority />
            ) : (
              <div className="h-full w-full bg-estate-surface-container-low" />
            )}
          </div>
          <div className="col-span-12 flex flex-col gap-4 md:col-span-4">
            <div className="relative h-1/2 min-h-[140px] overflow-hidden rounded-xl">
              {thumb1 ? (
                <Image src={thumb1} alt="" fill className="object-cover" sizes="33vw" />
              ) : (
                <div className="h-full bg-estate-surface-container" />
              )}
            </div>
            <div className="relative h-1/2 min-h-[140px] overflow-hidden rounded-xl">
              {thumb2 ? (
                <Image src={thumb2} alt="" fill className="object-cover" sizes="33vw" />
              ) : (
                <div className="h-full bg-estate-surface-container" />
              )}
              {photos.length > 1 && (
                <button
                  type="button"
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-estate-surface/90 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur"
                >
                  <EstateIcon name="grid_view" className="text-sm" />
                  Voir les {photos.length} photos
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="sticky top-20 z-40 mb-12 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-estate-outline-variant/15 bg-estate-surface px-6 py-6 shadow-lg shadow-estate-primary/5 transition-all">
          <div className="flex flex-wrap gap-8 md:gap-12">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-estate-on-surface-variant">
                Prix / jour
              </p>
              <p className="font-estate-serif text-2xl text-estate-primary">{annonce.prix_jour} €</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-estate-on-surface-variant">
                Localisation
              </p>
              <p className="font-estate-serif text-2xl text-estate-primary">{annonce.ville}</p>
            </div>
            <div className="hidden lg:block">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-estate-on-surface-variant">
                Catégorie
              </p>
              <p className="line-clamp-1 font-estate-serif text-xl text-estate-primary">{annonce.categorie}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <EstateButton variant="secondary" href={`/${locale}/annonces`} className="px-6 py-3">
              <EstateIcon name="bookmark" />
              Liste
            </EstateButton>
            {!isOwner && (
              <div className="min-w-[200px]">
                <ContactButton annonceId={annonce.id} proprietaireId={proprietaire.id} />
              </div>
            )}
            <div className="min-w-[120px]">
              <EditAnnonceButton annonceId={annonce.id} proprietaireId={proprietaire.id} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 space-y-16 lg:col-span-8">
            <section>
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <EstateCertifiedBadge label="Annonce vérifiée" />
                <span className="flex items-center gap-1 text-sm text-estate-on-surface-variant">
                  <EstateIcon name="visibility" className="text-base" />
                  {annonce.nombre_vues ?? 0} vues
                </span>
              </div>
              <h1 className="mb-8 font-estate-serif text-4xl leading-tight text-estate-primary md:text-5xl">
                {annonce.titre}
              </h1>
              <div className="prose prose-stone max-w-none text-lg leading-relaxed text-estate-on-surface-variant">
                <p className="whitespace-pre-line">{annonce.description}</p>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl bg-estate-surface-container-low p-6">
                  <EstateIcon name={m.icon} className="mb-4 text-estate-on-tertiary-container" />
                  <p className="mb-1 text-sm text-estate-on-surface-variant">{m.label}</p>
                  <p className="font-estate-serif text-2xl text-estate-primary">{m.value}</p>
                </div>
              ))}
            </section>

            {annonce.regles_specifiques && (
              <section className="rounded-xl bg-estate-surface-container p-8">
                <h3 className="mb-4 font-estate-serif text-xl text-estate-primary">{t('specificRules')}</h3>
                <p className="whitespace-pre-line text-estate-on-surface-variant">{annonce.regles_specifiques}</p>
              </section>
            )}

            <section className="rounded-xl bg-estate-surface-container-low p-8">
              <h3 className="mb-6 font-estate-serif text-xl text-estate-primary">Informations pratiques</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg bg-estate-surface p-4">
                  <span className="text-sm text-estate-on-surface-variant">{t('numberOfItemsAvailable')}</span>
                  <span className="font-medium">{annonce.nombre_articles ?? 1}</span>
                </div>
                {annonce.caution_indicative != null && (
                  <div className="flex items-center justify-between rounded-lg bg-estate-surface p-4">
                    <span className="text-sm text-estate-on-surface-variant">{t('indicativeDeposit')}</span>
                    <span className="font-medium">{annonce.caution_indicative} €</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-40 rounded-xl border border-estate-outline-variant/15 bg-estate-surface-container-highest p-8">
              <div className="mb-8 flex items-center gap-4">
                {proprietaire.photo_profil ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={proprietaire.photo_profil}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-estate-secondary-container font-bold text-estate-on-secondary-container">
                    {proprietaire.pseudo.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-estate-primary">{proprietaire.pseudo}</p>
                  <p className="text-xs text-estate-on-surface-variant">
                    {proprietaire.ville ? `📍 ${proprietaire.ville}` : t('owner')}
                  </p>
                </div>
              </div>
              {count != null && count > 0 && (
                <p className="mb-6 text-sm text-estate-on-surface-variant">
                  {t('otherAnnouncementsCount', { count })}
                </p>
              )}
              <p className="text-center text-xs leading-relaxed text-estate-on-surface-variant">
                Réponse sous 24h • <span className="font-bold text-estate-primary">Messagerie sécurisée</span>
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-24">
          <h3 className="mb-12 font-estate-serif text-3xl text-estate-primary">Autres annonces</h3>
          <div className="flex flex-wrap gap-4">
            <EstateButton variant="secondary" href={`/${locale}/annonces`}>
              Voir le catalogue
            </EstateButton>
            {proprietaire.id && (
              <EstateButton variant="ghost" href={`/${locale}/annonces?ville=${encodeURIComponent(annonce.ville)}`}>
                Même région
              </EstateButton>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
