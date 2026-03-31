'use server'

/**
 * Server actions métier — à implémenter (auth, permissions, Supabase).
 * Import depuis les pages ou formulaires : `import { … } from '@/lib/actions'`
 */

export async function noopServerAction(): Promise<{ ok: true }> {
  return { ok: true }
}
