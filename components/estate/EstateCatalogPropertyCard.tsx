import Image from 'next/image'
import Link from 'next/link'
import { EstateCertifiedBadge, EstateNeutralBadge } from './EstateBadge'
import { EstateIcon } from './EstateIcon'
import type { Annonce } from '@/types/database'

type Props = {
  annonce: Annonce
  href: string
  variant?: 'default' | 'premium'
}

export function EstateCatalogPropertyCard({ annonce, href, variant = 'default' }: Props) {
  const cover = annonce.photos?.[0]
  const priceLabel = `${annonce.prix_jour} €`

  return (
    <div className="group overflow-hidden rounded-xl bg-estate-surface-container-lowest shadow-estate transition-all duration-500 hover:shadow-estate-hover">
      <div className="relative h-80 overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="h-full w-full bg-estate-surface-container" />
        )}
        <div className="absolute left-4 top-4 flex gap-2">
          {variant === 'default' ? (
            <EstateCertifiedBadge label="Annonce vérifiée" />
          ) : (
            <EstateNeutralBadge>Annonce premium</EstateNeutralBadge>
          )}
        </div>
      </div>
      <div className="p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-estate-on-tertiary-container">
              {annonce.ville}
            </p>
            <h3 className="font-estate-serif text-2xl text-estate-primary transition-colors group-hover:text-estate-secondary">
              {annonce.titre}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-estate-primary">{priceLabel}</p>
            <p className="text-xs text-estate-outline">par jour</p>
          </div>
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4 border-y border-estate-outline-variant/15 py-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-tighter text-estate-outline">Catégorie</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
              <EstateIcon name="sell" className="text-sm" />
              <span className="line-clamp-1">{annonce.categorie}</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-tighter text-estate-outline">Disponibilité</p>
            <p className="mt-1 text-sm font-semibold text-estate-on-tertiary-container">
              {annonce.disponible ? 'Oui' : 'Non'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-tighter text-estate-outline">Vues</p>
            <p className="mt-1 text-sm font-bold text-emerald-800">{annonce.nombre_vues ?? 0}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-estate-outline">
            <EstateIcon name="photo_camera" title="Photos" />
            <EstateIcon name="chat" title="Contact" />
          </div>
          <Link
            href={href}
            className="group/btn flex items-center gap-2 text-sm font-bold text-estate-primary"
          >
            Voir détails
            <EstateIcon
              name="arrow_forward"
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
