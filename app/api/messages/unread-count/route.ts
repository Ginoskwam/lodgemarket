import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Indiquer que cette route est dynamique (utilise des cookies)
export const dynamic = 'force-dynamic'

/**
 * API Route pour récupérer le nombre de messages non lus d'un utilisateur
 * GET /api/messages/unread-count?userId=xxx
 */
export async function GET(request: Request) {
  try {
    let supabase
    try {
      supabase = await createClient()
    } catch (error) {
      console.error('Erreur lors de la création du client Supabase:', error)
      return NextResponse.json({ error: 'Erreur de configuration' }, { status: 500 })
    }
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      // Si l'utilisateur n'est pas connecté, retourner 0 au lieu d'une erreur
      return NextResponse.json({ count: 0 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Vérifier que l'utilisateur demande ses propres messages
    if (userId && userId !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Utiliser l'ID de l'utilisateur connecté
    const targetUserId = userId || user.id

    // Compter les messages non lus
    // Pour l'instant, on ne filtre pas les messages supprimés car les colonnes n'existent peut-être pas encore
    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('destinataire_id', targetUserId)
      .eq('lu', false)

    if (countError) {
      console.error('Erreur lors du comptage des messages non lus:', countError)
      return NextResponse.json({ count: 0 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

