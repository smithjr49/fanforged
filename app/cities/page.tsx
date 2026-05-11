'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HOST_CITIES, FAN_HUB_CITIES } from '@/lib/cities'

export default function CityGuidesPage() {
  const [countryFilter, setCountryFilter] = useState<'all' | 'USA' | 'Canada' | 'Mexico'>('all')

  const hostFiltered = HOST_CITIES.filter(
    (c) => countryFilter === 'all' || c.country === countryFilter
  )
  const fanHubFiltered = FAN_HUB_CITIES.filter(
    (c) => countryFilter === 'all' || c.country === countryFilter
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">City Guides</h1>
        <p className="text-gray-400">
          Stadium info, hotels, sports bars, and fan zones for every 2026 World Cup host city.
        </p>
      </div>

      {/* Country filter tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {(['all', 'USA', 'Canada', 'Mexico'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCountryFilter(c)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              countryFilter === c
                ? 'bg-yellow-400 text-gray-950'
                : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {c === 'all' ? 'All' : c === 'USA' ? '🇺🇸 USA' : c === 'Canada' ? '🇨🇦 Canada' : '🇲🇽 Mexico'}
          </button>
        ))}
      </div>

      {/* Host Cities */}
      {hostFiltered.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">🏆 Host Cities</span>
            <span className="text-gray-600 text-xs">Official tournament venues</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {hostFiltered.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400/20 hover:border-yellow-400/60 rounded-xl p-4 text-center transition-all group"
              >
                <div className="text-2xl mb-1.5">{city.flag}</div>
                <div className="text-white text-sm font-semibold group-hover:text-yellow-400 transition-colors leading-tight">
                  {city.name}
                </div>
                {city.stadium && (
                  <div className="text-gray-500 text-xs mt-0.5 truncate px-1">
                    {city.stadium}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Fan Hubs */}
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
                href={`/cities/${city.slug}`}
                className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 text-center transition-all group"
              >
                <div className="text-2xl mb-1.5">{city.flag}</div>
                <div className="text-white text-sm font-medium group-hover:text-white transition-colors leading-tight">
                  {city.name}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">{city.country}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {hostFiltered.length === 0 && fanHubFiltered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">No cities found for that filter.</p>
        </div>
      )}
    </div>
  )
}
