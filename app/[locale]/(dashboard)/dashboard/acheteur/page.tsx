import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { DashboardAccessDenied } from '@/components/dashboard/DashboardAccessDenied'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { canAccessDashboard, requireAuth } from '@/lib/auth/dashboard'
import {
  fetchBuyerFavorites,
  fetchBuyerInquiries,
  fetchBuyerVisits,
} from '@/lib/dashboard/dashboard-data'
import { inquiryStatusLabel, visitStatusLabel } from '@/lib/dashboard/labels'
import { formatCurrencyEur } from '@/lib/format'
import { createClient } from '@/lib/supabase/server'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default async function DashboardAcheteurPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const path = `/${locale}/dashboard/acheteur`
  const user = await requireAuth(locale, path)

  if (!canAccessDashboard(user.roles, ['buyer'])) {
    return <DashboardAccessDenied locale={locale} neededRoles={['buyer']} />
  }

  const supabase = await createClient()
  const [favorites, inquiries, visits] = await Promise.all([
    fetchBuyerFavorites(supabase, user.id),
    fetchBuyerInquiries(supabase, user.id),
    fetchBuyerVisits(supabase, user.id),
  ])

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-estate text-2xl font-semibold tracking-tight text-foreground">
          Espace acheteur
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Favoris, demandes de dossier et visites pour {user.displayName}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Favoris</p>
          <p className="mt-1 font-estate text-2xl font-semibold">{favorites.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Demandes dossier
          </p>
          <p className="mt-1 font-estate text-2xl font-semibold">{inquiries.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Visites</p>
          <p className="mt-1 font-estate text-2xl font-semibold">{visits.length}</p>
        </div>
      </div>

      <DashboardSection title="Favoris" description="Biens enregistrés pour un suivi rapide.">
        {favorites.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun favori pour le moment. Explorez le{' '}
            <Link href={`/${locale}/catalogue`} className="font-medium text-primary underline-offset-4 hover:underline">
              catalogue
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {favorites.map((row) => {
              const p = row.properties
              if (!p) return null
              return (
                <li key={`${p.id}-${row.created_at}`} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href={`/${locale}/biens/${p.slug}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {[p.city, formatCurrencyEur(Number(p.price), p.currency)].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">Ajouté le {formatDate(row.created_at)}</span>
                </li>
              )
            })}
          </ul>
        )}
      </DashboardSection>

      <DashboardSection title="Demandes de dossier" description="Suivi de vos demandes auprès des vendeurs.">
        {inquiries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande pour l’instant.</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {inquiries.map((row) => {
              const p = row.properties
              return (
                <li key={row.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      {p ? (
                        <Link href={`/${locale}/biens/${p.slug}`} className="font-medium hover:underline">
                          {p.title}
                        </Link>
                      ) : (
                        <span className="font-medium">Bien retiré</span>
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

      <DashboardSection title="Demandes de visite" description="Créneaux et messages échangés avec les vendeurs.">
        {visits.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande de visite.</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {visits.map((row) => {
              const p = row.properties
              return (
                <li key={row.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      {p ? (
                        <Link href={`/${locale}/biens/${p.slug}`} className="font-medium hover:underline">
                          {p.title}
                        </Link>
                      ) : (
                        <span className="font-medium">Bien retiré</span>
                      )}
                      <span className="ml-2 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {visitStatusLabel[row.status] ?? row.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(row.created_at)}</span>
                  </div>
                  {row.preferred_slots ? (
                    <p className="mt-2 text-sm text-muted-foreground">Créneaux : {row.preferred_slots}</p>
                  ) : null}
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
