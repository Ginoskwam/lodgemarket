import { createClient } from '@/lib/supabase/server'
import { getPropertyImagePublicUrl } from '@/lib/properties/image-url'
import { isSupabaseConfigured } from '@/lib/supabase/env'

export type PropertyCardData = {
  id: string
  slug: string
  title: string
  description: string
  price: number
  currency: string
  capacity: number | null
  surface_m2: number | null
  bedrooms: number | null
  bathrooms: number | null
  city: string | null
  postal_code: string | null
  country: string | null
  certification_level: string
  verified_at: string | null
  homologation_status: string | null
  coverUrl: string | null
  revenue_yearly: number | null
  yield_percent: number | null
  occupancy_rate: number | null
  adr: number | null
  operating_costs_yearly: number | null
  amenity_labels: string[]
  /** Toutes les images (ordre d’affichage), pour la fiche */
  galleryUrls: string[]
}

type MetricsRow = {
  revenue_yearly: number | null
  yield_percent: number | null
  occupancy_rate: number | null
  adr: number | null
  operating_costs_yearly: number | null
}

type PropertyRow = {
  id: string
  slug: string
  title: string
  description: string
  price: number
  currency: string
  capacity: number | null
  surface_m2: number | null
  bedrooms: number | null
  bathrooms: number | null
  city: string | null
  postal_code: string | null
  country: string | null
  certification_level: string
  verified_at: string | null
  homologation_status: string | null
  property_business_metrics: MetricsRow | MetricsRow[] | null
  property_images: { storage_path: string; sort_order: number; is_cover: boolean }[] | null
  property_amenities: { amenities: { label: string } | null }[] | null
}

function sortGalleryImages(images: PropertyRow['property_images']): string[] {
  if (!images?.length) return []
  const sorted = [...images].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1
    if (!a.is_cover && b.is_cover) return 1
    return a.sort_order - b.sort_order
  })
  return sorted.map((s) => getPropertyImagePublicUrl(s.storage_path))
}

function pickCoverUrl(images: PropertyRow['property_images']): string | null {
  const urls = sortGalleryImages(images)
  return urls[0] ?? null
}

function mapRow(row: PropertyRow): PropertyCardData {
  const mRaw = row.property_business_metrics
  const m = Array.isArray(mRaw) ? mRaw[0] ?? null : mRaw
  const amenity_labels =
    row.property_amenities
      ?.map((pa) => pa.amenities?.label)
      .filter((x): x is string => Boolean(x)) ?? []
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    currency: row.currency,
    capacity: row.capacity,
    surface_m2: row.surface_m2 != null ? Number(row.surface_m2) : null,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    city: row.city,
    postal_code: row.postal_code,
    country: row.country,
    certification_level: row.certification_level,
    verified_at: row.verified_at,
    homologation_status: row.homologation_status,
    coverUrl: pickCoverUrl(row.property_images),
    revenue_yearly: m?.revenue_yearly != null ? Number(m.revenue_yearly) : null,
    yield_percent: m?.yield_percent != null ? Number(m.yield_percent) : null,
    occupancy_rate: m?.occupancy_rate != null ? Number(m.occupancy_rate) : null,
    adr: m?.adr != null ? Number(m.adr) : null,
    operating_costs_yearly:
      m?.operating_costs_yearly != null ? Number(m.operating_costs_yearly) : null,
    amenity_labels,
    galleryUrls: sortGalleryImages(row.property_images),
  }
}

const propertySelect = `
  id,
  slug,
  title,
  description,
  price,
  currency,
  capacity,
  surface_m2,
  bedrooms,
  bathrooms,
  city,
  postal_code,
  country,
  certification_level,
  verified_at,
  homologation_status,
  property_business_metrics (
    revenue_yearly,
    yield_percent,
    occupancy_rate,
    adr,
    operating_costs_yearly
  ),
  property_images ( storage_path, sort_order, is_cover ),
  property_amenities ( amenities ( label ) )
`

export type CatalogueFilters = {
  city?: string
  prixMin?: number
  prixMax?: number
  capaciteMin?: number
}

export async function getPublishedProperties(
  filters: CatalogueFilters = {}
): Promise<PropertyCardData[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  let q = supabase
    .from('properties')
    .select(propertySelect)
    .eq('publication_status', 'published')
    .order('created_at', { ascending: false })

  if (filters.city?.trim()) {
    const term = filters.city.trim()
    q = q.or(`city.ilike.%${term}%,postal_code.ilike.%${term}%`)
  }
  if (filters.prixMin != null && !Number.isNaN(filters.prixMin)) {
    q = q.gte('price', filters.prixMin)
  }
  if (filters.prixMax != null && !Number.isNaN(filters.prixMax)) {
    q = q.lte('price', filters.prixMax)
  }
  if (filters.capaciteMin != null && !Number.isNaN(filters.capaciteMin)) {
    q = q.gte('capacity', filters.capaciteMin)
  }

  const { data, error } = await q

  if (error) {
    console.error('getPublishedProperties', error.message)
    return []
  }

  return (data as unknown as PropertyRow[]).map(mapRow)
}

export async function getFeaturedProperties(limit = 3): Promise<PropertyCardData[]> {
  const all = await getPublishedProperties({})
  return all.slice(0, limit)
}

export async function getPublishedPropertyBySlug(
  slug: string
): Promise<PropertyCardData | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select(propertySelect)
    .eq('publication_status', 'published')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('getPublishedPropertyBySlug', error.message)
    return null
  }
  if (!data) return null
  return mapRow(data as unknown as PropertyRow)
}
