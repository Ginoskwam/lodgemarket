import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
import { locales, defaultLocale } from './i18n'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // Activer la détection de locale depuis les cookies (next-intl gère déjà NEXT_LOCALE)
  localeDetection: true
});

/**
 * Middleware Next.js pour gérer l'authentification et l'internationalisation
 * S'exécute sur chaque requête pour maintenir la session Supabase et gérer les locales
 * 
 * Note: next-intl gère automatiquement le cookie NEXT_LOCALE pour la persistance
 */
export async function middleware(request: NextRequest) {
  // D'abord gérer l'internationalisation (peut rediriger)
  // next-intl lit automatiquement le cookie NEXT_LOCALE s'il existe
  const intlResponse = intlMiddleware(request);
  
  // Si next-intl a redirigé, retourner directement la redirection
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }
  
  // Ensuite gérer l'authentification Supabase
  const supabaseResponse = await updateSession(request);
  
  // Combiner les réponses : utiliser intlResponse comme base
  const response = intlResponse;
  
  // Ajouter les cookies de Supabase
  supabaseResponse.cookies.getAll().forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value, cookie);
  });
  
  // Ajouter les headers de Supabase
  supabaseResponse.headers.forEach((value, key) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

