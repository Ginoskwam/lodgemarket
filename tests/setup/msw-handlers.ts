import { http, HttpResponse } from 'msw'

/**
 * Handlers MSW pour mocker les appels API externes
 * Utilisé dans les tests d'intégration
 */

export const handlers = [
  // Mock Supabase Auth endpoints
  http.post('https://*.supabase.co/auth/v1/token', async () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
        user: {
          id: 'test-user-id',
          email: 'test-user-1@broques.test',
        },
    })
  }),

  // Mock Supabase REST API
  http.get('https://*.supabase.co/rest/v1/*', async () => {
    return HttpResponse.json([])
  }),

  // Mock email service (si utilisé)
  http.post('https://api.resend.com/emails', async () => {
    return HttpResponse.json({ id: 'mock-email-id' })
  }),
]

