# Launch Checklist — 26WorldCupGuide.com

## 1. Supabase

- [ ] Create a new Supabase project at https://supabase.com
- [ ] Run `supabase/migration.sql` in the SQL Editor (Project > SQL Editor > New query)
- [ ] Confirm these tables exist: `cities`, `venues`, `watch_parties`, `matches`
- [ ] Confirm RLS is enabled on all tables (Authentication > Policies)
- [ ] Confirm the `cities` seed data loaded (check `SELECT * FROM cities` returns 28 rows)
- [ ] Copy the Project URL and keys to Vercel env vars (see step 3)

## 2. Stripe

- [ ] Create a Stripe account at https://stripe.com
- [ ] Enable test mode and collect test keys
- [ ] Add a webhook endpoint in Stripe Dashboard:
  - URL: `https://26worldcupguide.com/api/webhook`
  - Events to send: `checkout.session.completed`
- [ ] Copy the webhook signing secret (`whsec_...`) to env vars
- [ ] Run a test payment with a [Stripe test card](https://stripe.com/docs/testing#cards) (e.g. `4242 4242 4242 4242`)
- [ ] Verify the venue moves to `pending_review` (not `active`) after test payment
- [ ] After successful test, swap to live mode keys for production

## 3. Vercel — Environment Variables

Set these in Vercel > Project > Settings > Environment Variables:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project Settings > API (service_role) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard > Developers > API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard > Webhooks > signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard > Developers > API keys |
| `NEXT_PUBLIC_BASE_URL` | `https://26worldcupguide.com` |
| `ADMIN_SECRET` | Generate a long random string (e.g. `openssl rand -hex 32`) |
| `LIVE_SCORES_ENABLED` | `false` until tournament starts |

## 4. Domain

- [ ] Purchase `26worldcupguide.com` (or confirm ownership)
- [ ] Add domain in Vercel > Project > Settings > Domains
- [ ] Confirm SSL certificate is provisioned (auto by Vercel)
- [ ] Update `NEXT_PUBLIC_BASE_URL` to `https://26worldcupguide.com`

## 5. Deploy

```bash
git push origin main
```

Vercel auto-deploys on push to main. Watch the build log for errors.

## 6. Post-deploy Checks

- [ ] Visit `https://26worldcupguide.com` — homepage renders
- [ ] Visit `/new-york` — city guide with hotels loads
- [ ] Visit `/new-york/watch-parties` — empty state shows correctly
- [ ] Visit `/watch-parties` — city grid renders
- [ ] Visit `/list-your-venue` — 3-step form works
- [ ] Submit a test venue → Stripe test checkout → confirm `pending_review` in Supabase
- [ ] Visit `/admin/venues?secret=YOUR_ADMIN_SECRET` — venue appears in pending_review tab
- [ ] Approve venue → confirm it appears on `/new-york/watch-parties`
- [ ] Visit `/sitemap.xml` — all city URLs listed, no `/admin` URLs
- [ ] Visit `/robots.txt` — disallows `/admin/`, `/dashboard`, `/api/`
- [ ] Visit `/matches` — schedule renders
- [ ] Visit `/cities/montreal/watch-parties` — Montréal fan hub page renders

## 7. Affiliate Links

- [ ] Sign up for [Booking.com Partner Program](https://www.booking.com/affiliateprogram/overview.html)
- [ ] Get your affiliate ID (e.g. `aid=XXXXXX`)
- [ ] Replace `?aid=YOUR_AID` in all `data/cities/*.json` hotel entries with your real affiliate ID
- [ ] Verify hotel links open in new tab with `sponsored` rel
- [ ] Confirm affiliate disclosure appears above hotel cards

### Supported providers (add links in city JSON):
- Booking.com: `https://www.booking.com/hotel/...?aid=YOUR_AID`
- Expedia: `https://www.expedia.com/...?affcid=YOUR_ID`
- Hotels.com: `https://www.hotels.com/...`
- GetYourGuide (tours): `https://www.getyourguide.com/...?partner_id=YOUR_ID`

## 8. Live Scores

When the tournament starts (June 11, 2026):

- [ ] Set `LIVE_SCORES_ENABLED=true` in Vercel env vars
- [ ] Redeploy or trigger a revalidation
- [ ] Monitor `/matches` page — live scores should appear when matches are in progress
- [ ] If FotMob breaks, set back to `false` — the page degrades gracefully

## 9. Admin Workflow

After a venue pays:
1. They land at `/dashboard?status=pending_review`
2. You receive no automatic notification (add email later via Resend/SendGrid)
3. Visit `/admin/venues?secret=YOUR_ADMIN_SECRET`
4. Review the venue name, address, and description
5. Click **Approve** → venue goes `active` → appears publicly
6. Or click **Reject** → venue goes `rejected` → not shown

## 10. Security Checklist

- [ ] `ADMIN_SECRET` is a long random string (not "admin" or similar)
- [ ] `.env.local` is in `.gitignore` (never committed)
- [ ] Service role key is only used server-side (API routes)
- [ ] Stripe webhook signature is always verified
- [ ] `/admin/*` and `/api/*` are in `robots.txt` disallow list
- [ ] No FIFA affiliation language on any public page
