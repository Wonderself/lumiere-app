import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthSessionProvider } from '@/components/layout/session-provider'
import { CookieBanner } from '@/components/layout/cookie-banner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cinema.lumiere.film'),
  title: {
    template: '%s | Lumière Cinema',
    default: 'Lumière Cinema — Le Studio IA du Futur',
  },
  description:
    "Lumière Cinema : production collaborative de films IA, micro-tâches créatives, streaming, bandes-annonces, votre visage dans le film. Paris · Tel Aviv · Hollywood.",
  keywords: [
    'cinéma IA',
    'film intelligence artificielle',
    'production collaborative',
    'micro-tâches cinéma',
    'streaming IA',
    'bandes-annonces IA',
    'Lumière Brothers Pictures',
    'studio cinéma IA',
  ],
  authors: [{ name: 'Lumière Brothers Pictures' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Lumière Cinema',
    title: 'Lumière Cinema — Le Studio IA du Futur',
    description: "Production collaborative de films IA, micro-tâches créatives, streaming mondial.",
    url: 'https://cinema.lumiere.film',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumière Cinema — Le Studio IA du Futur',
    description: "Production collaborative de films IA, micro-tâches créatives, streaming mondial.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-[#0A0A0A] text-white`}>
        <AuthSessionProvider>
        {children}
        <CookieBanner />
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid #222222',
              color: '#FAFAFA',
            },
          }}
        />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
