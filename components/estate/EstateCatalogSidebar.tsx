'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { EstateIcon } from './EstateIcon'

type Props = { locale: string }

export function EstateCatalogSidebar({ locale }: Props) {
  const router = useRouter()
  const sp = useSearchParams()
  const base = `/${locale}/annonces`

  const apply = useCallback(
    (next: Record<string, string>) => {
      const q = new URLSearchParams(sp.toString())
      Object.entries(next).forEach(([k, v]) => {
        if (v === '') q.delete(k)
        else q.set(k, v)
      })
      router.push(`${base}?${q.toString()}`)
    },
    [base, router, sp]
  )

  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-full overflow-y-auto border-r border-estate-outline-variant/15 bg-estate-surface-container-low p-6 md:w-1/4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-estate-primary">
          <EstateIcon name="tune" />
          Filtres
        </h2>
        <button
          type="button"
          onClick={() => router.push(base)}
          className="text-sm text-estate-secondary hover:underline"
        >
          Tout effacer
        </button>
      </div>
      <div className="space-y-10">
        <div>
          <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-estate-on-surface-variant">
            Localisation
          </label>
          <div className="relative">
            <EstateIcon
              name="location_on"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-estate-outline"
            />
            <input
              key={sp.get('ville') ?? ''}
              defaultValue={sp.get('ville') ?? ''}
              placeholder="Durbuy, Spa..."
              className="w-full rounded-lg border-0 bg-estate-surface py-3 pl-10 pr-4 text-sm shadow-sm ring-estate-primary focus:ring-1"
              onBlur={(e) => apply({ ville: e.target.value.trim() })}
            />
          </div>
        </div>
        <div>
          <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-estate-on-surface-variant">
            Prix de vente max (€)
          </label>
          <input
            key={sp.get('prix_vente_max') ?? ''}
            type="number"
            min={0}
            step={1000}
            defaultValue={sp.get('prix_vente_max') ?? ''}
            placeholder="Ex: 1 500 000"
            className="w-full rounded-lg border-0 bg-estate-surface p-3 text-sm shadow-sm focus:ring-1 focus:ring-estate-primary"
            onBlur={(e) => apply({ prix_vente_max: e.target.value.trim() })}
          />
        </div>
        <div className="rounded-xl border border-estate-secondary-container bg-estate-secondary-container/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-estate-on-secondary-container">Annonces vérifiées</p>
              <p className="text-xs text-estate-on-secondary-container/70">Priorité aux profils actifs</p>
            </div>
            <EstateIcon name="verified" className="text-estate-primary" filled />
          </div>
        </div>
        <div>
          <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-estate-on-surface-variant">
            Équipements (à venir)
          </label>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-estate-on-surface-variant">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" disabled className="rounded border-estate-outline-variant text-estate-primary" />
              Wellness / Spa
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" disabled className="rounded border-estate-outline-variant text-estate-primary" />
              Feu ouvert
            </label>
          </div>
        </div>
      </div>
    </aside>
  )
}
