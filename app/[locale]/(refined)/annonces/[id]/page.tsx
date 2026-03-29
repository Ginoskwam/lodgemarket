import { createClient } from '@/lib/supabase/server'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { EstateAnnonceDetail } from '@/components/estate/EstateAnnonceDetail'
import type { Annonce, Profile } from '@/types/database'

export default async function RefinedAnnonceDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id } = await params
  const locale = await getLocale()
  const t = await getTranslations('announcements')
  const tCommon = await getTranslations('common')
  const supabase = await createClient()

  const { data: annonce, error } = await supabase
    .from('annonces')
    .select(
      `
      *,
      proprietaire:profiles!annonces_proprietaire_id_fkey(*)
    `
    )
    .eq('id', id)
    .single()

  if (error || !annonce) {
    return (
      <div className="mx-auto max-w-7xl px-8 py-24 font-estate">
        <div className="rounded-xl border border-estate-outline-variant/20 bg-estate-surface-container-low p-12 text-center">
          <h1 className="mb-4 font-estate-serif text-2xl text-estate-primary">{t('noResults')}</h1>
          <Link
            href={`/${locale}/annonces`}
            className="inline-flex rounded-lg bg-estate-primary px-6 py-3 font-semibold text-estate-on-primary"
          >
            {tCommon('back')} — {t('availableEquipment')}
          </Link>
        </div>
      </div>
    )
  }

  const proprietaire = annonce.proprietaire as Profile
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = !!(user && (user.id === proprietaire.id || user.id === annonce.proprietaire_id))

  const { count } = await supabase
    .from('annonces')
    .select('*', { count: 'exact', head: true })
    .eq('proprietaire_id', proprietaire.id)
    .eq('disponible', true)
    .neq('id', annonce.id)

  return (
    <EstateAnnonceDetail
      annonce={annonce as Annonce & { proprietaire: Profile }}
      isOwner={isOwner}
      count={count}
      locale={locale}
    />
  )
}
