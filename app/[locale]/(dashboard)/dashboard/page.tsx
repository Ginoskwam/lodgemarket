import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getDashboardUser, type AppRole } from '@/lib/auth/dashboard'

export const dynamic = 'force-dynamic'

function firstDashboardPath(locale: string, roles: AppRole[]): string {
  if (roles.includes('admin')) return `/${locale}/dashboard/admin`
  if (roles.includes('buyer')) return `/${locale}/dashboard/acheteur`
  if (roles.includes('seller')) return `/${locale}/dashboard/vendeur`
  if (roles.includes('agency')) return `/${locale}/dashboard/agence`
  return `/${locale}/onboarding`
}

/**
 * Point d’entrée /[locale]/dashboard : évite le 404 et envoie vers le bon sous-espace.
 */
export default async function DashboardIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const user = await getDashboardUser()
  if (!user) {
    redirect(
      `/${locale}/auth/login?redirect=${encodeURIComponent(`/${locale}/dashboard`)}`
    )
  }

  redirect(firstDashboardPath(locale, user.roles))
}
