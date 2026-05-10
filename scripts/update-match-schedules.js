#!/usr/bin/env node
// Updates match_schedule in all city JSON files with real FIFA 2026 data

const fs = require('fs')
const path = require('path')

const CITIES_DIR = path.join(__dirname, '../data/cities')

// All matches from the confirmed draw, grouped by city
// Times are in LOCAL city time, format: "H:MM AM/PM TZ"
const CITY_SCHEDULES = {
  'atlanta': [
    { date: 'June 15', local_time: '12:00 PM ET', round: 'Group H', teams_or_placeholder: 'Spain vs Cape Verde', stadium: 'Mercedes-Benz Stadium' },
    { date: 'June 18', local_time: '12:00 PM ET', round: 'Group A', teams_or_placeholder: 'Czechia vs South Africa', stadium: 'Mercedes-Benz Stadium' },
    { date: 'June 21', local_time: '12:00 PM ET', round: 'Group H', teams_or_placeholder: 'Spain vs Saudi Arabia', stadium: 'Mercedes-Benz Stadium' },
    { date: 'June 24', local_time: '6:00 PM ET', round: 'Group C', teams_or_placeholder: 'Morocco vs Haiti', stadium: 'Mercedes-Benz Stadium' },
    { date: 'June 27', local_time: '7:30 PM ET', round: 'Group K', teams_or_placeholder: 'DR Congo vs Uzbekistan', stadium: 'Mercedes-Benz Stadium' },
    { date: 'July 1',  local_time: '12:00 PM ET', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 80)', stadium: 'Mercedes-Benz Stadium' },
    { date: 'July 7',  local_time: '12:00 PM ET', round: 'Round of 16', teams_or_placeholder: 'TBD (Match 95)', stadium: 'Mercedes-Benz Stadium' },
    { date: 'July 15', local_time: '3:00 PM ET',  round: 'Semi-final', teams_or_placeholder: 'TBD (Semi-final 2)', stadium: 'Mercedes-Benz Stadium' },
  ],
  'boston': [
    { date: 'June 13', local_time: '6:00 PM ET', round: 'Group C', teams_or_placeholder: 'Haiti vs Scotland', stadium: 'Gillette Stadium' },
    { date: 'June 16', local_time: '6:00 PM ET', round: 'Group I', teams_or_placeholder: 'Iraq vs Norway', stadium: 'Gillette Stadium' },
    { date: 'June 19', local_time: '6:00 PM ET', round: 'Group C', teams_or_placeholder: 'Scotland vs Morocco', stadium: 'Gillette Stadium' },
    { date: 'June 23', local_time: '4:00 PM ET', round: 'Group L', teams_or_placeholder: 'England vs Ghana', stadium: 'Gillette Stadium' },
    { date: 'June 26', local_time: '3:00 PM ET', round: 'Group I', teams_or_placeholder: 'Norway vs France', stadium: 'Gillette Stadium' },
    { date: 'June 29', local_time: '4:30 PM ET', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 75)', stadium: 'Gillette Stadium' },
    { date: 'July 9',  local_time: '4:00 PM ET', round: 'Quarter-final', teams_or_placeholder: 'TBD (Quarter-final 1)', stadium: 'Gillette Stadium' },
  ],
  'dallas': [
    { date: 'June 14', local_time: '3:00 PM CT', round: 'Group F', teams_or_placeholder: 'Netherlands vs Japan', stadium: 'AT&T Stadium' },
    { date: 'June 17', local_time: '3:00 PM CT', round: 'Group L', teams_or_placeholder: 'England vs Croatia', stadium: 'AT&T Stadium' },
    { date: 'June 22', local_time: '12:00 PM CT', round: 'Group J', teams_or_placeholder: 'Argentina vs Austria', stadium: 'AT&T Stadium' },
    { date: 'June 25', local_time: '6:00 PM CT', round: 'Group F', teams_or_placeholder: 'Japan vs Sweden', stadium: 'AT&T Stadium' },
    { date: 'June 27', local_time: '9:00 PM CT', round: 'Group J', teams_or_placeholder: 'Jordan vs Argentina', stadium: 'AT&T Stadium' },
    { date: 'June 30', local_time: '12:00 PM CT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 77)', stadium: 'AT&T Stadium' },
    { date: 'July 3',  local_time: '1:00 PM CT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 86)', stadium: 'AT&T Stadium' },
    { date: 'July 6',  local_time: '2:00 PM CT', round: 'Round of 16', teams_or_placeholder: 'TBD (Match 93)', stadium: 'AT&T Stadium' },
    { date: 'July 14', local_time: '2:00 PM CT', round: 'Semi-final', teams_or_placeholder: 'TBD (Semi-final 1)', stadium: 'AT&T Stadium' },
  ],
  'houston': [
    { date: 'June 14', local_time: '12:00 PM CT', round: 'Group E', teams_or_placeholder: 'Germany vs Curaçao', stadium: 'NRG Stadium' },
    { date: 'June 17', local_time: '12:00 PM CT', round: 'Group K', teams_or_placeholder: 'Portugal vs DR Congo', stadium: 'NRG Stadium' },
    { date: 'June 20', local_time: '12:00 PM CT', round: 'Group F', teams_or_placeholder: 'Netherlands vs Sweden', stadium: 'NRG Stadium' },
    { date: 'June 23', local_time: '12:00 PM CT', round: 'Group K', teams_or_placeholder: 'Portugal vs Uzbekistan', stadium: 'NRG Stadium' },
    { date: 'June 26', local_time: '7:00 PM CT', round: 'Group H', teams_or_placeholder: 'Cape Verde vs Saudi Arabia', stadium: 'NRG Stadium' },
    { date: 'June 29', local_time: '12:00 PM CT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 74)', stadium: 'NRG Stadium' },
    { date: 'July 4',  local_time: '12:00 PM CT', round: 'Round of 16', teams_or_placeholder: 'TBD (Match 89)', stadium: 'NRG Stadium' },
  ],
  'kansas-city': [
    { date: 'June 16', local_time: '8:00 PM CT', round: 'Group J', teams_or_placeholder: 'Argentina vs Algeria', stadium: 'Arrowhead Stadium' },
    { date: 'June 20', local_time: '7:00 PM CT', round: 'Group E', teams_or_placeholder: 'Ecuador vs Curaçao', stadium: 'Arrowhead Stadium' },
    { date: 'June 25', local_time: '6:00 PM CT', round: 'Group F', teams_or_placeholder: 'Tunisia vs Netherlands', stadium: 'Arrowhead Stadium' },
    { date: 'June 27', local_time: '9:00 PM CT', round: 'Group J', teams_or_placeholder: 'Algeria vs Austria', stadium: 'Arrowhead Stadium' },
    { date: 'July 3',  local_time: '8:30 PM CT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 88)', stadium: 'Arrowhead Stadium' },
    { date: 'July 11', local_time: '8:00 PM CT', round: 'Quarter-final', teams_or_placeholder: 'TBD (Quarter-final 4)', stadium: 'Arrowhead Stadium' },
  ],
  'los-angeles': [
    { date: 'June 12', local_time: '6:00 PM PT', round: 'Group D', teams_or_placeholder: 'USA vs Paraguay', stadium: 'SoFi Stadium' },
    { date: 'June 15', local_time: '6:00 PM PT', round: 'Group G', teams_or_placeholder: 'Iran vs New Zealand', stadium: 'SoFi Stadium' },
    { date: 'June 18', local_time: '12:00 PM PT', round: 'Group B', teams_or_placeholder: 'Switzerland vs Bosnia and Herzegovina', stadium: 'SoFi Stadium' },
    { date: 'June 21', local_time: '12:00 PM PT', round: 'Group G', teams_or_placeholder: 'Belgium vs Iran', stadium: 'SoFi Stadium' },
    { date: 'June 25', local_time: '7:00 PM PT', round: 'Group D', teams_or_placeholder: 'Türkiye vs USA', stadium: 'SoFi Stadium' },
    { date: 'June 28', local_time: '12:00 PM PT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 73)', stadium: 'SoFi Stadium' },
    { date: 'July 2',  local_time: '12:00 PM PT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 83)', stadium: 'SoFi Stadium' },
    { date: 'July 10', local_time: '12:00 PM PT', round: 'Quarter-final', teams_or_placeholder: 'TBD (Quarter-final 2)', stadium: 'SoFi Stadium' },
  ],
  'miami': [
    { date: 'June 15', local_time: '6:00 PM ET', round: 'Group H', teams_or_placeholder: 'Saudi Arabia vs Uruguay', stadium: 'Hard Rock Stadium' },
    { date: 'June 21', local_time: '6:00 PM ET', round: 'Group H', teams_or_placeholder: 'Uruguay vs Cape Verde', stadium: 'Hard Rock Stadium' },
    { date: 'June 24', local_time: '6:00 PM ET', round: 'Group C', teams_or_placeholder: 'Scotland vs Brazil', stadium: 'Hard Rock Stadium' },
    { date: 'June 27', local_time: '7:30 PM ET', round: 'Group K', teams_or_placeholder: 'Colombia vs Portugal', stadium: 'Hard Rock Stadium' },
    { date: 'July 3',  local_time: '6:00 PM ET', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 87)', stadium: 'Hard Rock Stadium' },
    { date: 'July 11', local_time: '5:00 PM ET', round: 'Quarter-final', teams_or_placeholder: 'TBD (Quarter-final 3)', stadium: 'Hard Rock Stadium' },
    { date: 'July 18', local_time: '5:00 PM ET', round: '3rd Place', teams_or_placeholder: 'TBD — 3rd Place Match', stadium: 'Hard Rock Stadium' },
  ],
  'new-york': [
    { date: 'June 13', local_time: '6:00 PM ET', round: 'Group C', teams_or_placeholder: 'Brazil vs Morocco', stadium: 'MetLife Stadium' },
    { date: 'June 16', local_time: '3:00 PM ET', round: 'Group I', teams_or_placeholder: 'France vs Senegal', stadium: 'MetLife Stadium' },
    { date: 'June 22', local_time: '8:00 PM ET', round: 'Group I', teams_or_placeholder: 'Norway vs Senegal', stadium: 'MetLife Stadium' },
    { date: 'June 25', local_time: '4:00 PM ET', round: 'Group E', teams_or_placeholder: 'Ecuador vs Germany', stadium: 'MetLife Stadium' },
    { date: 'June 27', local_time: '5:00 PM ET', round: 'Group L', teams_or_placeholder: 'Panama vs England', stadium: 'MetLife Stadium' },
    { date: 'June 30', local_time: '5:00 PM ET', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 78)', stadium: 'MetLife Stadium' },
    { date: 'July 5',  local_time: '4:00 PM ET', round: 'Round of 16', teams_or_placeholder: 'TBD (Match 91)', stadium: 'MetLife Stadium' },
    { date: 'July 19', local_time: '3:00 PM ET', round: 'FINAL', teams_or_placeholder: '🏆 World Cup Final', stadium: 'MetLife Stadium' },
  ],
  'philadelphia': [
    { date: 'June 14', local_time: '7:00 PM ET', round: 'Group E', teams_or_placeholder: 'Ivory Coast vs Ecuador', stadium: 'Lincoln Financial Field' },
    { date: 'June 19', local_time: '8:30 PM ET', round: 'Group C', teams_or_placeholder: 'Brazil vs Haiti', stadium: 'Lincoln Financial Field' },
    { date: 'June 22', local_time: '5:00 PM ET', round: 'Group I', teams_or_placeholder: 'France vs Iraq', stadium: 'Lincoln Financial Field' },
    { date: 'June 25', local_time: '4:00 PM ET', round: 'Group E', teams_or_placeholder: 'Curaçao vs Ivory Coast', stadium: 'Lincoln Financial Field' },
    { date: 'June 27', local_time: '5:00 PM ET', round: 'Group L', teams_or_placeholder: 'Croatia vs Ghana', stadium: 'Lincoln Financial Field' },
    { date: 'July 4',  local_time: '5:00 PM ET', round: 'Round of 16', teams_or_placeholder: 'TBD (Match 90)', stadium: 'Lincoln Financial Field' },
  ],
  'san-francisco': [
    { date: 'June 13', local_time: '12:00 PM PT', round: 'Group B', teams_or_placeholder: 'Qatar vs Switzerland', stadium: "Levi's Stadium" },
    { date: 'June 16', local_time: '9:00 PM PT', round: 'Group J', teams_or_placeholder: 'Austria vs Jordan', stadium: "Levi's Stadium" },
    { date: 'June 19', local_time: '8:00 PM PT', round: 'Group D', teams_or_placeholder: 'Türkiye vs Paraguay', stadium: "Levi's Stadium" },
    { date: 'June 22', local_time: '8:00 PM PT', round: 'Group J', teams_or_placeholder: 'Jordan vs Algeria', stadium: "Levi's Stadium" },
    { date: 'June 25', local_time: '7:00 PM PT', round: 'Group D', teams_or_placeholder: 'Paraguay vs Australia', stadium: "Levi's Stadium" },
    { date: 'July 1',  local_time: '5:00 PM PT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 82)', stadium: "Levi's Stadium" },
  ],
  'seattle': [
    { date: 'June 15', local_time: '12:00 PM PT', round: 'Group G', teams_or_placeholder: 'Belgium vs Egypt', stadium: 'Lumen Field' },
    { date: 'June 19', local_time: '12:00 PM PT', round: 'Group D', teams_or_placeholder: 'USA vs Australia', stadium: 'Lumen Field' },
    { date: 'June 24', local_time: '12:00 PM PT', round: 'Group B', teams_or_placeholder: 'Bosnia and Herzegovina vs Qatar', stadium: 'Lumen Field' },
    { date: 'June 26', local_time: '8:00 PM PT', round: 'Group G', teams_or_placeholder: 'Egypt vs Iran', stadium: 'Lumen Field' },
    { date: 'July 1',  local_time: '1:00 PM PT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 81)', stadium: 'Lumen Field' },
    { date: 'July 6',  local_time: '5:00 PM PT', round: 'Round of 16', teams_or_placeholder: 'TBD (Match 94)', stadium: 'Lumen Field' },
  ],
  'toronto': [
    { date: 'June 12', local_time: '3:00 PM ET', round: 'Group B', teams_or_placeholder: 'Canada vs Bosnia and Herzegovina', stadium: 'BMO Field' },
    { date: 'June 17', local_time: '7:00 PM ET', round: 'Group L', teams_or_placeholder: 'Ghana vs Panama', stadium: 'BMO Field' },
    { date: 'June 20', local_time: '4:00 PM ET', round: 'Group E', teams_or_placeholder: 'Germany vs Ivory Coast', stadium: 'BMO Field' },
    { date: 'June 23', local_time: '7:00 PM ET', round: 'Group L', teams_or_placeholder: 'Panama vs Croatia', stadium: 'BMO Field' },
    { date: 'June 26', local_time: '3:00 PM ET', round: 'Group I', teams_or_placeholder: 'Senegal vs Iraq', stadium: 'BMO Field' },
    { date: 'July 2',  local_time: '7:00 PM ET', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 84)', stadium: 'BMO Field' },
  ],
  'vancouver': [
    { date: 'June 13', local_time: '9:00 PM PT', round: 'Group D', teams_or_placeholder: 'Australia vs Türkiye', stadium: 'BC Place' },
    { date: 'June 18', local_time: '3:00 PM PT', round: 'Group B', teams_or_placeholder: 'Canada vs Qatar', stadium: 'BC Place' },
    { date: 'June 21', local_time: '6:00 PM PT', round: 'Group G', teams_or_placeholder: 'New Zealand vs Egypt', stadium: 'BC Place' },
    { date: 'June 24', local_time: '12:00 PM PT', round: 'Group B', teams_or_placeholder: 'Switzerland vs Canada', stadium: 'BC Place' },
    { date: 'June 26', local_time: '8:00 PM PT', round: 'Group G', teams_or_placeholder: 'New Zealand vs Belgium', stadium: 'BC Place' },
    { date: 'July 2',  local_time: '8:00 PM PT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 85)', stadium: 'BC Place' },
    { date: 'July 7',  local_time: '1:00 PM PT', round: 'Round of 16', teams_or_placeholder: 'TBD (Match 96)', stadium: 'BC Place' },
  ],
  'mexico-city': [
    { date: 'June 11', local_time: '3:00 PM CT', round: 'Group A', teams_or_placeholder: 'Mexico vs South Africa', stadium: 'Estadio Azteca' },
    { date: 'June 17', local_time: '9:00 PM CT', round: 'Group K', teams_or_placeholder: 'Uzbekistan vs Colombia', stadium: 'Estadio Azteca' },
    { date: 'June 24', local_time: '9:00 PM CT', round: 'Group A', teams_or_placeholder: 'Czechia vs Mexico', stadium: 'Estadio Azteca' },
    { date: 'June 30', local_time: '9:00 PM CT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 79)', stadium: 'Estadio Azteca' },
    { date: 'July 5',  local_time: '8:00 PM CT', round: 'Round of 16', teams_or_placeholder: 'TBD (Match 92)', stadium: 'Estadio Azteca' },
  ],
  'guadalajara': [
    { date: 'June 11', local_time: '10:00 PM CT', round: 'Group A', teams_or_placeholder: 'South Korea vs Czechia', stadium: 'Estadio Akron' },
    { date: 'June 18', local_time: '9:00 PM CT', round: 'Group A', teams_or_placeholder: 'Mexico vs South Korea', stadium: 'Estadio Akron' },
    { date: 'June 23', local_time: '10:00 PM CT', round: 'Group K', teams_or_placeholder: 'Colombia vs DR Congo', stadium: 'Estadio Akron' },
    { date: 'June 26', local_time: '7:00 PM CT', round: 'Group H', teams_or_placeholder: 'Uruguay vs Spain', stadium: 'Estadio Akron' },
  ],
  'monterrey': [
    { date: 'June 14', local_time: '10:00 PM CT', round: 'Group F', teams_or_placeholder: 'Sweden vs Tunisia', stadium: 'Estadio BBVA' },
    { date: 'June 21', local_time: '1:00 AM CT', round: 'Group F', teams_or_placeholder: 'Tunisia vs Japan', stadium: 'Estadio BBVA' },
    { date: 'June 24', local_time: '9:00 PM CT', round: 'Group A', teams_or_placeholder: 'South Africa vs South Korea', stadium: 'Estadio BBVA' },
    { date: 'June 29', local_time: '9:00 PM CT', round: 'Round of 32', teams_or_placeholder: 'TBD (Match 76)', stadium: 'Estadio BBVA' },
  ],
  'montreal': [
    { date: 'TBD', local_time: 'TBD', round: 'No matches', teams_or_placeholder: 'Montreal is not a 2026 World Cup host city. The nearest venues are Toronto and Boston.', stadium: '' },
  ],
}

let updated = 0
let skipped = 0

for (const [citySlug, schedule] of Object.entries(CITY_SCHEDULES)) {
  const filePath = path.join(CITIES_DIR, `${citySlug}.json`)
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${citySlug}.json not found`)
    skipped++
    continue
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  data.match_schedule = schedule
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  console.log(`✓ Updated ${citySlug} — ${schedule.length} matches`)
  updated++
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped`)
