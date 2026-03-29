/**
 * Service d'envoi d'emails pour les notifications
 * 
 * Cette fonction est une abstraction qui peut être implémentée avec différents services :
 * - Resend (https://resend.com) - recommandé
 * - SendGrid
 * - AWS SES
 * - etc.
 * 
 * Pour l'instant, c'est une fonction placeholder qui doit être complétée
 * avec les credentials réels du service choisi.
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Envoie un email de notification
 * 
 * @param options - Options de l'email (destinataire, sujet, contenu HTML)
 * @returns true si l'email a été envoyé avec succès, false sinon
 */
export async function sendEmailNotification(options: EmailOptions): Promise<boolean> {
  try {
    // TODO: Implémenter l'envoi d'email avec votre service préféré
    
    // Exemple avec Resend (décommentez et configurez si vous utilisez Resend) :
    /*
    const resend = require('resend')
    const resendClient = new resend.Resend(process.env.RESEND_API_KEY)
    
    const { data, error } = await resendClient.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@lodgemarket.app',
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
    
    if (error) {
      console.error('Erreur envoi email:', error)
      return false
    }
    
    return true
    */
    
    // Pour le développement, on log juste l'email qui serait envoyé
    console.log('📧 Email qui serait envoyé:', {
      to: options.to,
      subject: options.subject,
      html: options.html.substring(0, 100) + '...',
    })
    
    // En développement, on retourne true pour simuler l'envoi
    // En production, décommentez le code ci-dessus et configurez votre service
    return process.env.NODE_ENV === 'development' ? true : false
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return false
  }
}

/**
 * Génère le contenu HTML d'un email de notification pour un nouveau message
 */
export function generateNewMessageEmailHTML(
  senderPseudo: string,
  annonceTitre: string,
  conversationId: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const conversationUrl = `${baseUrl}/messages/${conversationId}`
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nouveau message sur Lodgemarket</h1>
          <p>Bonjour,</p>
          <p><strong>${senderPseudo}</strong> vous a envoyé un message concernant l'annonce : <strong>${annonceTitre}</strong>.</p>
          <p>Connectez-vous à Lodgemarket pour consulter et répondre à ce message.</p>
          <a href="${conversationUrl}" class="button">Voir le message</a>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Vous recevez cet email car vous avez reçu un nouveau message sur Lodgemarket.
          </p>
        </div>
      </body>
    </html>
  `
}

