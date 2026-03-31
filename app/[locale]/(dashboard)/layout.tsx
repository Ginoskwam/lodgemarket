import { setRequestLocale } from 'next-intl/server'
import { DashboardChrome } from '@/components/dashboard/DashboardChrome'
import { getDashboardUser } from '@/lib/auth/dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardShellLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const user = await getDashboardUser()
  if (!user) {
    return <div className="min-h-screen bg-muted/30 font-estate">{children}</div>
  }

  return (
    <DashboardChrome locale={locale} user={user}>
      {children}
    </DashboardChrome>
  )
}
