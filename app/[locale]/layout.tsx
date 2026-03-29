import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { NotificationsProvider } from '@/components/NotificationsProvider'
import { locales } from '@/i18n'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Await params dans Next.js 14+
  const { locale } = await params
  
  // Valider que la locale est supportée
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Définir la locale pour cette requête (important pour next-intl)
  setRequestLocale(locale)

  // Charger les messages directement depuis le fichier JSON
  const messages = (await import(`@/messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <NotificationsProvider />
    </NextIntlClientProvider>
  )
}

