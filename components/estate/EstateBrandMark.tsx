import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/cn'

type Props = {
  href: string
  className?: string
  /** En-tête : compact ; pied de page : un peu plus grand */
  variant?: 'header' | 'footer'
  /** LCP sur la home */
  priority?: boolean
}

export function EstateBrandMark({ href, className, variant = 'header', priority }: Props) {
  const height =
    variant === 'header' ? 'h-9 max-h-9 sm:h-10 sm:max-h-10 md:h-11 md:max-h-11' : 'h-14 max-h-14 sm:h-16 sm:max-h-16'

  return (
    <Link
      href={href}
      className={cn('inline-flex shrink-0 items-center', className)}
      aria-label="LodgeMarket — Accueil"
    >
      <Image
        src="/images/lodgemarket-logo.png"
        alt=""
        width={1024}
        height={1024}
        priority={priority ?? variant === 'header'}
        className={cn(height, 'w-auto max-w-[200px] object-contain object-left')}
      />
    </Link>
  )
}
