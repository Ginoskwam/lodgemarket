import { cn } from '@/lib/cn'
import Link from 'next/link'
import type { ComponentProps } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark'

const variants: Record<Variant, string> = {
  primary:
    'bg-estate-primary text-estate-on-primary rounded-lg font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-estate-primary/10',
  secondary:
    'border border-estate-outline-variant/30 text-estate-primary rounded-lg font-medium hover:bg-estate-surface-container-low transition-colors',
  ghost: 'text-estate-primary font-medium hover:bg-estate-surface-container-low transition-all rounded-lg',
  onDark:
    'bg-estate-secondary text-white px-10 py-4 rounded-lg font-bold hover:bg-estate-secondary-fixed hover:text-estate-primary transition-all',
}

export function EstateButton({
  variant = 'primary',
  className,
  href,
  children,
  ...rest
}: ComponentProps<'button'> &
  Partial<ComponentProps<'a'>> & {
    variant?: Variant
    href?: string
  }) {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 px-6 py-2 text-sm md:text-base',
    variants[variant],
    className
  )
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}
