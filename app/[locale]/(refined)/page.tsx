import { setRequestLocale } from 'next-intl/server'
import { EstateHomeContent } from '@/components/estate/EstateHomeContent'

export default async function RefinedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <EstateHomeContent />
}
