export type CityKind = 'host' | 'fan_hub'

export type CityMeta = {
  slug: string
  name: string           // display name e.g. "New York / New Jersey"
  country: 'USA' | 'Canada' | 'Mexico'
  flag: string
  stadium: string | null
  timezone: string
  heroColor: string      // Tailwind gradient
  kind: CityKind
}

// ─── Host cities (all 16 official tournament venues) ──────────
// Source: FIFA / wikipedia.org/wiki/2026_FIFA_World_Cup
// USA: 11 cities | Canada: 2 cities | Mexico: 3 cities
export const HOST_CITIES: CityMeta[] = [
  // USA (11)
  {
    slug: 'new-york',
    name: 'New York / New Jersey',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'MetLife Stadium',
    timezone: 'America/New_York',
    heroColor: 'from-blue-900 to-blue-700',
    kind: 'host',
  },
  {
    slug: 'los-angeles',
    name: 'Los Angeles',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'SoFi Stadium',
    timezone: 'America/Los_Angeles',
    heroColor: 'from-yellow-700 to-orange-600',
    kind: 'host',
  },
  {
    slug: 'dallas',
    name: 'Dallas',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'AT&T Stadium',
    timezone: 'America/Chicago',
    heroColor: 'from-blue-900 to-gray-700',
    kind: 'host',
  },
  {
    slug: 'atlanta',
    name: 'Atlanta',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'Mercedes-Benz Stadium',
    timezone: 'America/New_York',
    heroColor: 'from-red-900 to-gray-800',
    kind: 'host',
  },
  {
    slug: 'kansas-city',
    name: 'Kansas City',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'Arrowhead Stadium',
    timezone: 'America/Chicago',
    heroColor: 'from-red-700 to-yellow-600',
    kind: 'host',
  },
  {
    slug: 'houston',
    name: 'Houston',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'NRG Stadium',
    timezone: 'America/Chicago',
    heroColor: 'from-red-900 to-blue-800',
    kind: 'host',
  },
  {
    slug: 'san-francisco',
    name: 'San Francisco Bay Area',
    country: 'USA',
    flag: '🇺🇸',
    stadium: "Levi's Stadium",
    timezone: 'America/Los_Angeles',
    heroColor: 'from-red-800 to-yellow-600',
    kind: 'host',
  },
  {
    slug: 'philadelphia',
    name: 'Philadelphia',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'Lincoln Financial Field',
    timezone: 'America/New_York',
    heroColor: 'from-green-800 to-gray-700',
    kind: 'host',
  },
  {
    slug: 'seattle',
    name: 'Seattle',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'Lumen Field',
    timezone: 'America/Los_Angeles',
    heroColor: 'from-green-800 to-blue-700',
    kind: 'host',
  },
  {
    slug: 'boston',
    name: 'Boston',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'Gillette Stadium',
    timezone: 'America/New_York',
    heroColor: 'from-red-800 to-blue-700',
    kind: 'host',
  },
  {
    slug: 'miami',
    name: 'Miami',
    country: 'USA',
    flag: '🇺🇸',
    stadium: 'Hard Rock Stadium',
    timezone: 'America/New_York',
    heroColor: 'from-pink-600 to-cyan-500',
    kind: 'host',
  },
  // Canada (2)
  {
    slug: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    stadium: 'BMO Field',
    timezone: 'America/Toronto',
    heroColor: 'from-red-700 to-red-500',
    kind: 'host',
  },
  {
    slug: 'vancouver',
    name: 'Vancouver',
    country: 'Canada',
    flag: '🇨🇦',
    stadium: 'BC Place',
    timezone: 'America/Vancouver',
    heroColor: 'from-green-800 to-teal-600',
    kind: 'host',
  },
  // Mexico (3)
  {
    slug: 'mexico-city',
    name: 'Mexico City',
    country: 'Mexico',
    flag: '🇲🇽',
    stadium: 'Estadio Azteca',
    timezone: 'America/Mexico_City',
    heroColor: 'from-green-700 to-red-600',
    kind: 'host',
  },
  {
    slug: 'guadalajara',
    name: 'Guadalajara',
    country: 'Mexico',
    flag: '🇲🇽',
    stadium: 'Estadio Akron',
    timezone: 'America/Mexico_City',
    heroColor: 'from-blue-700 to-yellow-500',
    kind: 'host',
  },
  {
    slug: 'monterrey',
    name: 'Monterrey',
    country: 'Mexico',
    flag: '🇲🇽',
    stadium: 'Estadio BBVA',
    timezone: 'America/Monterrey',
    heroColor: 'from-sky-700 to-blue-500',
    kind: 'host',
  },
]

// ─── Fan hubs (major cities with watch-party demand, not hosting) ──
// NOTE: Montréal is a fan hub — it is NOT an official tournament host.
// Houston, Seattle, and Boston are host cities (see above).
export const FAN_HUB_CITIES: CityMeta[] = [
  // Canada
  {
    slug: 'montreal',
    name: 'Montréal',
    country: 'Canada',
    flag: '🇨🇦',
    stadium: null,
    timezone: 'America/Toronto',
    heroColor: 'from-blue-800 to-indigo-600',
    kind: 'fan_hub',
  },
  {
    slug: 'calgary',
    name: 'Calgary',
    country: 'Canada',
    flag: '🇨🇦',
    stadium: null,
    timezone: 'America/Edmonton',
    heroColor: 'from-red-800 to-red-600',
    kind: 'fan_hub',
  },
  {
    slug: 'ottawa',
    name: 'Ottawa',
    country: 'Canada',
    flag: '🇨🇦',
    stadium: null,
    timezone: 'America/Toronto',
    heroColor: 'from-red-700 to-orange-500',
    kind: 'fan_hub',
  },
  {
    slug: 'edmonton',
    name: 'Edmonton',
    country: 'Canada',
    flag: '🇨🇦',
    stadium: null,
    timezone: 'America/Edmonton',
    heroColor: 'from-blue-700 to-blue-500',
    kind: 'fan_hub',
  },
  // USA
  {
    slug: 'chicago',
    name: 'Chicago',
    country: 'USA',
    flag: '🇺🇸',
    stadium: null,
    timezone: 'America/Chicago',
    heroColor: 'from-blue-900 to-red-700',
    kind: 'fan_hub',
  },
  {
    slug: 'washington-dc',
    name: 'Washington DC',
    country: 'USA',
    flag: '🇺🇸',
    stadium: null,
    timezone: 'America/New_York',
    heroColor: 'from-red-800 to-blue-900',
    kind: 'fan_hub',
  },
  {
    slug: 'phoenix',
    name: 'Phoenix',
    country: 'USA',
    flag: '🇺🇸',
    stadium: null,
    timezone: 'America/Phoenix',
    heroColor: 'from-orange-700 to-red-600',
    kind: 'fan_hub',
  },
  {
    slug: 'denver',
    name: 'Denver',
    country: 'USA',
    flag: '🇺🇸',
    stadium: null,
    timezone: 'America/Denver',
    heroColor: 'from-blue-700 to-orange-600',
    kind: 'fan_hub',
  },
  {
    slug: 'las-vegas',
    name: 'Las Vegas',
    country: 'USA',
    flag: '🇺🇸',
    stadium: null,
    timezone: 'America/Los_Angeles',
    heroColor: 'from-yellow-600 to-gray-800',
    kind: 'fan_hub',
  },
  {
    slug: 'orlando',
    name: 'Orlando',
    country: 'USA',
    flag: '🇺🇸',
    stadium: null,
    timezone: 'America/New_York',
    heroColor: 'from-blue-600 to-purple-600',
    kind: 'fan_hub',
  },
  {
    slug: 'san-diego',
    name: 'San Diego',
    country: 'USA',
    flag: '🇺🇸',
    stadium: null,
    timezone: 'America/Los_Angeles',
    heroColor: 'from-sky-600 to-blue-500',
    kind: 'fan_hub',
  },
  {
    slug: 'nashville',
    name: 'Nashville',
    country: 'USA',
    flag: '🇺🇸',
    stadium: null,
    timezone: 'America/Chicago',
    heroColor: 'from-blue-800 to-yellow-600',
    kind: 'fan_hub',
  },
  {
    slug: 'austin',
    name: 'Austin',
    country: 'USA',
    flag: '🇺🇸',
    stadium: null,
    timezone: 'America/Chicago',
    heroColor: 'from-orange-700 to-blue-600',
    kind: 'fan_hub',
  },
  // Mexico
  {
    slug: 'tijuana',
    name: 'Tijuana',
    country: 'Mexico',
    flag: '🇲🇽',
    stadium: null,
    timezone: 'America/Tijuana',
    heroColor: 'from-green-700 to-red-500',
    kind: 'fan_hub',
  },
  {
    slug: 'cancun',
    name: 'Cancún',
    country: 'Mexico',
    flag: '🇲🇽',
    stadium: null,
    timezone: 'America/Cancun',
    heroColor: 'from-teal-600 to-blue-500',
    kind: 'fan_hub',
  },
  {
    slug: 'puebla',
    name: 'Puebla',
    country: 'Mexico',
    flag: '🇲🇽',
    stadium: null,
    timezone: 'America/Mexico_City',
    heroColor: 'from-blue-700 to-red-600',
    kind: 'fan_hub',
  },
]

// Combined list — all cities
export const CITIES: CityMeta[] = [...HOST_CITIES, ...FAN_HUB_CITIES]

export function getCityBySlug(slug: string): CityMeta | undefined {
  return CITIES.find((c) => c.slug === slug)
}

export function getCitiesByCountry(country: CityMeta['country']): CityMeta[] {
  return CITIES.filter((c) => c.country === country)
}
