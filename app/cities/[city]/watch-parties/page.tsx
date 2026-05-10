import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCityBySlug, FAN_HUB_CITIES } from '@/lib/cities'
import { supabase } from '@/lib/supabase'
import WatchPartyCard from '@/components/WatchPartyCard'
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
    title: `Soccer Watch Parties in ${city.name} — 2026 Tournament`,
    description: `Find bars and venues showing the 2026 soccer tournament in ${city.name}. Browse watch parties near you.`,
  }
}

export default async function FanHubWatchPartiesPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const { data: parties } = await supabase
    .from('watch_parties')
    .select('*, venue:venues(*)')
    .filter('venue.city_slug', 'eq', slug)
    .filter('venue.status', 'eq', 'active')
    .order('featured', { ascending: false })
    .order('date', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/watch-parties" className="hover:text-white transition-colors">Watch Parties</Link>
        <span>/</span>
        <span className="text-white">{city.name}</span>
      </div>

      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-white">
              {city.flag} Watch Parties in {city.name}
            </h1>
          </div>
          <p className="text-gray-400 mt-1 text-sm">
            {city.country} · Fan hub · 2026 tournament
          </p>
          <p className="text-gray-500 mt-1 text-sm">
            {parties && parties.length > 0
              ? `${parties.length} venue${parties.length !== 1 ? 's' : ''} showing matches`
              : 'No listings yet — be the first'}
          </p>
        </div>
        <Link
          href="/list-your-venue"
          className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          + List Your Venue
        </Link>
      </div>

      {parties && parties.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parties.map((party) => (
            <WatchPartyCard key={party.id} party={party} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900 rounded-3xl border border-gray-800">
          <div className="text-5xl mb-4">📍</div>
          <h2 className="text-white font-bold text-xl mb-2">
            No listings yet in {city.name}
          </h2>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">
            Own a bar or venue in {city.name}? List your 2026 tournament watch party for $39.
          </p>
          <Link
            href="/list-your-venue"
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-6 py-3 rounded-xl transition-colors inline-block"
          >
            List Your Venue — $39
          </Link>
        </div>
      )}
    </div>
  )
}
