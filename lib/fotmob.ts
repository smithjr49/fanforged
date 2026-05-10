/**
 * FotMob scores integration — unofficial, no API key required.
 * Feature-flagged via LIVE_SCORES_ENABLED env var.
 * Treat as temporary: keep provider logic isolated here so it can be
 * swapped for a licensed sports data provider without touching UI code.
 */

export type FotMobTeam = {
  name: string
  shortName: string
  score?: number
}

export type FotMobMatch = {
  id: string
  home: FotMobTeam
  away: FotMobTeam
  status: {
    utcTime: string
    started: boolean
    finished: boolean
    cancelled: boolean
    liveTime?: { short: string; long: string }
  }
  leagueName: string
}

export type LiveScoresResponse = {
  matches: FotMobMatch[]
  lastUpdated: string
}

const EMPTY: LiveScoresResponse = { matches: [], lastUpdated: new Date().toISOString() }

function isEnabled(): boolean {
  return process.env.LIVE_SCORES_ENABLED === 'true'
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}

export async function getLiveScores(date?: Date): Promise<LiveScoresResponse> {
  if (!isEnabled()) return EMPTY

  const dateStr = formatDate(date ?? new Date())

  try {
    const res = await fetch(
      `https://www.fotmob.com/api/matches?date=${dateStr}`,
      {
        next: { revalidate: 60 },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }
    )

    if (!res.ok) throw new Error(`FotMob HTTP ${res.status}`)

    const data = await res.json()
    const worldCupMatches: FotMobMatch[] = []

    if (Array.isArray(data.leagues)) {
      for (const league of data.leagues) {
        const name: string = league.name ?? ''
        if (
          name.toLowerCase().includes('world cup') ||
          name.toLowerCase().includes('fifa')
        ) {
          const matches = (league.matches ?? []).map((m: Record<string, unknown>) => ({
            id: String(m.id),
            home: {
              name: (m.home as Record<string, unknown>)?.name ?? '',
              shortName: (m.home as Record<string, unknown>)?.shortName ?? '',
              score: (m.home as Record<string, unknown>)?.score,
            },
            away: {
              name: (m.away as Record<string, unknown>)?.name ?? '',
              shortName: (m.away as Record<string, unknown>)?.shortName ?? '',
              score: (m.away as Record<string, unknown>)?.score,
            },
            status: m.status as FotMobMatch['status'],
            leagueName: name,
          }))
          worldCupMatches.push(...matches)
        }
      }
    }

    return { matches: worldCupMatches, lastUpdated: new Date().toISOString() }
  } catch (err) {
    // Never let scores failures break page rendering
    console.warn('FotMob fetch failed (non-fatal):', err)
    return EMPTY
  }
}
