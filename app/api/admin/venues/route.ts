/**
 * Admin venue review API — secret-protected.
 *
 * GET  /api/admin/venues?status=pending_review   — list venues by status
 * POST /api/admin/venues                         — change venue status
 *
 * Protected by ADMIN_SECRET header. Never expose this route publicly.
 *
 * Allowed transitions:
 *   pending_review -> active    (approve)
 *   pending_review -> rejected  (reject)
 *   active         -> suspended (suspend)
 */

import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending_review: ['active', 'rejected'],
  active: ['suspended'],
  suspended: ['active'],
}

function isAuthorized(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret')
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? 'pending_review'

  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('venues')
    .select('id, name, city_slug, address, contact_email, status, payment_status, paid_at, created_at')
    .eq('status', status)
    .order('paid_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  return NextResponse.json({ venues: data })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { venue_id?: string; action?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { venue_id, action } = body

  if (!venue_id || typeof venue_id !== 'string') {
    return NextResponse.json({ error: 'venue_id required' }, { status: 422 })
  }

  const validActions = ['active', 'rejected', 'suspended']
  if (!action || !validActions.includes(action)) {
    return NextResponse.json(
      { error: `action must be one of: ${validActions.join(', ')}` },
      { status: 422 }
    )
  }

  const admin = supabaseAdmin()

  // Fetch current status
  const { data: venue, error: fetchError } = await admin
    .from('venues')
    .select('id, status')
    .eq('id', venue_id)
    .single()

  if (fetchError || !venue) {
    return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
  }

  // Validate the transition
  const allowed = ALLOWED_TRANSITIONS[venue.status] ?? []
  if (!allowed.includes(action)) {
    return NextResponse.json(
      {
        error: `Cannot transition from '${venue.status}' to '${action}'. Allowed: ${allowed.join(', ') || 'none'}`,
      },
      { status: 422 }
    )
  }

  // Build update payload
  const updatePayload: Record<string, unknown> = { status: action }
  if (action === 'active') updatePayload.approved_at = new Date().toISOString()
  if (action === 'rejected') updatePayload.rejected_at = new Date().toISOString()

  const { error: updateError } = await admin
    .from('venues')
    .update(updatePayload)
    .eq('id', venue_id)

  if (updateError) {
    console.error('Admin venue update error:', updateError)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  console.log(`Admin: venue ${venue_id} → ${action}`)
  return NextResponse.json({ ok: true, venue_id, status: action })
}
