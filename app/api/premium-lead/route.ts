import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPremiumLeadNotification, type PremiumLeadData } from '@/lib/email'

// Service role for inserts — bypasses RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<PremiumLeadData>

    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const lead: PremiumLeadData = {
      name,
      email: email.toLowerCase(),
      cities: String(body.cities ?? '').trim(),
      dates: String(body.dates ?? '').trim(),
      travelers: String(body.travelers ?? '').trim(),
      budget: String(body.budget ?? '').trim(),
      services: String(body.services ?? '').trim(),
      notes: String(body.notes ?? '').trim(),
    }

    // TODO: Run migration_v4_premium_leads.sql in Supabase dashboard before this goes live
    // Save to Supabase (non-fatal — don't block the response if table doesn't exist yet)
    const { error: dbError } = await supabase.from('premium_leads').insert({
      name: lead.name,
      email: lead.email,
      cities: lead.cities || null,
      travel_dates: lead.dates || null,
      travelers: lead.travelers || null,
      budget: lead.budget || null,
      services: lead.services || null,
      notes: lead.notes || null,
    })

    if (dbError) {
      // Log but don't fail — email is the primary notification
      console.error('premium_leads insert error (non-fatal):', dbError)
    }

    // Send notification email
    await sendPremiumLeadNotification(lead)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('premium-lead route error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
