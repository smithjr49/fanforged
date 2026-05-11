import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCityBySlug, HOST_CITIES } from '@/lib/cities'
import { supabase } from '@/lib/supabase'
import WatchPartyCard from '@/components/WatchPartyCard'
import CityAlertSignup from '@/components/CityAlertSignup'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  // Only host cities get the /[city]/watch-parties route
  return HOST_CITIES.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city || city.kind !== 'host') return {}
  return {
    title: `Soccer Watch Parties in ${city.name} — 2026 Tournament`,
    description: `Find bars and venues showing the 2026 soccer tournament in ${city.name}. Browse watch party listings near ${city.stadium ?? city.name}.`,
  }
}

export default async function HostCityWatchPartiesPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)

  // Fan hubs use /cities/[city]/watch-parties — redirect if someone hits the wrong route
  if (!city) notFound()
  if (city.kind === 'fan_hub') redirect(`/cities/${slug}/watch-parties`)

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
        <Link href={`/${slug}`} className="hover:text-white transition-colors">{city.name}</Link>
        <span>/</span>
        <span className="text-white">Watch Parties</span>
      </div>

      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {city.flag} Watch Parties in {city.name}
          </h1>
          <p className="text-gray-400 mt-2">
            {city.stadium && (
              <span className="text-gray-500 text-sm">Near {city.stadium} · </span>
            )}
            {parties && parties.length > 0
              ? `${parties.length} venue${parties.length !== 1 ? 's' : ''} showing the 2026 tournament`
              : 'Be the first venue listed here'}
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
        <div className="space-y-4">
          {/* Empty state hero */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-7 sm:p-10 text-center">
            <div className="text-4xl mb-3">🍺</div>
            <h2 className="text-white font-bold text-xl mb-2">
              No watch parties listed in {city.name} yet
            </h2>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Listings go live as venues sign up. Get notified the moment new watch parties are added — or list yours now.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/list-your-venue"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                List Your Venue — $39
              </Link>
              <a
                href="#alerts"
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Get {city.name} Alerts
              </a>
            </div>
          </div>

          {/* Suggest a venue nudge */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-gray-400 text-sm">
              Know a bar in {city.name} that&apos;s showing matches?{' '}
              <span className="text-gray-300">Help fans find it.</span>
            </p>
            <Link
              href="/list-your-venue"
              className="shrink-0 text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition-colors"
            >
              Suggest a venue →
            </Link>
          </div>

          {/* Email alert signup */}
          <div id="alerts">
            <CityAlertSignup defaultCity={slug} />
          </div>
        </div>
      )}

      {/* Venue owner CTA — always visible */}
      {parties && parties.length > 0 && (
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-950 text-base">Own or manage a venue in {city.name}?</h3>
            <p className="text-gray-900/70 text-sm mt-0.5">Get listed alongside these venues. Simple $39 listing, reviewed before publishing.</p>
          </div>
          <Link
            href="/list-your-venue"
            className="shrink-0 bg-gray-950 hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            List Your Venue
          </Link>
        </div>
      )}
    </div>
  )
}
