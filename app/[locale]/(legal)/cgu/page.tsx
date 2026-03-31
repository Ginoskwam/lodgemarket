import { setRequestLocale } from 'next-intl/server'
import { PhasePlaceholder } from '@/components/scaffold/PhasePlaceholder'

export default async function CguPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PhasePlaceholder title="Conditions générales d’utilisation" />
}
