import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublishedArticleBySlug } from '@/lib/articles/queries'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticleBySlug(slug)
  if (!article) return { title: 'Article | Lodgemarket' }
  return {
    title: `${article.title} | Lodgemarket`,
    description: article.content.replace(/\s+/g, ' ').trim().slice(0, 160),
  }
}

export default async function RessourceArticlePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const article = await getPublishedArticleBySlug(slug)
  if (!article) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <nav className="mb-8 text-sm text-estate-on-surface-variant">
        <Link href={`/${locale}/ressources`} className="hover:text-estate-primary">
          Ressources
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-estate-on-surface">{article.title}</span>
      </nav>
      <h1 className="font-estate-serif text-4xl text-estate-on-surface md:text-5xl">{article.title}</h1>
      <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap text-estate-on-surface-variant">
        {article.content}
      </div>
    </article>
  )
}
