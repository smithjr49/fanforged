import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'List Your Venue — 2026 Soccer Watch Party',
  description:
    'List your bar or venue as a 2026 World Cup watch party destination. One-time $39 listing fee. Get discovered by fans in your city across the USA, Canada, and Mexico.',
}

export default function ListYourVenueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
