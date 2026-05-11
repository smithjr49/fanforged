import Link from 'next/link'
import { HOST_CITIES } from '@/lib/cities'
import HotelCityCard from '@/components/HotelCityCard'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import { loadCityGuide } from '@/lib/cityGuide'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://fanforged.fans'

export const metadata: Metadata = {
  title: 'World Cup 2026 Hotels — Best Areas to Stay in Every Host City | FanForged',
  description:
    'Find the best neighborhoods to stay in all 16 World Cup 2026 host cities. Compare areas by stadium access, nightlife, budget, and luxury — across the USA, Canada, and Mexico.',
  alternates: { canonical: `${BASE}/hotels` },
  openGraph: {
    title: 'World Cup 2026 Hotels — Best Areas to Stay in Every Host City',
    description: 'Best neighborhoods for stadium access, nightlife, budget, and luxury in all 16 host cities.',
    url: `${BASE}/hotels`,
    type: 'website',
  },
}

export default function HotelsIndexPage() {
  const usaCities = HOST_CITIES.filter((c) => c.country === 'USA')
  const canadaCities = HOST_CITIES.filter((c) => c.country === 'Canada')
  const mexicoCities = HOST_CITIES.filter((c) => c.country === 'Mexico')

  function getTopArea(slug: string): string | undefined {
    try {
      const guide = loadCityGuide(slug)
      return guide?.neighborhoods?.[0]?.name
    } catch {
      return undefined
    }
  }

  function getHotelCount(slug: string): number {
    try {
      const guide = loadCityGuide(slug)
      return guide?.hotels?.length ?? 0
    } catch {
      return 0
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span>›</span>
        <span className="text-gray-300">Hotels</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1 mb-3">
          <span className="text-yellow-400 text-xs font-semibold">🏨 World Cup 2026 Hotels</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Where to Stay for the 2026 World Cup
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          We break down the best neighborhoods to stay in every host city — by stadium access,
          nightlife, budget, family-friendliness, and luxury options. Find your area, then book
          directly through our trusted partners.
        </p>
      </div>

      {/* How it works */}
      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        {[
          { icon: '🗺️', title: 'Pick your city', desc: 'All 16 host cities covered across the USA, Canada, and Mexico.' },
          { icon: '🏙️', title: 'Find your area', desc: 'We compare neighborhoods by stadium distance, vibe, and price level.' },
          { icon: '🏨', title: 'Book with confidence', desc: 'Direct links to Booking.com, Hotels.com, and other trusted partners.' },
        ].map((s) => (
          <div key={s.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-3">
            <span className="text-xl shrink-0">{s.icon}</span>
            <div>
              <p className="text-white font-semibold text-sm">{s.title}</p>
              <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* USA */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-gray-300 text-xs font-bold uppercase tracking-wider">🇺🇸 United States — 11 Host Cities</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {usaCities.map((city) => (
            <HotelCityCard
              key={city.slug}
              city={city}
              hotelCount={getHotelCount(city.slug)}
              topArea={getTopArea(city.slug)}
            />
          ))}
        </div>
      </div>

      {/* Canada */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-gray-300 text-xs font-bold uppercase tracking-wider">🇨🇦 Canada — 2 Host Cities</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {canadaCities.map((city) => (
            <HotelCityCard
              key={city.slug}
              city={city}
              hotelCount={getHotelCount(city.slug)}
              topArea={getTopArea(city.slug)}
            />
          ))}
        </div>
      </div>

      {/* Mexico */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-gray-300 text-xs font-bold uppercase tracking-wider">🇲🇽 Mexico — 3 Host Cities</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {mexicoCities.map((city) => (
            <HotelCityCard
              key={city.slug}
              city={city}
              hotelCount={getHotelCount(city.slug)}
              topArea={getTopArea(city.slug)}
            />
          ))}
        </div>
      </div>

      {/* Affiliate disclosure */}
      <AffiliateDisclosure className="mb-8" />

      {/* Premium travel CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">Premium Travel</p>
          <h2 className="text-white font-bold text-lg">Need a luxury hotel, villa, or private driver?</h2>
          <p className="text-gray-400 text-sm mt-1">Our concierge team handles premium bookings, private transfers, and VIP experiences.</p>
        </div>
        <Link
          href="/premium-travel"
          className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Explore Premium Travel →
        </Link>
      </div>
    </div>
  )
}
