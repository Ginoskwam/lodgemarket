import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { EstateButton } from '@/components/estate/EstateButton'
import { EstateIcon } from '@/components/estate/EstateIcon'

const steps = [
  {
    n: '1',
    title: 'Parcourir le catalogue',
    text: 'Filtrez par région, budget et capacité. Chaque fiche affiche des indicateurs de performance et le niveau de certification.',
  },
  {
    n: '2',
    title: 'Créer un compte acheteur',
    text: 'Inscrivez-vous pour enregistrer vos favoris, demander le dossier complet et planifier une visite avec le vendeur.',
  },
  {
    n: '3',
    title: 'Analyser & négocier',
    text: 'Vous disposez de données structurées pour votre due diligence. Notre équipe peut vous orienter vers des partenaires (notaire, expert-comptable).',
  },
  {
    n: '4',
    title: 'Conclure',
    text: 'La transaction se formalise chez le notaire. Lodgemarket met l’accent sur la transparence des informations en amont.',
  },
]

export default async function CommentCaMarchePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const p = `/${locale}`

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28">
      <h1 className="font-estate-serif text-4xl text-estate-on-surface md:text-5xl">Comment ça marche</h1>
      <p className="mt-4 text-lg text-estate-on-surface-variant">
        Lodgemarket est une marketplace spécialisée dans l’immobilier touristique en Belgique : acheteurs qualifiés,
        annonces vérifiées, données business sur les gîtes et maisons d’hôtes.
      </p>

      <section className="mt-16 space-y-12">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-estate-primary font-estate-serif text-xl text-estate-on-primary">
              {s.n}
            </div>
            <div>
              <h2 className="font-estate-serif text-2xl text-estate-on-surface">{s.title}</h2>
              <p className="mt-2 text-estate-on-surface-variant">{s.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-20 rounded-2xl border border-estate-outline-variant/15 bg-estate-surface-container-low p-8">
        <h2 className="flex items-center gap-2 font-estate-serif text-2xl text-estate-on-surface">
          <EstateIcon name="storefront" />
          Vous vendez ?
        </h2>
        <p className="mt-3 text-estate-on-surface-variant">
          Publiez votre bien, ajoutez photos et pièces, puis soumettez votre annonce pour modération. Les acheteurs
          accèdent au catalogue public une fois l’annonce validée.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <EstateButton href={`${p}/deposer-un-bien`}>Déposer un bien</EstateButton>
          <EstateButton variant="secondary" href={`${p}/catalogue`}>
            Voir le catalogue
          </EstateButton>
        </div>
      </section>

      <p className="mt-12 text-center text-sm text-estate-on-surface-variant">
        Une question ?{' '}
        <Link href={`${p}/contact`} className="font-semibold text-estate-primary underline underline-offset-4">
          Contactez-nous
        </Link>
        .
      </p>
    </div>
  )
}
