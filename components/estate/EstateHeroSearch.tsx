import { getLocale } from 'next-intl/server'
import { EstateIcon } from './EstateIcon'

export async function EstateHeroSearch() {
  const locale = await getLocale()
  const action = `/${locale}/catalogue`

  return (
    <form
      action={action}
      method="get"
      className="mx-auto flex max-w-4xl flex-col gap-2 rounded-xl bg-estate-surface p-2 shadow-xl md:flex-row"
    >
      <div className="flex flex-1 items-center gap-3 px-4 py-3">
        <EstateIcon name="location_on" className="text-estate-outline" />
        <div className="text-left">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-estate-outline">
            Localisation
          </label>
          <input
            name="city"
            className="w-full border-0 bg-transparent p-0 font-medium text-estate-on-surface focus:ring-0"
            placeholder="Ardennes belges, Spa, Durbuy"
            defaultValue=""
          />
        </div>
      </div>
      <div className="mx-2 hidden w-px bg-estate-outline-variant/30 md:block" />
      <div className="flex flex-1 items-center gap-3 px-4 py-3">
        <EstateIcon name="payments" className="text-estate-outline" />
        <div className="text-left">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-estate-outline">
            Budget d&apos;achat max (€)
          </label>
          <input
            name="prix_max"
            type="number"
            min={0}
            step={1000}
            className="w-full border-0 bg-transparent p-0 font-medium text-estate-on-surface focus:ring-0"
            placeholder="Ex: 1 200 000"
          />
        </div>
      </div>
      <div className="mx-2 hidden w-px bg-estate-outline-variant/30 md:block" />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-estate-primary px-8 py-4 font-bold text-estate-on-primary transition-all hover:bg-estate-primary-container"
      >
        <EstateIcon name="search" />
        Trouver un actif
      </button>
    </form>
  )
}
