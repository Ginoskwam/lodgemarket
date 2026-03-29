import { NextResponse } from 'next/server'

/**
 * API Route pour récupérer la clé publique VAPID
 * GET /api/push/vapid-public-key
 * 
 * Cette clé est utilisée côté client pour créer la subscription push
 */
export async function GET() {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  if (!vapidPublicKey) {
    return NextResponse.json(
      { error: 'Clé VAPID publique non configurée' },
      { status: 500 }
    )
  }

  return NextResponse.json({ publicKey: vapidPublicKey })
}

