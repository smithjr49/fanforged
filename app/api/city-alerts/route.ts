import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS for inserts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, city_slug } = body

    if (!email || !city_slug) {
      return NextResponse.json({ error: 'Email and city are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const { error } = await supabase
      .from('city_alerts')
      .insert({ email: email.toLowerCase().trim(), city_slug })

    if (error) {
      // Unique constraint = already signed up — treat as success
      if (error.code === '23505') {
        return NextResponse.json({ ok: true })
      }
      console.error('city_alerts insert error:', error)
      return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('city-alerts route error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
