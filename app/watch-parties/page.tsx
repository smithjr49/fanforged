'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HOST_CITIES, FAN_HUB_CITIES } from '@/lib/cities'

export default function AllWatchPartiesPage() {
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState<'all' | 'USA' | 'Canada' | 'Mexico'>('all')

  const hostCities = HOST_CITIES.map((c) => ({ ...c, isHost: true as const }))
  const fanHubCities = FAN_HUB_CITIES.map((c) => ({ ...c, isHost: false as const }))
  const allCities = [...hostCities, ...fanHubCities]

  const filtered = allCities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
    const matchesCountry = countryFilter === 'all' || c.country === countryFilter
    return matchesSearch && matchesCountry
  })

  const hostFiltered = filtered.filter((c) => c.isHost)
  const fanHubFiltered = filtered.filter((c) => !c.isHost)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Watch Parties</h1>
        <p className="text-gray-400 text-lg">
          Find where fans are watching the 2026 World Cup — all 16 host cities and major hubs across North America.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-400 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 outline-none transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        </div>
        <div className="flex gap-2">
          {(['all', 'USA', 'Canada', 'Mexico'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                countryFilter === c
                  ? 'bg-yellow-400 text-gray-950'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {c === 'all' ? 'All' : c === 'USA' ? '🇺🇸 USA' : c === 'Canada' ? '🇨🇦 Canada' : '🇲🇽 Mexico'}
            </button>
          ))}
        </div>
      </div>

      {/* Host cities */}
      {hostFiltered.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">🏆 Host Cities</span>
            <span className="text-gray-600 text-xs">16 official tournament venues</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {hostFiltered.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}/watch-parties`}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400/30 hover:border-yellow-400 rounded-xl p-3 text-center transition-all group"
              >
                <div className="text-2xl mb-1">{city.flag}</div>
                <div className="text-white text-sm font-medium group-hover:text-yellow-400 transition-colors leading-tight">{city.name}</div>
                <div className="text-gray-500 text-xs mt-0.5">{city.stadium ? city.stadium.split(' ').slice(0, 2).join(' ') : city.country}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Fan hub cities */}
      {fanHubFiltered.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">📍 Fan Hubs</span>
            <span className="text-gray-600 text-xs">Major cities with watch-party demand</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {fanHubFiltered.map((city) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}/watch-parties`}
                className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-3 text-center transition-all group"
              >
                <div className="text-2xl mb-1">{city.flag}</div>
                <div className="text-white text-sm font-medium group-hover:text-white transition-colors">{city.name}</div>
                <div className="text-gray-500 text-xs">{city.country}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No city found for &quot;{search}&quot;</p>
          <p className="text-gray-500 text-sm">
            Don&apos;t see your city?{' '}
            <Link href="/list-your-venue" className="text-yellow-400 hover:underline">
              List your venue
            </Link>{' '}
            and we&apos;ll add it.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center">
        <h2 className="text-white font-bold text-2xl mb-2">Own a bar in North America?</h2>
        <p className="text-gray-400 mb-6">
          List your World Cup watch party and reach fans in your city. One-time fee — $39.
        </p>
        <Link
          href="/list-your-venue"
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-8 py-3 rounded-xl transition-colors inline-block"
        >
          List Your Venue — $39
        </Link>
      </div>
    </div>
  )
}
