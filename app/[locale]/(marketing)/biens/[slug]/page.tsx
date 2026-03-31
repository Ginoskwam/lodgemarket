import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPublishedPropertyBySlug } from '@/lib/properties/queries'
import { PropertyDetailView } from '@/components/property/PropertyDetailView'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const property = await getPublishedPropertyBySlug(slug)
  if (!property) {
    return { title: 'Bien introuvable | Lodgemarket' }
  }
  const place = [property.city, property.country].filter(Boolean).join(', ')
  return {
    title: `${property.title} | Lodgemarket`,
    description:
      place ?
        `${property.title} — ${place}. ${property.description.slice(0, 155)}${property.description.length > 155 ? '…' : ''}`
      : `${property.title}. ${property.description.slice(0, 155)}${property.description.length > 155 ? '…' : ''}`,
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 200),
      ...(property.coverUrl ? { images: [{ url: property.coverUrl }] } : {}),
    },
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const property = await getPublishedPropertyBySlug(slug)
  if (!property) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency,
    },
    ...(property.coverUrl ? { image: property.coverUrl } : {}),
  }
  if (siteUrl) {
    jsonLd.url = `${siteUrl}/${locale}/biens/${property.slug}`
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailView property={property} locale={locale} />
    </>
  )
}
