import { stripe, LISTING_PRICE } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// ─── Validation helpers ──────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HTTPS_RE = /^https:\/\/.+/
const MIN_DATE = '2026-06-11'
const MAX_DATE = '2026-07-19'

type ValidationErrors = Record<string, string>

function validateInput(body: Record<string, unknown>): ValidationErrors {
  const errors: ValidationErrors = {}

  // Required strings
  const venueName = String(body.venueName ?? '').trim()
  if (!venueName) errors.venueName = 'Venue name is required'
  else if (venueName.length > 120) errors.venueName = 'Venue name must be 120 chars or fewer'

  const address = String(body.address ?? '').trim()
  if (!address) errors.address = 'Address is required'
  else if (address.length > 200) errors.address = 'Address must be 200 chars or fewer'

  const contactEmail = String(body.contactEmail ?? '').trim()
  if (!contactEmail) errors.contactEmail = 'Contact email is required'
  else if (!EMAIL_RE.test(contactEmail)) errors.contactEmail = 'Invalid email address'

  // City: either a known host citySlug or a globalCity+globalCountry pair
  const isGlobalCity = Boolean(body.isGlobalCity)
  if (isGlobalCity) {
    const globalCity = String(body.globalCity ?? '').trim()
    const globalCountry = String(body.globalCountry ?? '').trim()
    if (!globalCity) errors.globalCity = 'City name is required'
    else if (globalCity.length > 80) errors.globalCity = 'City name too long'
    if (!globalCountry) errors.globalCountry = 'Country is required'
  } else {
    const citySlug = String(body.citySlug ?? '').trim()
    if (!citySlug) errors.citySlug = 'City is required'
    // Only allow slugs that look safe (no injection)
    else if (!/^[a-z0-9-]+$/.test(citySlug)) errors.citySlug = 'Invalid city'
  }

  // Event date
  const matchDate = String(body.matchDate ?? '').trim()
  if (!matchDate) {
    errors.matchDate = 'Event date is required'
  } else if (matchDate < MIN_DATE || matchDate > MAX_DATE) {
    errors.matchDate = `Date must be between ${MIN_DATE} and ${MAX_DATE}`
  }

  // Optional numeric fields
  const coverCharge = body.coverCharge !== '' && body.coverCharge != null
    ? Number(body.coverCharge)
    : 0
  if (isNaN(coverCharge) || coverCharge < 0 || coverCharge > 500)
    errors.coverCharge = 'Cover charge must be between $0 and $500'

  const capacity = body.capacity !== '' && body.capacity != null
    ? Number(body.capacity)
    : null
  if (capacity !== null && (isNaN(capacity) || capacity <= 0 || capacity > 50000))
    errors.capacity = 'Capacity must be a positive number up to 50,000'

  // Optional URLs must be HTTPS if provided
  const website = String(body.website ?? '').trim()
  if (website && !HTTPS_RE.test(website))
    errors.website = 'Website must be a valid https:// URL'

  const ticketUrl = String(body.ticketUrl ?? '').trim()
  if (ticketUrl && !HTTPS_RE.test(ticketUrl))
    errors.ticketUrl = 'Ticket link must be a valid https:// URL'

  // Description cap
  const description = String(body.description ?? '').trim()
  if (description.length > 600)
    errors.description = 'Description must be 600 chars or fewer'

  return errors
}

// ─── Route handler ───────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Server-side validation
  const errors = validateInput(body)
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 })
  }

  // Sanitised values only — never trust client for status/price/featured
  const venueName    = String(body.venueName).trim()
  const address      = String(body.address).trim()
  const contactEmail = String(body.contactEmail).trim().toLowerCase()
  const matchDate    = String(body.matchDate).trim()
  const isGlobalCity = Boolean(body.isGlobalCity)
  const description  = String(body.description ?? '').trim() || null
  const website      = String(body.website ?? '').trim() || null
  const startTime    = String(body.startTime ?? '').trim() || null
  const ticketUrl    = String(body.ticketUrl ?? '').trim() || null
  const coverCharge  = body.coverCharge !== '' && body.coverCharge != null
    ? Math.max(0, Math.floor(Number(body.coverCharge))) : 0
  const capacity     = body.capacity !== '' && body.capacity != null
    ? Math.max(1, Math.floor(Number(body.capacity))) : null

  const citySlug = isGlobalCity
    ? `city-${String(body.globalCity).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
    : String(body.citySlug).trim()

  const cityDisplay = isGlobalCity
    ? `${String(body.globalCity).trim()}, ${String(body.globalCountry).trim()}`
    : citySlug

  try {
    const admin = supabaseAdmin()

    // 1. Create venue as pending_payment — NOT active, NOT pending_review
    const { data: venue, error: venueError } = await admin
      .from('venues')
      .insert({
        name: venueName,
        address,
        city_slug: citySlug,
        contact_email: contactEmail,
        website_url: website,
        description,
        status: 'pending_payment',
        payment_status: 'unpaid',
      })
      .select()
      .single()

    if (venueError || !venue) {
      console.error('Venue insert error:', venueError)
      return NextResponse.json({ error: 'Failed to create venue record' }, { status: 500 })
    }

    // 2. Create watch party record (hidden by RLS until venue is active)
    const { error: partyError } = await admin
      .from('watch_parties')
      .insert({
        venue_id: venue.id,
        title: `${venueName} — 2026 Tournament Watch Party`,
        date: matchDate,
        start_time: startTime,
        cover_charge: coverCharge,
        capacity,
        ticket_url: ticketUrl,
        featured: false,  // never trust client for this
      })

    if (partyError) {
      console.error('Watch party insert error (non-fatal):', partyError)
    }

    // 3. Create Stripe Checkout session — price is server-defined only
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: contactEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Watch Party Listing — 2026 Tournament',
              description: `${venueName} · ${cityDisplay}`,
            },
            unit_amount: LISTING_PRICE,  // server-defined, $39
          },
          quantity: 1,
        },
      ],
      metadata: {
        venue_id: venue.id,
        city: cityDisplay,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?status=pending_review&venue=${venue.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/list-your-venue?cancelled=true`,
    })

    // 4. Store Stripe session ID on the venue record
    await admin
      .from('venues')
      .update({ stripe_session_id: session.id })
      .eq('id', venue.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Create listing error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
