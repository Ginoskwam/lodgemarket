import Image from 'next/image'
import Link from 'next/link'
import type { PropertyCardData } from '@/lib/properties/queries'
import { formatCurrencyEur, formatPercent, formatRevenueShort } from '@/lib/format'
import { EstateButton } from '@/components/estate/EstateButton'
import { EstateCertifiedBadge, EstateNeutralBadge } from '@/components/estate/EstateBadge'
import { EstateIcon } from '@/components/estate/EstateIcon'

function certBadge(level: string) {
  if (level === 'certified') return <EstateCertifiedBadge label="Annonce certifiée" />
  if (level === 'verified') return <EstateCertifiedBadge label="Annonce vérifiée" />
  return null
}

export function PropertyDetailView({
  property,
  locale,
}: {
  property: PropertyCardData
  locale: string
}) {
  const place = [property.postal_code, property.city, property.country].filter(Boolean).join(' · ')
  const mainImage = property.galleryUrls[0] ?? property.coverUrl
  const rest = property.galleryUrls.slice(1)
  const revenue = formatRevenueShort(property.revenue_yearly)

  return (
    <article className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <nav className="mb-8 text-sm text-estate-on-surface-variant">
        <Link href={`/${locale}/catalogue`} className="hover:text-estate-primary">
          Catalogue
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-estate-on-surface">{property.title}</span>
      </nav>

      <div className="mb-10 grid gap-4 lg:grid-cols-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-estate-surface-container lg:col-span-2">
          {mainImage ? (
            <Image
              src={mainImage}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-estate-surface-container-high">
              <EstateIcon name="photo_camera" className="text-5xl text-estate-outline-variant/40" />
            </div>
          )}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">{certBadge(property.certification_level)}</div>
        </div>
        <aside className="flex flex-col justify-between rounded-2xl border border-estate-outline-variant/15 bg-estate-surface-container-low p-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-estate-on-surface-variant">
              Prix demandé
            </p>
            <p className="mt-2 font-estate-serif text-3xl text-estate-primary">
              {formatCurrencyEur(property.price, property.currency)}
            </p>
            {place ? (
              <p className="mt-4 flex items-start gap-2 text-estate-on-surface-variant">
                <EstateIcon name="location_on" className="mt-0.5 shrink-0" />
                {place}
              </p>
            ) : null}
          </div>
          <div className="mt-8 space-y-3">
            <EstateButton variant="primary" href={`/${locale}/auth/register`} className="w-full justify-center">
              Créer un compte pour dossier & visite
            </EstateButton>
            <EstateButton variant="secondary" href={`/${locale}/contact`} className="w-full justify-center">
              Contacter Lodgemarket
            </EstateButton>
          </div>
        </aside>
      </div>

      {rest.length > 0 ? (
        <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {rest.map((url) => (
            <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image src={url} alt="" fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 font-estate-serif text-2xl text-estate-on-surface">Présentation</h2>
            <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-estate-on-surface-variant">
              {property.description}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-estate-serif text-2xl text-estate-on-surface">Caractéristiques</h2>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ['Capacité', property.capacity != null ? `${property.capacity} pers.` : '—'],
                ['Surface', property.surface_m2 != null ? `${property.surface_m2} m²` : '—'],
                ['Chambres', property.bedrooms != null ? String(property.bedrooms) : '—'],
                ['Salles de bain', property.bathrooms != null ? String(property.bathrooms) : '—'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-estate-surface-container-low px-4 py-3">
                  <dt className="text-xs font-bold uppercase text-estate-outline">{k}</dt>
                  <dd className="mt-1 font-medium text-estate-on-surface">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {property.amenity_labels.length > 0 ? (
            <section>
              <h2 className="mb-4 font-estate-serif text-2xl text-estate-on-surface">Équipements</h2>
              <ul className="flex flex-wrap gap-2">
                {property.amenity_labels.map((a) => (
                  <li key={a}>
                    <EstateNeutralBadge>{a}</EstateNeutralBadge>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {property.homologation_status ? (
            <section className="rounded-xl border border-estate-outline-variant/20 bg-estate-surface-container-low p-6">
              <h2 className="mb-2 font-estate-serif text-xl">Homologation</h2>
              <p className="text-sm text-estate-on-surface-variant">{property.homologation_status}</p>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-estate-outline-variant/15 bg-estate-primary/5 p-6">
            <h2 className="mb-4 font-estate-serif text-xl text-estate-on-surface">Données & performance</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between gap-4">
                <span className="text-estate-on-surface-variant">CA annuel (indicatif)</span>
                <span className="font-semibold text-estate-on-surface">{revenue ?? '—'}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-estate-on-surface-variant">Rendement</span>
                <span className="font-semibold text-estate-on-surface">
                  {property.yield_percent != null ? formatPercent(property.yield_percent) : '—'}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-estate-on-surface-variant">Occupation</span>
                <span className="font-semibold text-estate-on-surface">
                  {property.occupancy_rate != null ? formatPercent(property.occupancy_rate) : '—'}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-estate-on-surface-variant">ADR</span>
                <span className="font-semibold text-estate-on-surface">
                  {property.adr != null ? formatCurrencyEur(property.adr) : '—'}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-estate-on-surface-variant">Charges d&apos;exploitation</span>
                <span className="font-semibold text-estate-on-surface">
                  {property.operating_costs_yearly != null
                    ? formatCurrencyEur(property.operating_costs_yearly)
                    : '—'}
                </span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-estate-on-surface-variant/80">
              Données communiquées par le vendeur et/ou auditées selon le niveau de certification. Non contractuelles.
            </p>
          </div>
        </aside>
      </div>
    </article>
  )
}
