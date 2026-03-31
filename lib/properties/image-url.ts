import { getSupabaseUrlForPublicAssets } from '@/lib/supabase/env'

/**
 * URL publique pour un objet du bucket `property-images` (storage_path = chemin relatif dans le bucket).
 */
export function getPropertyImagePublicUrl(storagePath: string): string {
  const base = getSupabaseUrlForPublicAssets()
  const path = storagePath.replace(/^\/+/, '')
  if (!base) {
    return ''
  }
  return `${base}/storage/v1/object/public/property-images/${encodeURI(path)}`
}
