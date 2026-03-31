'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function DashboardSignOutButton() {
  const router = useRouter()
  const locale = useLocale()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}`)
    router.refresh()
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => void signOut()}>
      Déconnexion
    </Button>
  )
}
