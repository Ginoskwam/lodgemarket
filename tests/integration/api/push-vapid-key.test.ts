import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/push/vapid-public-key/route'

/**
 * Tests d'intégration pour l'API route /api/push/vapid-public-key
 */

describe('API /api/push/vapid-public-key', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait retourner la clé VAPID publique', async () => {
    // Mock des variables d'environnement
    const originalEnv = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = 'test-vapid-public-key'

    try {
      const request = new Request('http://localhost:3000/api/push/vapid-public-key')
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('publicKey')
      expect(data.publicKey).toBe('test-vapid-public-key')
    } finally {
      if (originalEnv) {
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = originalEnv
      } else {
        delete process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      }
    }
  })

  it('devrait retourner une erreur si la clé VAPID n\'est pas configurée', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    delete process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

    try {
      const request = new Request('http://localhost:3000/api/push/vapid-public-key')
      const response = await GET(request)
      
      expect(response.status).toBe(500)
    } finally {
      if (originalEnv) {
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = originalEnv
      }
    }
  })
})

