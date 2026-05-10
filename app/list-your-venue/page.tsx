'use client'

import { useState } from 'react'
import { HOST_CITIES } from '@/lib/cities'

// USA/Canada/Mexico regions only
const NA_COUNTRIES = ['USA', 'Canada', 'Mexico']

type Step = 1 | 2 | 3

export default function ListYourVenuePage() {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    venueName: '',
    address: '',
    citySlug: '',
    isOtherCity: false,
    otherCity: '',
    otherCountry: '',
    contactEmail: '',
    website: '',
    description: '',
    matchDate: '',
    startTime: '',
    coverCharge: '',
    capacity: '',
    ticketUrl: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setServerErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handleCheckout = async () => {
    setLoading(true)
    setServerErrors({})
    try {
      const payload = {
        venueName: form.venueName,
        address: form.address,
        citySlug: form.isOtherCity ? '' : form.citySlug,
        isGlobalCity: form.isOtherCity,
        globalCity: form.otherCity,
        globalCountry: form.otherCountry,
        contactEmail: form.contactEmail,
        website: form.website,
        description: form.description,
        matchDate: form.matchDate,
        startTime: form.startTime,
        coverCharge: form.coverCharge,
        capacity: form.capacity,
        ticketUrl: form.ticketUrl,
      }

      const res = await fetch('/api/create-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          setServerErrors(data.errors)
          setStep(1) // Go back to show field errors
        } else {
          alert(data.error ?? 'Something went wrong. Please try again.')
        }
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const hostCityOptions = HOST_CITIES.map((c) => ({
    value: c.slug,
    label: `${c.flag} ${c.name}`,
  }))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">List Your Venue</h1>
        <p className="text-gray-400 mt-2">
          Get your watch party discovered by fans. One-time listing fee — $39.
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Listings are reviewed before publication to protect fans and venue owners.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-yellow-400 text-gray-950' : 'bg-gray-800 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`h-0.5 w-12 ${step > s ? 'bg-yellow-400' : 'bg-gray-800'}`} />
            )}
          </div>
        ))}
        <span className="ml-2 text-gray-400 text-sm">
          {step === 1 ? 'Venue Details' : step === 2 ? 'Event Details' : 'Review & Pay'}
        </span>
      </div>

      {/* ── Step 1: Venue Details ── */}
      {step === 1 && (
        <div className="space-y-5">
          <Field label="Venue Name *" error={serverErrors.venueName}>
            <input
              name="venueName"
              value={form.venueName}
              onChange={handleChange}
              placeholder="e.g. The Pitch Bar & Grill"
              className={inputClass(serverErrors.venueName)}
            />
          </Field>

          <Field label="City *" error={serverErrors.citySlug ?? serverErrors.globalCity}>
            <select
              name="citySlug"
              value={form.isOtherCity ? '__other__' : form.citySlug}
              onChange={(e) => {
                if (e.target.value === '__other__') {
                  setForm((p) => ({ ...p, isOtherCity: true, citySlug: '' }))
                } else {
                  setForm((p) => ({ ...p, isOtherCity: false, citySlug: e.target.value }))
                }
              }}
              className={inputClass()}
            >
              <option value="">Select a city...</option>
              <optgroup label="🏟️ Tournament Host Cities">
                {hostCityOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="📍 Fan Hub Cities">
                {[
                  { value: 'chicago', label: '🇺🇸 Chicago' },
                  { value: 'washington-dc', label: '🇺🇸 Washington DC' },
                  { value: 'phoenix', label: '🇺🇸 Phoenix' },
                  { value: 'denver', label: '🇺🇸 Denver' },
                  { value: 'las-vegas', label: '🇺🇸 Las Vegas' },
                  { value: 'orlando', label: '🇺🇸 Orlando' },
                  { value: 'san-diego', label: '🇺🇸 San Diego' },
                  { value: 'nashville', label: '🇺🇸 Nashville' },
                  { value: 'austin', label: '🇺🇸 Austin' },
                  { value: 'montreal', label: '🇨🇦 Montréal' },
                  { value: 'calgary', label: '🇨🇦 Calgary' },
                  { value: 'ottawa', label: '🇨🇦 Ottawa' },
                  { value: 'edmonton', label: '🇨🇦 Edmonton' },
                  { value: 'tijuana', label: '🇲🇽 Tijuana' },
                  { value: 'cancun', label: '🇲🇽 Cancún' },
                  { value: 'puebla', label: '🇲🇽 Puebla' },
                ].map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
              <option value="__other__">My city isn&apos;t listed...</option>
            </select>

            {form.isOtherCity && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <input
                  name="otherCity"
                  value={form.otherCity}
                  onChange={handleChange}
                  placeholder="City name"
                  className={inputClass(serverErrors.globalCity)}
                />
                <select
                  name="otherCountry"
                  value={form.otherCountry}
                  onChange={handleChange}
                  className={inputClass(serverErrors.globalCountry)}
                >
                  <option value="">Country...</option>
                  {NA_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Field>

          <Field label="Full Address *" error={serverErrors.address}>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main St, City, State/Province"
              className={inputClass(serverErrors.address)}
            />
          </Field>

          <Field label="Contact Email *" error={serverErrors.contactEmail}>
            <input
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="owner@yourbar.com"
              className={inputClass(serverErrors.contactEmail)}
            />
          </Field>

          <Field label="Website (optional)" error={serverErrors.website}>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://yourbar.com"
              className={inputClass(serverErrors.website)}
            />
          </Field>

          <Field label="About your venue (optional)" error={serverErrors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={600}
              placeholder="Tell fans what makes your watch party special..."
              className={`${inputClass(serverErrors.description)} resize-none`}
            />
            <p className="text-gray-600 text-xs mt-1 text-right">
              {form.description.length}/600
            </p>
          </Field>

          <button
            onClick={() => setStep(2)}
            disabled={
              !form.venueName ||
              (!form.citySlug && !form.otherCity) ||
              !form.address ||
              !form.contactEmail
            }
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-gray-950 font-bold py-3.5 rounded-xl transition-colors"
          >
            Continue →
          </button>
        </div>
      )}

      {/* ── Step 2: Event Details ── */}
      {step === 2 && (
        <div className="space-y-5">
          <Field label="Event Date *" error={serverErrors.matchDate}>
            <input
              name="matchDate"
              type="date"
              value={form.matchDate}
              onChange={handleChange}
              min="2026-06-11"
              max="2026-07-19"
              className={inputClass(serverErrors.matchDate)}
            />
            <p className="text-gray-500 text-xs mt-1">Tournament runs June 11 – July 19, 2026</p>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Doors Open (optional)">
              <input
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
                className={inputClass()}
              />
            </Field>
            <Field label="Cover Charge ($)" error={serverErrors.coverCharge}>
              <input
                name="coverCharge"
                type="number"
                value={form.coverCharge}
                onChange={handleChange}
                placeholder="0 = Free entry"
                min="0"
                max="500"
                className={inputClass(serverErrors.coverCharge)}
              />
            </Field>
          </div>

          <Field label="Capacity (optional)" error={serverErrors.capacity}>
            <input
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              placeholder="Max attendees"
              min="1"
              className={inputClass(serverErrors.capacity)}
            />
          </Field>

          <Field label="Ticket / RSVP Link (optional)" error={serverErrors.ticketUrl}>
            <input
              name="ticketUrl"
              value={form.ticketUrl}
              onChange={handleChange}
              placeholder="https://eventbrite.com/..."
              className={inputClass(serverErrors.ticketUrl)}
            />
          </Field>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.matchDate}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-gray-950 font-bold py-3.5 rounded-xl transition-colors"
            >
              Review →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review & Pay ── */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-3">
            <h3 className="text-white font-semibold">Review Your Listing</h3>
            {[
              { label: 'Venue', value: form.venueName },
              {
                label: 'City',
                value: form.isOtherCity
                  ? `${form.otherCity}, ${form.otherCountry}`
                  : HOST_CITIES.find((c) => c.slug === form.citySlug)?.name ?? form.citySlug,
              },
              { label: 'Address', value: form.address },
              { label: 'Date', value: form.matchDate },
              { label: 'Doors Open', value: form.startTime || '—' },
              { label: 'Cover Charge', value: form.coverCharge ? `$${form.coverCharge}` : 'Free' },
              { label: 'Contact', value: form.contactEmail },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-white text-right max-w-[60%] break-words">{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-white font-semibold">Standard Listing</p>
                <p className="text-gray-400 text-sm">Valid for the full 2026 tournament</p>
              </div>
              <span className="text-yellow-400 font-bold text-2xl">$39</span>
            </div>
            <div className="bg-yellow-400/10 rounded-xl p-3 text-sm text-yellow-200/80">
              ℹ️ After payment, your listing will be reviewed before it goes live. We typically review within 1–2 business days.
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flex-[2] bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-gray-950 font-bold py-3.5 px-6 rounded-xl transition-colors"
            >
              {loading ? 'Redirecting to checkout…' : 'Pay $39 & Submit for Review'}
            </button>
          </div>
          <p className="text-gray-600 text-xs text-center">
            Secure checkout via Stripe. Your listing will be reviewed before publication.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────

function inputClass(error?: string) {
  return `w-full bg-gray-900 border ${
    error ? 'border-red-500' : 'border-gray-700'
  } focus:border-yellow-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors`
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
