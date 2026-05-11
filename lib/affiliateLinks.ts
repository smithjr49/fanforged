/**
 * Affiliate Links — FanForged Travel Platform
 *
 * Active affiliate programs:
 *
 * AWIN (ui.awin.com) — Publisher ID: 2891535
 *   Covers: Booking.com, Hotels.com, GetYourGuide, Rentalcars.com, Skyscanner
 *   TODO: Join each advertiser program in AWIN dashboard → Advertiser Search
 *
 * VIATOR (partners.viator.com) — Partner ID: P00300735
 *   Covers: Tours & experiences (300k+ globally, 8% commission)
 *   TODO: Complete account verification at partners.viator.com → "Get verified"
 *
 * EXPEDIA GROUP (creator.expediagroup.com) — Travel Creator Program
 *   Covers: Expedia.com, Hotels.com, Vrbo hotels
 *   TODO: Add bank details at creator.expediagroup.com → "Add bank details"
 *         Then get your tracking code from Creator Toolbox → Link Builder
 *         Set EXPEDIA_TRACKING_CODE below once you have it
 *
 * AWIN merchant IDs (verify in AWIN dashboard):
 *   Booking.com (US/Global) : 596
 *   Hotels.com              : 14758
 *   GetYourGuide            : 25146
 *   Rentalcars.com          : 9922
 *   Skyscanner              : 1315
 */

// ─── Affiliate IDs ────────────────────────────────────────────────────────────

// AWIN Publisher ID — Fan Forged
const AWIN_ID = '2891535'

// Viator Partner ID — Fan Forged
const VIATOR_ID = 'P00300735'
// Viator channel ID (42383 = affiliate standard, don't change)
const VIATOR_MCID = '42383'

// TODO: Add bank details at creator.expediagroup.com, then get your tracking
// code from Creator Toolbox → Link Builder and set it here.
const EXPEDIA_TRACKING = 'YOUR_EXPEDIA_CODE'

// ─── AWIN Merchant IDs ────────────────────────────────────────────────────────
const MERCHANT = {
  BOOKING:      '596',
  HOTELS_COM:   '14758',
  GETYOURGUIDE: '25146',
  RENTALCARS:   '9922',
  SKYSCANNER:   '1315',
}

// ─── Link builders ────────────────────────────────────────────────────────────

/** AWIN deep link — wraps any destination URL with publisher tracking */
function awin(merchantId: string, destinationUrl: string): string {
  return `https://www.awin1.com/cread.php?awinmid=${merchantId}&awinaffid=${AWIN_ID}&ued=${encodeURIComponent(destinationUrl)}`
}

/**
 * Viator city search link.
 * Uses Viator's direct partner program (better rates than AWIN for experiences).
 * mcid=42383 is the standard affiliate channel ID.
 */
function viator(cityName: string): string {
  const query = encodeURIComponent(`${cityName} tours`)
  return `https://www.viator.com/search/${encodeURIComponent(cityName)}/?pid=${VIATOR_ID}&mcid=${VIATOR_MCID}&medium=link&campaign=worldcup2026`
}

/**
 * Expedia hotel search link.
 * TODO: Replace YOUR_EXPEDIA_CODE once Expedia bank details are set up.
 * Falls back to AWIN Booking.com link until then.
 */
function expedia(cityName: string, bookingFallback: string): string {
  if (EXPEDIA_TRACKING === 'YOUR_EXPEDIA_CODE') {
    // Fallback to Booking.com via AWIN until Expedia is set up
    return awin(MERCHANT.BOOKING, bookingFallback)
  }
  return `https://www.expedia.com/${encodeURIComponent(cityName.replace(/ /g, '-'))}/Hotels?affcid=${EXPEDIA_TRACKING}&kw=worldcup2026`
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type AffiliateLinks = {
  hotelSearchUrl: string
  expediaUrl: string
  flightSearchUrl: string
  transferUrl: string
  carRentalUrl: string
  experiencesUrl: string  // Viator
  insuranceUrl: string
  esimUrl: string
  premiumTravelLeadUrl: string
}

// ─── Shared non-AWIN links ────────────────────────────────────────────────────

const sharedLinks = {
  insuranceUrl: 'https://safetywing.com/?referenceID=YOUR_REF', // TODO: safetywing.com/affiliate
  esimUrl:      'https://ref.airalo.com/YOUR_REF?aff=fanforged&package=usa-north-america', // TODO: airalo.com/affiliate
  premiumTravelLeadUrl: '/premium-travel',
}

// ─── City link factory ────────────────────────────────────────────────────────

type CityDef = {
  displayName: string       // e.g. "New York City" for Viator/Expedia searches
  bookingSearch: string     // Booking.com search results page
  skyscanner: string
  rentalcars: string
  transfer: string
}

function buildCityLinks(c: CityDef): Omit<AffiliateLinks, 'insuranceUrl' | 'esimUrl' | 'premiumTravelLeadUrl'> {
  return {
    hotelSearchUrl:  awin(MERCHANT.BOOKING,    c.bookingSearch),
    expediaUrl:      expedia(c.displayName,    c.bookingSearch),
    flightSearchUrl: awin(MERCHANT.SKYSCANNER, c.skyscanner),
    carRentalUrl:    awin(MERCHANT.RENTALCARS, c.rentalcars),
    experiencesUrl:  viator(c.displayName),
    transferUrl:     c.transfer,
  }
}

// ─── Per-city data ────────────────────────────────────────────────────────────

const cityAffiliateLinks: Record<string, AffiliateLinks> = {
  'new-york': {
    ...buildCityLinks({
      displayName:   'New York City',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=New+York+City&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/nyca/cheap-flights-to-new-york.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/new-york/',
      transfer:      'https://www.gettransfer.com/en/city/new-york?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'los-angeles': {
    ...buildCityLinks({
      displayName:   'Los Angeles',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Los+Angeles&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/lax/cheap-flights-to-los-angeles.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/los-angeles/',
      transfer:      'https://www.gettransfer.com/en/city/los-angeles?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'miami': {
    ...buildCityLinks({
      displayName:   'Miami',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Miami%2C+Florida&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/mia/cheap-flights-to-miami.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/miami/',
      transfer:      'https://www.gettransfer.com/en/city/miami?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'dallas': {
    ...buildCityLinks({
      displayName:   'Dallas',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Dallas%2C+Texas&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/dfw/cheap-flights-to-dallas.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/dallas/',
      transfer:      'https://www.gettransfer.com/en/city/dallas?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'houston': {
    ...buildCityLinks({
      displayName:   'Houston',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Houston%2C+Texas&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/hou/cheap-flights-to-houston.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/houston/',
      transfer:      'https://www.gettransfer.com/en/city/houston?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'atlanta': {
    ...buildCityLinks({
      displayName:   'Atlanta',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Atlanta%2C+Georgia&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/atl/cheap-flights-to-atlanta.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/atlanta/',
      transfer:      'https://www.gettransfer.com/en/city/atlanta?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'kansas-city': {
    ...buildCityLinks({
      displayName:   'Kansas City',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Kansas+City%2C+Missouri&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/mci/cheap-flights-to-kansas-city.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/kansas-city/',
      transfer:      'https://www.gettransfer.com/en/city/kansas-city?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'philadelphia': {
    ...buildCityLinks({
      displayName:   'Philadelphia',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Philadelphia%2C+Pennsylvania&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/phl/cheap-flights-to-philadelphia.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/philadelphia/',
      transfer:      'https://www.gettransfer.com/en/city/philadelphia?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'seattle': {
    ...buildCityLinks({
      displayName:   'Seattle',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Seattle%2C+Washington&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/sea/cheap-flights-to-seattle.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/seattle/',
      transfer:      'https://www.gettransfer.com/en/city/seattle?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'san-francisco': {
    ...buildCityLinks({
      displayName:   'San Francisco',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=San+Francisco%2C+California&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/sfo/cheap-flights-to-san-francisco.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/san-francisco/',
      transfer:      'https://www.gettransfer.com/en/city/san-francisco?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'boston': {
    ...buildCityLinks({
      displayName:   'Boston',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Boston%2C+Massachusetts&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/bos/cheap-flights-to-boston.html',
      rentalcars:    'https://www.rentalcars.com/en/city/us/boston/',
      transfer:      'https://www.gettransfer.com/en/city/boston?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'toronto': {
    ...buildCityLinks({
      displayName:   'Toronto',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Toronto%2C+Ontario&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/yyz/cheap-flights-to-toronto.html',
      rentalcars:    'https://www.rentalcars.com/en/city/ca/toronto/',
      transfer:      'https://www.gettransfer.com/en/city/toronto?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'vancouver': {
    ...buildCityLinks({
      displayName:   'Vancouver',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Vancouver%2C+British+Columbia&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/yvr/cheap-flights-to-vancouver.html',
      rentalcars:    'https://www.rentalcars.com/en/city/ca/vancouver/',
      transfer:      'https://www.gettransfer.com/en/city/vancouver?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'montreal': {
    ...buildCityLinks({
      displayName:   'Montreal',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Montreal%2C+Quebec&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/yul/cheap-flights-to-montreal.html',
      rentalcars:    'https://www.rentalcars.com/en/city/ca/montreal/',
      transfer:      'https://www.gettransfer.com/en/city/montreal?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'mexico-city': {
    ...buildCityLinks({
      displayName:   'Mexico City',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Mexico+City&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/mex/cheap-flights-to-mexico-city.html',
      rentalcars:    'https://www.rentalcars.com/en/city/mx/mexico-city/',
      transfer:      'https://www.gettransfer.com/en/city/mexico-city?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'guadalajara': {
    ...buildCityLinks({
      displayName:   'Guadalajara',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Guadalajara%2C+Mexico&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/gdl/cheap-flights-to-guadalajara.html',
      rentalcars:    'https://www.rentalcars.com/en/city/mx/guadalajara/',
      transfer:      'https://www.gettransfer.com/en/city/guadalajara?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'monterrey': {
    ...buildCityLinks({
      displayName:   'Monterrey',
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Monterrey%2C+Mexico&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/mty/cheap-flights-to-monterrey.html',
      rentalcars:    'https://www.rentalcars.com/en/city/mx/monterrey/',
      transfer:      'https://www.gettransfer.com/en/city/monterrey?ref=fanforged',
    }),
    ...sharedLinks,
  },
}

/** Returns affiliate links for a city slug, or a sensible fallback. */
export function getAffiliateLinks(citySlug: string): AffiliateLinks {
  return (
    cityAffiliateLinks[citySlug] ?? {
      hotelSearchUrl:  awin(MERCHANT.BOOKING,    `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(citySlug)}`),
      expediaUrl:      expedia(citySlug,          `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(citySlug)}`),
      flightSearchUrl: awin(MERCHANT.SKYSCANNER, 'https://www.skyscanner.com'),
      carRentalUrl:    awin(MERCHANT.RENTALCARS, 'https://www.rentalcars.com'),
      experiencesUrl:  viator(citySlug),
      transferUrl:     'https://www.gettransfer.com?ref=fanforged',
      ...sharedLinks,
    }
  )
}
