import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { isIOSSubscription } from '@/lib/apns'

/**
 * API Route pour envoyer une notification push
 * POST /api/push/send
 * 
 * Body: {
 *   userId: string (ID du destinataire)
 *   title: string
 *   body: string
 *   url?: string
 *   data?: object
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

    const { userId, title, body, url, data } = await request.json()

    if (!userId || !title || !body) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    // Récupérer la subscription push de l'utilisateur
    const { data: subscriptionData, error: subError } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_id', userId)
      .single()

    if (subError || !subscriptionData) {
      // Si pas de subscription, on retourne un succès mais sans envoyer
      return NextResponse.json({ 
        success: true, 
        message: 'Aucune subscription push trouvée pour cet utilisateur' 
      })
    }

    // Détecter si c'est une subscription iOS
    const isIOS = subscriptionData.endpoint && isIOSSubscription({ endpoint: subscriptionData.endpoint })

    // Configurer web-push selon la plateforme
    if (isIOS) {
      // Pour iOS, on peut utiliser APNs ou VAPID (iOS 16.4+ supporte VAPID)
      const apnsKeyId = process.env.APNS_KEY_ID
      const apnsTeamId = process.env.APNS_TEAM_ID
      const apnsKey = process.env.APNS_KEY

      if (apnsKeyId && apnsTeamId && apnsKey) {
        // Utiliser APNs si configuré
        const apnsEmail = `mailto:${apnsTeamId}@broques.fr`
        webpush.setVapidDetails(apnsEmail, apnsKeyId, apnsKey)
      } else {
        // Sinon, utiliser VAPID standard (iOS 16.4+)
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
        const vapidEmail = process.env.VAPID_EMAIL || 'mailto:contact@broques.fr'

        if (!vapidPublicKey || !vapidPrivateKey) {
          console.warn('Clés VAPID/APNs non configurées pour iOS')
          return NextResponse.json({ 
            success: false, 
            error: 'Clés VAPID/APNs non configurées' 
          })
        }

        webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)
      }
    } else {
      // Pour les autres plateformes, utiliser VAPID standard
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
      const vapidEmail = process.env.VAPID_EMAIL || 'mailto:contact@broques.fr'

      if (!vapidPublicKey || !vapidPrivateKey) {
        console.warn('Clés VAPID non configurées, les notifications push ne peuvent pas être envoyées')
        return NextResponse.json({ 
          success: false, 
          error: 'Clés VAPID non configurées' 
        })
      }

      webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)
    }

    // Récupérer le nombre de messages non lus pour le badge
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('destinataire_id', userId)
      .eq('lu', false)

    // Construire la subscription push
    const pushSubscription = {
      endpoint: subscriptionData.endpoint,
      keys: {
        p256dh: subscriptionData.p256dh,
        auth: subscriptionData.auth
      }
    }

    // Préparer le payload de la notification
    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: 'new-message',
      url: url || '/messages',
      data: {
        ...(data || {}),
        badgeCount: (unreadCount || 0) + 1, // +1 car on vient de recevoir un nouveau message
        unreadCount: (unreadCount || 0) + 1
      }
    })

    try {
      // Envoyer la notification push
      await webpush.sendNotification(pushSubscription, payload)
      
      return NextResponse.json({ success: true })
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la notification push:', error)
      
      // Si la subscription est invalide (410), la supprimer
      if (error.statusCode === 410) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', userId)
      }

      return NextResponse.json({ 
        success: false, 
        error: 'Erreur lors de l\'envoi de la notification' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

