import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthSessionProvider } from '@/components/layout/session-provider'
import { CookieBanner } from '@/components/layout/cookie-banner'
import { ServiceWorkerRegister } from '@/components/layout/sw-register'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
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
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Lumiere',
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
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-[#0A0A0A] text-white`}>
        <AuthSessionProvider>
        {children}
        <CookieBanner />
        <ServiceWorkerRegister />
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
