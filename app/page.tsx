import Link from 'next/link'
import CityCard from '@/components/CityCard'
import Countdown from '@/components/Countdown'
import { CITIES, HOST_CITIES } from '@/lib/cities'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://fanforged.fans'

export const metadata: Metadata = {
  title: 'World Cup 2026 Travel Guide — Hotels, Watch Parties & City Guides',
  description:
    'The independent fan guide to the 2026 World Cup. City guides for all 16 host cities across the USA, Canada, and Mexico — hotels, stadium transport, sports bars, fan hubs, and watch party finder.',
  keywords: [
    'World Cup 2026 travel guide',
    '2026 FIFA World Cup cities',
    'World Cup 2026 hotels',
    'World Cup 2026 watch parties',
    '2026 soccer tournament guide',
  ],
  alternates: { canonical: BASE },
  openGraph: {
    title: 'World Cup 2026 Travel Guide — Hotels, Watch Parties & City Guides',
    description: 'Independent fan guide to the 2026 World Cup across the USA, Canada, and Mexico.',
    url: BASE,
    type: 'website',
    siteName: 'FanForged',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FanForged — World Cup 2026 Fan Travel Guide',
  url: BASE,
  description:
    'Independent travel guide for the 2026 FIFA World Cup covering all 16 host cities across the USA, Canada, and Mexico.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/watch-parties?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function HomePage() {
  const usaCities = CITIES.filter((c) => c.country === 'USA')
  const canadaCities = CITIES.filter((c) => c.country === 'Canada')
  const mexicoCities = CITIES.filter((c) => c.country === 'Mexico')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[size:28px_28px]" />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-8">
            <span className="text-yellow-400 text-sm font-semibold">⚽ FIFA World Cup 2026</span>
            <span className="text-yellow-400/50 text-sm">June 11 – July 19</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
            Your Complete Guide to<br />
            <span className="text-yellow-400">World Cup 2026</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Independent travel guides for all 16 host cities. Hotels, stadium transit, fan hubs, and watch party finder — across the USA, Canada, and Mexico.
          </p>

          {/* Countdown */}
          <div className="mb-10">
            <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider font-medium">Tournament kicks off in</p>
            <Countdown />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/watch-parties"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-8 py-3.5 rounded-xl text-lg transition-colors shadow-lg shadow-yellow-400/20"
            >
              Find Watch Parties
            </Link>
            <Link
              href="#cities"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors border border-white/20"
            >
              Browse City Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Host Cities', value: '16' },
              { label: 'Teams', value: '48' },
              { label: 'Matches', value: '104' },
              { label: 'Days of Football', value: '38' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="bg-gray-950 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🏟️', title: 'Stadium Guides', desc: 'Transit, parking, match-day tips for every venue' },
              { icon: '🏨', title: 'Hotel Picks', desc: 'Curated stays near stadiums and fan hubs' },
              { icon: '🍺', title: 'Sports Bars', desc: 'Best places to watch in every host city' },
              { icon: '🗺️', title: 'Fan Hubs', desc: 'Outdoor fan zones and gathering spots' },
            ].map((f) => (
              <div key={f.title} className="flex gap-3 items-start">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Guides */}
      <section id="cities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">16 Host City Guides</h2>
            <p className="text-gray-500 text-sm mt-1">Hotels · Bars · Stadium Transit · Fan Zones</p>
          </div>
        </div>

        {/* USA */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-gray-300 text-sm font-bold uppercase tracking-wider">🇺🇸 United States</h3>
            <span className="text-gray-700 text-xs">11 cities</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {usaCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>

        {/* Canada */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-gray-300 text-sm font-bold uppercase tracking-wider">🇨🇦 Canada</h3>
            <span className="text-gray-700 text-xs">2 cities</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {canadaCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>

        {/* Mexico */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-gray-300 text-sm font-bold uppercase tracking-wider">🇲🇽 Mexico</h3>
            <span className="text-gray-700 text-xs">3 cities</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mexicoCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-gray-900 border border-gray-800 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider mb-2">Fan Guides & Tips</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Deep-dive articles for World Cup travelers</h2>
              <p className="text-gray-400 mt-2 max-w-xl">
                How to get the most out of each host city — packing lists, transport deep dives, fan culture guides, and budget breakdowns.
              </p>
            </div>
            <Link
              href="/blog"
              className="shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Read the blog →
            </Link>
          </div>
        </div>
      </section>

      {/* Watch Party CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl">
          <div className="px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-950 mb-3">Own a Bar or Venue?</h2>
            <p className="text-gray-900/70 text-lg mb-8 max-w-xl mx-auto">
              List your World Cup watch party and get discovered by thousands of fans in your city. One-time listing fee of $39.
            </p>
            <Link
              href="/list-your-venue"
              className="bg-gray-950 hover:bg-gray-800 text-white font-bold px-8 py-3.5 rounded-xl text-lg transition-colors inline-block shadow-xl"
            >
              List Your Venue — $39
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
