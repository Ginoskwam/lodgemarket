import { setRequestLocale } from 'next-intl/server'
import { PhasePlaceholder } from '@/components/scaffold/PhasePlaceholder'

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <PhasePlaceholder
      title="Onboarding"
      description="Choix du type de compte : acheteur, vendeur, agence."
    />
  )
}
