import { EstateButton } from './EstateButton'
import { EstateIcon } from './EstateIcon'

type Props = { locale: string }

export function EstateEditorialBreak({ locale }: Props) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-estate-primary p-10 text-estate-on-primary lg:col-span-1">
      <div className="relative z-10">
        <h3 className="mb-6 font-estate-serif text-3xl italic leading-tight">
          Pourquoi investir en Ardennes ?
        </h3>
        <p className="mb-8 text-lg leading-relaxed text-estate-on-primary-container">
          Le marché du gîte de luxe connaît une croissance stable, portée par une demande Benelux toute
          l&apos;année.
        </p>
        <ul className="space-y-4 text-sm font-medium">
          <li className="flex items-center gap-3">
            <EstateIcon name="check_circle" className="text-estate-tertiary-fixed" />
            Attractivité 4 saisons
          </li>
          <li className="flex items-center gap-3">
            <EstateIcon name="check_circle" className="text-estate-tertiary-fixed" />
            Fiscalité belge étudiée
          </li>
          <li className="flex items-center gap-3">
            <EstateIcon name="check_circle" className="text-estate-tertiary-fixed" />
            Patrimoine architectural durable
          </li>
        </ul>
      </div>
      <div className="relative z-10 mt-12">
        <EstateButton
          variant="secondary"
          href={`/${locale}/aide`}
          className="bg-estate-secondary-container px-8 py-3 font-bold text-estate-on-secondary-container hover:scale-[1.02]"
        >
          Guide de l&apos;investisseur
        </EstateButton>
      </div>
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-estate-secondary/20 blur-3xl transition-transform duration-1000 group-hover:scale-125" />
    </div>
  )
}
