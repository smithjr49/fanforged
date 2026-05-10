-- ============================================================
-- FanForged / 26WorldCupGuide — Supabase Migration v2
-- Run in Supabase SQL editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CITIES
-- kind: 'host' | 'fan_hub'
-- Montréal is a fan_hub, not a host city.
-- ============================================================
CREATE TABLE IF NOT EXISTS cities (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,        -- display name e.g. "New York/New Jersey"
  country     TEXT NOT NULL,
  stadium     TEXT,
  timezone    TEXT,
  kind        TEXT NOT NULL DEFAULT 'fan_hub'
                CHECK (kind IN ('host', 'fan_hub')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VENUES
-- Status lifecycle: pending_payment -> pending_review -> active
--                                              └-> rejected
--                   active -> suspended
-- Stripe never sets active. Admin sets active.
-- ============================================================
CREATE TABLE IF NOT EXISTS venues (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_slug           TEXT NOT NULL,
  name                TEXT NOT NULL,
  address             TEXT NOT NULL,
  lat                 FLOAT,
  lng                 FLOAT,
  contact_email       TEXT NOT NULL,
  website_url         TEXT,
  description         TEXT,

  -- Lifecycle
  status              TEXT NOT NULL DEFAULT 'pending_payment'
                        CHECK (status IN ('pending_payment','pending_review','active','rejected','suspended')),
  payment_status      TEXT NOT NULL DEFAULT 'unpaid'
                        CHECK (payment_status IN ('unpaid','paid','refunded')),

  -- Stripe
  stripe_session_id   TEXT UNIQUE,

  -- Timestamps
  paid_at             TIMESTAMPTZ,
  approved_at         TIMESTAMPTZ,
  rejected_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WATCH PARTIES
-- Only visible when parent venue is active (enforced by RLS).
-- ============================================================
CREATE TABLE IF NOT EXISTS watch_parties (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id      UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  match_id      TEXT,
  title         TEXT NOT NULL,
  date          DATE NOT NULL,
  start_time    TEXT,
  cover_charge  INT DEFAULT 0,     -- in USD, 0 = free
  capacity      INT,
  ticket_url    TEXT,
  featured      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MATCHES (seeded from tournament schedule)
-- ============================================================
CREATE TABLE IF NOT EXISTS matches (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_number  INT,
  date          DATE NOT NULL,
  time_utc      TEXT,
  home_team     TEXT NOT NULL DEFAULT 'TBD',
  away_team     TEXT NOT NULL DEFAULT 'TBD',
  stage         TEXT NOT NULL,
  city_slug     TEXT,
  stadium       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_venues_city_status
  ON venues(city_slug, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_venues_status_payment
  ON venues(status, payment_status);

-- stripe_session_id uniqueness already enforced by UNIQUE constraint above

CREATE INDEX IF NOT EXISTS idx_parties_venue_date
  ON watch_parties(venue_id, date);

CREATE INDEX IF NOT EXISTS idx_parties_date_featured
  ON watch_parties(date, featured);

CREATE INDEX IF NOT EXISTS idx_matches_city
  ON matches(city_slug);

CREATE INDEX IF NOT EXISTS idx_matches_date
  ON matches(date);

-- ============================================================
-- updated_at auto-trigger
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS venues_updated_at ON venues;
CREATE TRIGGER venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS parties_updated_at ON watch_parties;
CREATE TRIGGER parties_updated_at
  BEFORE UPDATE ON watch_parties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Public: only active venues & their watch parties.
-- Service role (API routes): full access.
-- ============================================================
ALTER TABLE venues       ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches       ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities        ENABLE ROW LEVEL SECURITY;

-- Drop old policies if re-running
DROP POLICY IF EXISTS "Public can read active venues"          ON venues;
DROP POLICY IF EXISTS "Service role full access venues"        ON venues;
DROP POLICY IF EXISTS "Public can read watch parties"          ON watch_parties;
DROP POLICY IF EXISTS "Public can read watch parties for active venues" ON watch_parties;
DROP POLICY IF EXISTS "Service role full access parties"       ON watch_parties;
DROP POLICY IF EXISTS "Public can read matches"                ON matches;
DROP POLICY IF EXISTS "Public can read cities"                 ON cities;

-- Venues: public sees only active
CREATE POLICY "Public can read active venues"
  ON venues FOR SELECT
  USING (status = 'active');

-- Watch parties: public sees only parties whose venue is active
CREATE POLICY "Public can read watch parties for active venues"
  ON watch_parties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM venues
      WHERE venues.id = watch_parties.venue_id
        AND venues.status = 'active'
    )
  );

-- Matches: public readable
CREATE POLICY "Public can read matches"
  ON matches FOR SELECT USING (true);

-- Cities: public readable
CREATE POLICY "Public can read cities"
  ON cities FOR SELECT USING (true);

-- Service role: full access (used by API routes)
CREATE POLICY "Service role full access venues"
  ON venues FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access parties"
  ON watch_parties FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access matches"
  ON matches FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access cities"
  ON cities FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- SEED: Cities
-- Note: Montréal is kind='fan_hub', not a host city.
-- New York displays as "New York / New Jersey".
-- ============================================================
-- Source: FIFA / wikipedia.org/wiki/2026_FIFA_World_Cup
-- USA: 11 host cities | Canada: 2 | Mexico: 3
INSERT INTO cities (slug, name, country, stadium, timezone, kind) VALUES
  -- Host cities: USA (11)
  ('new-york',       'New York / New Jersey',   'USA',    'MetLife Stadium',         'America/New_York',    'host'),
  ('los-angeles',    'Los Angeles',             'USA',    'SoFi Stadium',            'America/Los_Angeles', 'host'),
  ('dallas',         'Dallas',                  'USA',    'AT&T Stadium',            'America/Chicago',     'host'),
  ('atlanta',        'Atlanta',                 'USA',    'Mercedes-Benz Stadium',   'America/New_York',    'host'),
  ('kansas-city',    'Kansas City',             'USA',    'Arrowhead Stadium',       'America/Chicago',     'host'),
  ('houston',        'Houston',                 'USA',    'NRG Stadium',             'America/Chicago',     'host'),
  ('san-francisco',  'San Francisco Bay Area',  'USA',    'Levi''s Stadium',         'America/Los_Angeles', 'host'),
  ('philadelphia',   'Philadelphia',            'USA',    'Lincoln Financial Field', 'America/New_York',    'host'),
  ('seattle',        'Seattle',                 'USA',    'Lumen Field',             'America/Los_Angeles', 'host'),
  ('boston',         'Boston',                  'USA',    'Gillette Stadium',        'America/New_York',    'host'),
  ('miami',          'Miami',                   'USA',    'Hard Rock Stadium',       'America/New_York',    'host'),
  -- Host cities: Canada (2)
  ('toronto',        'Toronto',                'Canada',  'BMO Field',               'America/Toronto',     'host'),
  ('vancouver',      'Vancouver',              'Canada',  'BC Place',                'America/Vancouver',   'host'),
  -- Host cities: Mexico (3)
  ('mexico-city',    'Mexico City',            'Mexico',  'Estadio Azteca',          'America/Mexico_City', 'host'),
  ('guadalajara',    'Guadalajara',            'Mexico',  'Estadio Akron',           'America/Mexico_City', 'host'),
  ('monterrey',      'Monterrey',              'Mexico',  'Estadio BBVA',            'America/Monterrey',   'host'),
  -- Fan hubs (not hosting — major watch-party demand cities)
  ('montreal',       'Montréal',               'Canada',  NULL,                      'America/Toronto',     'fan_hub'),
  ('chicago',        'Chicago',                'USA',     NULL,                      'America/Chicago',     'fan_hub'),
  ('washington-dc',  'Washington DC',          'USA',     NULL,                      'America/New_York',    'fan_hub'),
  ('phoenix',        'Phoenix',                'USA',     NULL,                      'America/Phoenix',     'fan_hub'),
  ('denver',         'Denver',                 'USA',     NULL,                      'America/Denver',      'fan_hub'),
  ('las-vegas',      'Las Vegas',              'USA',     NULL,                      'America/Los_Angeles', 'fan_hub'),
  ('orlando',        'Orlando',                'USA',     NULL,                      'America/New_York',    'fan_hub'),
  ('san-diego',      'San Diego',              'USA',     NULL,                      'America/Los_Angeles', 'fan_hub'),
  ('nashville',      'Nashville',              'USA',     NULL,                      'America/Chicago',     'fan_hub'),
  ('austin',         'Austin',                 'USA',     NULL,                      'America/Chicago',     'fan_hub'),
  ('calgary',        'Calgary',                'Canada',  NULL,                      'America/Edmonton',    'fan_hub'),
  ('ottawa',         'Ottawa',                 'Canada',  NULL,                      'America/Toronto',     'fan_hub'),
  ('edmonton',       'Edmonton',               'Canada',  NULL,                      'America/Edmonton',    'fan_hub'),
  ('tijuana',        'Tijuana',                'Mexico',  NULL,                      'America/Tijuana',     'fan_hub'),
  ('cancun',         'Cancún',                 'Mexico',  NULL,                      'America/Cancun',      'fan_hub'),
  ('puebla',         'Puebla',                 'Mexico',  NULL,                      'America/Mexico_City', 'fan_hub')
ON CONFLICT (slug) DO UPDATE SET
  name       = EXCLUDED.name,
  kind       = EXCLUDED.kind,
  stadium    = EXCLUDED.stadium,
  timezone   = EXCLUDED.timezone;

-- ============================================================
-- SEED: Matches (opening phase, confirmed host cities only)
-- Note: Montréal removed — not an official host.
-- ============================================================
-- Opening phase matches (representative, not official draw)
INSERT INTO matches (match_number, date, time_utc, home_team, away_team, stage, city_slug, stadium) VALUES
  (1,   '2026-06-11', '01:00', 'Mexico',    'TBD', 'Group Stage', 'mexico-city',   'Estadio Azteca'),
  (2,   '2026-06-12', '22:00', 'USA',       'TBD', 'Group Stage', 'los-angeles',   'SoFi Stadium'),
  (3,   '2026-06-13', '01:00', 'Canada',    'TBD', 'Group Stage', 'toronto',       'BMO Field'),
  (4,   '2026-06-14', '21:00', 'Brazil',    'TBD', 'Group Stage', 'miami',         'Hard Rock Stadium'),
  (5,   '2026-06-15', '00:00', 'Argentina', 'TBD', 'Group Stage', 'new-york',      'MetLife Stadium'),
  (6,   '2026-06-16', '01:00', 'Spain',     'TBD', 'Group Stage', 'guadalajara',   'Estadio Akron'),
  (7,   '2026-06-17', '22:00', 'France',    'TBD', 'Group Stage', 'vancouver',     'BC Place'),
  (8,   '2026-06-18', '01:00', 'England',   'TBD', 'Group Stage', 'monterrey',     'Estadio BBVA'),
  (9,   '2026-06-19', '22:00', 'Germany',   'TBD', 'Group Stage', 'dallas',        'AT&T Stadium'),
  (10,  '2026-06-20', '01:00', 'Italy',     'TBD', 'Group Stage', 'atlanta',       'Mercedes-Benz Stadium'),
  (11,  '2026-06-21', '22:00', 'Portugal',  'TBD', 'Group Stage', 'kansas-city',   'Arrowhead Stadium'),
  (12,  '2026-06-22', '01:00', 'Netherlands','TBD','Group Stage', 'seattle',       'Lumen Field'),
  (13,  '2026-06-23', '22:00', 'Japan',     'TBD', 'Group Stage', 'houston',       'NRG Stadium'),
  (14,  '2026-06-24', '01:00', 'Morocco',   'TBD', 'Group Stage', 'philadelphia',  'Lincoln Financial Field'),
  (15,  '2026-06-25', '22:00', 'Colombia',  'TBD', 'Group Stage', 'boston',        'Gillette Stadium'),
  (16,  '2026-06-26', '01:00', 'South Korea','TBD','Group Stage', 'san-francisco', 'Levi''s Stadium'),
  (104, '2026-07-19', '20:00', 'TBD',       'TBD', 'Final',       'new-york',      'MetLife Stadium')
ON CONFLICT DO NOTHING;
