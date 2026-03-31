import { EstateFooter } from '@/components/estate/EstateFooter'
import { EstateHeader } from '@/components/estate/EstateHeader'

/**
 * Pages marketing publiques (catalogue plan, fiches, ressources) — shell premium aligné (refined).
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-estate-surface font-estate text-estate-on-surface">
      <EstateHeader />
      {children}
      <EstateFooter />
    </div>
  )
}
