import Image from 'next/image'
import Link from 'next/link'
import type { PropertyCardData } from '@/lib/properties/queries'
import { formatCurrencyEur, formatPercent, formatRevenueShort } from '@/lib/format'
import { EstateCertifiedBadge } from '@/components/estate/EstateBadge'
import { EstateIcon } from '@/components/estate/EstateIcon'
import { cn } from '@/lib/cn'

function certLabel(level: string): string | null {
  if (level === 'certified') return 'CERTIFIÉ'
  if (level === 'verified') return 'VÉRIFIÉ'
  return null
}

export function PropertyCard({
  property,
  locale,
  className,
}: {
  property: PropertyCardData
  locale: string
  className?: string
}) {
  const href = `/${locale}/biens/${property.slug}`
  const place = [property.postal_code, property.city].filter(Boolean).join(' ') || 'Belgique'
  const cert = certLabel(property.certification_level)
  const revenue = formatRevenueShort(property.revenue_yearly)
  const yieldStr =
    property.yield_percent != null ? formatPercent(property.yield_percent) : null

  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 hover:shadow-xl',
        className
      )}
    >
      <div className="relative h-64 overflow-hidden bg-estate-surface-container">
        {property.coverUrl ? (
          <Image
            src={property.coverUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-estate-primary/20 to-estate-secondary-container/40">
            <EstateIcon name="villa" className="text-4xl text-estate-outline-variant/50" />
          </div>
        )}
        {cert ? (
          <div className="absolute left-4 top-4">
            <EstateCertifiedBadge label={`GÎTE ${cert}`} />
          </div>
        ) : null}
      </div>
      <div className="flex flex-grow flex-col p-6">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-estate-serif text-xl font-bold text-estate-on-surface">{property.title}</h3>
          <span className="shrink-0 font-bold text-estate-primary">
            {formatCurrencyEur(property.price, property.currency)}
          </span>
        </div>
        <p className="mb-4 flex items-center gap-1 text-sm text-estate-on-surface-variant">
          <EstateIcon name="location_on" className="text-sm" />
          {place}
        </p>
        <div className="mb-4 grid grid-cols-2 gap-4 border-y border-estate-outline-variant/10 py-4">
          <div className="flex items-center gap-2">
            <EstateIcon name="group" className="text-estate-outline" />
            <span className="text-xs font-medium text-estate-on-surface-variant">
              {property.capacity != null ? `${property.capacity} voyageurs` : '—'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <EstateIcon name="trending_up" className="text-estate-outline" />
            <span className="text-xs font-medium text-estate-on-surface-variant">
              {yieldStr ? `Rendement ${yieldStr}` : 'Rendement —'}
            </span>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-estate-on-tertiary-container">
          <EstateIcon name="bar_chart" className="text-sm" />
          {revenue ? `CA annuel : ${revenue}+` : 'Données sur demande'}
        </div>
      </div>
    </Link>
  )
}
