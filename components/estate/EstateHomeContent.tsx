import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { getPublishedArticles } from '@/lib/articles/queries'
import { getFeaturedProperties } from '@/lib/properties/queries'
import { PropertyCard } from '@/components/property/PropertyCard'
import { EstateCertifiedBadge } from './EstateBadge'
import { EstateButton } from './EstateButton'
import { EstateHeroSearch } from './EstateHeroSearch'
import { EstateIcon } from './EstateIcon'

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAwH-Sh3LJSxP_VuioNlt4HtLsK0Ti4PWXvedNbdcmDsUioFLu9RriuOKpMIpYvcJSvajaMgjVV1t6mmHShk2_gL7A0yA9ZWIw7ExVVUK3OeQGBzDFUgLwI1ZHOOuVxylGVpDC8q_AVeFT2PavXGmaqlp9CqZaBNlmp9F1SMYa7uvVSYE5ZfKCbsw-sOKoxCSAiZrwYmsPolPs2fY92uzARRHwh1MTlSFqulD2SWY1VVYLIlGaBcWioVJbuj1vbGrArdeKZyJR9-HM'

const featured = [
  {
    title: 'Le Relais de la Lesse',
    price: '795 000 €',
    place: 'Houffalize, Luxembourg belge',
    guests: '14 Voyageurs',
    yield: '8.5%',
    revenue: '65k€+',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6O3zNTp8bHkGhqyLsQtsjj0wyCeH6RWaivxI-OEL9oaYa-tpGYqWR97RFCWyVGFNHaT0gUITOoc7krm3suGeAglFdU6XKURhRKBZeYTmb54wPL2fY7Rn9yeamV23yC-Y3gWsC7tB_9fzHb1bO7QiE3rvo0UfVRJUxoO6HBHRNvYCElLFJMeOiSJP7a7_-pXKcEg6s01k_EfHKv7RvDAh3HMketA0v6j4EZcxNlTuicClbwiGSZy3n6dPCJsR0kfI5nmrCqo0lXps',
  },
  {
    title: "L'Écrin des Fagnes",
    price: '1 450 000 €',
    place: 'Spa, Province de Liège',
    guests: '10 Voyageurs',
    yield: '10.2%',
    revenue: '125k€+',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC05PS-MwFEsLZp8J8ux4YiOwHnEHHp8e0or6BjfL1HUbzplfpz0zgn5Qu8Iyo-pYwfTAQbNBhIBP5S0qOwxXZAZCGBRZw0MqPVsc63JFEeuNEIeDXEK0IUHeBb9KB06n5x4LQKucX6dg-AdSNVeWAwc_9Skp1F4k2lxqLPqZpIo2pZ4DXkgrvlcVm1-4xtLYPjinqfDVeYLBnG5qcaTR1i4F54X6GwKVmu4lCmSC780_Sv01ktOxYcYWWNwIaLdhumaRE4ReXzG28',
  },
  {
    title: 'Manoir de Durbuy',
    price: '920 000 €',
    place: 'Durbuy, Ardennes belges',
    guests: '18 Voyageurs',
    yield: '9.1%',
    revenue: '88k€+',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFgWBFIBfl5VR5PtNCaJH8wCl0_iiu6O-27oE7gEuRhNoYPmslb81MG_6gACV5HBYtWKvvu3-Tab0NQV4EjU_Mya5CSm5LTl6mFLROzJxW20kL1zq3Ixn49iYHyfFM0kTcqVEo3-wvFNIUen1ZnCamOGhKqTAglFd29or4gGcga2OcqijyDi9ttNqRdvXJ1vjEJxuqTKIVnE5ws5hmblR8n6INM9oa6sknM6f4UBGXoUWpmpuyt-kh3HDvnqWBVrqO6dadBgRL7o0',
  },
]

const resources = [
  {
    title: 'La Fiscalité des Gîtes en Belgique',
    excerpt: 'Comprendre la déclaration des revenus locatifs en Wallonie...',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsJvLxWg0WWCTmvPso2BfY2IlCH5tWdvEc9UJFaZGhVriM9f7cGBgUEW_mLjhcqp42PRasGWLQ-whP_iHB2aVVKLSg9DiKyo_dTRm60ftax_g7I6H8sXUjmdTqZVkstAK-U7myBpjMvtEQBpEmaWLjD3KFW6P9FtJ4Uw0xhmGMQgikn2Mdu9WfIGXdBj5gVoJOHmJ6bVLQyoZChE1ghnAw6nJ2Jq91aSbfKDxKLBk_-FIGi09XTFZaRXROssLIYuH4mOhXlDSM_SY',
  },
  {
    title: "Design d'Intérieur Ardennais",
    excerpt: 'Allier pierre de pays et modernité pour séduire les voyageurs...',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4WOOHlJgSLPu_jLQTh2kq-rUgbIuUhJ1WOBHttv4Z8qGAGI3DOnZ5Bxfh_8GWg6SLBVIPEUVW2leSzgVK8jb-00L-t1s2gnZRNY2MHnbIMfKf8_0kZmhuXYB0kyu7WY9JyY4UR-O5TDIx_8izi01qwT8-Zvr9isVX3hXwOdtQ0qzmHM9vCNXisdR48lXDhVu9hWtNKZCg4JoLsCjEVpbcud-AZ55CPhxLfvPLkJ2w-YMNpZlFnWxTNDpk681OowCGdDdlhRA0oRg',
  },
  {
    title: 'Écotourisme en Ardennes',
    excerpt: 'Pourquoi les séjours nature explosent dans le sud de la Belgique...',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCsaxnAY43mndf4isWs9f2K14_0RJa1pE0e0v9kVQq4J2EdyP8rg72aAd2DCwGhtu7SqbUao0Sco7Drh6C6hjyIuCTZt1JaLg3vHw-Ak3oiNp6FxRtqmh8kN2O7WgnGNXb-7ArdQFEABeZZKSM5VjvqC1mdwE8QvfEIA0FxAqXbgA51h3MRiMcmOcr4y-YuO0EwHaaYzOJpE5Gv7oamUgyfdq1L0aniVr66qj_Gck1RNFOp9I3HZYa05JbXjQp0fgkix79tr-418M',
  },
]

const sellerCtaImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDXuhgEkPrZT_T76gIDilnAKb9NNBYDL-E71d7tF6PxDX3EYU1XEw45WtrdKbGgqCJ2aQVauLwnkZb7EFA0J02IRyWopUoNXuZK7QT-iyXvEzv_KsrulZL2YJJOfnaJWxzyZz-RyQaKQ4-tmg8iVomiQXYTu_stgLJBJiWXge7J6sM35u2IAOso9gkcBEGkWmEFD8miPnqdUZ4F2WcheXB3B4xiMkZEIZ3w4Kiu9U4CbfUjYbZbD1Hv04bTNQAqQePtmsj7pcT4LWE'

export async function EstateHomeContent() {
  const locale = await getLocale()
  const p = `/${locale}`
  const featuredDb = await getFeaturedProperties(3)
  const publishedArticles = await getPublishedArticles()

  return (
    <>
      <header className="relative flex min-h-screen items-center justify-center px-6 pb-16 pt-28">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMG}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-estate-primary/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-estate-surface via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-5xl text-center">
          <h1 className="mb-6 font-estate-serif text-5xl font-normal leading-tight text-white drop-shadow-lg md:text-7xl">
            Investissez en{' '}
            <span className="italic text-estate-secondary-fixed">Ardennes belges</span> : gîtes certifiés
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl font-light text-white/90 md:text-2xl">
            Acquérez un patrimoine d&apos;exception au cœur des forêts ardennaises. Fonds de commerce vérifiés,
            rendements audités et charme authentique.
          </p>
          <EstateHeroSearch />
        </div>
      </header>

      <section className="border-y border-estate-outline-variant/10 bg-estate-surface-container-low py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6">
          <span className="font-medium text-estate-on-surface-variant">Filtres rapides :</span>
          <div className="flex flex-wrap gap-3">
            {['Bords de Semois', 'Hautes Fagnes', 'Chalets en Forêt', 'Manoirs de Pierre'].map((label) => (
              <Link
                key={label}
                href={`${p}/catalogue?city=${encodeURIComponent(label)}`}
                className="rounded-full border border-estate-outline-variant/20 bg-estate-surface px-4 py-2 text-sm transition-colors hover:border-estate-primary"
              >
                {label}
              </Link>
            ))}
            <span className="flex items-center gap-2 rounded-full bg-estate-secondary-container px-4 py-2 text-sm font-bold text-estate-on-secondary-container">
              <EstateIcon name="verified" className="text-sm" filled />
              Uniquement certifiés
            </span>
          </div>
          <Link href={`${p}/catalogue`} className="text-sm font-bold text-estate-primary underline underline-offset-4">
            Filtres avancés
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {[
            {
              icon: 'verified_user' as const,
              title: 'Propriétés Vérifiées',
              text: 'Expertise structurelle et juridique conforme aux normes wallonnes pour chaque gîte listé.',
            },
            {
              icon: 'analytics' as const,
              title: 'Données Commerciales',
              text: "Accédez à 3 ans de taux d'occupation audités sur le marché touristique ardennais.",
            },
            {
              icon: 'workspace_premium' as const,
              title: 'Annonces Certifiées',
              text: 'Accès exclusif aux propriétés classées par le Commissariat général au Tourisme (CGT).',
            },
            {
              icon: 'person_check' as const,
              title: 'Acheteurs Qualifiés',
              text: 'Nous validons le profil financier pour sécuriser les transactions immobilières en Belgique.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group flex flex-col gap-4 rounded-xl bg-estate-surface-container p-8 transition-all duration-500 hover:bg-estate-primary hover:text-estate-on-primary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-estate-secondary-container group-hover:bg-estate-on-primary-container">
                <EstateIcon
                  name={item.icon}
                  className="text-estate-primary group-hover:text-estate-on-primary"
                />
              </div>
              <h3 className="font-estate-serif text-xl">{item.title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-estate-surface-container-low py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mb-4 font-estate-serif text-4xl text-estate-on-surface">Opportunités en Ardennes</h2>
              <p className="max-w-lg text-estate-on-surface-variant">
                Découvrez notre sélection d&apos;actifs hôteliers et gîtes ruraux dans les plus beaux coins de Wallonie.
              </p>
            </div>
            <EstateButton variant="secondary" href={`${p}/catalogue`} className="px-6 py-3 font-bold">
              Voir tout le catalogue
            </EstateButton>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {featuredDb.length > 0
              ? featuredDb.map((item) => (
                  <PropertyCard key={item.id} property={item} locale={locale} />
                ))
              : featured.map((item) => (
                  <div
                    key={item.title}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={item.img}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                      <div className="absolute left-4 top-4">
                        <EstateCertifiedBadge label="GÎTE CERTIFIÉ CGT" />
                      </div>
                    </div>
                    <div className="flex flex-grow flex-col p-6">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-estate-serif text-xl font-bold text-estate-on-surface">{item.title}</h3>
                        <span className="font-bold text-estate-primary">{item.price}</span>
                      </div>
                      <p className="mb-4 flex items-center gap-1 text-sm text-estate-on-surface-variant">
                        <EstateIcon name="location_on" className="text-sm" />
                        {item.place}
                      </p>
                      <div className="mb-4 grid grid-cols-2 gap-4 border-y border-estate-outline-variant/10 py-4">
                        <div className="flex items-center gap-2">
                          <EstateIcon name="group" className="text-estate-outline" />
                          <span className="text-xs font-medium text-estate-on-surface-variant">{item.guests}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <EstateIcon name="trending_up" className="text-estate-outline" />
                          <span className="text-xs font-medium text-estate-on-surface-variant">
                            Rendement {item.yield}
                          </span>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center gap-2 text-sm font-bold text-estate-on-tertiary-container">
                        <EstateIcon name="bar_chart" className="text-sm" />
                        Revenu annuel : {item.revenue}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section id="expertise" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <div className="space-y-8">
            <h2 className="font-estate-serif text-4xl leading-tight text-estate-on-surface">
              Expertise immobilière dédiée au gîte ardennais
            </h2>
            <p className="text-lg font-light text-estate-on-surface-variant">
              Le marché belge des Ardennes est spécifique. Nous vous offrons une transparence totale sur les
              régulations de la Région Wallonne et un historique opérationnel précis pour chaque bien.
            </p>
            <div className="space-y-6">
              {[
                {
                  title: 'Certification Wallonne',
                  text: 'Vérification de la conformité aux règlements du CGT et sécurité incendie.',
                },
                {
                  title: 'Rendements locatifs belges',
                  text: 'Accédez aux bilans comptables certifiés pour des projections ROI basées sur la fiscalité belge.',
                },
                {
                  title: 'Accompagnement notarial',
                  text: 'Experts spécialisés dans les cessions de fonds de commerce en Wallonie.',
                },
              ].map((row) => (
                <div key={row.title} className="flex gap-4">
                  <EstateIcon name="check_circle" className="text-estate-on-tertiary-container" />
                  <div>
                    <h4 className="font-bold text-estate-on-surface">{row.title}</h4>
                    <p className="text-sm text-estate-on-surface-variant">{row.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -rotate-2 rounded-xl bg-estate-secondary-container z-0" />
            <div className="relative z-10 rounded-xl border border-estate-outline-variant/10 bg-estate-surface p-8 shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-estate-outline-variant/30">
                    <th className="pb-4 font-estate-serif text-lg">Fonctionnalité</th>
                    <th className="pb-4 text-center font-estate-serif text-sm opacity-50">Générique</th>
                    <th className="pb-4 text-center font-estate-serif text-sm text-estate-primary">Lodgemarket</th>
                  </tr>
                </thead>
                <tbody>
                  {['Audit de rendement', 'Licence CGT / Gîte', 'Urbanisme vérifié', 'Historique réservations'].map(
                    (row) => (
                      <tr key={row} className="border-b border-estate-outline-variant/10">
                        <td className="py-4 font-medium">{row}</td>
                        <td className="py-4 text-center text-estate-error">
                          <EstateIcon name="close" />
                        </td>
                        <td className="py-4 text-center text-estate-primary">
                          <EstateIcon name="check" />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="parcours" className="bg-estate-primary py-24 text-estate-on-primary">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-20 text-center font-estate-serif text-4xl">Votre parcours d&apos;acquisition</h2>
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="absolute left-1/4 right-12 top-12 hidden h-px border-t border-dashed border-estate-on-primary/20 md:block" />
            {[
              { n: '1', t: 'Sélection', d: 'Explorez les opportunités certifiées et accédez aux données clés.' },
              { n: '2', t: 'Audit', d: "Analyse des comptes, du bâti et des permis d'exploitation." },
              { n: '3', t: 'Offre', d: 'Négociation assistée par des experts du tourisme belge.' },
              { n: '4', t: 'Succès', d: 'Signature chez le notaire et accompagnement opérationnel.' },
            ].map((step) => (
              <div key={step.n} className="relative space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-estate-on-primary/20 bg-estate-surface/10 font-estate-serif text-2xl">
                  {step.n}
                </div>
                <h4 className="text-xl font-bold">{step.t}</h4>
                <p className="text-sm opacity-70">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-estate-surface py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 text-center md:grid-cols-4">
          {[
            ['450+', 'Gîtes ardennais'],
            ['100%', 'Données certifiées'],
            ['28M€', 'Volume transactionnel'],
            ['8.9%', 'ROI moyen annuel'],
          ].map(([a, b]) => (
            <div key={b}>
              <div className="mb-2 font-estate-serif text-5xl text-estate-primary">{a}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-estate-on-surface-variant">{b}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-estate-surface-container-low py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center font-estate-serif text-4xl italic text-estate-on-surface">
            Témoignages
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {[
              {
                q: '« Investir via Lodgemarket a été la meilleure décision pour notre retraite. La transparence sur les taux d’occupation réels nous a donné confiance. »',
                who: 'Jean-Paul & Anne M.',
                role: 'Propriétaires',
              },
              {
                q: '« La qualification des acheteurs est exceptionnelle. Vente conclue en seulement 3 visites sérieuses. »',
                who: 'Laurent V.',
                role: 'Ancien propriétaire',
              },
            ].map((t) => (
              <div key={t.who} className="rounded-xl bg-estate-surface p-10 shadow-sm">
                <p className="mb-6 text-lg italic leading-relaxed text-estate-on-surface-variant">{t.q}</p>
                <div className="flex items-center gap-4 not-italic">
                  <div className="h-12 w-12 rounded-full bg-estate-surface-container-high" />
                  <div>
                    <h5 className="font-bold text-estate-on-surface">{t.who}</h5>
                    <p className="text-xs text-estate-outline">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 font-estate-serif text-3xl text-estate-on-surface">Le mag de l&apos;investissement</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {publishedArticles.length > 0
            ? publishedArticles.slice(0, 3).map((a) => (
                <Link
                  key={a.id}
                  href={`${p}/ressources/${a.slug}`}
                  className="group flex flex-col rounded-xl border border-estate-outline-variant/15 bg-estate-surface-container-low p-6 transition-colors hover:border-estate-primary/40"
                >
                  <h4 className="text-xl font-bold transition-colors group-hover:text-estate-primary">{a.title}</h4>
                  <p className="mt-2 line-clamp-4 text-sm text-estate-on-surface-variant">
                    {a.content.replace(/\s+/g, ' ').trim().slice(0, 180)}
                    {a.content.length > 180 ? '…' : ''}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-estate-primary">Lire l&apos;article →</span>
                </Link>
              ))
            : resources.map((r) => (
                <Link key={r.title} href={`${p}/ressources`} className="group">
                  <div className="mb-4 h-48 overflow-hidden rounded-lg">
                    <Image
                      src={r.img}
                      alt=""
                      width={400}
                      height={192}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="text-xl font-bold transition-colors group-hover:text-estate-primary">{r.title}</h4>
                  <p className="mt-2 text-sm text-estate-on-surface-variant">{r.excerpt}</p>
                </Link>
              ))}
        </div>
      </section>

      <section className="relative mx-6 mb-24 overflow-hidden rounded-2xl py-32 text-center text-white">
        <Image src={sellerCtaImg} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 z-10 bg-estate-primary/60 backdrop-blur-[2px]" />
        <div className="relative z-20 mx-auto max-w-3xl px-6">
          <h2 className="mb-8 font-estate-serif text-4xl leading-tight md:text-5xl">
            Vendez votre gîte à des{' '}
            <span className="italic text-estate-secondary-fixed">investisseurs qualifiés</span>
          </h2>
          <p className="mb-12 text-xl font-light opacity-90">
            Maximisez votre valeur de sortie avec une plateforme dédiée aux actifs de prestige.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <EstateButton variant="onDark" href={`${p}/deposer-un-bien`}>
              Mettre en vente
            </EstateButton>
            <Link
              href={`${p}/contact`}
              className="rounded-lg border border-white/30 bg-white/10 px-10 py-4 font-bold backdrop-blur-md transition-all hover:bg-white/20"
            >
              Audit de valorisation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
