import type { SupabaseClient } from '@supabase/supabase-js'

export type BuyerFavoriteRow = {
  created_at: string
  properties: {
    id: string
    title: string
    slug: string
    city: string | null
    price: number
    currency: string
  } | null
}

export type InquiryRow = {
  id: string
  status: string
  message: string | null
  created_at: string
  properties: { title: string; slug: string } | null
}

export type VisitRow = {
  id: string
  status: string
  message: string | null
  preferred_slots: string | null
  created_at: string
  properties: { title: string; slug: string } | null
}

export async function fetchBuyerFavorites(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select(
      `
      created_at,
      properties (
        id,
        title,
        slug,
        city,
        price,
        currency
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  const rows = (data ?? []) as unknown as {
    created_at: string
    properties: BuyerFavoriteRow['properties'] | BuyerFavoriteRow['properties'][] | null
  }[]
  return rows.map((row) => ({
    created_at: row.created_at,
    properties: Array.isArray(row.properties) ? row.properties[0] ?? null : row.properties,
  }))
}

export async function fetchBuyerInquiries(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('inquiries')
    .select(
      `
      id,
      status,
      message,
      created_at,
      properties ( title, slug )
    `
    )
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  const rows = (data ?? []) as unknown as {
    id: string
    status: string
    message: string | null
    created_at: string
    properties: InquiryRow['properties'] | InquiryRow['properties'][] | null
  }[]
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    message: row.message,
    created_at: row.created_at,
    properties: Array.isArray(row.properties) ? row.properties[0] ?? null : row.properties,
  }))
}

export async function fetchBuyerVisits(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('visit_requests')
    .select(
      `
      id,
      status,
      message,
      preferred_slots,
      created_at,
      properties ( title, slug )
    `
    )
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  const rows = (data ?? []) as unknown as {
    id: string
    status: string
    message: string | null
    preferred_slots: string | null
    created_at: string
    properties: VisitRow['properties'] | VisitRow['properties'][] | null
  }[]
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    message: row.message,
    preferred_slots: row.preferred_slots,
    created_at: row.created_at,
    properties: Array.isArray(row.properties) ? row.properties[0] ?? null : row.properties,
  }))
}

export type SellerPropertyRow = {
  id: string
  slug: string
  title: string
  publication_status: string
  price: number
  currency: string
  city: string | null
  updated_at: string
}

export async function fetchSellerProperties(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('id, slug, title, publication_status, price, currency, city, updated_at')
    .eq('owner_user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as SellerPropertyRow[]
}

export type LeadInquiryRow = {
  id: string
  status: string
  message: string | null
  created_at: string
  buyer_id: string
  properties: { title: string; slug: string } | null
}

export async function fetchSellerLeads(supabase: SupabaseClient, userId: string) {
  const { data: props } = await supabase.from('properties').select('id').eq('owner_user_id', userId)

  const ids = (props ?? []).map((p) => p.id)
  if (ids.length === 0) return []

  const { data, error } = await supabase
    .from('inquiries')
    .select(
      `
      id,
      status,
      message,
      created_at,
      buyer_id,
      properties ( title, slug )
    `
    )
    .in('property_id', ids)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) throw error
  const rows = (data ?? []) as unknown as {
    id: string
    status: string
    message: string | null
    created_at: string
    buyer_id: string
    properties: LeadInquiryRow['properties'] | LeadInquiryRow['properties'][] | null
  }[]
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    message: row.message,
    created_at: row.created_at,
    buyer_id: row.buyer_id,
    properties: Array.isArray(row.properties) ? row.properties[0] ?? null : row.properties,
  }))
}

export type OrgSummary = {
  id: string
  name: string
  slug: string
}

export async function fetchAgencyOrganizations(supabase: SupabaseClient, userId: string) {
  const { data: members, error: mErr } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)

  if (mErr) throw mErr
  const orgIds = Array.from(new Set((members ?? []).map((m) => m.organization_id)))
  if (orgIds.length === 0) return [] as OrgSummary[]

  const { data: orgs, error } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .in('id', orgIds)

  if (error) throw error
  return (orgs ?? []) as OrgSummary[]
}

export async function fetchAgencyProperties(supabase: SupabaseClient, orgIds: string[]) {
  if (orgIds.length === 0) return [] as SellerPropertyRow[]

  const { data, error } = await supabase
    .from('properties')
    .select('id, slug, title, publication_status, price, currency, city, updated_at')
    .in('organization_id', orgIds)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as SellerPropertyRow[]
}

export type AdminPropertyRow = SellerPropertyRow & {
  owner_user_id: string | null
  organization_id: string | null
}

export async function fetchAdminPendingProperties(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('properties')
    .select(
      'id, slug, title, publication_status, price, currency, city, updated_at, owner_user_id, organization_id'
    )
    .eq('publication_status', 'pending_review')
    .order('updated_at', { ascending: true })
    .limit(40)

  if (error) throw error
  return (data ?? []) as AdminPropertyRow[]
}

export async function fetchAdminPropertyStats(supabase: SupabaseClient) {
  const statuses = ['draft', 'pending_review', 'published', 'rejected', 'archived'] as const
  const counts: Record<string, number> = {}

  for (const s of statuses) {
    const { count, error } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('publication_status', s)

    if (error) throw error
    counts[s] = count ?? 0
  }

  return counts
}

export async function fetchAdminUserRoleCounts(supabase: SupabaseClient) {
  const roles = ['buyer', 'seller', 'agency', 'admin'] as const
  const counts: Record<string, number> = {}

  for (const r of roles) {
    const { count, error } = await supabase
      .from('user_roles')
      .select('user_id', { count: 'exact', head: true })
      .eq('role', r)

    if (error) throw error
    counts[r] = count ?? 0
  }

  return counts
}
