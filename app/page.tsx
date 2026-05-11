import Link from 'next/link'
import CityCard from '@/components/CityCard'
import Countdown from '@/components/Countdown'
import CityAlertSignup from '@/components/CityAlertSignup'
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

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 sm:pt-16 sm:pb-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1 mb-4 sm:mb-5">
            <span className="text-yellow-400 text-xs sm:text-sm font-semibold">⚽ FIFA World Cup 2026</span>
            <span className="text-yellow-400/50 text-xs sm:text-sm">Jun 11 – Jul 19</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] mb-3 sm:mb-4 tracking-tight">
            Your Complete Guide to<br />
            <span className="text-yellow-400">World Cup 2026</span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto mb-4 sm:mb-6 leading-relaxed">
            Independent guides for all 16 host cities — hotels, stadium transit, sports bars, fan hubs, and watch parties across the USA, Canada, and Mexico.
          </p>

          {/* Countdown */}
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-500 text-[10px] sm:text-xs mb-2 sm:mb-3 uppercase tracking-wider font-medium">Tournament kicks off in</p>
            <Countdown />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center mb-4">
            <Link
              href="/watch-parties"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-6 py-3 rounded-xl text-base transition-colors shadow-lg shadow-yellow-400/20"
            >
              Find Watch Parties
            </Link>
            <Link
              href="/cities"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl text-base transition-colors border border-white/20"
            >
              Browse City Guides
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="text-gray-600 text-[10px] sm:text-xs">
            FanForged is an independent fan guide. Not affiliated with or endorsed by FIFA or tournament organizers.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { label: 'Host Cities', value: '16' },
              { label: 'Teams', value: '48' },
              { label: 'Matches', value: '104' },
              { label: 'Days', value: '38' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">{stat.value}</div>
                <div className="text-gray-500 text-[10px] sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature strip (desktop only — not worth space on mobile) ── */}
      <section className="hidden sm:block bg-gray-950 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: '🏟️', title: 'Stadium Guides', desc: 'Transit, parking & match-day tips' },
              { icon: '🏨', title: 'Hotel Picks', desc: 'Curated stays near stadiums' },
              { icon: '🍺', title: 'Sports Bars', desc: 'Best watch spots in every city' },
              { icon: '🗺️', title: 'Fan Zones', desc: 'Outdoor fan hubs & gathering spots' },
            ].map((f) => (
              <div key={f.title} className="flex gap-3 items-start">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── City Guides ── */}
      <section id="cities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 scroll-mt-20">
        <div className="mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-bold text-white">16 Host City Guides</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Hotels · Bars · Stadium Transit · Fan Zones</p>
        </div>

        {/* USA */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3 sm:mb-5">
            <h3 className="text-gray-300 text-xs font-bold uppercase tracking-wider">🇺🇸 United States</h3>
            <span className="text-gray-700 text-xs">11 cities</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {usaCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>

        {/* Canada */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3 sm:mb-5">
            <h3 className="text-gray-300 text-xs font-bold uppercase tracking-wider">🇨🇦 Canada</h3>
            <span className="text-gray-700 text-xs">2 cities + fan hub</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {canadaCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>

        {/* Mexico */}
        <div className="mb-2 sm:mb-4">
          <div className="flex items-center gap-3 mb-3 sm:mb-5">
            <h3 className="text-gray-300 text-xs font-bold uppercase tracking-wider">🇲🇽 Mexico</h3>
            <span className="text-gray-700 text-xs">3 cities</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {mexicoCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Watch Party finder CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-gradient-to-r from-blue-950 to-gray-900 rounded-2xl border border-blue-800/40 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">Watch Parties</p>
            <h2 className="text-lg sm:text-2xl font-bold text-white">Find where fans are watching near you</h2>
            <p className="text-gray-400 text-sm mt-1">Browse bars and venues showing every match, across all 16 host cities.</p>
          </div>
          <Link
            href="/watch-parties"
            className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Browse Watch Parties →
          </Link>
        </div>
      </section>

      {/* ── City alert email capture ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <CityAlertSignup variant="banner" />
      </section>

      {/* ── Venue owner CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl">
          <div className="px-6 py-7 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950">Own or manage a venue?</h2>
              <p className="text-gray-900/70 text-sm sm:text-base mt-1 max-w-md">
                List your watch party so fans can find you by city. Simple $39 listing, reviewed before publishing.
              </p>
            </div>
            <Link
              href="/list-your-venue"
              className="shrink-0 bg-gray-950 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-xl"
            >
              List Your Venue — $39
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blog teaser ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-2xl bg-gray-900 border border-gray-800 p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">Fan Guides & Analysis</p>
              <h2 className="text-lg sm:text-2xl font-bold text-white">Deep-dive articles for World Cup fans</h2>
              <p className="text-gray-400 text-sm mt-1 max-w-xl">
                City guides, match previews, dark horse picks, travel tips, and fan culture — across the USA, Canada, and Mexico.
              </p>
            </div>
            <Link
              href="/blog"
              className="shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              Read the blog →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
