'use client'

import { useEffect, useState } from 'react'
import type { FotMobMatch } from '@/lib/fotmob'

type Props = {
  initialMatches?: FotMobMatch[]
}

function MatchScore({ match }: { match: FotMobMatch }) {
  const isLive = match.status.started && !match.status.finished
  const isFinished = match.status.finished
  const upcoming = !match.status.started

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${isLive ? 'bg-green-900/30 border border-green-700/40' : 'bg-gray-800/50'} min-w-[220px]`}>
      <div className="flex-1 text-right">
        <span className="text-white text-sm font-medium">{match.home.shortName || match.home.name}</span>
      </div>

      <div className="flex flex-col items-center min-w-[60px]">
        {upcoming ? (
          <span className="text-gray-400 text-xs">
            {new Date(match.status.utcTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        ) : (
          <span className="text-white font-bold text-base">
            {match.home.score ?? 0} – {match.away.score ?? 0}
          </span>
        )}
        {isLive && match.status.liveTime && (
          <span className="text-green-400 text-xs font-semibold animate-pulse">
            {match.status.liveTime.short}′
          </span>
        )}
        {isFinished && <span className="text-gray-500 text-xs">FT</span>}
      </div>

      <div className="flex-1 text-left">
        <span className="text-white text-sm font-medium">{match.away.shortName || match.away.name}</span>
      </div>
    </div>
  )
}

export default function LiveScores({ initialMatches = [] }: Props) {
  const [matches, setMatches] = useState<FotMobMatch[]>(initialMatches)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const fetchScores = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/live-scores')
      const data = await res.json()
      if (data.matches) {
        setMatches(data.matches)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    } catch (err) {
      console.error('Failed to fetch scores:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchScores, 60_000)
    return () => clearInterval(interval)
  }, [])

  if (matches.length === 0) return null

  const liveMatches = matches.filter((m) => m.status.started && !m.status.finished)
  const todayMatches = matches.filter((m) => !m.status.started || m.status.finished)

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {liveMatches.length > 0 && (
            <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold uppercase tracking-wider shrink-0">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping inline-block" />
              Live
            </span>
          )}
          {liveMatches.length === 0 && (
            <span className="text-gray-500 text-xs shrink-0">Today&apos;s Matches</span>
          )}

          {[...liveMatches, ...todayMatches].map((match) => (
            <MatchScore key={match.id} match={match} />
          ))}

          {lastUpdated && (
            <span className="text-gray-600 text-xs shrink-0 ml-2">
              {loading ? 'Updating…' : `Updated ${lastUpdated}`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
