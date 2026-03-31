import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { DashboardAccessDenied } from '@/components/dashboard/DashboardAccessDenied'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { canAccessDashboard, requireAuth } from '@/lib/auth/dashboard'
import { fetchAgencyOrganizations, fetchAgencyProperties } from '@/lib/dashboard/dashboard-data'
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

export default async function DashboardAgencePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const path = `/${locale}/dashboard/agence`
  const user = await requireAuth(locale, path)

  if (!canAccessDashboard(user.roles, ['agency'])) {
    return <DashboardAccessDenied locale={locale} neededRoles={['agency']} />
  }

  const supabase = await createClient()
  const orgs = await fetchAgencyOrganizations(supabase, user.id)
  const orgIds = orgs.map((o) => o.id)
  const properties = await fetchAgencyProperties(supabase, orgIds)

  const byStatus = properties.reduce(
    (acc, p) => {
      acc[p.publication_status] = (acc[p.publication_status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-estate text-2xl font-semibold tracking-tight text-foreground">
          Espace agence
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Structures dont vous faites partie et annonces rattachées à votre organisation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Structures</p>
          <p className="mt-1 font-estate text-2xl font-semibold">{orgs.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Annonces</p>
          <p className="mt-1 font-estate text-2xl font-semibold">{properties.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Publiées</p>
          <p className="mt-1 font-estate text-2xl font-semibold">{byStatus['published'] ?? 0}</p>
        </div>
      </div>

      <DashboardSection title="Organisations" description="Agences ou structures auxquelles vous êtes rattaché.">
        {orgs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune organisation pour l’instant. Création d’équipe et invitations arriveront dans une prochaine
            étape.
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {orgs.map((o) => (
              <li key={o.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{o.name}</p>
                  <p className="text-xs text-muted-foreground">/{o.slug}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>

      <DashboardSection title="Annonces du réseau" description="Biens gérés par votre organisation.">
        {properties.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune annonce liée à vos structures.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Titre</th>
                  <th className="pb-2 pr-4 font-medium">Statut</th>
                  <th className="pb-2 pr-4 font-medium">Prix</th>
                  <th className="pb-2 font-medium">Mise à jour</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-4">
                      <Link href={`/${locale}/biens/${p.slug}`} className="font-medium text-primary hover:underline">
                        {p.title}
                      </Link>
                      {p.city ? <p className="text-xs text-muted-foreground">{p.city}</p> : null}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {publicationStatusLabel[p.publication_status] ?? p.publication_status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{formatCurrencyEur(Number(p.price), p.currency)}</td>
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
