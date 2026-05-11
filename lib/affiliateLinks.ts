/**
 * Affiliate Links — FanForged Travel Platform
 *
 * TODO: Replace all YOUR_AID / YOUR_TAG placeholders with real affiliate IDs
 * before going to market. Each network requires separate signup:
 *
 * - Booking.com Partner Hub:  https://www.booking.com/affiliate-program/v2/index.html
 * - Skyscanner Affiliates:    https://www.partners.skyscanner.net
 * - GetYourGuide:             https://affiliate.getyourguide.com
 * - Airalo eSIM:              https://www.airalo.com/affiliate
 * - SafetyWing Insurance:     https://safetywing.com/affiliate
 * - Rentalcars.com:           https://www.rentalcars.com/affiliate
 * - Klook Experiences:        https://affiliate.klook.com
 */

export type AffiliateLinks = {
  /** Booking.com hotel search URL for this city */
  hotelSearchUrl: string
  /** Skyscanner flight search URL */
  flightSearchUrl: string
  /** Airport transfer search (GetTransfer / Welcome Pickups) */
  transferUrl: string
  /** Car rental comparison (Rentalcars.com / Kayak) */
  carRentalUrl: string
  /** Experiences and tours (GetYourGuide / Klook) */
  experiencesUrl: string
  /** Travel insurance (SafetyWing / World Nomads) */
  insuranceUrl: string
  /** eSIM for North America travel (Airalo) */
  esimUrl: string
  /** Premium/concierge lead form */
  premiumTravelLeadUrl: string
}

// ─── Shared base links (not city-specific) ─────────────────────────────────

// TODO: Replace YOUR_AID with your Booking.com affiliate ID
const BOOKING_AID = 'YOUR_AID'

// TODO: Replace with your Skyscanner partner ID
const SKYSCANNER_PARTNER = 'YOUR_PARTNER'

// TODO: Replace with your GetYourGuide partner ID
const GYG_PARTNER = 'YOUR_GYG_PARTNER'

const sharedLinks = {
  // TODO: Sign up at safetywing.com/affiliate
  insuranceUrl: 'https://safetywing.com/?referenceID=YOUR_REF',
  // TODO: Sign up at airalo.com/affiliate
  esimUrl: 'https://ref.airalo.com/YOUR_REF?aff=fanforged&package=usa-north-america',
  premiumTravelLeadUrl: '/premium-travel',
}

// ─── City-specific affiliate links ─────────────────────────────────────────

const cityAffiliateLinks: Record<string, AffiliateLinks> = {
  'new-york': {
    // TODO: Replace YOUR_AID
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=New+York+City&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/nyca/cheap-flights-to-new-york.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/new-york?ref=fanforged', // TODO
    carRentalUrl: `https://www.rentalcars.com/en/city/us/new-york/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/new-york-city-l59/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'los-angeles': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Los+Angeles&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/lax/cheap-flights-to-los-angeles.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/los-angeles?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/los-angeles/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/los-angeles-l32/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'miami': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Miami%2C+Florida&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/mia/cheap-flights-to-miami.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/miami?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/miami/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/miami-l91/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'dallas': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Dallas%2C+Texas&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/dfw/cheap-flights-to-dallas.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/dallas?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/dallas/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/dallas-l97/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'houston': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Houston%2C+Texas&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/hou/cheap-flights-to-houston.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/houston?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/houston/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/houston-l96/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'atlanta': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Atlanta%2C+Georgia&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/atl/cheap-flights-to-atlanta.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/atlanta?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/atlanta/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/atlanta-l99/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'kansas-city': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Kansas+City%2C+Missouri&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/mci/cheap-flights-to-kansas-city.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/kansas-city?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/kansas-city/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/kansas-city-l100/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'philadelphia': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Philadelphia%2C+Pennsylvania&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/phl/cheap-flights-to-philadelphia.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/philadelphia?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/philadelphia/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/philadelphia-l130/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'seattle': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Seattle%2C+Washington&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/sea/cheap-flights-to-seattle.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/seattle?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/seattle/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/seattle-l137/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'san-francisco': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=San+Francisco%2C+California&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/sfo/cheap-flights-to-san-francisco.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/san-francisco?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/san-francisco/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/san-francisco-l61/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'boston': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Boston%2C+Massachusetts&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/bos/cheap-flights-to-boston.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/boston?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/us/boston/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/boston-l63/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'toronto': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Toronto%2C+Ontario&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/yyz/cheap-flights-to-toronto.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/toronto?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/ca/toronto/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/toronto-l96/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'vancouver': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Vancouver%2C+British+Columbia&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/yvr/cheap-flights-to-vancouver.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/vancouver?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/ca/vancouver/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/vancouver-l97/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'montreal': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Montreal%2C+Quebec&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/yul/cheap-flights-to-montreal.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/montreal?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/ca/montreal/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/montreal-l58/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'mexico-city': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Mexico+City&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/mex/cheap-flights-to-mexico-city.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/mexico-city?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/mx/mexico-city/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/mexico-city-l96/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'guadalajara': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Guadalajara%2C+Mexico&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/gdl/cheap-flights-to-guadalajara.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/guadalajara?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/mx/guadalajara/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/guadalajara-l97/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
  'monterrey': {
    hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=Monterrey%2C+Mexico&aid=${BOOKING_AID}&checkin=2026-06-11&checkout=2026-07-20`,
    flightSearchUrl: `https://www.skyscanner.com/flights-to/mty/cheap-flights-to-monterrey.html?associateid=${SKYSCANNER_PARTNER}`,
    transferUrl: 'https://www.gettransfer.com/en/city/monterrey?ref=fanforged',
    carRentalUrl: `https://www.rentalcars.com/en/city/mx/monterrey/?affiliateCode=YOUR_CODE`,
    experiencesUrl: `https://www.getyourguide.com/monterrey-l98/?partner_id=${GYG_PARTNER}`,
    ...sharedLinks,
  },
}

/** Returns affiliate links for a city slug, or a fallback set if not found. */
export function getAffiliateLinks(citySlug: string): AffiliateLinks {
  return (
    cityAffiliateLinks[citySlug] ?? {
      hotelSearchUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(citySlug)}&aid=${BOOKING_AID}`,
      flightSearchUrl: `https://www.skyscanner.com/?associateid=${SKYSCANNER_PARTNER}`,
      transferUrl: 'https://www.gettransfer.com?ref=fanforged',
      carRentalUrl: 'https://www.rentalcars.com/?affiliateCode=YOUR_CODE',
      experiencesUrl: `https://www.getyourguide.com/?partner_id=${GYG_PARTNER}`,
      ...sharedLinks,
    }
  )
}
