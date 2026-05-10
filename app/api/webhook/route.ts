import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Stripe requires the raw body for signature verification.
// Next.js App Router: disable body parsing via config below.
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  // Only handle checkout.session.completed
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // Verify payment was actually successful
  if (session.payment_status !== 'paid') {
    console.warn('Webhook: checkout.session.completed but payment_status is not paid:', session.id)
    return NextResponse.json({ received: true })
  }

  const venue_id = session.metadata?.venue_id
  if (!venue_id) {
    console.error('Webhook: missing venue_id in session metadata:', session.id)
    return NextResponse.json({ error: 'Missing venue_id' }, { status: 400 })
  }

  const admin = supabaseAdmin()

  // Fetch the venue to cross-check the session ID (prevents replay/spoofing)
  const { data: venue, error: fetchError } = await admin
    .from('venues')
    .select('id, status, payment_status, stripe_session_id')
    .eq('id', venue_id)
    .single()

  if (fetchError || !venue) {
    console.error('Webhook: venue not found:', venue_id, fetchError)
    return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
  }

  // Cross-check: session ID must match what we stored
  if (venue.stripe_session_id !== session.id) {
    console.error('Webhook: session ID mismatch for venue:', venue_id)
    return NextResponse.json({ error: 'Session ID mismatch' }, { status: 400 })
  }

  // Idempotency: if already moved past pending_payment, skip
  if (venue.status !== 'pending_payment') {
    console.log(`Webhook: venue ${venue_id} already in status '${venue.status}', skipping`)
    return NextResponse.json({ received: true })
  }

  // Move to pending_review — admin must manually approve to make active
  const { error: updateError } = await admin
    .from('venues')
    .update({
      status: 'pending_review',
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('id', venue_id)
    .eq('status', 'pending_payment') // extra guard against race conditions

  if (updateError) {
    console.error('Webhook: failed to update venue to pending_review:', updateError)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  console.log(`✅ Venue ${venue_id} moved to pending_review after successful payment`)
  return NextResponse.json({ received: true })
}
