/**
 * Helpers pour les tests d'authentification
 */

import { vi } from 'vitest'
import { testUsers } from '../fixtures/users'

/**
 * Crée un client Supabase mock pour les tests
 */
export function createMockSupabaseClient() {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id', email: testUsers.user1.email }, session: {} },
        error: null,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id', email: testUsers.user1.email }, session: {} },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  }
}

/**
 * Simule une session utilisateur authentifié
 */
export function mockAuthenticatedSession(user = testUsers.user1) {
  return {
    data: {
      session: {
        user: {
          id: 'test-user-id',
          email: user.email,
          user_metadata: { name: user.name },
        },
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      },
    },
    error: null,
  }
}

/**
 * Simule une session non authentifiée
 */
export function mockUnauthenticatedSession() {
  return {
    data: { session: null },
    error: null,
  }
}

