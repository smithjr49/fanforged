'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/admin/venues'
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Test the secret against the admin venues API
    const res = await fetch('/api/admin/venues?limit=1', {
      headers: { 'x-admin-secret': secret },
    })

    if (res.ok) {
      // Store in cookie and redirect
      document.cookie = `admin_secret=${encodeURIComponent(secret)}; path=/; SameSite=Strict; max-age=86400`
      router.push(next)
    } else {
      setError('Invalid secret. Check your ADMIN_SECRET env var.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Admin secret</label>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          placeholder="Enter ADMIN_SECRET value"
          required
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-950 font-bold py-2.5 rounded-lg transition-colors"
      >
        {loading ? 'Checking…' : 'Enter Admin'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">⚽</span>
          <h1 className="text-2xl font-bold text-white mt-3">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">FanForged</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <Suspense fallback={<div className="text-gray-500 text-sm">Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
