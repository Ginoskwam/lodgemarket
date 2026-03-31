'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useLocale()

  useEffect(() => {
    console.error('[dashboard]', error)
  }, [error])

  return (
    <div className="mx-auto max-w-lg px-4 py-16 font-estate">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Impossible d’afficher le tableau de bord</CardTitle>
          <CardDescription>
            Vérifiez la connexion à Supabase (variables dans <code className="text-xs">.env.local</code>) et que
            les migrations sont appliquées.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {process.env.NODE_ENV === 'development' ? (
            <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {error.message}
            </pre>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => reset()}>
              Réessayer
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={`/${locale}`}>Accueil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
