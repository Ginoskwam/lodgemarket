import { EstateFooter } from '@/components/estate/EstateFooter'
import { EstateHeader } from '@/components/estate/EstateHeader'

export default async function RefinedMarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-estate-surface font-estate text-estate-on-surface">
      <EstateHeader />
      {children}
      <EstateFooter />
    </div>
  )
}
