import { createClient } from '@/lib/supabase/server'
import { sendEmailNotification, generateNewMessageEmailHTML } from '@/lib/email'
import { NextResponse } from 'next/server'

/**
 * API Route pour envoyer une notification email
 * Appelée depuis le client après l'envoi d'un message
 * 
 * Cette route peut être appelée via un webhook Supabase ou directement depuis le client
 */
export async function POST(request: Request) {
  try {
    const { conversationId, senderId, recipientId, annonceTitre, senderPseudo } =
      await request.json()

    if (!conversationId || !senderId || !recipientId || !annonceTitre || !senderPseudo) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const supabase = await createClient()

    // Vérifier que l'utilisateur est authentifié
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || user.id !== senderId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier si on doit envoyer l'email (limitation de fréquence)
    const { data: conversation } = await supabase
      .from('conversations')
      .select('dernier_email_notif')
      .eq('id', conversationId)
      .single()

    if (conversation) {
      const shouldSendEmail =
        !conversation.dernier_email_notif ||
        new Date(conversation.dernier_email_notif).getTime() < Date.now() - 10 * 60 * 1000 // 10 minutes

      if (shouldSendEmail) {
        // Récupérer l'email du destinataire
        // Note: Cela nécessite l'utilisation de Supabase Admin API ou de stocker l'email dans profiles
        // Pour l'instant, on simule l'envoi
        // TODO: Implémenter la récupération de l'email du destinataire
        
        const emailHTML = generateNewMessageEmailHTML(senderPseudo, annonceTitre, conversationId)
        
        // Pour l'instant, on ne peut pas récupérer l'email sans Admin API
        // Cette fonctionnalité nécessite une configuration supplémentaire
        // Vous pouvez soit :
        // 1. Ajouter une colonne email dans profiles (optionnel, non recommandé pour la sécurité)
        // 2. Utiliser Supabase Edge Functions avec Admin API
        // 3. Utiliser un service externe qui gère les emails
        
        console.log('📧 Email de notification à envoyer (nécessite configuration):', {
          conversationId,
          senderPseudo,
          annonceTitre,
        })

        // Mettre à jour dernier_email_notif
        await supabase
          .from('conversations')
          .update({ dernier_email_notif: new Date().toISOString() })
          .eq('id', conversationId)

        return NextResponse.json({ success: true, emailSent: false })
      }
    }

    return NextResponse.json({ success: true, emailSent: false })
  } catch (error) {
    console.error('Erreur envoi notification:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

