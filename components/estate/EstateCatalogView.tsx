'use client'

import { Fragment, useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Annonce } from '@/types/database'
import { EstateCatalogSidebar } from './EstateCatalogSidebar'
import { EstateCatalogPropertyCard } from './EstateCatalogPropertyCard'
import { EstateEditorialBreak } from './EstateEditorialBreak'
import { EstateIcon } from './EstateIcon'

function CatalogInner({ locale }: { locale: string }) {
  const searchParams = useSearchParams()
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      let query = supabase
        .from('annonces')
        .select('*')
        .eq('disponible', true)
        .order('date_creation', { ascending: false })

      const ville = searchParams.get('ville')
      const prixMax = searchParams.get('prix_max')
      if (ville) query = query.ilike('ville', `%${ville}%`)
      if (prixMax) {
        const n = parseFloat(prixMax)
        if (!Number.isNaN(n) && n >= 0) query = query.lte('prix_jour', n)
      }

      const { data, error } = await query
      if (cancelled) return
      if (error) {
        setAnnonces([])
      } else {
        setAnnonces(data ?? [])
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [searchParams])

  const items = annonces.slice(0, 5)
  const editorialAfter = 2

  return (
    <main className="flex min-h-screen flex-col gap-0 pt-24 md:flex-row">
      <EstateCatalogSidebar locale={locale} />
      <section className="w-full bg-estate-surface p-6 md:w-3/4 md:p-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-estate-serif text-4xl leading-tight text-estate-primary">
              Domaines sélectionnés
            </h1>
            <p className="mt-2 text-estate-on-surface-variant">
              {loading ? 'Chargement…' : `${annonces.length} annonce(s) disponible(s).`}
            </p>
          </div>
          <div className="flex items-center gap-1 self-start rounded-xl bg-estate-surface-container-low p-1.5 shadow-sm">
            <span className="px-3 text-xs font-bold uppercase tracking-wider text-estate-outline">
              Trier :
            </span>
            <button
              type="button"
              className="rounded-lg bg-estate-primary px-4 py-2 text-sm font-medium text-estate-on-primary shadow-sm"
            >
              Pertinence
            </button>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-medium text-estate-on-surface/60 transition-all hover:text-estate-primary"
            >
              Prix
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {loading &&
            [0, 1].map((i) => (
              <div
                key={i}
                className="h-[480px] animate-pulse rounded-xl bg-estate-surface-container-low"
              />
            ))}
          {!loading &&
            items.map((a, i) => (
              <Fragment key={a.id}>
                <EstateCatalogPropertyCard
                  annonce={a}
                  href={`/${locale}/annonces/${a.id}`}
                  variant={i % 3 === 2 ? 'premium' : 'default'}
                />
                {i === editorialAfter - 1 && items.length > editorialAfter && (
                  <EstateEditorialBreak locale={locale} />
                )}
              </Fragment>
            ))}
        </div>

        {!loading && annonces.length === 0 && (
          <p className="mt-12 text-center text-estate-on-surface-variant">
            Aucune annonce ne correspond à vos critères. Essayez d&apos;élargir la recherche.
          </p>
        )}

        <div className="mt-20 flex items-center justify-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-estate-outline hover:bg-estate-surface-container-high"
            aria-label="Précédent"
          >
            <EstateIcon name="chevron_left" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-estate-primary font-bold text-estate-on-primary"
          >
            1
          </button>
          <span className="px-2 text-estate-outline">…</span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-estate-outline hover:bg-estate-surface-container-high"
            aria-label="Suivant"
          >
            <EstateIcon name="chevron_right" />
          </button>
        </div>
      </section>
    </main>
  )
}

export function EstateCatalogView({ locale }: { locale: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-estate-surface pt-28 text-center font-estate text-estate-on-surface-variant">
          Chargement du catalogue…
        </div>
      }
    >
      <CatalogInner locale={locale} />
    </Suspense>
  )
}
