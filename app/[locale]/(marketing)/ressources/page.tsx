import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { getPublishedArticles } from '@/lib/articles/queries'

export default async function RessourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const articles = await getPublishedArticles()

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <h1 className="font-estate-serif text-4xl text-estate-on-surface md:text-5xl">Ressources</h1>
      <p className="mt-4 text-estate-on-surface-variant">
        Articles et guides sur l’investissement locatif touristique, la fiscalité et le marché belge.
      </p>

      {articles.length === 0 ? (
        <p className="mt-12 rounded-xl border border-dashed border-estate-outline-variant/30 bg-estate-surface-container-low px-6 py-12 text-center text-estate-on-surface-variant">
          Aucun article publié pour le moment. Revenez bientôt ou contactez-nous pour proposer un sujet.
        </p>
      ) : (
        <ul className="mt-12 space-y-6">
          {articles.map((a) => (
            <li key={a.id}>
              <Link
                href={`/${locale}/ressources/${a.slug}`}
                className="group block rounded-xl border border-estate-outline-variant/15 bg-estate-surface-container-low p-6 transition-colors hover:border-estate-primary/40"
              >
                <h2 className="font-estate-serif text-xl text-estate-on-surface group-hover:text-estate-primary">
                  {a.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-estate-on-surface-variant">
                  {a.content.replace(/\s+/g, ' ').trim().slice(0, 200)}
                  {a.content.length > 200 ? '…' : ''}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
