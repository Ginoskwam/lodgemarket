import { createBrowserClient } from '@supabase/ssr'

/**
 * Client Supabase pour le navigateur
 * Utilisé dans les composants React côté client
 * 
 * Note: createBrowserClient gère automatiquement les cookies
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

