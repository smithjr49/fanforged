/**
 * Admin venue review page.
 * Protected server-side by ADMIN_SECRET cookie or query param.
 * Keep this route out of sitemap and robots.
 *
 * Access: /admin/venues?secret=YOUR_ADMIN_SECRET
 */

import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import AdminVenueActions from './AdminVenueActions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Venue Review',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{ secret?: string; status?: string }>
}

const STATUS_TABS = ['pending_review', 'active', 'rejected', 'suspended'] as const

export default async function AdminVenuesPage({ searchParams }: Props) {
  const { secret, status: statusParam } = await searchParams

  // Guard — compare against env var server-side
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    notFound()
  }

  const currentStatus = STATUS_TABS.includes(statusParam as typeof STATUS_TABS[number])
    ? (statusParam as typeof STATUS_TABS[number])
    : 'pending_review'

  const admin = supabaseAdmin()
  const { data: venues } = await admin
    .from('venues')
    .select('id, name, city_slug, address, contact_email, website_url, description, status, payment_status, paid_at, created_at')
    .eq('status', currentStatus)
    .order('paid_at', { ascending: true, nullsFirst: false })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Admin — Venue Review</h1>

      {/* Status tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {STATUS_TABS.map((s) => (
          <a
            key={s}
            href={`/admin/venues?secret=${secret}&status=${s}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              s === currentStatus
                ? 'bg-yellow-400 text-gray-950'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {s.replace('_', ' ')}
          </a>
        ))}
      </div>

      {!venues || venues.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
          <p className="text-gray-400">No venues with status &quot;{currentStatus}&quot;</p>
        </div>
      ) : (
        <div className="space-y-4">
          {venues.map((venue) => (
            <div key={venue.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{venue.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">📍 {venue.address}</p>
                  <p className="text-gray-400 text-sm">📧 {venue.contact_email}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    City: {venue.city_slug} ·{' '}
                    Payment: {venue.payment_status} ·{' '}
                    Paid: {venue.paid_at ? new Date(venue.paid_at).toLocaleDateString() : '—'} ·{' '}
                    Submitted: {new Date(venue.created_at).toLocaleDateString()}
                  </p>
                  {venue.website_url && (
                    <a
                      href={venue.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 text-xs hover:underline mt-1 inline-block"
                    >
                      {venue.website_url}
                    </a>
                  )}
                  {venue.description && (
                    <p className="text-gray-300 text-sm mt-2 italic">&quot;{venue.description}&quot;</p>
                  )}
                </div>

                {/* Action buttons — client component for fetch calls */}
                <AdminVenueActions
                  venueId={venue.id}
                  currentStatus={venue.status}
                  secret={secret!}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
