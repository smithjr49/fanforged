import { Resend } from 'resend'

// TODO: Add RESEND_API_KEY to Vercel environment variables.
// Get your key at https://resend.com — free plan covers 3,000 emails/month.
// Also verify your sending domain (fanforged.fans) in the Resend dashboard
// under Domains → Add Domain, then add the DNS records to your registrar.
const resend = new Resend(process.env.RESEND_API_KEY)

const NOTIFY_TO = 'hello@fanforged.fans'
const FROM = 'FanForged <notifications@fanforged.fans>'

// ─── Venue listing paid ──────────────────────────────────────────────────────

export async function sendVenueListingNotification(data: {
  venueId: string
  venueName: string
  citySlug: string
  contactEmail: string
  address: string
  stripeSessionId: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping venue listing email')
    return
  }

  const adminUrl = `https://fanforged.fans/admin`

  await resend.emails.send({
    from: FROM,
    to: NOTIFY_TO,
    subject: `💰 New venue listing paid — ${data.venueName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#111;margin-bottom:4px">New Watch Party Listing Paid</h2>
        <p style="color:#666;margin-top:0">A venue has completed payment and is waiting for your review.</p>

        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;width:140px">Venue</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">${data.venueName}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">City</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee">${data.citySlug}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">Address</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee">${data.address}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">Contact</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee">${data.contactEmail}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">Venue ID</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:12px;font-family:monospace">${data.venueId}</td></tr>
          <tr><td style="padding:8px 0;color:#888">Stripe Session</td>
              <td style="padding:8px 0;font-size:12px;font-family:monospace">${data.stripeSessionId}</td></tr>
        </table>

        <p style="margin:16px 0">
          <a href="${adminUrl}" style="background:#facc15;color:#111;font-weight:700;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block">
            Review in Admin →
          </a>
        </p>

        <p style="color:#999;font-size:12px;margin-top:24px">
          To publish, change the venue's status to <code>active</code> in Supabase.
          The listing will appear on the site immediately.
        </p>
      </div>
    `,
  })
}

// ─── Premium travel lead ──────────────────────────────────────────────────────

export type PremiumLeadData = {
  name: string
  email: string
  cities: string
  dates: string
  travelers: string
  budget: string
  services: string
  notes: string
}

export async function sendPremiumLeadNotification(data: PremiumLeadData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping premium lead email')
    return
  }

  await resend.emails.send({
    from: FROM,
    to: NOTIFY_TO,
    subject: `⭐ Premium travel inquiry — ${data.name} (${data.budget})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#111;margin-bottom:4px">New Premium Travel Inquiry</h2>
        <p style="color:#666;margin-top:0">Someone wants help planning a premium World Cup trip.</p>

        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888;width:140px">Name</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">${data.name}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">Email</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee">
                <a href="mailto:${data.email}" style="color:#2563eb">${data.email}</a>
              </td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">Cities</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee">${data.cities || '—'}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">Dates</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee">${data.dates || '—'}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">Travelers</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee">${data.travelers || '—'}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">Budget</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;color:#059669">${data.budget || '—'}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#888">Services</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee">${data.services || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#888">Notes</td>
              <td style="padding:8px 0">${data.notes || '—'}</td></tr>
        </table>

        <p style="margin:16px 0">
          <a href="mailto:${data.email}" style="background:#facc15;color:#111;font-weight:700;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block">
            Reply to ${data.name} →
          </a>
        </p>

        <p style="color:#999;font-size:12px;margin-top:24px">
          This inquiry was submitted via fanforged.fans/premium-travel
        </p>
      </div>
    `,
  })
}
