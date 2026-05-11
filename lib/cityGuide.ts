import fs from 'fs'
import path from 'path'

// ─── Shared city guide types ────────────────────────────────────────────────
// Keep in sync with app/[city]/page.tsx until that file is refactored to import from here.

export type HotelEntry = {
  name: string
  stars: number
  distance: string
  neighborhood: string
  best_for?: string
  affiliate_url?: string
  affiliate_label?: string
  affiliate_provider?: string
  sponsored_disclosure?: string
}

export type NeighborhoodEntry = {
  name: string
  best_for: string
  safety_transit_notes: string
  stadium_access?: string
  hotel_price_level?: string
  description: string
}

export type CityGuideData = {
  hero: { tagline: string; description: string }
  stadium: { name: string; capacity: number; address: string; transport: string }
  hotels: HotelEntry[]
  bars: { name: string; neighborhood: string; vibe: string; address: string }[]
  transport: { summary: string; tips: string[] }
  fan_zones: { name: string; location: string; capacity: number; description: string }[]
  quick_facts?: Record<string, string | number | string[]>
  weather?: { june?: string; july?: string; packing_tips?: string[] }
  airports?: { name: string; code: string; distance_to_stadium?: string; transfer_options?: string[]; notes?: string }[]
  match_schedule?: { match_number?: number; date: string; local_time?: string; round: string; teams_or_placeholder: string; stadium?: string }[]
  neighborhoods?: NeighborhoodEntry[]
  booking_links?: { provider: string; label: string; affiliate_url?: string }[]
  things_to_do?: { tourist_hits?: { name: string; notes?: string }[]; local_favorites?: { name: string; notes?: string }[] }
  food_nightlife?: { areas?: string[]; recommendations?: { name: string; type?: string; notes?: string }[] }
  fan_hubs?: { name: string; location: string; description: string }[]
  // allow extra keys without breaking
  [key: string]: unknown
}

/** Load a city guide JSON file. Returns null if not found. */
export function loadCityGuide(slug: string): CityGuideData | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'cities', `${slug}.json`)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as CityGuideData
  } catch {
    return null
  }
}
