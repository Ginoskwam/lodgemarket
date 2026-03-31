import Link from 'next/link'
import { DashboardSignOutButton } from '@/components/dashboard/DashboardSignOutButton'
import type { AppRole, DashboardUser } from '@/lib/auth/dashboard'

function navForUser(user: DashboardUser): { href: string; label: string }[] {
  if (user.roles.includes('admin')) {
    return [
      { href: 'acheteur', label: 'Acheteur' },
      { href: 'vendeur', label: 'Vendeur' },
      { href: 'agence', label: 'Agence' },
      { href: 'admin', label: 'Admin' },
    ]
  }

  const items: { href: string; label: string }[] = []
  const has = (r: AppRole) => user.roles.includes(r)

  if (has('buyer')) items.push({ href: 'acheteur', label: 'Acheteur' })
  if (has('seller')) items.push({ href: 'vendeur', label: 'Vendeur' })
  if (has('agency')) items.push({ href: 'agence', label: 'Agence' })

  return items
}

export function DashboardChrome({
  locale,
  user,
  children,
}: {
  locale: string
  user: DashboardUser
  children: React.ReactNode
}) {
  const items = navForUser(user)

  return (
    <div className="flex min-h-screen bg-muted/30 font-estate">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="border-b border-border p-4">
          <div className="text-sm font-semibold text-foreground">Tableau de bord</div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{user.displayName}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-3 text-xs leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">Aucun rôle activé</p>
              <p className="mt-1">Ajoutez un rôle (acheteur, vendeur…) via l’onboarding pour afficher les accès ici.</p>
              <Link
                href={`/${locale}/onboarding`}
                className="mt-2 inline-block font-medium text-primary underline-offset-4 hover:underline"
              >
                Aller à l’onboarding
              </Link>
            </div>
          ) : (
            items.map(({ href, label }) => (
              <Link
                key={href}
                href={`/${locale}/dashboard/${href}`}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {label}
              </Link>
            ))
          )}
        </nav>
        <div className="border-t border-border p-3">
          <DashboardSignOutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.displayName}</p>
            <nav className="mt-2 flex flex-wrap gap-2">
              {items.length === 0 ? (
                <Link
                  href={`/${locale}/onboarding`}
                  className="rounded-md border border-dashed border-border bg-muted/40 px-2 py-1 text-xs text-foreground"
                >
                  Onboarding (rôles)
                </Link>
              ) : (
                items.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={`/${locale}/dashboard/${href}`}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
                  >
                    {label}
                  </Link>
                ))
              )}
            </nav>
          </div>
          <DashboardSignOutButton />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
