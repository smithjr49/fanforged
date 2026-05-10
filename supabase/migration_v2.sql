-- ============================================
-- FanForged Migration v2
-- Adds payment_status, paid_at, and updates
-- the status check constraint on venues
-- Run in Supabase SQL Editor
-- ============================================

-- Drop the old check constraint
ALTER TABLE venues DROP CONSTRAINT IF EXISTS venues_status_check;

-- Add new status values: pending_payment, pending_review, active, rejected, suspended
ALTER TABLE venues
  ALTER COLUMN status SET DEFAULT 'pending_payment',
  ADD CONSTRAINT venues_status_check
    CHECK (status IN ('pending_payment', 'pending_review', 'active', 'rejected', 'suspended'));

-- Add payment_status column
ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'paid', 'refunded'));

-- Add paid_at timestamp
ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Index for admin dashboard ordering
CREATE INDEX IF NOT EXISTS venues_paid_at_idx ON venues(paid_at);
CREATE INDEX IF NOT EXISTS venues_payment_status_idx ON venues(payment_status);

-- Update RLS: public can only see active venues (unchanged)
-- Service role bypasses RLS (unchanged)
