import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function PhasePlaceholder({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-estate text-xl">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">PHASE 2 — emplacement réservé (scaffold).</p>
        </CardContent>
      </Card>
    </div>
  )
}
