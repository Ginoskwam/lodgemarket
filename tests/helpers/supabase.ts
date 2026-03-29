/**
 * Helpers pour les tests Supabase
 */

import { vi } from 'vitest'

/**
 * Mock du client Supabase
 */
export function createMockSupabaseClient(mockData: any = {}) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    }),
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  }
}

/**
 * Mock d'une réponse Supabase réussie
 */
export function mockSupabaseSuccess(data: any) {
  return { data, error: null }
}

/**
 * Mock d'une réponse Supabase avec erreur
 */
export function mockSupabaseError(message: string, code?: string) {
  return {
    data: null,
    error: {
      message,
      code,
      details: message,
      hint: null,
    },
  }
}

