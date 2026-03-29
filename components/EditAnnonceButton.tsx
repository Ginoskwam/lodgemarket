'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

/**
 * Bouton pour modifier une annonce (visible uniquement par le propriétaire)
 */
export function EditAnnonceButton({ annonceId, proprietaireId }: { annonceId: string; proprietaireId: string }) {
  const locale = useLocale()
  const t = useTranslations('common')
  const router = useRouter()
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkOwnership() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && user.id === proprietaireId) {
        setIsOwner(true)
      }
      
      setLoading(false)
    }

    checkOwnership()
  }, [proprietaireId])

  if (loading || !isOwner) {
    return null
  }

  return (
    <Link
      href={`/${locale}/annonces/${annonceId}/modifier`}
      className="btn-secondary w-full text-center"
    >
      {t('edit')} cette annonce
    </Link>
  )
}

