import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const LISTING_PRICE = 3900 // $39.00 in cents
export const FEATURED_PRICE = 7500 // $75.00 in cents
