import type { Metadata, Viewport } from 'next'
import { Inter, Manrope, Noto_Serif } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif', display: 'swap' })

export const metadata: Metadata = {
  title: 'Lodgemarket — Gîtes & investissement locatif',
  description:
    'Marché spécialisé pour l’immobilier touristique et les gîtes certifiés. Catalogue, fiches détaillées et parcours vendeur / acheteur.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lodgemarket',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'theme-color': '#061b0e',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// Root layout - Next.js nécessite un layout racine avec html et body
// Le layout [locale] gère le contenu spécifique à la locale
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} ${notoSerif.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}


