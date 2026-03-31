import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AppRole = 'buyer' | 'seller' | 'agency' | 'admin'

export type DashboardUser = {
  id: string
  email: string | undefined
  displayName: string
  roles: AppRole[]
}

async function getDashboardUserUncached(): Promise<DashboardUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle()

  const { data: roleRows } = await supabase.from('user_roles').select('role').eq('user_id', user.id)

  const roles = (roleRows ?? [])
    .map((r) => r.role as AppRole)
    .filter((r): r is AppRole => ['buyer', 'seller', 'agency', 'admin'].includes(r))

  return {
    id: user.id,
    email: user.email,
    displayName: profile?.display_name ?? user.email?.split('@')[0] ?? 'Utilisateur',
    roles,
  }
}

export const getDashboardUser = cache(getDashboardUserUncached)

export function canAccessDashboard(roles: AppRole[], allowed: AppRole[]): boolean {
  if (roles.includes('admin')) return true
  return allowed.some((r) => roles.includes(r))
}

export async function requireAuth(locale: string, returnPath: string): Promise<DashboardUser> {
  const user = await getDashboardUser()
  if (!user) {
    const next = encodeURIComponent(returnPath)
    redirect(`/${locale}/auth/login?redirect=${next}`)
  }
  return user
}
