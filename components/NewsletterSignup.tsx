'use client'

import { useState } from 'react'

export default function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    // Store in localStorage as a simple no-backend solution; swap for API route + DB later
    try {
      const existing = JSON.parse(localStorage.getItem('wc26_subscribers') ?? '[]')
      if (!existing.includes(email)) {
        localStorage.setItem('wc26_subscribers', JSON.stringify([...existing, email]))
      }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (compact) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <p className="text-white font-semibold text-sm mb-1">Get match-day guides in your inbox</p>
        <p className="text-gray-500 text-xs mb-3">City guides, fan hub updates, and World Cup tips — no spam.</p>
        {status === 'success' ? (
          <p className="text-yellow-400 text-sm font-medium">You&apos;re on the list!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {status === 'loading' ? '...' : 'Notify me'}
            </button>
          </form>
        )}
      </div>
    )
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 text-center">
      <div className="text-3xl mb-3">📬</div>
      <h2 className="text-2xl font-bold text-white mb-2">Stay ahead of match day</h2>
      <p className="text-gray-400 max-w-md mx-auto mb-6">
        City-specific fan guides, watch party openings, transit tips, and World Cup 2026 news — delivered before you need them.
      </p>
      {status === 'success' ? (
        <div className="text-yellow-400 text-lg font-semibold">
          You&apos;re on the list! We&apos;ll be in touch before match day.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-gray-950 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe free'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-3">Something went wrong — please try again.</p>
      )}
      <p className="text-gray-600 text-xs mt-4">No spam. Unsubscribe any time.</p>
    </section>
  )
}
