import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { EstateIcon } from './EstateIcon'

export async function EstateFooter() {
  const locale = await getLocale()
  const p = `/${locale}`

  return (
    <footer className="w-full bg-estate-surface-container-low pt-16 pb-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 md:grid-cols-4 md:px-12">
        <div className="space-y-6">
          <div className="font-estate-serif text-xl text-estate-primary">Lodgemarket</div>
          <p className="max-w-xs text-sm leading-relaxed text-estate-on-surface/60">
            La première place de marché dédiée aux actifs locatifs de prestige et à l&apos;hospitalité
            rurale certifiée.
          </p>
          <div className="flex gap-4 text-estate-primary">
            <EstateIcon name="public" className="cursor-pointer hover:text-estate-on-tertiary-container" />
            <EstateIcon name="mail" className="cursor-pointer hover:text-estate-on-tertiary-container" />
            <EstateIcon name="chat" className="cursor-pointer hover:text-estate-on-tertiary-container" />
          </div>
        </div>
        <div className="space-y-4">
          <h5 className="font-bold text-estate-primary">Plateforme</h5>
          <ul className="space-y-2 text-sm text-estate-on-surface/60">
            <li>
              <Link className="transition-colors hover:text-estate-on-tertiary-container" href={`${p}/annonces`}>
                Explorer les Gîtes
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-estate-on-tertiary-container" href={`${p}/#expertise`}>
                Méthodologie
              </Link>
            </li>
            <li>
              <Link
                className="transition-colors hover:text-estate-on-tertiary-container"
                href={`${p}/annonces/nouvelle`}
              >
                Espace Vendeur
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-estate-on-tertiary-container" href={`${p}/aide`}>
                Guides
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h5 className="font-bold text-estate-primary">Société</h5>
          <ul className="space-y-2 text-sm text-estate-on-surface/60">
            <li>
              <a className="transition-colors hover:text-estate-on-tertiary-container" href="mailto:info@newinc.be">
                Contact
              </a>
            </li>
            <li>
              <Link className="transition-colors hover:text-estate-on-tertiary-container" href={`${p}/terms`}>
                Mentions légales
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-estate-on-tertiary-container" href={`${p}/privacy`}>
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h5 className="font-bold text-estate-primary">Newsletter</h5>
          <p className="text-sm text-estate-on-surface/60">
            Recevez un accès prioritaire aux opportunités sélectionnées.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Votre email"
              className="w-full rounded-l-lg border-0 bg-estate-surface px-3 py-2 text-sm text-estate-on-surface focus:ring-1 focus:ring-estate-primary"
            />
            <button
              type="button"
              className="rounded-r-lg bg-estate-primary px-4 text-estate-on-primary"
              aria-label="Envoyer"
            >
              <EstateIcon name="arrow_forward" />
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl border-t border-estate-outline-variant/10 px-8 pt-8 text-center text-xs text-estate-on-surface/60 md:px-12">
        © {new Date().getFullYear()} Lodgemarket. Tous droits réservés.
      </div>
    </footer>
  )
}
