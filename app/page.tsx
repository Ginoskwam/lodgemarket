import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n'

// Rediriger vers la locale par défaut
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
