-- City alert email signups
CREATE TABLE IF NOT EXISTS city_alerts (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text        NOT NULL,
  city_slug   text        NOT NULL,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (email, city_slug)
);

CREATE INDEX IF NOT EXISTS city_alerts_city_slug_idx ON city_alerts(city_slug);
CREATE INDEX IF NOT EXISTS city_alerts_email_idx ON city_alerts(email);

-- Row Level Security: allow inserts from anon (API route uses service role, but no reads needed)
ALTER TABLE city_alerts ENABLE ROW LEVEL SECURITY;

-- No select policy needed — email data is internal only
-- Service role bypasses RLS for inserts via the API route
