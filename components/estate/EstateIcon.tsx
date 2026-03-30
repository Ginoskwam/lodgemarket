import { cn } from '@/lib/cn'

export function EstateIcon({
  name,
  className,
  filled,
  title,
}: {
  name: string
  className?: string
  filled?: boolean
  title?: string
}) {
  return (
    <span
      title={title}
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
