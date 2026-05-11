-- Premium travel lead capture
CREATE TABLE IF NOT EXISTS premium_leads (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text        NOT NULL,
  email        text        NOT NULL,
  cities       text,
  travel_dates text,
  travelers    text,
  budget       text,
  services     text,
  notes        text,
  status       text        NOT NULL DEFAULT 'new',  -- new | contacted | closed
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS premium_leads_email_idx   ON premium_leads(email);
CREATE INDEX IF NOT EXISTS premium_leads_status_idx  ON premium_leads(status);
CREATE INDEX IF NOT EXISTS premium_leads_created_idx ON premium_leads(created_at DESC);

ALTER TABLE premium_leads ENABLE ROW LEVEL SECURITY;
-- No public read/write — service role only via API route
