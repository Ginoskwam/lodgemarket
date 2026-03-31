import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseClientEnv } from '@/lib/supabase/env'

/**
 * Client Supabase pour le serveur
 * Utilisé dans les Server Components et Server Actions
 */
export async function createClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = getSupabaseClientEnv()

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Gestion des erreurs si les cookies ne peuvent pas être définis
          }
        },
      },
    }
  )
}

