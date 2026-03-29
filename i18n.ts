import { getRequestConfig } from 'next-intl/server';

// Les locales supportées
export const locales = ['fr', 'en', 'nl', 'de'] as const;
export type Locale = (typeof locales)[number];

// Locale par défaut
export const defaultLocale: Locale = 'fr';

export default getRequestConfig(async ({ locale }) => {
  // Valider que la locale est supportée, sinon utiliser la locale par défaut
  const validLocale: Locale = (locale && locales.includes(locale as Locale)) ? (locale as Locale) : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});

