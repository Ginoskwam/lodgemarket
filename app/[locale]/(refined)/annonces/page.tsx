import { setRequestLocale } from 'next-intl/server'
import { EstateCatalogView } from '@/components/estate/EstateCatalogView'

export default async function RefinedCatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <EstateCatalogView locale={locale} />
}
