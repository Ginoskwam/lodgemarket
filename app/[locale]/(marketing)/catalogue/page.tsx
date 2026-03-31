import { setRequestLocale } from 'next-intl/server'
import { getPublishedProperties } from '@/lib/properties/queries'
import { PropertyCard } from '@/components/property/PropertyCard'
import { EstateButton } from '@/components/estate/EstateButton'

function parseNum(v: string | string[] | undefined): number | undefined {
  if (typeof v !== 'string' || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export default async function CataloguePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const sp = await searchParams
  const city = typeof sp.city === 'string' ? sp.city : undefined
  const prixMin = parseNum(sp.prix_min)
  const prixMax = parseNum(sp.prix_max)
  const capaciteMin = parseNum(sp.capacite_min)

  const properties = await getPublishedProperties({
    city,
    prixMin,
    prixMax,
    capaciteMin,
  })

  const p = `/${locale}`

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <div className="mb-10">
        <h1 className="font-estate-serif text-4xl text-estate-on-surface md:text-5xl">Catalogue</h1>
        <p className="mt-3 max-w-2xl text-estate-on-surface-variant">
          Gîtes et actifs touristiques publiés sur Lodgemarket. Filtrez par localisation, budget ou capacité.
        </p>
      </div>

      <form
        method="get"
        className="mb-12 grid gap-4 rounded-2xl border border-estate-outline-variant/15 bg-estate-surface-container-low p-6 md:grid-cols-12 md:items-end"
      >
        <label className="md:col-span-4">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-estate-outline">
            Ville ou code postal
          </span>
          <input
            name="city"
            type="text"
            defaultValue={city ?? ''}
            placeholder="Spa, 4900…"
            className="w-full rounded-lg border border-estate-outline-variant/25 bg-estate-surface px-3 py-2 text-sm text-estate-on-surface"
          />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-estate-outline">
            Prix min (€)
          </span>
          <input
            name="prix_min"
            type="number"
            min={0}
            step={10000}
            defaultValue={prixMin ?? ''}
            className="w-full rounded-lg border border-estate-outline-variant/25 bg-estate-surface px-3 py-2 text-sm text-estate-on-surface"
          />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-estate-outline">
            Prix max (€)
          </span>
          <input
            name="prix_max"
            type="number"
            min={0}
            step={10000}
            defaultValue={prixMax ?? ''}
            className="w-full rounded-lg border border-estate-outline-variant/25 bg-estate-surface px-3 py-2 text-sm text-estate-on-surface"
          />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-estate-outline">
            Capacité min.
          </span>
          <input
            name="capacite_min"
            type="number"
            min={1}
            defaultValue={capaciteMin ?? ''}
            className="w-full rounded-lg border border-estate-outline-variant/25 bg-estate-surface px-3 py-2 text-sm text-estate-on-surface"
          />
        </label>
        <div className="flex gap-2 md:col-span-2">
          <EstateButton type="submit" className="flex-1 justify-center">
            Filtrer
          </EstateButton>
          <EstateButton type="button" variant="secondary" href={`${p}/catalogue`} className="flex-1 justify-center">
            Réinit.
          </EstateButton>
        </div>
      </form>

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-estate-outline-variant/30 bg-estate-surface-container-low px-8 py-16 text-center">
          <p className="font-estate-serif text-xl text-estate-on-surface">Aucun bien ne correspond à ces critères.</p>
          <p className="mt-2 text-sm text-estate-on-surface-variant">
            Élargissez la recherche ou revenez plus tard : de nouvelles annonces certifiées sont publiées régulièrement.
          </p>
          <EstateButton variant="secondary" href={`${p}/catalogue`} className="mt-8">
            Voir tout le catalogue
          </EstateButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
