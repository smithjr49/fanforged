import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCityBySlug, HOST_CITIES } from '@/lib/cities'
import { loadCityGuide } from '@/lib/cityGuide'
import { getAffiliateLinks } from '@/lib/affiliateLinks'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://fanforged.fans'

export async function generateStaticParams() {
  const dataDir = path.join(process.cwd(), 'data', 'cities')
  const slugs = HOST_CITIES.map((c) => c.slug).filter((slug) => {
    try { fs.accessSync(path.join(dataDir, `${slug}.json`)); return true } catch { return false }
  })
  return slugs.map((city) => ({ city }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return {}
  return {
    title: `Where to Stay in ${city.name} for World Cup 2026 | FanForged`,
    description: `Compare the best areas to stay in ${city.name} for World Cup 2026 — stadium access, nightlife, budget options, family areas, and luxury hotel zones.`,
    alternates: { canonical: `${BASE}/hotels/${slug}` },
    openGraph: {
      title: `Best Areas to Stay in ${city.name} — World Cup 2026`,
      description: `Stadium access, nightlife, budget, and luxury neighborhoods in ${city.name} for the 2026 World Cup.`,
      url: `${BASE}/hotels/${slug}`,
      type: 'website',
    },
  }
}

const PRICE_LABELS: Record<string, string> = {
  '$': 'Budget',
  '$$': 'Mid-range',
  '$$$': 'Upscale',
  '$$$$': 'Luxury',
  '$$-$$$': 'Mid-range to upscale',
  '$$$-$$$$': 'Upscale to luxury',
}

function priceLabel(level?: string): string {
  if (!level) return ''
  return PRICE_LABELS[level] ?? level
}

function highlightTags(bestFor: string): string[] {
  return bestFor
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3)
}

export default async function HotelCityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const guide = loadCityGuide(slug)
  if (!guide) notFound()

  const links = getAffiliateLinks(slug)
  const neighborhoods = guide.neighborhoods ?? []
  const hotels = guide.hotels ?? []

  // Categorize neighborhoods from their best_for fields
  const stadiumNeighborhood = neighborhoods.find((n) =>
    n.best_for.toLowerCase().includes('stadium') || n.stadium_access
  )
  const nightlifeNeighborhood = neighborhoods.find((n) =>
    n.best_for.toLowerCase().includes('nightlife') || n.best_for.toLowerCase().includes('bar')
  )
  const budgetNeighborhood = neighborhoods.find((n) =>
    n.hotel_price_level === '$' || n.hotel_price_level === '$$' ||
    n.best_for.toLowerCase().includes('budget')
  )
  const familyNeighborhood = neighborhoods.find((n) =>
    n.best_for.toLowerCase().includes('famil')
  )
  const luxuryNeighborhood = neighborhoods.find((n) =>
    n.hotel_price_level === '$$$$' || n.hotel_price_level === '$$$-$$$$' ||
    n.best_for.toLowerCase().includes('luxury')
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4 sm:mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span>›</span>
        <Link href="/hotels" className="hover:text-gray-300 transition-colors">Hotels</Link>
        <span>›</span>
        <span className="text-gray-300">{city.name}</span>
      </nav>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${city.heroColor} rounded-2xl p-5 sm:p-10 mb-6 relative overflow-hidden`}>
        <div className="absolute -right-4 -bottom-4 text-[120px] sm:text-[180px] opacity-10 select-none pointer-events-none rotate-12">🏨</div>
        <div className="relative z-10">
          <span className="text-white/60 text-[10px] sm:text-xs uppercase tracking-widest font-semibold">
            {city.country} · World Cup 2026
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mt-1 mb-2">
            Where to Stay in {city.name}
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-xl mb-5">
            {guide.hero.tagline} — here are the best neighborhoods by stadium access, nightlife,
            budget, and luxury.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a
              href={links.hotelSearchUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              🏨 Search on Booking.com
            </a>
            <a
              href={links.expediaUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors border border-white/20"
            >
              Search on Expedia
            </a>
            <Link
              href={`/${slug}`}
              className="bg-white/10 hover:bg-white/20 text-white/80 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors border border-white/10"
            >
              City Guide →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      {city.stadium && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-gray-900 border border-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-full">
            📍 Stadium: {city.stadium}
          </span>
          <span className="bg-gray-900 border border-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-full">
            📅 Jun 11 – Jul 19, 2026
          </span>
          <span className="bg-gray-900 border border-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-full">
            🏙️ {neighborhoods.length} neighborhoods compared
          </span>
        </div>
      )}

      {/* Book now CTA bar */}
      <div className="bg-gray-900 border border-yellow-400/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <p className="text-white font-semibold text-sm">Ready to book?</p>
          <p className="text-gray-500 text-xs mt-0.5">Compare prices across hundreds of hotels in {city.name}.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a
            href={links.hotelSearchUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            Booking.com →
          </a>
          <a
            href={links.expediaUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            Expedia →
          </a>
        </div>
      </div>

      {/* Neighborhoods grid */}
      {neighborhoods.length > 0 && (
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-1">Best Areas to Stay</h2>
          <p className="text-gray-500 text-sm mb-5">
            Neighborhoods ranked for World Cup fans — by stadium access, price, and vibe.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {neighborhoods.map((n, i) => (
              <div
                key={n.name}
                className={`rounded-xl border p-4 sm:p-5 ${
                  i === 0
                    ? 'border-yellow-400/40 bg-yellow-400/5'
                    : 'border-gray-800 bg-gray-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-bold text-base ${i === 0 ? 'text-yellow-400' : 'text-white'}`}>
                    {i === 0 && <span className="text-xs font-bold text-yellow-400/70 mr-1.5">★ TOP PICK</span>}
                    {n.name}
                  </h3>
                  {n.hotel_price_level && (
                    <span className="text-gray-400 text-xs shrink-0 font-mono bg-gray-800 px-2 py-0.5 rounded">
                      {n.hotel_price_level}
                    </span>
                  )}
                </div>
                {n.hotel_price_level && (
                  <p className="text-gray-500 text-[11px] mb-1">{priceLabel(n.hotel_price_level)}</p>
                )}
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{n.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {highlightTags(n.best_for).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {n.stadium_access && (
                  <p className="text-gray-500 text-xs">
                    <span className="text-gray-400 font-medium">Stadium:</span> {n.stadium_access}
                  </p>
                )}
                {n.safety_transit_notes && (
                  <p className="text-gray-500 text-xs mt-1">
                    <span className="text-gray-400 font-medium">Transit:</span> {n.safety_transit_notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category callouts */}
      {(stadiumNeighborhood || nightlifeNeighborhood || budgetNeighborhood || familyNeighborhood || luxuryNeighborhood) && (
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-1">Find Your Perfect Area</h2>
          <p className="text-gray-500 text-sm mb-5">What matters most to you?</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stadiumNeighborhood && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wide mb-1">🏟️ Best for Stadium Access</p>
                <p className="text-white font-semibold text-sm">{stadiumNeighborhood.name}</p>
                {stadiumNeighborhood.stadium_access && (
                  <p className="text-gray-500 text-xs mt-1">{stadiumNeighborhood.stadium_access}</p>
                )}
              </div>
            )}
            {nightlifeNeighborhood && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wide mb-1">🍸 Best for Nightlife</p>
                <p className="text-white font-semibold text-sm">{nightlifeNeighborhood.name}</p>
                <p className="text-gray-500 text-xs mt-1">{nightlifeNeighborhood.description.split('.')[0]}.</p>
              </div>
            )}
            {budgetNeighborhood && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wide mb-1">💰 Best for Budget</p>
                <p className="text-white font-semibold text-sm">{budgetNeighborhood.name}</p>
                <p className="text-gray-500 text-xs mt-1">{budgetNeighborhood.hotel_price_level} · {priceLabel(budgetNeighborhood.hotel_price_level)}</p>
              </div>
            )}
            {familyNeighborhood && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wide mb-1">👨‍👩‍👧 Best for Families</p>
                <p className="text-white font-semibold text-sm">{familyNeighborhood.name}</p>
                <p className="text-gray-500 text-xs mt-1">{familyNeighborhood.safety_transit_notes.split(';')[0]}</p>
              </div>
            )}
            {luxuryNeighborhood && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wide mb-1">✨ Best Luxury Area</p>
                <p className="text-white font-semibold text-sm">{luxuryNeighborhood.name}</p>
                <p className="text-gray-500 text-xs mt-1">{luxuryNeighborhood.hotel_price_level} · {priceLabel(luxuryNeighborhood.hotel_price_level)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured hotel picks */}
      {hotels.length > 0 && (
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-1">Featured Hotel Picks</h2>
          <p className="text-gray-500 text-sm mb-5">
            Curated options near the stadium and key fan areas.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((hotel) => (
              <div key={hotel.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-sm leading-tight">{hotel.name}</h3>
                  <span className="text-yellow-400 text-xs shrink-0 ml-2">
                    {'★'.repeat(hotel.stars)}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-1">📍 {hotel.neighborhood}</p>
                <p className="text-gray-500 text-xs mb-3">🏟️ {hotel.distance}</p>
                {hotel.best_for && (
                  <p className="text-gray-600 text-[11px] mb-3">Best for: {hotel.best_for}</p>
                )}
                {hotel.affiliate_url ? (
                  <a
                    href={hotel.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-xs py-2 rounded-lg transition-colors"
                  >
                    {hotel.affiliate_label ?? 'Check Availability'}
                  </a>
                ) : (
                  <a
                    href={links.hotelSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs py-2 rounded-lg transition-colors"
                  >
                    Search on Booking.com
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other travel services */}
      <div className="mb-10">
        <h2 className="text-white font-bold text-xl mb-4">Also Plan Your Trip</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href={links.flightSearchUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all group"
          >
            <div className="text-2xl mb-2">✈️</div>
            <p className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">Flights</p>
            <p className="text-gray-500 text-xs mt-0.5">Search & compare flights to {city.name}</p>
          </a>
          <a
            href={links.transferUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all group"
          >
            <div className="text-2xl mb-2">🚖</div>
            <p className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">Airport Transfers</p>
            <p className="text-gray-500 text-xs mt-0.5">Pre-book private transfers</p>
          </a>
          <a
            href={links.experiencesUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all group"
          >
            <div className="text-2xl mb-2">🎟️</div>
            <p className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">Experiences</p>
            <p className="text-gray-500 text-xs mt-0.5">Tours & activities via Viator</p>
          </a>
          <Link
            href={`/${slug}/watch-parties`}
            className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all group"
          >
            <div className="text-2xl mb-2">🍺</div>
            <p className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">Watch Parties</p>
            <p className="text-gray-500 text-xs mt-0.5">Find where fans are watching</p>
          </Link>
        </div>
      </div>

      {/* Affiliate disclosure */}
      <AffiliateDisclosure className="mb-8" />

      {/* Premium travel CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">Premium Travel</p>
          <h2 className="text-white font-bold text-base">Looking for a luxury hotel, villa, or concierge service?</h2>
          <p className="text-gray-400 text-sm mt-1">Our premium travel team handles the full trip — transfers, VIP access, private stays.</p>
        </div>
        <Link
          href="/premium-travel"
          className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Explore Premium →
        </Link>
      </div>
    </div>
  )
}
