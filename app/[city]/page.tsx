import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCityBySlug, HOST_CITIES } from '@/lib/cities'
import NewsletterSignup from '@/components/NewsletterSignup'
import CityAlertSignup from '@/components/CityAlertSignup'
import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'

type HotelEntry = {
  name: string
  stars: number
  distance: string
  neighborhood: string
  best_for?: string
  affiliate_url?: string
  affiliate_label?: string      // e.g. "Check availability", "View hotel"
  affiliate_provider?: string   // e.g. "Booking.com", "Expedia"
  sponsored_disclosure?: string // per-hotel override; falls back to section disclosure
}

type NamedLink = {
  label?: string
  name?: string
  url?: string
}

type AirportEntry = {
  name: string
  code: string
  distance_to_stadium?: string
  transfer_options?: string[]
  notes?: string
}

type MatchEntry = {
  match_number?: number
  date: string
  local_time?: string
  round: string
  teams_or_placeholder: string
  stadium?: string
}

type NeighborhoodEntry = {
  name: string
  best_for: string
  safety_transit_notes: string
  stadium_access?: string
  hotel_price_level?: string
  description: string
}

type SoccerBarEntry = {
  name: string
  neighborhood: string
  vibe: string
  address: string
  transit?: string
  notes?: string
  website_url?: string
}

type SimplePlace = {
  name: string
  location?: string
  type?: string
  distance?: string
  difficulty?: string
  access_notes?: string
  skill_level?: string
  schedule_notes?: string
  notes?: string
  link?: string
}

type CityGuideData = {
  hero: { tagline: string; description: string }
  stadium: { name: string; capacity: number; address: string; transport: string }
  hotels: HotelEntry[]
  bars: SoccerBarEntry[]
  transport: { summary: string; tips: string[] }
  fan_zones: { name: string; location: string; capacity: number; description: string }[]
  quick_facts?: Record<string, string | number | string[]>
  weather?: {
    june?: string
    july?: string
    packing_tips?: string[]
  }
  airports?: AirportEntry[]
  match_schedule?: MatchEntry[]
  stadium_transport?: {
    public_transit?: string[]
    rideshare?: string[]
    driving_parking?: string[]
    walking_biking?: string[]
    match_day_tips?: string[]
  }
  fan_hubs?: {
    name: string
    location: string
    status?: 'confirmed' | 'expected' | 'local_watch_area'
    description: string
    transport_tips?: string[]
  }[]
  neighborhoods?: NeighborhoodEntry[]
  booking_links?: {
    provider: string
    label: string
    affiliate_url?: string
  }[]
  soccer_culture?: {
    local_clubs?: string[]
    supporter_groups?: string[]
    historic_venues?: string[]
    community_notes?: string
  }
  things_to_do?: {
    tourist_hits?: SimplePlace[]
    local_favorites?: SimplePlace[]
  }
  food_nightlife?: {
    areas?: string[]
    recommendations?: SimplePlace[]
  }
  local_resources?: {
    tourism_links?: NamedLink[]
    transit_apps?: NamedLink[]
    local_blogs?: NamedLink[]
    emergency_info?: string
  }
  walk_bike?: {
    walkability_summary?: string
    bikeability_summary?: string
    best_walkable_areas?: string[]
    bike_share_notes?: string
    useful_links?: NamedLink[]
  }
  pickup_soccer?: SimplePlace[]
  outdoors_day_trips?: SimplePlace[]
  safety_tips?: string[]
  travel_connections?: {
    to_toronto?: string[]
    to_new_york?: string[]
    notes?: string
  }
}

function loadCityGuide(slug: string): CityGuideData | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'cities', `${slug}.json`)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  // Only generate pages for cities that have a JSON guide file.
  // Fan hub cities without guide files will 404 gracefully at runtime.
  const dataDir = path.join(process.cwd(), 'data', 'cities')
  const slugsWithGuides = HOST_CITIES.map((c) => c.slug).filter((slug) => {
    try { fs.accessSync(path.join(dataDir, `${slug}.json`)); return true } catch { return false }
  })
  // Include any fan hub that has a guide file (e.g. montreal)
  const extraSlugs = ['montreal'].filter((slug) => {
    try { fs.accessSync(path.join(dataDir, `${slug}.json`)); return true } catch { return false }
  })
  return [...slugsWithGuides, ...extraSlugs].map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return {}
  const guide = loadCityGuide(slug)

  const stadiumText = city.stadium ? `${city.stadium}` : 'the tournament stadium'
  const tagline = guide?.hero?.tagline ?? ''
  const neighborhoods = guide?.neighborhoods?.slice(0, 3).map((n) => n.name).join(', ')

  const title = `${city.name} World Cup 2026 Guide — Hotels, Bars & Stadium Transit`
  const description = tagline
    ? `${tagline}. Independent ${city.name} 2026 travel guide: hotels near ${stadiumText}, stadium transport${neighborhoods ? `, best neighborhoods (${neighborhoods})` : ''}, sports bars, fan hubs, and local tips.`
    : `Complete ${city.name} 2026 World Cup travel guide. Hotels near ${stadiumText}, match-day transit, fan hubs, sports bars, and everything you need to know before you go.`

  const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://fanforged.fans'

  return {
    title,
    description,
    keywords: [
      `${city.name} World Cup 2026`,
      `${city.name} 2026 travel guide`,
      `${city.stadium ?? city.name} stadium guide`,
      `${city.name} watch party 2026`,
      `${city.name} soccer bars`,
      `World Cup 2026 ${city.country}`,
    ],
    alternates: { canonical: `${BASE}/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/${slug}`,
      type: 'article',
      siteName: 'FanForged',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

const vibeColors: Record<string, string> = {
  rowdy: 'bg-red-900/40 text-red-300',
  family: 'bg-green-900/40 text-green-300',
  rooftop: 'bg-sky-900/40 text-sky-300',
  pub: 'bg-amber-900/40 text-amber-300',
  outdoor: 'bg-teal-900/40 text-teal-300',
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      {children}
    </section>
  )
}

function BulletList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-gray-400">
          <span className="text-yellow-400 shrink-0">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function MaybeLink({ item }: { item: NamedLink }) {
  const text = item.label ?? item.name ?? item.url
  if (!text) return null
  return item.url ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-yellow-400 hover:text-yellow-300 transition-colors"
    >
      {text}
    </a>
  ) : (
    <span>{text}</span>
  )
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const guide = loadCityGuide(slug)
  if (!guide) notFound()

  const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://fanforged.fans'

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: `${city.name} — World Cup 2026 Travel Guide`,
    description: guide.hero.description,
    url: `${BASE}/${slug}`,
    touristType: 'Sports fans',
    includesAttraction: [
      ...(guide.fan_hubs ?? guide.fan_zones ?? []).map((hub) => ({
        '@type': 'TouristAttraction',
        name: hub.name,
        description: hub.description,
        address: hub.location,
      })),
      {
        '@type': 'StadiumOrArena',
        name: guide.stadium.name,
        address: guide.stadium.address,
        maximumAttendeeCapacity: guide.stadium.capacity,
      },
    ],
    containsPlace: guide.neighborhoods?.map((n) => ({
      '@type': 'Neighborhood',
      name: n.name,
      description: n.description,
    })),
  }

  const navItems = [
    ['overview', 'Overview'],
    ['matches', 'Matches'],
    ['airports', 'Airports'],
    ['stadium', 'Stadium'],
    ['stay', 'Where to Stay'],
    ['bars', 'Bars'],
    ['food', 'Food & Nightlife'],
    ['things-to-do', 'Things To Do'],
    ['local-resources', 'Resources'],
  ].filter(([id]) => {
    if (id === 'matches') return Boolean(guide.match_schedule?.length)
    if (id === 'airports') return Boolean(guide.airports?.length)
    if (id === 'food') return Boolean(guide.food_nightlife)
    if (id === 'things-to-do') return Boolean(guide.things_to_do)
    if (id === 'local-resources') return Boolean(guide.local_resources)
    return true
  })

  // Quick stats for the hero bar
  const quickStats = [
    city.stadium && { label: 'Stadium', value: city.stadium },
    guide.stadium.capacity && { label: 'Capacity', value: guide.stadium.capacity.toLocaleString() },
    guide.quick_facts?.timezone && { label: 'Timezone', value: guide.quick_facts.timezone as string },
    guide.quick_facts?.airport_codes && {
      label: 'Airport',
      value: (guide.quick_facts.airport_codes as string[]).join(' / '),
    },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-3 sm:mb-6 flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span>›</span>
        <Link href="/#cities" className="hover:text-gray-300 transition-colors">City Guides</Link>
        <span>›</span>
        <span className="text-gray-300">{city.name}</span>
      </nav>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${city.heroColor} rounded-2xl p-4 sm:p-10 mb-4 sm:mb-6 relative overflow-hidden`}>
        <div className="absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 text-[120px] sm:text-[180px] opacity-10 select-none pointer-events-none">⚽</div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <span className="text-2xl sm:text-4xl">{city.flag}</span>
            <span className="text-white/60 text-[10px] sm:text-xs uppercase tracking-widest font-semibold">{city.country} · World Cup 2026</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">{city.name}</h1>
          <p className="text-white/80 text-sm sm:text-lg font-medium mb-1 sm:mb-3">{guide.hero.tagline}</p>
          {/* Description: visible on desktop, hidden on mobile to reduce scroll */}
          <p className="hidden sm:block text-white/60 max-w-2xl text-sm sm:text-base leading-relaxed">{guide.hero.description}</p>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-7">
            <Link
              href={`/${slug}/watch-parties`}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-colors text-xs sm:text-sm border border-white/20"
            >
              Watch Parties →
            </Link>
            <Link
              href="#stadium"
              className="bg-white/10 hover:bg-white/20 text-white/80 font-medium px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-colors text-xs sm:text-sm border border-white/10"
            >
              Stadium Info
            </Link>
          </div>
        </div>
      </div>

      {/* Quick stats — compact chips row */}
      {quickStats.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-5">
          {quickStats.map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-lg border border-gray-800 px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-500">{stat.label}:</span>
              <span className="text-xs font-semibold text-white truncate max-w-[140px]">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sticky section nav */}
      <div className="sticky top-0 z-20 -mx-4 sm:mx-0 mb-5 sm:mb-8 bg-gray-950/95 backdrop-blur sm:bg-transparent sm:backdrop-blur-none sm:static sm:z-auto border-b border-gray-800 sm:border-0">
        <nav className="sm:rounded-2xl sm:border sm:border-gray-800 sm:bg-gray-900/70 sm:p-2.5 px-4 sm:px-0">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide py-2.5 sm:py-0">
            {navItems.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="shrink-0 rounded-lg bg-gray-800/80 sm:bg-gray-800 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {(guide.quick_facts || guide.weather) && (
            <Section id="overview" title="Quick Overview">
              <div className="grid gap-4 sm:grid-cols-2">
                {guide.quick_facts && Object.entries(guide.quick_facts).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500">{key.replace(/_/g, ' ')}</p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </p>
                  </div>
                ))}
                {guide.weather && (
                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Weather and packing</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {guide.weather.june && <p className="text-sm text-gray-300">June: {guide.weather.june}</p>}
                      {guide.weather.july && <p className="text-sm text-gray-300">July: {guide.weather.july}</p>}
                    </div>
                    <div className="mt-4">
                      <BulletList items={guide.weather.packing_tips} />
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {guide.match_schedule && guide.match_schedule.length > 0 && (
            <Section id="matches" title="Match Schedule">
              <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
                <div className="divide-y divide-gray-800">
                  {guide.match_schedule.map((match) => (
                    <div key={`${match.match_number ?? match.date}-${match.round}`} className="grid gap-3 p-4 sm:grid-cols-[120px_1fr_130px] sm:items-center">
                      <div>
                        <p className="text-sm font-semibold text-white">{match.date}</p>
                        {match.local_time && <p className="text-xs text-gray-500">{match.local_time}</p>}
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">{match.teams_or_placeholder}</p>
                        <p className="text-xs text-gray-500">{match.stadium ?? guide.stadium.name}</p>
                      </div>
                      <p className="text-xs font-medium uppercase tracking-wider text-yellow-400">{match.round}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {guide.airports && guide.airports.length > 0 && (
            <Section id="airports" title="Airports & Arrival">
              <div className="grid gap-3">
                {guide.airports.map((airport) => (
                  <div key={airport.code} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{airport.name}</h3>
                      <span className="rounded bg-gray-800 px-2 py-1 text-xs font-bold text-yellow-400">{airport.code}</span>
                    </div>
                    {airport.distance_to_stadium && <p className="mt-1 text-sm text-gray-500">{airport.distance_to_stadium}</p>}
                    {airport.notes && <p className="mt-3 text-sm text-gray-300">{airport.notes}</p>}
                    <div className="mt-4">
                      <BulletList items={airport.transfer_options} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Stadium */}
          <Section id="stadium" title="Stadium & Match-Day Transit">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold text-lg">{guide.stadium.name}</h3>
              <p className="text-gray-400 text-sm mt-1">📍 {guide.stadium.address}</p>
              <p className="text-gray-400 text-sm mt-1">
                👥 Capacity: {guide.stadium.capacity.toLocaleString()}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-gray-300 text-sm font-medium mb-1">Getting There</p>
                <p className="text-gray-400 text-sm">{guide.stadium.transport}</p>
              </div>
              {guide.stadium_transport && (
                <div className="mt-6 grid gap-5 border-t border-gray-800 pt-5 sm:grid-cols-2">
                  {[
                    { label: 'Public transit', items: guide.stadium_transport.public_transit },
                    { label: 'Rideshare', items: guide.stadium_transport.rideshare },
                    { label: 'Driving and parking', items: guide.stadium_transport.driving_parking },
                    { label: 'Walking and biking', items: guide.stadium_transport.walking_biking },
                    { label: 'Match-day tips', items: guide.stadium_transport.match_day_tips },
                  ].map(({ label, items }) => Array.isArray(items) && items.length > 0 ? (
                    <div key={label}>
                      <p className="mb-2 text-sm font-semibold text-gray-300">{label}</p>
                      <BulletList items={items} />
                    </div>
                  ) : null)}
                </div>
              )}
            </div>
          </Section>

          {guide.neighborhoods && guide.neighborhoods.length > 0 && (
            <Section id="stay" title="Where To Stay">
              <div className="grid gap-3">
                {guide.neighborhoods.map((neighborhood) => (
                  <div key={neighborhood.name} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-white">{neighborhood.name}</h3>
                      {neighborhood.hotel_price_level && (
                        <span className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-300">{neighborhood.hotel_price_level}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-300">{neighborhood.description}</p>
                    <div className="mt-3 grid gap-2 text-xs text-gray-500 sm:grid-cols-3">
                      <p><span className="text-gray-400">Best for:</span> {neighborhood.best_for}</p>
                      <p><span className="text-gray-400">Transit:</span> {neighborhood.safety_transit_notes}</p>
                      {neighborhood.stadium_access && <p><span className="text-gray-400">Stadium:</span> {neighborhood.stadium_access}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Best Bars */}
          <Section id="bars" title="Sports Bars & Watch Spots">
            <div className="grid sm:grid-cols-2 gap-3">
              {guide.bars.map((bar, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-white font-medium">{bar.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${vibeColors[bar.vibe] ?? 'bg-gray-800 text-gray-400'}`}>
                      {bar.vibe}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">📍 {bar.address}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{bar.neighborhood}</p>
                  {bar.transit && <p className="mt-2 text-xs text-gray-500">Transit: {bar.transit}</p>}
                  {bar.notes && <p className="mt-2 text-sm text-gray-300">{bar.notes}</p>}
                  {bar.website_url && (
                    <a href={bar.website_url} target="_blank" rel="noopener noreferrer" className="mt-3 block text-xs font-semibold text-yellow-400 hover:text-yellow-300">
                      Visit site →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Fan Zones */}
          <Section id="fan-hubs" title="Fan Hubs">
            <div className="space-y-3">
              {(guide.fan_hubs ?? guide.fan_zones).map((zone, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                  <h4 className="text-white font-semibold">{zone.name}</h4>
                  <p className="text-gray-400 text-sm mt-1">📍 {zone.location}</p>
                  {'capacity' in zone && zone.capacity > 0 && (
                    <p className="text-gray-500 text-sm">👥 Up to {zone.capacity.toLocaleString()} fans</p>
                  )}
                  {'status' in zone && zone.status && (
                    <p className="mt-1 text-xs uppercase tracking-wider text-yellow-400">{zone.status.replace(/_/g, ' ')}</p>
                  )}
                  <p className="text-gray-300 text-sm mt-2">{zone.description}</p>
                  {'transport_tips' in zone && <div className="mt-4"><BulletList items={zone.transport_tips} /></div>}
                </div>
              ))}
            </div>
          </Section>

          {guide.soccer_culture && (
            <Section id="soccer-culture" title="Local Soccer Culture">
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                {guide.soccer_culture.community_notes && <p className="mb-5 text-sm text-gray-300">{guide.soccer_culture.community_notes}</p>}
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-white">Clubs</p>
                    <BulletList items={guide.soccer_culture.local_clubs} />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold text-white">Supporters</p>
                    <BulletList items={guide.soccer_culture.supporter_groups} />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold text-white">Venues</p>
                    <BulletList items={guide.soccer_culture.historic_venues} />
                  </div>
                </div>
              </div>
            </Section>
          )}

          {guide.things_to_do && (
            <Section id="things-to-do" title="Tourist Hits & Local Favorites">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Tourist hits', places: guide.things_to_do.tourist_hits },
                  { label: 'Local favorites', places: guide.things_to_do.local_favorites },
                ].map(({ label, places }) => Array.isArray(places) && places.length > 0 ? (
                  <div key={label} className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                    <h3 className="mb-3 font-semibold text-white">{label}</h3>
                    <div className="space-y-3">
                      {places.map((place) => (
                        <div key={place.name}>
                          <p className="text-sm font-medium text-gray-200">{place.name}</p>
                          {place.notes && <p className="mt-1 text-xs text-gray-500">{place.notes}</p>}
                          {place.link && <a href={place.link} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs text-yellow-400">Learn more →</a>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null)}
              </div>
            </Section>
          )}

          {guide.pickup_soccer && guide.pickup_soccer.length > 0 && (
            <Section id="pickup-soccer" title="Pickup Soccer">
              <div className="grid gap-3 sm:grid-cols-2">
                {guide.pickup_soccer.map((place) => (
                  <div key={place.name} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <p className="font-semibold text-white">{place.name}</p>
                    {place.location && <p className="mt-1 text-sm text-gray-500">{place.location}</p>}
                    {place.access_notes && <p className="mt-2 text-sm text-gray-300">{place.access_notes}</p>}
                    {place.schedule_notes && <p className="mt-2 text-xs text-gray-500">{place.schedule_notes}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {guide.outdoors_day_trips && guide.outdoors_day_trips.length > 0 && (
            <Section id="outdoors" title="Outdoors & Day Trips">
              <div className="grid gap-3 sm:grid-cols-2">
                {guide.outdoors_day_trips.map((place) => (
                  <div key={place.name} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <p className="font-semibold text-white">{place.name}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {[place.type, place.distance, place.difficulty].filter(Boolean).join(' · ')}
                    </p>
                    {place.notes && <p className="mt-2 text-sm text-gray-300">{place.notes}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {guide.food_nightlife && (
            <Section id="food" title="Food & Nightlife">
              {guide.food_nightlife.areas && guide.food_nightlife.areas.length > 0 && (
                <div className="mb-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
                  <p className="text-sm font-semibold text-gray-300 mb-3">Best areas to eat and drink</p>
                  <ul className="space-y-2">
                    {guide.food_nightlife.areas.map((area, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-400">
                        <span className="text-yellow-400 shrink-0">→</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {guide.food_nightlife.recommendations && guide.food_nightlife.recommendations.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {guide.food_nightlife.recommendations.map((rec) => (
                    <div key={rec.name} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                      <p className="font-semibold text-white text-sm">{rec.name}</p>
                      {rec.notes && <p className="mt-1 text-xs text-gray-400">{rec.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {guide.travel_connections && (
            <Section id="connections" title="Getting Here from Other Cities">
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-5">
                {guide.travel_connections.notes && (
                  <p className="text-sm text-gray-300">{guide.travel_connections.notes}</p>
                )}
                {guide.travel_connections.to_toronto && guide.travel_connections.to_toronto.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-200 mb-2">From Montréal → Toronto</p>
                    <BulletList items={guide.travel_connections.to_toronto} />
                  </div>
                )}
                {guide.travel_connections.to_new_york && guide.travel_connections.to_new_york.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-200 mb-2">From Montréal → New York</p>
                    <BulletList items={guide.travel_connections.to_new_york} />
                  </div>
                )}
              </div>
            </Section>
          )}
        </div>

        <div className="space-y-8">
          {/* Hotels */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">🏨 Hotels</h2>
            <p className="text-gray-600 text-xs mb-3">
              Some travel links may earn us a small commission at no extra cost to you.
            </p>
            <div className="space-y-3">
              {guide.hotels.map((hotel, i) => {
                const cta = hotel.affiliate_label ?? 'Check availability'
                const inner = (
                  <>
                    <div className="flex items-start justify-between">
                      <h4 className="text-white font-medium text-sm group-hover:text-yellow-400 transition-colors">
                        {hotel.name}
                      </h4>
                      <span className="text-yellow-400 text-xs shrink-0 ml-2">
                        {'★'.repeat(hotel.stars)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{hotel.neighborhood} · {hotel.distance}</p>
                    {hotel.best_for && <p className="text-gray-400 text-xs mt-1">Best for {hotel.best_for}</p>}
                    {hotel.affiliate_url && (
                      <span className="text-yellow-400 text-xs mt-2 block">{cta} →</span>
                    )}
                  </>
                )
                return hotel.affiliate_url ? (
                  <a
                    key={i}
                    href={hotel.affiliate_url}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="block bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-yellow-400/50 transition-colors group"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    {inner}
                  </div>
                )
              })}
            </div>
            {guide.booking_links && guide.booking_links.length > 0 && (
              <div className="mt-4 grid gap-2">
                {guide.booking_links.map((link) => link.affiliate_url ? (
                  <a
                    key={link.provider}
                    href={link.affiliate_url}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-sm font-semibold text-yellow-400 hover:border-yellow-400/50"
                  >
                    {link.label}
                  </a>
                ) : null)}
              </div>
            )}
          </section>

          {/* Transport */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">🚇 Getting Around</h2>
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <p className="text-gray-300 text-sm mb-4">{guide.transport.summary}</p>
              <ul className="space-y-2">
                {guide.transport.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400 shrink-0">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {guide.local_resources && (
            <section id="local-resources">
              <h2 className="text-xl font-bold text-white mb-4">Useful Local Resources</h2>
              <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-5">
                {[
                  { label: 'Tourism', links: guide.local_resources.tourism_links },
                  { label: 'Transit apps', links: guide.local_resources.transit_apps },
                  { label: 'Local blogs', links: guide.local_resources.local_blogs },
                ].map(({ label, links }) => Array.isArray(links) && links.length > 0 ? (
                  <div key={label}>
                    <p className="mb-2 text-sm font-semibold text-gray-300">{label}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {links.map((item) => (
                        <span key={(item.label ?? item.name ?? item.url) as string} className="rounded bg-gray-800 px-2 py-1">
                          <MaybeLink item={item} />
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null)}
                {guide.local_resources.emergency_info && (
                  <p className="border-t border-gray-800 pt-4 text-xs text-gray-500">{guide.local_resources.emergency_info}</p>
                )}
              </div>
            </section>
          )}

          {guide.walk_bike && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Walk & Bike Notes</h2>
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                {guide.walk_bike.walkability_summary && <p className="text-sm text-gray-300">{guide.walk_bike.walkability_summary}</p>}
                {guide.walk_bike.bikeability_summary && <p className="mt-2 text-sm text-gray-300">{guide.walk_bike.bikeability_summary}</p>}
                <div className="mt-4">
                  <BulletList items={guide.walk_bike.best_walkable_areas} />
                </div>
                {guide.walk_bike.bike_share_notes && <p className="mt-4 text-xs text-gray-500">{guide.walk_bike.bike_share_notes}</p>}
              </div>
            </section>
          )}

          {guide.safety_tips && guide.safety_tips.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Safety & Match-Day Tips</h2>
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <BulletList items={guide.safety_tips} />
              </div>
            </section>
          )}

          {/* ── Plan Your Trip module ── */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
            <h3 className="text-white font-bold text-base sm:text-lg mb-1">🗺️ Plan Your Trip to {city.name}</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-4">Hotels, flights, transfers, and experiences — all in one place.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <Link
                href={`/hotels/${slug}`}
                className="group bg-gray-900 border border-gray-800 hover:border-yellow-400/50 rounded-xl p-3 text-center transition-all"
              >
                <div className="text-xl mb-1">🏨</div>
                <p className="text-white text-xs font-semibold group-hover:text-yellow-400 transition-colors">Hotels</p>
                <p className="text-gray-600 text-[10px] mt-0.5">Best areas to stay</p>
              </Link>
              <Link
                href="/premium-travel"
                className="group bg-gray-900 border border-gray-800 hover:border-yellow-400/50 rounded-xl p-3 text-center transition-all"
              >
                <div className="text-xl mb-1">🎟️</div>
                <p className="text-white text-xs font-semibold group-hover:text-yellow-400 transition-colors">Experiences</p>
                <p className="text-gray-600 text-[10px] mt-0.5">Tours & activities</p>
              </Link>
              <Link
                href="/premium-travel"
                className="group bg-gray-900 border border-gray-800 hover:border-yellow-400/50 rounded-xl p-3 text-center transition-all"
              >
                <div className="text-xl mb-1">🚖</div>
                <p className="text-white text-xs font-semibold group-hover:text-yellow-400 transition-colors">Transfers</p>
                <p className="text-gray-600 text-[10px] mt-0.5">Airport & stadium</p>
              </Link>
              <Link
                href={`/${slug}/watch-parties`}
                className="group bg-gray-900 border border-gray-800 hover:border-yellow-400/50 rounded-xl p-3 text-center transition-all"
              >
                <div className="text-xl mb-1">🍺</div>
                <p className="text-white text-xs font-semibold group-hover:text-yellow-400 transition-colors">Watch Parties</p>
                <p className="text-gray-600 text-[10px] mt-0.5">Where fans watch</p>
              </Link>
            </div>
          </div>

          {/* City alert email capture */}
          <CityAlertSignup defaultCity={slug} />

          {/* Venue CTA */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-5">
            <h3 className="text-gray-950 font-bold text-base">Own or manage a venue here?</h3>
            <p className="text-gray-900/70 text-sm mt-1 mb-4">
              List your {city.name} watch party for $39 and get in front of fans planning their trip.
            </p>
            <Link
              href="/list-your-venue"
              className="block text-center bg-gray-950 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors"
            >
              List Your Venue — $39
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
