import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { DashboardAccessDenied } from '@/components/dashboard/DashboardAccessDenied'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { canAccessDashboard, requireAuth } from '@/lib/auth/dashboard'
import { fetchSellerLeads, fetchSellerProperties } from '@/lib/dashboard/dashboard-data'
import { inquiryStatusLabel, publicationStatusLabel } from '@/lib/dashboard/labels'
import { formatCurrencyEur } from '@/lib/format'
import { createClient } from '@/lib/supabase/server'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(iso)
    )
  } catch {
    return iso
  }
}

export default async function DashboardVendeurPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const path = `/${locale}/dashboard/vendeur`
  const user = await requireAuth(locale, path)

  if (!canAccessDashboard(user.roles, ['seller'])) {
    return <DashboardAccessDenied locale={locale} neededRoles={['seller']} />
  }

  const supabase = await createClient()
  const [properties, leads] = await Promise.all([
    fetchSellerProperties(supabase, user.id),
    fetchSellerLeads(supabase, user.id),
  ])

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
          Espace vendeur
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Annonces publiées ou en cours, et demandes reçues sur vos biens.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Annonces</p>
          <p className="mt-1 font-estate text-2xl font-semibold">{properties.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">En ligne</p>
          <p className="mt-1 font-estate text-2xl font-semibold">{byStatus['published'] ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">En validation</p>
          <p className="mt-1 font-estate text-2xl font-semibold">{byStatus['pending_review'] ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Leads (dossiers)</p>
          <p className="mt-1 font-estate text-2xl font-semibold">{leads.length}</p>
        </div>
      </div>

      <DashboardSection title="Mes annonces" description="Statut de publication et accès rapide à la fiche publique.">
        {properties.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune annonce pour l’instant. Utilisez le flux « déposer un bien » lorsqu’il sera disponible.
          </p>
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

      <DashboardSection
        title="Derniers dossiers"
        description="Demandes de contact et dossiers liés à vos biens (aperçu)."
      >
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun lead pour le moment.</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {leads.map((row) => {
              const p = row.properties
              return (
                <li key={row.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      {p ? (
                        <span className="font-medium">{p.title}</span>
                      ) : (
                        <span className="font-medium">Bien</span>
                      )}
                      <span className="ml-2 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {inquiryStatusLabel[row.status] ?? row.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(row.created_at)}</span>
                  </div>
                  {row.message ? <p className="mt-2 text-sm text-muted-foreground">{row.message}</p> : null}
                </li>
              )
            })}
          </ul>
        )}
      </DashboardSection>
    </div>
  )
}
