import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const p = `/${locale}`

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <h1 className="font-estate-serif text-4xl text-estate-on-surface md:text-5xl">À propos</h1>
      <div className="mt-10 space-y-6 text-estate-on-surface-variant">
        <p className="text-lg leading-relaxed text-estate-on-surface">
          Lodgemarket est né du constat que l’achat d’un gîte ou d’un actif hôtelier exige plus qu’une simple annonce :
          des chiffres fiables, une compréhension du cadre réglementaire wallon et des acheteurs sérieux.
        </p>
        <p>
          Nous combinons une expérience utilisateur premium avec des exigences de transparence : niveaux de certification
          (vérifié, certifié), métriques business lorsqu’elles sont disponibles, et modération des annonces avant
          publication.
        </p>
        <p>
          Notre mission est de rapprocher vendeurs et investisseurs sur la durée, en limitant les surprises et en
          valorisant le patrimoine touristique des Ardennes et au-delà.
        </p>
      </div>
      <p className="mt-12 text-sm">
        <Link href={`${p}/contact`} className="font-semibold text-estate-primary underline underline-offset-4">
          Écrire à l’équipe
        </Link>
      </p>
    </div>
  )
}
