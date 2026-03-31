import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppRole } from '@/lib/auth/dashboard'

const roleLabels: Record<AppRole, string> = {
  buyer: 'acheteur',
  seller: 'vendeur',
  agency: 'agence',
  admin: 'administrateur',
}

export function DashboardAccessDenied({
  locale,
  neededRoles,
}: {
  locale: string
  neededRoles: AppRole[]
}) {
  const label = neededRoles.map((r) => roleLabels[r]).join(' ou ')

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-estate text-xl">Accès réservé</CardTitle>
          <CardDescription>
            Cet espace est destiné aux comptes {label}. Vous pouvez compléter votre profil ou choisir un
            autre tableau de bord.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${locale}/onboarding`}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Onboarding
          </Link>
          <Link
            href={`/${locale}`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            Retour à l’accueil
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
