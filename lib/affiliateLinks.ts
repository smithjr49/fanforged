/**
 * Affiliate Links — FanForged Travel Platform
 *
 * PRIMARY NETWORK: AWIN (ui.awin.com)
 * All major travel merchants (Booking.com, Hotels.com, GetYourGuide,
 * Rentalcars.com, etc.) are on AWIN. One Publisher ID covers all of them.
 *
 * ─── HOW TO ACTIVATE ──────────────────────────────────────────────────────
 * 1. Find your Publisher ID:
 *    ui.awin.com → Account name (top-right) → Account details → Publisher ID
 *
 * 2. Set it below: replace YOUR_AWIN_ID with the 6-7 digit number
 *
 * 3. Join these advertiser programs on AWIN (Publisher → Advertiser Search):
 *    - Booking.com       (search "Booking.com" — apply, usually auto-approved)
 *    - Hotels.com        (search "Hotels.com")
 *    - GetYourGuide      (search "GetYourGuide")
 *    - Rentalcars.com    (search "Rentalcars.com" or "KAYAK")
 *    - eSky / Skyscanner (search "Skyscanner")
 *
 * 4. Once approved, links are live immediately — no other code change needed.
 *
 * AWIN deep link format:
 *   https://www.awin1.com/cread.php?awinmid=MERCHANT_ID&awinaffid=PUBLISHER_ID&ued=DESTINATION_URL
 *
 * Key merchant IDs (verify in AWIN dashboard under Advertiser Search):
 *   Booking.com (US/Global) : 596
 *   Hotels.com              : 14758
 *   GetYourGuide            : 25146
 *   Rentalcars.com          : 9922
 *   Skyscanner              : 1315
 */

// ─── TODO: Replace with your AWIN Publisher ID ───────────────────────────────
const AWIN_ID = 'YOUR_AWIN_ID'

// ─── AWIN Merchant IDs — verify in AWIN dashboard ────────────────────────────
const MERCHANT = {
  BOOKING:      '596',
  HOTELS_COM:   '14758',
  GETYOURGUIDE: '25146',
  RENTALCARS:   '9922',
  SKYSCANNER:   '1315',
}

/**
 * Build an AWIN deep link.
 * @param merchantId - AWIN merchant ID
 * @param destinationUrl - The final URL the user lands on (will be encoded)
 */
function awin(merchantId: string, destinationUrl: string): string {
  const encoded = encodeURIComponent(destinationUrl)
  return `https://www.awin1.com/cread.php?awinmid=${merchantId}&awinaffid=${AWIN_ID}&ued=${encoded}`
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type AffiliateLinks = {
  /** Booking.com hotel search URL for this city */
  hotelSearchUrl: string
  /** Skyscanner flight search URL */
  flightSearchUrl: string
  /** Airport transfer search */
  transferUrl: string
  /** Car rental comparison (Rentalcars.com) */
  carRentalUrl: string
  /** Experiences and tours (GetYourGuide) */
  experiencesUrl: string
  /** Travel insurance */
  insuranceUrl: string
  /** eSIM for North America travel */
  esimUrl: string
  /** Premium/concierge lead form */
  premiumTravelLeadUrl: string
}

// ─── Shared non-AWIN links ────────────────────────────────────────────────────

const sharedLinks = {
  // SafetyWing has its own affiliate program: safetywing.com/affiliate
  // TODO: Replace YOUR_REF once signed up
  insuranceUrl: 'https://safetywing.com/?referenceID=YOUR_REF',
  // Airalo has its own program: airalo.com/affiliate
  // TODO: Replace YOUR_REF once signed up
  esimUrl: 'https://ref.airalo.com/YOUR_REF?aff=fanforged&package=usa-north-america',
  premiumTravelLeadUrl: '/premium-travel',
}

// ─── City-specific affiliate links ───────────────────────────────────────────

type CityLinks = Omit<AffiliateLinks, 'insuranceUrl' | 'esimUrl' | 'premiumTravelLeadUrl'>

function buildCityLinks(city: {
  bookingSearch: string  // Booking.com search results URL (no tracking params)
  skyscanner: string     // Skyscanner destination page URL
  gyg: string            // GetYourGuide city page URL
  rentalcars: string     // Rentalcars.com city URL
  transfer: string       // Transfer/taxi search URL
}): CityLinks {
  return {
    hotelSearchUrl:  awin(MERCHANT.BOOKING,      city.bookingSearch),
    flightSearchUrl: awin(MERCHANT.SKYSCANNER,   city.skyscanner),
    experiencesUrl:  awin(MERCHANT.GETYOURGUIDE, city.gyg),
    carRentalUrl:    awin(MERCHANT.RENTALCARS,   city.rentalcars),
    transferUrl:     city.transfer, // GetTransfer has its own program — placeholder for now
  }
}

const cityAffiliateLinks: Record<string, AffiliateLinks> = {
  'new-york': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=New+York+City&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/nyca/cheap-flights-to-new-york.html',
      gyg:           'https://www.getyourguide.com/new-york-city-l59/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/new-york/',
      transfer:      'https://www.gettransfer.com/en/city/new-york?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'los-angeles': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Los+Angeles&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/lax/cheap-flights-to-los-angeles.html',
      gyg:           'https://www.getyourguide.com/los-angeles-l32/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/los-angeles/',
      transfer:      'https://www.gettransfer.com/en/city/los-angeles?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'miami': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Miami%2C+Florida&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/mia/cheap-flights-to-miami.html',
      gyg:           'https://www.getyourguide.com/miami-l91/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/miami/',
      transfer:      'https://www.gettransfer.com/en/city/miami?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'dallas': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Dallas%2C+Texas&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/dfw/cheap-flights-to-dallas.html',
      gyg:           'https://www.getyourguide.com/dallas-l97/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/dallas/',
      transfer:      'https://www.gettransfer.com/en/city/dallas?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'houston': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Houston%2C+Texas&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/hou/cheap-flights-to-houston.html',
      gyg:           'https://www.getyourguide.com/houston-l96/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/houston/',
      transfer:      'https://www.gettransfer.com/en/city/houston?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'atlanta': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Atlanta%2C+Georgia&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/atl/cheap-flights-to-atlanta.html',
      gyg:           'https://www.getyourguide.com/atlanta-l99/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/atlanta/',
      transfer:      'https://www.gettransfer.com/en/city/atlanta?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'kansas-city': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Kansas+City%2C+Missouri&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/mci/cheap-flights-to-kansas-city.html',
      gyg:           'https://www.getyourguide.com/kansas-city-l100/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/kansas-city/',
      transfer:      'https://www.gettransfer.com/en/city/kansas-city?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'philadelphia': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Philadelphia%2C+Pennsylvania&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/phl/cheap-flights-to-philadelphia.html',
      gyg:           'https://www.getyourguide.com/philadelphia-l130/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/philadelphia/',
      transfer:      'https://www.gettransfer.com/en/city/philadelphia?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'seattle': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Seattle%2C+Washington&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/sea/cheap-flights-to-seattle.html',
      gyg:           'https://www.getyourguide.com/seattle-l137/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/seattle/',
      transfer:      'https://www.gettransfer.com/en/city/seattle?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'san-francisco': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=San+Francisco%2C+California&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/sfo/cheap-flights-to-san-francisco.html',
      gyg:           'https://www.getyourguide.com/san-francisco-l61/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/san-francisco/',
      transfer:      'https://www.gettransfer.com/en/city/san-francisco?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'boston': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Boston%2C+Massachusetts&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/bos/cheap-flights-to-boston.html',
      gyg:           'https://www.getyourguide.com/boston-l63/',
      rentalcars:    'https://www.rentalcars.com/en/city/us/boston/',
      transfer:      'https://www.gettransfer.com/en/city/boston?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'toronto': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Toronto%2C+Ontario&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/yyz/cheap-flights-to-toronto.html',
      gyg:           'https://www.getyourguide.com/toronto-l96/',
      rentalcars:    'https://www.rentalcars.com/en/city/ca/toronto/',
      transfer:      'https://www.gettransfer.com/en/city/toronto?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'vancouver': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Vancouver%2C+British+Columbia&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/yvr/cheap-flights-to-vancouver.html',
      gyg:           'https://www.getyourguide.com/vancouver-l97/',
      rentalcars:    'https://www.rentalcars.com/en/city/ca/vancouver/',
      transfer:      'https://www.gettransfer.com/en/city/vancouver?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'montreal': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Montreal%2C+Quebec&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/yul/cheap-flights-to-montreal.html',
      gyg:           'https://www.getyourguide.com/montreal-l58/',
      rentalcars:    'https://www.rentalcars.com/en/city/ca/montreal/',
      transfer:      'https://www.gettransfer.com/en/city/montreal?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'mexico-city': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Mexico+City&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/mex/cheap-flights-to-mexico-city.html',
      gyg:           'https://www.getyourguide.com/mexico-city-l96/',
      rentalcars:    'https://www.rentalcars.com/en/city/mx/mexico-city/',
      transfer:      'https://www.gettransfer.com/en/city/mexico-city?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'guadalajara': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Guadalajara%2C+Mexico&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/gdl/cheap-flights-to-guadalajara.html',
      gyg:           'https://www.getyourguide.com/guadalajara-l97/',
      rentalcars:    'https://www.rentalcars.com/en/city/mx/guadalajara/',
      transfer:      'https://www.gettransfer.com/en/city/guadalajara?ref=fanforged',
    }),
    ...sharedLinks,
  },
  'monterrey': {
    ...buildCityLinks({
      bookingSearch: 'https://www.booking.com/searchresults.html?ss=Monterrey%2C+Mexico&checkin=2026-06-11&checkout=2026-07-20',
      skyscanner:    'https://www.skyscanner.com/flights-to/mty/cheap-flights-to-monterrey.html',
      gyg:           'https://www.getyourguide.com/monterrey-l98/',
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
      hotelSearchUrl:  awin(MERCHANT.BOOKING,      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(citySlug)}`),
      flightSearchUrl: awin(MERCHANT.SKYSCANNER,   'https://www.skyscanner.com'),
      experiencesUrl:  awin(MERCHANT.GETYOURGUIDE, 'https://www.getyourguide.com'),
      carRentalUrl:    awin(MERCHANT.RENTALCARS,   'https://www.rentalcars.com'),
      transferUrl:     'https://www.gettransfer.com?ref=fanforged',
      ...sharedLinks,
    }
  )
}
