/**
 * Lecture normalisée des variables Supabase (trim, guillemets).
 * Évite l’erreur « Invalid supabaseUrl » si espaces ou quotes dans .env.
 */

function normalizeEnvValue(raw: string | undefined): string {
  if (raw == null) return ''
  let s = String(raw).trim()
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  return s
}

/** Supprime BOM, zero-width, et autres caractères invisibles qui cassent `new URL()`. */
function stripInvisible(s: string): string {
  return s
    .replace(/^\uFEFF/g, '')
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
    .trim()
}

/**
 * URL projet Supabase : nettoyage agressif + extraction si la ligne a été mal collée.
 * Supporte le cloud (*.supabase.co) et Supabase local (127.0.0.1 / localhost).
 */
function normalizeSupabaseProjectUrl(raw: string | undefined): string {
  let s = stripInvisible(normalizeEnvValue(raw))
  if (!s) return ''

  const cloud = s.match(/https?:\/\/[a-z0-9-]+\.supabase\.co/i)
  if (cloud) {
    return cloud[0].replace(/\/$/, '')
  }

  const local = s.match(/https?:\/\/(?:127\.0\.0\.1|localhost):\d+/i)
  if (local) {
    return local[0].replace(/\/$/, '')
  }

  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s.replace(/^\/+/, '')}`
  }
  return s.replace(/\/$/, '')
}

function isValidHttpUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/** Pour les pages qui doivent fonctionner sans Supabase (build / fallback). */
export function isSupabaseConfigured(): boolean {
  const url = normalizeSupabaseProjectUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const key = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return Boolean(url && key && isValidHttpUrl(url))
}

/**
 * URL + clé anon pour createClient (serveur, client, middleware).
 * Message explicite si .env manquant ou invalide.
 */
export function getSupabaseClientEnv(): { url: string; anonKey: string } {
  const url = normalizeSupabaseProjectUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!url || !anonKey) {
    throw new Error(
      'Supabase : définissez NEXT_PUBLIC_SUPABASE_URL (https://xxxx.supabase.co) et NEXT_PUBLIC_SUPABASE_ANON_KEY dans `.env.local` à la racine du projet. Enregistrez le fichier, puis redémarrez `npm run dev`. Si l’erreur persiste : `rm -rf .next` puis relancez.'
    )
  }

  if (!isValidHttpUrl(url)) {
    const preview = stripInvisible(normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)).slice(0, 64)
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL est invalide après nettoyage (aperçu brut : « ${preview}${preview.length >= 64 ? '…' : ''} »). Vérifiez qu’il n’y a pas de texte avant/après l’URL, puis une seule ligne : NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_REF.supabase.co`
    )
  }

  return { url, anonKey }
}

export function getSupabaseUrlForPublicAssets(): string {
  return normalizeSupabaseProjectUrl(process.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/$/, '')
}
