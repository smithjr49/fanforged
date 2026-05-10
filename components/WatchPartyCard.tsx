import type { WatchParty } from '@/lib/supabase'

type Props = {
  party: WatchParty
}

export default function WatchPartyCard({ party }: Props) {
  const matchDate = new Date(party.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className={`bg-gray-900 rounded-2xl p-5 border ${party.featured ? 'border-yellow-400' : 'border-gray-800'} hover:border-gray-600 transition-colors`}>
      {party.featured && (
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">⭐ Featured</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base">{party.venue?.name ?? party.title}</h3>
          {party.venue?.address && (
            <p className="text-gray-400 text-sm mt-0.5">📍 {party.venue.address}</p>
          )}
        </div>
        {party.cover_charge != null && party.cover_charge > 0 && (
          <span className="bg-gray-800 text-gray-200 text-sm px-2 py-1 rounded-lg whitespace-nowrap">
            ${party.cover_charge}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
        <span>📅 {formattedDate}</span>
        {party.start_time && <span>🕐 {party.start_time}</span>}
        {party.capacity && <span>👥 {party.capacity} cap</span>}
      </div>

      {party.ticket_url && (
        <a
          href={party.ticket_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full text-center bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          Get Tickets
        </a>
      )}
    </div>
  )
}
