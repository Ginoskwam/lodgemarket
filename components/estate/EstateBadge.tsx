import { cn } from '@/lib/cn'
import { EstateIcon } from './EstateIcon'

export function EstateCertifiedBadge({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-estate-secondary-container px-3 py-1 text-xs font-bold text-estate-on-secondary-container shadow-sm',
        className
      )}
    >
      <EstateIcon name="verified" className="text-sm" filled />
      {label}
    </span>
  )
}

export function EstateNeutralBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-estate-surface/90 px-3 py-1 text-xs font-bold text-estate-primary shadow-sm backdrop-blur-md',
        className
      )}
    >
      {children}
    </span>
  )
}
