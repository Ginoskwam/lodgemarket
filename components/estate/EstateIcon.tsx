import { cn } from '@/lib/cn'

export function EstateIcon({
  name,
  className,
  filled,
}: {
  name: string
  className?: string
  filled?: boolean
}) {
  return (
    <span
      className={cn('material-symbols-outlined select-none', className)}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
      aria-hidden
    >
      {name}
    </span>
  )
}
