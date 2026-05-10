'use client'

import { useState } from 'react'
import type { VenueStatus } from '@/lib/supabase'

type Props = {
  venueId: string
  currentStatus: VenueStatus
  secret: string
}

const ACTIONS: Partial<Record<VenueStatus, { label: string; next: VenueStatus; color: string }[]>> = {
  pending_review: [
    { label: '✓ Approve', next: 'active', color: 'bg-green-600 hover:bg-green-500' },
    { label: '✗ Reject', next: 'rejected', color: 'bg-red-700 hover:bg-red-600' },
  ],
  active: [
    { label: '⏸ Suspend', next: 'suspended', color: 'bg-yellow-600 hover:bg-yellow-500' },
  ],
  suspended: [
    { label: '↩ Reinstate', next: 'active', color: 'bg-green-600 hover:bg-green-500' },
  ],
}

export default function AdminVenueActions({ venueId, currentStatus, secret }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const actions = ACTIONS[currentStatus] ?? []

  if (actions.length === 0) {
    return <span className="text-gray-600 text-xs">No actions</span>
  }

  const handle = async (action: VenueStatus) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ venue_id: venueId, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unknown error')
      setDone(action)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <span className="text-green-400 text-sm font-medium">
        → {done}
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-2 shrink-0">
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {actions.map((a) => (
        <button
          key={a.next}
          onClick={() => handle(a.next)}
          disabled={loading}
          className={`${a.color} disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors`}
        >
          {loading ? '…' : a.label}
        </button>
      ))}
    </div>
  )
}
