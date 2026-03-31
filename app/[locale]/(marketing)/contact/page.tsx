import { setRequestLocale } from 'next-intl/server'
import { EstateIcon } from '@/components/estate/EstateIcon'

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const p = `/${locale}`

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <h1 className="font-estate-serif text-4xl text-estate-on-surface md:text-5xl">Contact</h1>
      <p className="mt-4 text-estate-on-surface-variant">
        Pour toute question sur la plateforme, un dossier annonce ou un partenariat, écrivez-nous.
      </p>

      <div className="mt-12 space-y-8 rounded-2xl border border-estate-outline-variant/15 bg-estate-surface-container-low p-8">
        <a
          href="mailto:info@newinc.be"
          className="flex items-center gap-4 text-lg font-medium text-estate-on-surface transition-colors hover:text-estate-primary"
        >
          <EstateIcon name="mail" className="text-estate-primary" />
          info@newinc.be
        </a>
        <p className="text-sm text-estate-on-surface-variant">
          Nous répondons en général sous 2 jours ouvrés. Pour les demandes liées à une annonce précise, indiquez le
          titre du bien ou son lien dans le catalogue ({p}/catalogue).
        </p>
      </div>
    </div>
  )
}
