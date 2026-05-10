import { supabase } from '@/lib/supabase'
import type { VenueStatus } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listing Dashboard',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{ status?: string; venue?: string }>
}

const STATUS_LABELS: Record<VenueStatus, { label: string; color: string; description: string }> = {
  pending_payment: {
    label: 'Pending Payment',
    color: 'bg-gray-800 text-gray-300 border-gray-700',
    description: 'Payment not yet received. Complete checkout to submit for review.',
  },
  pending_review: {
    label: 'Pending Review',
    color: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
    description: 'Payment received. Your listing is pending review. We typically review within 1–2 business days.',
  },
  active: {
    label: 'Active',
    color: 'bg-green-900/40 text-green-400 border-green-700/40',
    description: 'Your listing is live and visible to fans.',
  },
  rejected: {
    label: 'Not Approved',
    color: 'bg-red-900/40 text-red-400 border-red-700/40',
    description: 'Your listing was not approved. Contact us for more information.',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-orange-900/40 text-orange-400 border-orange-700/40',
    description: 'Your listing has been suspended. Contact us to resolve.',
  },
}

export default async function DashboardPage({ searchParams }: Props) {
  const { status: statusParam, venue: venueId } = await searchParams

  let venue = null
  let parties: { id: string; title: string; date: string; start_time: string | null; cover_charge: number | null }[] | null = null

  if (venueId) {
    const { data: v } = await supabase
      .from('venues')
      .select('id, name, address, city_slug, status, payment_status, paid_at, approved_at, description')
      .eq('id', venueId)
      .single()
    venue = v

    if (venue) {
      const { data: p } = await supabase
        .from('watch_parties')
        .select('id, title, date, start_time, cover_charge')
        .eq('venue_id', venueId)
      parties = p
    }
  }

  const isPendingReview = statusParam === 'pending_review' || venue?.status === 'pending_review'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-white mb-8">Listing Dashboard</h1>

      {/* Payment success notice */}
      {isPendingReview && (
        <div className="bg-green-900/20 border border-green-700/40 rounded-2xl p-5 mb-8 flex gap-3">
          <span className="text-2xl shrink-0">✅</span>
          <div>
            <p className="text-green-400 font-semibold">Payment received. Your listing is pending review.</p>
            <p className="text-green-400/70 text-sm mt-1">
              Listings are reviewed before publication to protect fans and venue owners. We typically respond within 1–2 business days.
            </p>
          </div>
        </div>
      )}

      {venue ? (
        <div className="space-y-6">
          {/* Status card */}
          {(() => {
            const info = STATUS_LABELS[venue.status as VenueStatus] ?? STATUS_LABELS.pending_payment
            return (
              <div className={`rounded-2xl border p-5 ${info.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{info.label}</span>
                </div>
                <p className="text-sm opacity-80">{info.description}</p>
              </div>
            )
          })()}

          {/* Venue details */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h2 className="text-white font-semibold text-lg mb-3">{venue.name}</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">📍 {venue.address}</p>
              <p className="text-gray-500">City: {venue.city_slug}</p>
              {venue.paid_at && (
                <p className="text-gray-500">
                  Payment received: {new Date(venue.paid_at).toLocaleDateString()}
                </p>
              )}
              {venue.approved_at && (
                <p className="text-gray-500">
                  Approved: {new Date(venue.approved_at).toLocaleDateString()}
                </p>
              )}
            </div>
            {venue.description && (
              <p className="text-gray-400 text-sm mt-3 pt-3 border-t border-gray-800">
                {venue.description}
              </p>
            )}
          </div>

          {/* Watch parties */}
          {parties && parties.length > 0 && (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4">Your Watch Parties</h3>
              <div className="space-y-3">
                {parties.map((party) => (
                  <div key={party.id} className="bg-gray-800 rounded-xl p-4">
                    <p className="text-white text-sm font-medium">{party.title}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {party.date}
                      {party.start_time && ` · Doors ${party.start_time}`}
                      {party.cover_charge ? ` · $${party.cover_charge} cover` : ' · Free entry'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-sm">
            <p className="text-gray-400 font-medium mb-1">Need to make changes or have a question?</p>
            <p className="text-gray-500">
              Email{' '}
              <a href="mailto:hello@fanforged.fans" className="text-yellow-400 hover:underline">
                hello@fanforged.fans
              </a>{' '}
              with your listing ID:{' '}
              <code className="bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded text-xs">
                {venueId?.slice(0, 8)}
              </code>
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-900 rounded-3xl border border-gray-800">
          <div className="text-5xl mb-4">🏟️</div>
          <h2 className="text-white font-bold text-xl mb-2">No listing found</h2>
          <p className="text-gray-400 mb-6 text-sm max-w-sm mx-auto">
            Access your dashboard via the link in your confirmation email, or{' '}
            <a href="mailto:hello@fanforged.fans" className="text-yellow-400 hover:underline">
              contact us
            </a>{' '}
            if you need help.
          </p>
        </div>
      )}
    </div>
  )
}
