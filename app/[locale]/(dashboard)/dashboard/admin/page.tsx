import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { DashboardAccessDenied } from '@/components/dashboard/DashboardAccessDenied'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { canAccessDashboard, requireAuth } from '@/lib/auth/dashboard'
import {
  fetchAdminPendingProperties,
  fetchAdminPropertyStats,
  fetchAdminUserRoleCounts,
} from '@/lib/dashboard/dashboard-data'
import { publicationStatusLabel } from '@/lib/dashboard/labels'
import { formatCurrencyEur } from '@/lib/format'
import { createClient } from '@/lib/supabase/server'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(iso))
  } catch {
    return iso
  }
}

const roleLabels: Record<string, string> = {
  buyer: 'Acheteurs',
  seller: 'Vendeurs',
  agency: 'Agences',
  admin: 'Admins',
}

export default async function DashboardAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const path = `/${locale}/dashboard/admin`
  const user = await requireAuth(locale, path)

  if (!canAccessDashboard(user.roles, ['admin'])) {
    return <DashboardAccessDenied locale={locale} neededRoles={['admin']} />
  }

  const supabase = await createClient()
  const [pending, propStats, roleCounts] = await Promise.all([
    fetchAdminPendingProperties(supabase),
    fetchAdminPropertyStats(supabase),
    fetchAdminUserRoleCounts(supabase),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-estate text-2xl font-semibold tracking-tight text-foreground">
          Administration
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          File d’attente de modération et vue d’ensemble des rôles déclarés.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {(['pending_review', 'published', 'draft', 'rejected', 'archived'] as const).map((key) => (
          <div key={key} className="rounded-xl border bg-card p-4 shadow">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {publicationStatusLabel[key]}
            </p>
            <p className="mt-1 font-estate text-2xl font-semibold">{propStats[key] ?? 0}</p>
          </div>
        ))}
      </div>

      <DashboardSection
        title="Rôles utilisateurs"
        description="Nombre de comptes ayant activé chaque rôle (une même personne peut cumuler plusieurs rôles)."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(roleCounts).map(([role, count]) => (
            <div
              key={role}
              className="flex items-center justify-between rounded-lg border bg-background px-4 py-3 text-sm"
            >
              <span className="text-muted-foreground">{roleLabels[role] ?? role}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title="Annonces en attente de validation"
        description="Passez les fiches en « Publiée » ou « Refusée » depuis l’outil de modération (actions à brancher)."
      >
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune annonce en file d’attente.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Titre</th>
                  <th className="pb-2 pr-4 font-medium">Prix</th>
                  <th className="pb-2 pr-4 font-medium">Lieu</th>
                  <th className="pb-2 font-medium">Mise à jour</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pending.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-4">
                      <Link href={`/${locale}/biens/${p.slug}`} className="font-medium text-primary hover:underline">
                        {p.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {p.owner_user_id ? 'Particulier' : p.organization_id ? 'Organisation' : '—'}
                      </p>
                    </td>
                    <td className="py-3 pr-4">{formatCurrencyEur(Number(p.price), p.currency)}</td>
                    <td className="py-3 pr-4">{p.city ?? '—'}</td>
                    <td className="py-3 text-xs text-muted-foreground">{formatDate(p.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardSection>
    </div>
  )
}
