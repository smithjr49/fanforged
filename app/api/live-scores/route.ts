import { getLiveScores } from '@/lib/fotmob'
import { NextResponse } from 'next/server'

export async function GET() {
  // Scores are feature-flagged — returns empty if LIVE_SCORES_ENABLED != 'true'
  const data = await getLiveScores()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  })
}
