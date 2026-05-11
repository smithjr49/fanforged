import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCityBySlug, FAN_HUB_CITIES, HOST_CITIES } from '@/lib/cities'
import CityAlertSignup from '@/components/CityAlertSignup'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return FAN_HUB_CITIES.map((c) => ({ city: c.slug }))
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
    title: `${city.name} World Cup 2026 Fan Hub — Watch Parties & Guide`,
    description: `${city.name} is a World Cup 2026 fan hub. Find watch parties, sports bars, and where fans are gathering during the 2026 tournament.`,
    alternates: { canonical: `https://fanforged.fans/cities/${slug}` },
  }
}

export default async function FanHubCityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  // Show host cities from same country first, then others
  const nearbyHosts = [
    ...HOST_CITIES.filter((c) => c.country === city.country),
    ...HOST_CITIES.filter((c) => c.country !== city.country),
  ].slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">{city.name}</span>
      </div>

      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${city.heroColor} rounded-2xl overflow-hidden p-6 sm:p-10 mb-6`}>
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_70%_80%,white_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute -right-4 -bottom-4 text-[120px] opacity-[0.08] select-none pointer-events-none rotate-12">⚽</div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/20 text-white/90 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Fan Hub
            </span>
            <span className="text-white/50 text-xs">{city.country}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {city.flag} {city.name}
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-lg">
            {city.name} is a World Cup 2026 fan hub — a gathering point for fans across the region
            during the tournament. Find watch parties and sports bars showing every match.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <Link
              href={`/cities/${slug}/watch-parties`}
              className="inline-flex items-center gap-2 bg-white text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors hover:bg-yellow-400"
            >
              🍺 Browse Watch Parties in {city.name}
            </Link>
            <Link
              href="/list-your-venue"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors border border-white/20"
            >
              + List Your Venue
            </Link>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {/* What is a fan hub */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="text-white font-bold text-base mb-2">📍 What's a Fan Hub?</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Fan hub cities aren't official match venues, but they become major gathering points for
            supporters during the 2026 tournament. Bars, fan zones, and pop-up watch parties
            across {city.name} will show every group stage and knockout match live.
          </p>
        </div>
        {/* Watch parties CTA */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="text-white font-bold text-base mb-2">🍺 Find Where to Watch</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Browse verified bars and venues in {city.name} that are hosting watch parties for
            the 2026 tournament. Updated as new listings go live.
          </p>
          <Link
            href={`/cities/${slug}/watch-parties`}
            className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition-colors"
          >
            View {city.name} watch parties →
          </Link>
        </div>
      </div>

      {/* Host cities nearby */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-6">
        <h2 className="text-white font-semibold text-sm mb-3">🏟️ Nearby Host Cities</h2>
        <p className="text-gray-400 text-sm mb-3">
          {city.name} is a fan hub. For match venues and full city guides, see the official host cities:
        </p>
        <div className="flex flex-wrap gap-2">
          {nearbyHosts.map((h) => (
            <Link
              key={h.slug}
              href={`/${h.slug}`}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              {h.flag} {h.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Email signup */}
      <CityAlertSignup defaultCity={slug} />

      {/* Venue CTA */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-950 text-base">Own or manage a venue in {city.name}?</h3>
          <p className="text-gray-900/70 text-sm mt-0.5">
            Get listed so fans can find you. Simple $39 listing, reviewed before publishing.
          </p>
        </div>
        <Link
          href="/list-your-venue"
          className="shrink-0 bg-gray-950 hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          List Your Venue
        </Link>
      </div>
    </div>
  )
}
