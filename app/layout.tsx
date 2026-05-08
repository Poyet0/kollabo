import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://kollabo.app'),
  title: {
    default: 'KOLLABO — La collab qui tient ses promesses.',
    template: '%s | KOLLABO',
  },
  description:
    'La marketplace qui connecte les créateurs de contenu africains aux marques. Paiement sécurisé, contrats clairs, revenus garantis.',
  keywords: [
    'influenceur',
    'créateur de contenu',
    'marketing influence',
    'Côte d\'Ivoire',
    'Afrique',
    'FCFA',
    'campagne',
    'marque',
  ],
  authors: [{ name: 'KOLLABO SAS', url: 'https://kollabo.app' }],
  creator: 'KOLLABO',
  publisher: 'KOLLABO',
  openGraph: {
    type: 'website',
    locale: 'fr_CI',
    url: 'https://kollabo.app',
    siteName: 'KOLLABO',
    title: 'KOLLABO — La collab qui tient ses promesses.',
    description:
      'La marketplace qui connecte les créateurs de contenu africains aux marques. Paiement sécurisé, contrats clairs, revenus garantis.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KOLLABO — Marketplace influence Afrique',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KOLLABO — La collab qui tient ses promesses.',
    description: 'La marketplace qui connecte les créateurs africains aux marques.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-black antialiased">
        {children}
      </body>
    </html>
  )
}
