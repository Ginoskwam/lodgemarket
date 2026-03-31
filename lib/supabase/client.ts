import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseClientEnv, isSupabaseConfigured } from '@/lib/supabase/env'

/**
 * Client Supabase pour le navigateur
 * Utilisé dans les composants React côté client
 *
 * Note: createBrowserClient gère automatiquement les cookies
 */
export function tryCreateBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  try {
    const { url, anonKey } = getSupabaseClientEnv()
    return createBrowserClient(url, anonKey)
  } catch {
    return null
  }
}

export function createClient(): SupabaseClient {
  const client = tryCreateBrowserClient()
  if (!client) {
    throw new Error(
      'Supabase : définissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans `.env.local`, puis redémarrez le serveur de dev.'
    )
  }
  return client
}

