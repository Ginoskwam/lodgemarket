'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { EstateButton } from './EstateButton'

const navLink =
  'text-estate-on-surface/70 hover:text-estate-primary py-1 transition-all text-sm font-medium'

export function EstateHeader() {
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const prefix = `/${locale}`

  return (
    <nav className="glass-nav-estate fixed top-0 z-50 flex w-full max-w-full items-center justify-between border-b border-estate-outline-variant/10 px-6 py-4 shadow-sm md:px-8">
      <Link
        href={prefix}
        className="font-estate-serif text-2xl italic tracking-tight text-estate-primary"
      >
        Lodgemarket
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        <Link
          href={`${prefix}/annonces`}
          className="border-b-2 border-estate-on-tertiary-container py-1 text-sm font-semibold text-estate-primary"
        >
          Explorer les propriétés
        </Link>
        <Link href={`${prefix}/annonces/nouvelle`} className={navLink}>
          Vendre votre gîte
        </Link>
        <Link href={`${prefix}/#parcours`} className={navLink}>
          Notre méthodologie
        </Link>
        <Link href={`${prefix}/aide`} className={navLink}>
          Aide &amp; Guides
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden lg:block">
          <LanguageSwitcher />
        </div>
        <EstateButton variant="ghost" href={`${prefix}/auth/login`} className="hidden px-4 sm:inline-flex">
          Espace Propriétaire
        </EstateButton>
        <EstateButton variant="primary" href={`${prefix}/auth/register`} className="px-4 sm:px-5">
          S&apos;inscrire
        </EstateButton>
        <button
          type="button"
          className="rounded-lg p-2 text-estate-primary md:hidden"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      <div
        className={cn(
          'absolute left-0 right-0 top-full border-b border-estate-outline-variant/10 bg-estate-surface/95 px-6 py-4 backdrop-blur-md md:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <div className="flex flex-col gap-3">
          <Link href={`${prefix}/annonces`} className="font-semibold text-estate-primary">
            Explorer les propriétés
          </Link>
          <Link href={`${prefix}/annonces/nouvelle`}>Vendre votre gîte</Link>
          <Link href={`${prefix}/#parcours`}>Notre méthodologie</Link>
          <Link href={`${prefix}/aide`}>Aide &amp; Guides</Link>
          <Link href={`${prefix}/auth/login`}>Connexion</Link>
          <div className="pt-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
