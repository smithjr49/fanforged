'use client'

import { useState } from 'react'
import { HOST_CITIES, FAN_HUB_CITIES } from '@/lib/cities'

const ALL_CITIES = [...HOST_CITIES, ...FAN_HUB_CITIES].sort((a, b) =>
  a.name.localeCompare(b.name)
)

type Props = {
  /** Pre-select a city slug (e.g. from a city guide page) */
  defaultCity?: string
  /** Visual variant */
  variant?: 'banner' | 'inline'
}

export default function CityAlertSignup({ defaultCity, variant = 'inline' }: Props) {
  const [email, setEmail] = useState('')
  const [city, setCity] = useState(defaultCity ?? '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const cityLabel = ALL_CITIES.find((c) => c.slug === city)?.name ?? city

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !city) return
    setStatus('loading')
    try {
      const res = await fetch('/api/city-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, city_slug: city }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`rounded-2xl border border-green-500/30 bg-green-950/30 p-5 text-center ${variant === 'banner' ? 'sm:p-8' : ''}`}>
        <p className="text-green-400 font-semibold text-sm">✓ You&apos;re on the list!</p>
        <p className="text-gray-400 text-sm mt-1">
          We&apos;ll notify you when watch parties go live{cityLabel ? ` in ${cityLabel}` : ''}.
        </p>
      </div>
    )
  }

  const isBanner = variant === 'banner'

  return (
    <div className={`rounded-2xl border border-gray-800 bg-gray-900 ${isBanner ? 'p-6 sm:p-8' : 'p-5'}`}>
      <div className={isBanner ? 'max-w-xl mx-auto text-center' : ''}>
        <p className={`font-bold text-white ${isBanner ? 'text-lg sm:text-xl mb-1' : 'text-base mb-0.5'}`}>
          {defaultCity
            ? `Get watch party alerts for ${cityLabel}`
            : 'Get watch party alerts for your city'}
        </p>
        <p className="text-gray-400 text-sm mb-4">
          Be first to know when new venues list — plus fan tips and city updates.
        </p>

        <form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${isBanner ? 'sm:flex-row sm:gap-3' : ''}`}>
          {!defaultCity && (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="flex-1 bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
            >
              <option value="">Select a city…</option>
              <optgroup label="🇺🇸 USA">
                {HOST_CITIES.filter((c) => c.country === 'USA').map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </optgroup>
              <optgroup label="🇨🇦 Canada">
                {HOST_CITIES.filter((c) => c.country === 'Canada').map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
                {FAN_HUB_CITIES.filter((c) => c.country === 'Canada').map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </optgroup>
              <optgroup label="🇲🇽 Mexico">
                {HOST_CITIES.filter((c) => c.country === 'Mexico').map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </optgroup>
            </select>
          )}

          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shrink-0"
          >
            {status === 'loading' ? 'Sending…' : 'Get Alerts'}
          </button>
        </form>

        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
        )}

        <p className="text-gray-600 text-xs mt-3">No spam. Unsubscribe any time.</p>
      </div>
    </div>
  )
}
