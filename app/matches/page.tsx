import type { Metadata } from 'next'
import { getLiveScores } from '@/lib/fotmob'
import { CITIES } from '@/lib/cities'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '2026 FIFA World Cup Match Schedule & Live Scores',
  description: 'Full match schedule for the 2026 FIFA World Cup with live scores, match times, and host city information.',
}

// Representative opening-phase matches across all 16 host cities.
// Full draw not yet confirmed — teams shown are illustrative only.
const OPENING_MATCHES = [
  { id: '1',  date: '2026-06-11', time: '20:00', home: 'Mexico',      away: 'TBD', stage: 'Group Stage', city: 'mexico-city',   stadium: 'Estadio Azteca' },
  { id: '2',  date: '2026-06-12', time: '17:00', home: 'USA',         away: 'TBD', stage: 'Group Stage', city: 'los-angeles',   stadium: 'SoFi Stadium' },
  { id: '3',  date: '2026-06-13', time: '20:00', home: 'Canada',      away: 'TBD', stage: 'Group Stage', city: 'toronto',       stadium: 'BMO Field' },
  { id: '4',  date: '2026-06-14', time: '16:00', home: 'Brazil',      away: 'TBD', stage: 'Group Stage', city: 'miami',         stadium: 'Hard Rock Stadium' },
  { id: '5',  date: '2026-06-15', time: '19:00', home: 'Argentina',   away: 'TBD', stage: 'Group Stage', city: 'new-york',      stadium: 'MetLife Stadium' },
  { id: '6',  date: '2026-06-16', time: '20:00', home: 'Spain',       away: 'TBD', stage: 'Group Stage', city: 'guadalajara',   stadium: 'Estadio Akron' },
  { id: '7',  date: '2026-06-17', time: '17:00', home: 'France',      away: 'TBD', stage: 'Group Stage', city: 'vancouver',     stadium: 'BC Place' },
  { id: '8',  date: '2026-06-18', time: '20:00', home: 'England',     away: 'TBD', stage: 'Group Stage', city: 'monterrey',     stadium: 'Estadio BBVA' },
  { id: '9',  date: '2026-06-19', time: '17:00', home: 'Germany',     away: 'TBD', stage: 'Group Stage', city: 'dallas',        stadium: 'AT&T Stadium' },
  { id: '10', date: '2026-06-20', time: '20:00', home: 'Italy',       away: 'TBD', stage: 'Group Stage', city: 'atlanta',       stadium: 'Mercedes-Benz Stadium' },
  { id: '11', date: '2026-06-21', time: '17:00', home: 'Portugal',    away: 'TBD', stage: 'Group Stage', city: 'kansas-city',   stadium: 'Arrowhead Stadium' },
  { id: '12', date: '2026-06-22', time: '17:00', home: 'Netherlands', away: 'TBD', stage: 'Group Stage', city: 'seattle',       stadium: 'Lumen Field' },
  { id: '13', date: '2026-06-23', time: '20:00', home: 'Japan',       away: 'TBD', stage: 'Group Stage', city: 'houston',       stadium: 'NRG Stadium' },
  { id: '14', date: '2026-06-24', time: '20:00', home: 'Morocco',     away: 'TBD', stage: 'Group Stage', city: 'philadelphia',  stadium: 'Lincoln Financial Field' },
  { id: '15', date: '2026-06-25', time: '17:00', home: 'Colombia',    away: 'TBD', stage: 'Group Stage', city: 'boston',        stadium: 'Gillette Stadium' },
  { id: '16', date: '2026-06-26', time: '20:00', home: 'South Korea', away: 'TBD', stage: 'Group Stage', city: 'san-francisco', stadium: "Levi's Stadium" },
]

export default async function MatchesPage() {
  // Fetch live scores from FotMob
  let liveMatches: import('@/lib/fotmob').FotMobMatch[] = []
  try {
    const { matches } = await getLiveScores()
    liveMatches = matches
  } catch {
    // silently fail
  }

  const cityMap = Object.fromEntries(CITIES.map((c) => [c.slug, c]))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Match Schedule</h1>
        <p className="text-gray-400 mt-2">All 104 matches · June 11 – July 19, 2026</p>
        <p className="text-gray-600 text-xs mt-2">
          Host cities and stadiums are confirmed. Group-stage team assignments shown are illustrative — the official draw has not yet been completed.
        </p>
      </div>

      {/* Live scores strip */}
      {liveMatches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
            <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Live Now</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {liveMatches
              .filter((m) => m.status.started && !m.status.finished)
              .map((match) => (
                <div key={match.id} className="bg-green-900/20 border border-green-700/40 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-white font-medium">{match.home.name}</span>
                  <span className="text-white font-bold text-lg px-3">
                    {match.home.score ?? 0} – {match.away.score ?? 0}
                  </span>
                  <span className="text-white font-medium">{match.away.name}</span>
                  {match.status.liveTime && (
                    <span className="text-green-400 text-sm font-bold ml-2">{match.status.liveTime.short}′</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Schedule */}
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gray-800 px-5 py-3 flex items-center gap-2">
            <span className="text-white font-semibold text-sm">Group Stage — Opening Matches</span>
            <span className="text-gray-400 text-xs">June 11–30, 2026</span>
          </div>
          <div className="divide-y divide-gray-800">
            {OPENING_MATCHES.map((match) => {
              const city = cityMap[match.city]
              const matchDate = new Date(match.date + 'T' + match.time)
              return (
                <div key={match.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors">
                  <div className="w-24 shrink-0">
                    <p className="text-gray-400 text-xs">
                      {matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-gray-500 text-xs">{match.time} local</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-3">
                    <span className="text-white font-medium text-sm text-right flex-1">{match.home}</span>
                    <span className="text-gray-500 text-xs px-2 py-0.5 bg-gray-800 rounded">vs</span>
                    <span className="text-white font-medium text-sm text-left flex-1">{match.away}</span>
                  </div>
                  <div className="w-40 shrink-0 text-right">
                    {city && (
                      <Link
                        href={`/${match.city}/watch-parties`}
                        className="text-yellow-400 hover:text-yellow-300 text-xs transition-colors"
                      >
                        {city.flag} {city.name} →
                      </Link>
                    )}
                    <p className="text-gray-600 text-xs mt-0.5">{match.stage}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Placeholder cards for knockout rounds */}
        {[
          { label: 'Round of 32', dates: 'July 1–4, 2026', count: 16 },
          { label: 'Round of 16', dates: 'July 6–9, 2026', count: 8 },
          { label: 'Quarter-finals', dates: 'July 11–12, 2026', count: 4 },
          { label: 'Semi-finals', dates: 'July 14–15, 2026', count: 2 },
          { label: 'Final', dates: 'July 19, 2026 · MetLife Stadium', count: 1 },
        ].map((round) => (
          <div key={round.label} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="bg-gray-800 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">{round.label}</span>
                <span className="text-gray-400 text-xs">{round.dates}</span>
              </div>
              <span className="text-gray-500 text-xs">{round.count} match{round.count !== 1 ? 'es' : ''}</span>
            </div>
            <div className="px-5 py-6 text-center">
              <p className="text-gray-600 text-sm">Draw to be confirmed · Check back soon</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
