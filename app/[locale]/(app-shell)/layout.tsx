import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

/**
 * Shell applicatif Lodgemarket : messagerie, auth, formulaires (palette historique orange / crème).
 */
export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFFBEB] to-[#FFF7ED]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
