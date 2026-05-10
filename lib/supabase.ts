import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

function hasRealSupabaseConfig(url: string, key: string) {
  return Boolean(
    url &&
    key &&
    !url.includes('placeholder') &&
    !key.includes('placeholder')
  )
}

type EmptyQueryResult = { data: never[]; error: null }
type EmptySingleResult = { data: null; error: null }

function createEmptyQueryBuilder() {
  const emptyResult: EmptyQueryResult = { data: [], error: null }
  const builder = {
    select: () => builder,
    eq: () => builder,
    in: () => builder,
    filter: () => builder,
    order: () => builder,
    limit: () => builder,
    single: async (): Promise<EmptySingleResult> => ({ data: null, error: null }),
    then: (
      resolve: (value: EmptyQueryResult) => void,
      reject?: (reason?: unknown) => void
    ) => Promise.resolve(emptyResult).then(resolve, reject),
  }
  return builder
}

let publicClient: SupabaseClient | null = null

function getPublicClient() {
  if (!hasRealSupabaseConfig(SUPABASE_URL, SUPABASE_ANON_KEY)) {
    return null
  }
  publicClient ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return publicClient
}

// Public read-only client. In local dev with placeholder env vars, queries resolve
// to empty results so public pages can render their empty states without a DB.
export const supabase = {
  from(table: string) {
    const client = getPublicClient()
    return client ? client.from(table) : createEmptyQueryBuilder()
  },
}

/** Server-only admin client — never import this in client components */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!hasRealSupabaseConfig(url, key)) {
    throw new Error('Supabase admin credentials missing — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, key)
}

// ─── Domain types ────────────────────────────────────────────

export type VenueStatus =
  | 'pending_payment'
  | 'pending_review'
  | 'active'
  | 'rejected'
  | 'suspended'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export type CityKind = 'host' | 'fan_hub'

export type City = {
  id: string
  slug: string
  name: string
  country: string
  stadium: string | null
  timezone: string | null
  kind: CityKind
  created_at: string
}

export type Venue = {
  id: string
  city_slug: string
  name: string
  address: string
  lat?: number | null
  lng?: number | null
  contact_email: string
  website_url?: string | null
  description?: string | null
  status: VenueStatus
  payment_status: PaymentStatus
  stripe_session_id?: string | null
  paid_at?: string | null
  approved_at?: string | null
  rejected_at?: string | null
  created_at: string
  updated_at: string
}

export type WatchParty = {
  id: string
  venue_id: string
  match_id?: string | null
  title: string
  date: string
  start_time?: string | null
  cover_charge?: number | null
  capacity?: number | null
  ticket_url?: string | null
  featured: boolean
  created_at: string
  updated_at: string
  // joined
  venue?: Venue
}

export type Match = {
  id: string
  match_number?: number | null
  date: string
  time_utc?: string | null
  home_team: string
  away_team: string
  stage: string
  city_slug?: string | null
  stadium?: string | null
  created_at: string
}
