import { createClient } from '@supabase/supabase-js'
import { getSupabaseClientEnv } from '@/lib/supabase/env'

/**
 * Client service role — **uniquement** routes serveur (Route Handlers, scripts).
 * Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` au navigateur.
 */
export function createAdminClient() {
  const { url } = getSupabaseClientEnv()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!key) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
