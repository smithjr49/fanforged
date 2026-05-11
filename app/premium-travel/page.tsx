'use client'

import { useState } from 'react'
import Link from 'next/link'

const SERVICES = [
  { icon: '🏨', title: 'Luxury Hotels & Villas', desc: 'Five-star properties and private villa rentals near stadiums and city centers.' },
  { icon: '🚘', title: 'Private Drivers & Transfers', desc: 'Door-to-door luxury transfers — airport to hotel, hotel to stadium, match days.' },
  { icon: '✈️', title: 'Private Aviation', desc: 'Charter flights between host cities for multi-city itineraries.' },
  { icon: '🎟️', title: 'VIP Experiences', desc: 'Exclusive stadium access, hospitality suites, and behind-the-scenes tours.' },
  { icon: '🍽️', title: 'Restaurant & Nightlife Tables', desc: 'Reservations at the best restaurants and nightlife in every host city.' },
  { icon: '🗺️', title: 'Full Trip Concierge', desc: 'End-to-end itinerary planning — hotels, transport, experiences, matches.' },
]

export default function PremiumTravelPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    cities: '',
    dates: '',
    travelers: '',
    services: '',
    budget: '',
    notes: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/premium-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span>›</span>
        <span className="text-gray-300">Premium Travel</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1 mb-4">
          <span className="text-yellow-400 text-xs font-semibold">✨ Premium & Concierge Travel</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          World Cup 2026.<br />
          <span className="text-yellow-400">Done properly.</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
          Luxury hotels, private transfers, VIP experiences, and full-trip concierge planning
          across all 16 host cities. Tell us what you need and we'll handle the rest.
        </p>
      </div>

      {/* Services grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {SERVICES.map((s) => (
          <div key={s.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <h3 className="text-white font-semibold text-sm mb-1">{s.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Lead form */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-10">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-white font-bold text-2xl mb-2">Request received</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              We'll review your request and get back to you within 24 hours at the email you provided.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-white font-bold text-xl sm:text-2xl mb-1">Request Premium Travel Help</h2>
            <p className="text-gray-500 text-sm mb-6">
              Tell us about your trip. We'll respond within 24 hours with options and pricing.
            </p>

            {/* TODO: Wire form submission to Supabase premium_leads table or Resend email */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Your name *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Email address *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Host cities you&apos;re visiting</label>
                  <input
                    name="cities"
                    type="text"
                    value={form.cities}
                    onChange={handleChange}
                    placeholder="e.g. Miami, New York, Dallas"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Travel dates</label>
                  <input
                    name="dates"
                    type="text"
                    value={form.dates}
                    onChange={handleChange}
                    placeholder="e.g. June 14 – June 26"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Number of travelers</label>
                  <select
                    name="travelers"
                    value={form.travelers}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white outline-none transition-colors text-sm"
                  >
                    <option value="">Select…</option>
                    <option value="1">Just me</option>
                    <option value="2">2 people</option>
                    <option value="3-4">3–4 people</option>
                    <option value="5-10">5–10 people</option>
                    <option value="10+">10+ / group</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5">Approximate budget per person</label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white outline-none transition-colors text-sm"
                  >
                    <option value="">Select…</option>
                    <option value="2k-5k">$2,000 – $5,000</option>
                    <option value="5k-10k">$5,000 – $10,000</option>
                    <option value="10k-20k">$10,000 – $20,000</option>
                    <option value="20k+">$20,000+</option>
                    <option value="flexible">Flexible / tell me options</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Services you need</label>
                <input
                  name="services"
                  type="text"
                  value={form.services}
                  onChange={handleChange}
                  placeholder="e.g. luxury hotel, airport transfer, restaurant reservations"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1.5">Anything else we should know?</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Special requests, accessibility needs, celebrating an occasion…"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-400 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-colors text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-gray-950 font-bold py-3 rounded-xl text-sm transition-colors"
              >
                {loading ? 'Sending…' : 'Request Premium Travel Help →'}
              </button>

              <p className="text-gray-600 text-[11px] text-center">
                No commitment required. We'll respond within 24 hours with options.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
