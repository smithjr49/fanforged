import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '2026 Soccer Travel Guide — North America City Guides & Watch Parties',
    template: '%s | FanForged',
  },
  icons: {
    icon: '/fanforged-icon.png',
    apple: '/fanforged-icon.png',
  },
  description:
    'Independent travel guide for the 2026 North America soccer tournament. Find city guides, watch parties, hotels, and fan hubs across the USA, Canada, and Mexico.',
  keywords: [
    '2026 World Cup guide',
    'soccer watch party 2026',
    '2026 tournament travel',
    'World Cup host cities guide',
    'soccer fan travel North America',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fanforged.fans',
    siteName: 'FanForged',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-950 text-white antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
