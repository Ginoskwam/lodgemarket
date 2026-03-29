import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { AnnonceDetailContent } from '@/components/AnnonceDetailContent'
import type { Annonce, Profile } from '@/types/database'

/**
 * Page de détail d'une annonce
 * Design premium et clair
 */
export default async function AnnonceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Charger l'annonce d'abord
  const { data: annonce, error } = await supabase
    .from('annonces')
    .select(`
      *,
      proprietaire:profiles!annonces_proprietaire_id_fkey(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !annonce) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-12 text-center">
          <h1 className="heading-2 mb-4">Annonce introuvable</h1>
          <Link href="/annonces" className="btn-primary">
            Retour aux annonces
          </Link>
        </div>
      </div>
    )
  }

  const proprietaire = annonce.proprietaire as Profile

  // Récupérer l'utilisateur pour déterminer si c'est le propriétaire
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = !!(user && (user.id === proprietaire.id || user.id === annonce.proprietaire_id))

  const { count } = await supabase
    .from('annonces')
    .select('*', { count: 'exact', head: true })
    .eq('proprietaire_id', proprietaire.id)
    .eq('disponible', true)
    .neq('id', annonce.id)

  return (
    <AnnonceDetailContent 
      annonce={annonce as Annonce & { proprietaire: Profile }}
      isOwner={isOwner}
      count={count}
    />
  )
}
