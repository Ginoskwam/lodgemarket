'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { LodgemarketLogo } from '@/components/LodgemarketLogo'

/**
 * Footer principal de l'application
 * Design moderne et épuré avec liens légaux
 */
export function Footer() {
  const t = useTranslations('footer')
  const tHeader = useTranslations('header')
  const locale = useLocale()
  return (
    <footer className="bg-charbon-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <LodgemarketLogo className="w-full h-full" />
              </div>
              <span className="text-xl font-bold">Lodgemarket</span>
            </div>
            <p className="text-sm text-gray-300">
              {t('description')}
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold mb-4">{t('navigation')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/annonces`} className="text-gray-300 hover:text-white transition-colors">
                  {tHeader('announcements')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/annonces/nouvelle`} className="text-gray-300 hover:text-white transition-colors">
                  {tHeader('publish')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/auth/register`} className="text-gray-300 hover:text-white transition-colors">
                  {tHeader('register')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/aide`} className="text-gray-300 hover:text-white transition-colors">
                  {t('help')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-300 hover:text-white transition-colors">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-300 hover:text-white transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:info@newinc.be" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Lodgemarket. {t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}

