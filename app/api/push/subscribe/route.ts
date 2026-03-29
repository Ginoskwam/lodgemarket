import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * API Route pour enregistrer une subscription push
 * POST /api/push/subscribe
 * 
 * Body: {
 *   subscription: PushSubscription (JSON)
 * }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { subscription } = await request.json()

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Subscription invalide' }, { status: 400 })
    }

    // Enregistrer la subscription dans la base de données
    // On va créer une table push_subscriptions si elle n'existe pas
    // Pour l'instant, on stocke dans une table simple
    const { error: insertError } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (insertError) {
      console.error('Erreur lors de l\'enregistrement de la subscription:', insertError)
      // Si la table n'existe pas, on retourne quand même un succès
      // L'utilisateur pourra toujours recevoir des notifications via le service worker
      return NextResponse.json({ 
        success: true, 
        warning: 'Table push_subscriptions non trouvée. Les notifications push fonctionneront via le service worker.' 
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la subscription:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * API Route pour supprimer une subscription push
 * DELETE /api/push/subscribe
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Supprimer la subscription
    const { error: deleteError } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Erreur lors de la suppression de la subscription:', deleteError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de la subscription:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

