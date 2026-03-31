import { setRequestLocale } from 'next-intl/server'
import { EstateButton } from '@/components/estate/EstateButton'
import { EstateIcon } from '@/components/estate/EstateIcon'

const bullets = [
  'Création de compte vendeur ou professionnel',
  'Assistant multi-étapes : description, photos, métriques, documents',
  'Soumission pour relecture par notre équipe avant mise en ligne',
]

export default async function DeposerUnBienPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const p = `/${locale}`

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <h1 className="font-estate-serif text-4xl text-estate-on-surface md:text-5xl">Déposer un bien</h1>
      <p className="mt-4 text-lg text-estate-on-surface-variant">
        Publiez votre gîte ou votre actif touristique auprès d’investisseurs et d’acheteurs ciblés. Les annonces sont
        modérées pour garantir la qualité du catalogue.
      </p>

      <ul className="mt-10 space-y-4">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3 text-estate-on-surface">
            <EstateIcon name="check_circle" className="mt-0.5 shrink-0 text-estate-primary" />
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <EstateButton href={`${p}/auth/register`}>Créer un compte et commencer</EstateButton>
        <EstateButton variant="secondary" href={`${p}/comment-ca-marche`}>
          Comment ça marche
        </EstateButton>
      </div>

      <p className="mt-10 text-sm text-estate-on-surface-variant">
        Vous avez déjà un compte ?{' '}
        <a href={`${p}/auth/login`} className="font-semibold text-estate-primary underline underline-offset-4">
          Connexion
        </a>
      </p>
    </div>
  )
}
