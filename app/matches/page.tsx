import type { Metadata } from 'next'
import { getLiveScores } from '@/lib/fotmob'
import { CITIES } from '@/lib/cities'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '2026 FIFA World Cup Match Schedule — All 104 Matches',
  description: 'Complete 2026 World Cup match schedule with all 104 games — group stage, knockout rounds, dates, times, stadiums, and host cities across USA, Canada, and Mexico.',
}

type Match = {
  id: string
  date: string
  time: string // ET
  home: string
  away: string
  stage: string
  city: string
  stadium: string
}

const GROUP_MATCHES: Match[] = [
  // ── GROUP A ──────────────────────────────────────────────
  { id: 'a1',  date: '2026-06-11', time: '15:00', home: 'Mexico',       away: 'South Africa', stage: 'Group A', city: 'mexico-city',   stadium: 'Estadio Azteca' },
  { id: 'a2',  date: '2026-06-11', time: '22:00', home: 'South Korea',  away: 'Czechia',      stage: 'Group A', city: 'guadalajara',   stadium: 'Estadio Akron' },
  { id: 'a3',  date: '2026-06-18', time: '12:00', home: 'Czechia',      away: 'South Africa', stage: 'Group A', city: 'atlanta',       stadium: 'Mercedes-Benz Stadium' },
  { id: 'a4',  date: '2026-06-18', time: '21:00', home: 'Mexico',       away: 'South Korea',  stage: 'Group A', city: 'guadalajara',   stadium: 'Estadio Akron' },
  { id: 'a5',  date: '2026-06-24', time: '21:00', home: 'Czechia',      away: 'Mexico',       stage: 'Group A', city: 'mexico-city',   stadium: 'Estadio Azteca' },
  { id: 'a6',  date: '2026-06-24', time: '21:00', home: 'South Africa', away: 'South Korea',  stage: 'Group A', city: 'monterrey',     stadium: 'Estadio BBVA' },
  // ── GROUP B ──────────────────────────────────────────────
  { id: 'b1',  date: '2026-06-12', time: '15:00', home: 'Canada',       away: 'Bosnia and Herzegovina', stage: 'Group B', city: 'toronto',       stadium: 'BMO Field' },
  { id: 'b2',  date: '2026-06-13', time: '15:00', home: 'Qatar',        away: 'Switzerland',  stage: 'Group B', city: 'san-francisco',  stadium: "Levi's Stadium" },
  { id: 'b3',  date: '2026-06-18', time: '15:00', home: 'Switzerland',  away: 'Bosnia and Herzegovina', stage: 'Group B', city: 'los-angeles',  stadium: 'SoFi Stadium' },
  { id: 'b4',  date: '2026-06-18', time: '18:00', home: 'Canada',       away: 'Qatar',        stage: 'Group B', city: 'vancouver',     stadium: 'BC Place' },
  { id: 'b5',  date: '2026-06-24', time: '15:00', home: 'Switzerland',  away: 'Canada',       stage: 'Group B', city: 'vancouver',     stadium: 'BC Place' },
  { id: 'b6',  date: '2026-06-24', time: '15:00', home: 'Bosnia and Herzegovina', away: 'Qatar', stage: 'Group B', city: 'seattle', stadium: 'Lumen Field' },
  // ── GROUP C ──────────────────────────────────────────────
  { id: 'c1',  date: '2026-06-13', time: '18:00', home: 'Brazil',       away: 'Morocco',      stage: 'Group C', city: 'new-york',      stadium: 'MetLife Stadium' },
  { id: 'c2',  date: '2026-06-13', time: '21:00', home: 'Haiti',        away: 'Scotland',     stage: 'Group C', city: 'boston',        stadium: 'Gillette Stadium' },
  { id: 'c3',  date: '2026-06-19', time: '18:00', home: 'Scotland',     away: 'Morocco',      stage: 'Group C', city: 'boston',        stadium: 'Gillette Stadium' },
  { id: 'c4',  date: '2026-06-19', time: '20:30', home: 'Brazil',       away: 'Haiti',        stage: 'Group C', city: 'philadelphia',  stadium: 'Lincoln Financial Field' },
  { id: 'c5',  date: '2026-06-24', time: '18:00', home: 'Scotland',     away: 'Brazil',       stage: 'Group C', city: 'miami',         stadium: 'Hard Rock Stadium' },
  { id: 'c6',  date: '2026-06-24', time: '18:00', home: 'Morocco',      away: 'Haiti',        stage: 'Group C', city: 'atlanta',       stadium: 'Mercedes-Benz Stadium' },
  // ── GROUP D ──────────────────────────────────────────────
  { id: 'd1',  date: '2026-06-12', time: '21:00', home: 'USA',          away: 'Paraguay',     stage: 'Group D', city: 'los-angeles',   stadium: 'SoFi Stadium' },
  { id: 'd2',  date: '2026-06-13', time: '00:00', home: 'Australia',    away: 'Türkiye',      stage: 'Group D', city: 'vancouver',     stadium: 'BC Place' },
  { id: 'd3',  date: '2026-06-19', time: '15:00', home: 'USA',          away: 'Australia',    stage: 'Group D', city: 'seattle',       stadium: 'Lumen Field' },
  { id: 'd4',  date: '2026-06-19', time: '23:00', home: 'Türkiye',      away: 'Paraguay',     stage: 'Group D', city: 'san-francisco', stadium: "Levi's Stadium" },
  { id: 'd5',  date: '2026-06-25', time: '22:00', home: 'Türkiye',      away: 'USA',          stage: 'Group D', city: 'los-angeles',   stadium: 'SoFi Stadium' },
  { id: 'd6',  date: '2026-06-25', time: '22:00', home: 'Paraguay',     away: 'Australia',    stage: 'Group D', city: 'san-francisco', stadium: "Levi's Stadium" },
  // ── GROUP E ──────────────────────────────────────────────
  { id: 'e1',  date: '2026-06-14', time: '13:00', home: 'Germany',      away: 'Curaçao',      stage: 'Group E', city: 'houston',       stadium: 'NRG Stadium' },
  { id: 'e2',  date: '2026-06-14', time: '19:00', home: 'Ivory Coast',  away: 'Ecuador',      stage: 'Group E', city: 'philadelphia',  stadium: 'Lincoln Financial Field' },
  { id: 'e3',  date: '2026-06-20', time: '16:00', home: 'Germany',      away: 'Ivory Coast',  stage: 'Group E', city: 'toronto',       stadium: 'BMO Field' },
  { id: 'e4',  date: '2026-06-20', time: '20:00', home: 'Ecuador',      away: 'Curaçao',      stage: 'Group E', city: 'kansas-city',   stadium: 'Arrowhead Stadium' },
  { id: 'e5',  date: '2026-06-25', time: '16:00', home: 'Curaçao',      away: 'Ivory Coast',  stage: 'Group E', city: 'philadelphia',  stadium: 'Lincoln Financial Field' },
  { id: 'e6',  date: '2026-06-25', time: '16:00', home: 'Ecuador',      away: 'Germany',      stage: 'Group E', city: 'new-york',      stadium: 'MetLife Stadium' },
  // ── GROUP F ──────────────────────────────────────────────
  { id: 'f1',  date: '2026-06-14', time: '16:00', home: 'Netherlands',  away: 'Japan',        stage: 'Group F', city: 'dallas',        stadium: 'AT&T Stadium' },
  { id: 'f2',  date: '2026-06-14', time: '22:00', home: 'Sweden',       away: 'Tunisia',      stage: 'Group F', city: 'monterrey',     stadium: 'Estadio BBVA' },
  { id: 'f3',  date: '2026-06-20', time: '13:00', home: 'Netherlands',  away: 'Sweden',       stage: 'Group F', city: 'houston',       stadium: 'NRG Stadium' },
  { id: 'f4',  date: '2026-06-21', time: '00:00', home: 'Tunisia',      away: 'Japan',        stage: 'Group F', city: 'monterrey',     stadium: 'Estadio BBVA' },
  { id: 'f5',  date: '2026-06-25', time: '19:00', home: 'Japan',        away: 'Sweden',       stage: 'Group F', city: 'dallas',        stadium: 'AT&T Stadium' },
  { id: 'f6',  date: '2026-06-25', time: '19:00', home: 'Tunisia',      away: 'Netherlands',  stage: 'Group F', city: 'kansas-city',   stadium: 'Arrowhead Stadium' },
  // ── GROUP G ──────────────────────────────────────────────
  { id: 'g1',  date: '2026-06-15', time: '15:00', home: 'Belgium',      away: 'Egypt',        stage: 'Group G', city: 'seattle',       stadium: 'Lumen Field' },
  { id: 'g2',  date: '2026-06-15', time: '21:00', home: 'Iran',         away: 'New Zealand',  stage: 'Group G', city: 'los-angeles',   stadium: 'SoFi Stadium' },
  { id: 'g3',  date: '2026-06-21', time: '15:00', home: 'Belgium',      away: 'Iran',         stage: 'Group G', city: 'los-angeles',   stadium: 'SoFi Stadium' },
  { id: 'g4',  date: '2026-06-21', time: '21:00', home: 'New Zealand',  away: 'Egypt',        stage: 'Group G', city: 'vancouver',     stadium: 'BC Place' },
  { id: 'g5',  date: '2026-06-26', time: '23:00', home: 'Egypt',        away: 'Iran',         stage: 'Group G', city: 'seattle',       stadium: 'Lumen Field' },
  { id: 'g6',  date: '2026-06-26', time: '23:00', home: 'New Zealand',  away: 'Belgium',      stage: 'Group G', city: 'vancouver',     stadium: 'BC Place' },
  // ── GROUP H ──────────────────────────────────────────────
  { id: 'h1',  date: '2026-06-15', time: '12:00', home: 'Spain',        away: 'Cape Verde',   stage: 'Group H', city: 'atlanta',       stadium: 'Mercedes-Benz Stadium' },
  { id: 'h2',  date: '2026-06-15', time: '18:00', home: 'Saudi Arabia', away: 'Uruguay',      stage: 'Group H', city: 'miami',         stadium: 'Hard Rock Stadium' },
  { id: 'h3',  date: '2026-06-21', time: '12:00', home: 'Spain',        away: 'Saudi Arabia', stage: 'Group H', city: 'atlanta',       stadium: 'Mercedes-Benz Stadium' },
  { id: 'h4',  date: '2026-06-21', time: '18:00', home: 'Uruguay',      away: 'Cape Verde',   stage: 'Group H', city: 'miami',         stadium: 'Hard Rock Stadium' },
  { id: 'h5',  date: '2026-06-26', time: '20:00', home: 'Cape Verde',   away: 'Saudi Arabia', stage: 'Group H', city: 'houston',       stadium: 'NRG Stadium' },
  { id: 'h6',  date: '2026-06-26', time: '20:00', home: 'Uruguay',      away: 'Spain',        stage: 'Group H', city: 'guadalajara',   stadium: 'Estadio Akron' },
  // ── GROUP I ──────────────────────────────────────────────
  { id: 'i1',  date: '2026-06-16', time: '15:00', home: 'France',       away: 'Senegal',      stage: 'Group I', city: 'new-york',      stadium: 'MetLife Stadium' },
  { id: 'i2',  date: '2026-06-16', time: '18:00', home: 'Iraq',         away: 'Norway',       stage: 'Group I', city: 'boston',        stadium: 'Gillette Stadium' },
  { id: 'i3',  date: '2026-06-22', time: '17:00', home: 'France',       away: 'Iraq',         stage: 'Group I', city: 'philadelphia',  stadium: 'Lincoln Financial Field' },
  { id: 'i4',  date: '2026-06-22', time: '20:00', home: 'Norway',       away: 'Senegal',      stage: 'Group I', city: 'new-york',      stadium: 'MetLife Stadium' },
  { id: 'i5',  date: '2026-06-26', time: '15:00', home: 'Norway',       away: 'France',       stage: 'Group I', city: 'boston',        stadium: 'Gillette Stadium' },
  { id: 'i6',  date: '2026-06-26', time: '15:00', home: 'Senegal',      away: 'Iraq',         stage: 'Group I', city: 'toronto',       stadium: 'BMO Field' },
  // ── GROUP J ──────────────────────────────────────────────
  { id: 'j1',  date: '2026-06-16', time: '21:00', home: 'Argentina',    away: 'Algeria',      stage: 'Group J', city: 'kansas-city',   stadium: 'Arrowhead Stadium' },
  { id: 'j2',  date: '2026-06-17', time: '00:00', home: 'Austria',      away: 'Jordan',       stage: 'Group J', city: 'san-francisco', stadium: "Levi's Stadium" },
  { id: 'j3',  date: '2026-06-22', time: '13:00', home: 'Argentina',    away: 'Austria',      stage: 'Group J', city: 'dallas',        stadium: 'AT&T Stadium' },
  { id: 'j4',  date: '2026-06-22', time: '23:00', home: 'Jordan',       away: 'Algeria',      stage: 'Group J', city: 'san-francisco', stadium: "Levi's Stadium" },
  { id: 'j5',  date: '2026-06-27', time: '22:00', home: 'Algeria',      away: 'Austria',      stage: 'Group J', city: 'kansas-city',   stadium: 'Arrowhead Stadium' },
  { id: 'j6',  date: '2026-06-27', time: '22:00', home: 'Jordan',       away: 'Argentina',    stage: 'Group J', city: 'dallas',        stadium: 'AT&T Stadium' },
  // ── GROUP K ──────────────────────────────────────────────
  { id: 'k1',  date: '2026-06-17', time: '13:00', home: 'Portugal',     away: 'DR Congo',     stage: 'Group K', city: 'houston',       stadium: 'NRG Stadium' },
  { id: 'k2',  date: '2026-06-17', time: '22:00', home: 'Uzbekistan',   away: 'Colombia',     stage: 'Group K', city: 'mexico-city',   stadium: 'Estadio Azteca' },
  { id: 'k3',  date: '2026-06-23', time: '13:00', home: 'Portugal',     away: 'Uzbekistan',   stage: 'Group K', city: 'houston',       stadium: 'NRG Stadium' },
  { id: 'k4',  date: '2026-06-23', time: '22:00', home: 'Colombia',     away: 'DR Congo',     stage: 'Group K', city: 'guadalajara',   stadium: 'Estadio Akron' },
  { id: 'k5',  date: '2026-06-27', time: '19:30', home: 'Colombia',     away: 'Portugal',     stage: 'Group K', city: 'miami',         stadium: 'Hard Rock Stadium' },
  { id: 'k6',  date: '2026-06-27', time: '19:30', home: 'DR Congo',     away: 'Uzbekistan',   stage: 'Group K', city: 'atlanta',       stadium: 'Mercedes-Benz Stadium' },
  // ── GROUP L ──────────────────────────────────────────────
  { id: 'l1',  date: '2026-06-17', time: '16:00', home: 'England',      away: 'Croatia',      stage: 'Group L', city: 'dallas',        stadium: 'AT&T Stadium' },
  { id: 'l2',  date: '2026-06-17', time: '19:00', home: 'Ghana',        away: 'Panama',       stage: 'Group L', city: 'toronto',       stadium: 'BMO Field' },
  { id: 'l3',  date: '2026-06-23', time: '16:00', home: 'England',      away: 'Ghana',        stage: 'Group L', city: 'boston',        stadium: 'Gillette Stadium' },
  { id: 'l4',  date: '2026-06-23', time: '19:00', home: 'Panama',       away: 'Croatia',      stage: 'Group L', city: 'toronto',       stadium: 'BMO Field' },
  { id: 'l5',  date: '2026-06-27', time: '17:00', home: 'Panama',       away: 'England',      stage: 'Group L', city: 'new-york',      stadium: 'MetLife Stadium' },
  { id: 'l6',  date: '2026-06-27', time: '17:00', home: 'Croatia',      away: 'Ghana',        stage: 'Group L', city: 'philadelphia',  stadium: 'Lincoln Financial Field' },
]

type KnockoutMatch = {
  id: string
  matchNum: number
  date: string
  time: string
  home: string
  away: string
  stage: string
  city: string
  stadium: string
}

const KNOCKOUT_MATCHES: KnockoutMatch[] = [
  // ── ROUND OF 32 ─────────────────────────────────────────
  { id: 'r32-1',  matchNum: 73, date: '2026-06-28', time: '15:00', home: '2nd A', away: '2nd B',              stage: 'Round of 32', city: 'los-angeles',  stadium: 'SoFi Stadium' },
  { id: 'r32-2',  matchNum: 74, date: '2026-06-29', time: '13:00', home: '1st C', away: '2nd F',              stage: 'Round of 32', city: 'houston',      stadium: 'NRG Stadium' },
  { id: 'r32-3',  matchNum: 75, date: '2026-06-29', time: '16:30', home: '1st E', away: 'Best 3rd',           stage: 'Round of 32', city: 'boston',       stadium: 'Gillette Stadium' },
  { id: 'r32-4',  matchNum: 76, date: '2026-06-29', time: '21:00', home: '1st F', away: '2nd C',              stage: 'Round of 32', city: 'monterrey',    stadium: 'Estadio BBVA' },
  { id: 'r32-5',  matchNum: 77, date: '2026-06-30', time: '13:00', home: '2nd E', away: '2nd I',              stage: 'Round of 32', city: 'dallas',       stadium: 'AT&T Stadium' },
  { id: 'r32-6',  matchNum: 78, date: '2026-06-30', time: '17:00', home: '1st I', away: 'Best 3rd',           stage: 'Round of 32', city: 'new-york',     stadium: 'MetLife Stadium' },
  { id: 'r32-7',  matchNum: 79, date: '2026-06-30', time: '21:00', home: '1st A', away: 'Best 3rd',           stage: 'Round of 32', city: 'mexico-city',  stadium: 'Estadio Azteca' },
  { id: 'r32-8',  matchNum: 80, date: '2026-07-01', time: '12:00', home: '1st L', away: 'Best 3rd',           stage: 'Round of 32', city: 'atlanta',      stadium: 'Mercedes-Benz Stadium' },
  { id: 'r32-9',  matchNum: 81, date: '2026-07-01', time: '16:00', home: '1st G', away: 'Best 3rd',           stage: 'Round of 32', city: 'seattle',      stadium: 'Lumen Field' },
  { id: 'r32-10', matchNum: 82, date: '2026-07-01', time: '20:00', home: '1st D', away: 'Best 3rd',           stage: 'Round of 32', city: 'san-francisco',stadium: "Levi's Stadium" },
  { id: 'r32-11', matchNum: 83, date: '2026-07-02', time: '15:00', home: '1st H', away: '2nd J',              stage: 'Round of 32', city: 'los-angeles',  stadium: 'SoFi Stadium' },
  { id: 'r32-12', matchNum: 84, date: '2026-07-02', time: '19:00', home: '2nd K', away: '2nd L',              stage: 'Round of 32', city: 'toronto',      stadium: 'BMO Field' },
  { id: 'r32-13', matchNum: 85, date: '2026-07-02', time: '23:00', home: '1st B', away: 'Best 3rd',           stage: 'Round of 32', city: 'vancouver',    stadium: 'BC Place' },
  { id: 'r32-14', matchNum: 86, date: '2026-07-03', time: '14:00', home: '2nd D', away: '2nd G',              stage: 'Round of 32', city: 'dallas',       stadium: 'AT&T Stadium' },
  { id: 'r32-15', matchNum: 87, date: '2026-07-03', time: '18:00', home: '1st J', away: '2nd H',              stage: 'Round of 32', city: 'miami',        stadium: 'Hard Rock Stadium' },
  { id: 'r32-16', matchNum: 88, date: '2026-07-03', time: '21:30', home: '1st K', away: 'Best 3rd',           stage: 'Round of 32', city: 'kansas-city',  stadium: 'Arrowhead Stadium' },
  // ── ROUND OF 16 ─────────────────────────────────────────
  { id: 'r16-1',  matchNum: 89, date: '2026-07-04', time: '13:00', home: 'W74',   away: 'W77',                stage: 'Round of 16', city: 'houston',      stadium: 'NRG Stadium' },
  { id: 'r16-2',  matchNum: 90, date: '2026-07-04', time: '17:00', home: 'W73',   away: 'W75',                stage: 'Round of 16', city: 'philadelphia', stadium: 'Lincoln Financial Field' },
  { id: 'r16-3',  matchNum: 91, date: '2026-07-05', time: '16:00', home: 'W76',   away: 'W78',                stage: 'Round of 16', city: 'new-york',     stadium: 'MetLife Stadium' },
  { id: 'r16-4',  matchNum: 92, date: '2026-07-05', time: '20:00', home: 'W79',   away: 'W80',                stage: 'Round of 16', city: 'mexico-city',  stadium: 'Estadio Azteca' },
  { id: 'r16-5',  matchNum: 93, date: '2026-07-06', time: '15:00', home: 'W83',   away: 'W84',                stage: 'Round of 16', city: 'dallas',       stadium: 'AT&T Stadium' },
  { id: 'r16-6',  matchNum: 94, date: '2026-07-06', time: '20:00', home: 'W81',   away: 'W82',                stage: 'Round of 16', city: 'seattle',      stadium: 'Lumen Field' },
  { id: 'r16-7',  matchNum: 95, date: '2026-07-07', time: '12:00', home: 'W86',   away: 'W88',                stage: 'Round of 16', city: 'atlanta',      stadium: 'Mercedes-Benz Stadium' },
  { id: 'r16-8',  matchNum: 96, date: '2026-07-07', time: '16:00', home: 'W85',   away: 'W87',                stage: 'Round of 16', city: 'vancouver',    stadium: 'BC Place' },
  // ── QUARTER-FINALS ──────────────────────────────────────
  { id: 'qf1',    matchNum: 97, date: '2026-07-09', time: '16:00', home: 'W89',   away: 'W90',                stage: 'Quarter-final', city: 'boston',     stadium: 'Gillette Stadium' },
  { id: 'qf2',    matchNum: 98, date: '2026-07-10', time: '15:00', home: 'W93',   away: 'W94',                stage: 'Quarter-final', city: 'los-angeles',stadium: 'SoFi Stadium' },
  { id: 'qf3',    matchNum: 99, date: '2026-07-11', time: '17:00', home: 'W91',   away: 'W92',                stage: 'Quarter-final', city: 'miami',      stadium: 'Hard Rock Stadium' },
  { id: 'qf4',    matchNum: 100,date: '2026-07-11', time: '21:00', home: 'W95',   away: 'W96',                stage: 'Quarter-final', city: 'kansas-city',stadium: 'Arrowhead Stadium' },
  // ── SEMI-FINALS ─────────────────────────────────────────
  { id: 'sf1',    matchNum: 101,date: '2026-07-14', time: '15:00', home: 'W97',   away: 'W98',                stage: 'Semi-final',  city: 'dallas',       stadium: 'AT&T Stadium' },
  { id: 'sf2',    matchNum: 102,date: '2026-07-15', time: '15:00', home: 'W99',   away: 'W100',               stage: 'Semi-final',  city: 'atlanta',      stadium: 'Mercedes-Benz Stadium' },
  // ── 3RD PLACE ───────────────────────────────────────────
  { id: '3rd',    matchNum: 103,date: '2026-07-18', time: '17:00', home: 'L101',  away: 'L102',               stage: '3rd Place',   city: 'miami',        stadium: 'Hard Rock Stadium' },
  // ── FINAL ───────────────────────────────────────────────
  { id: 'final',  matchNum: 104,date: '2026-07-19', time: '15:00', home: 'TBD',   away: 'TBD',                stage: 'Final',       city: 'new-york',     stadium: 'MetLife Stadium' },
]

const STAGE_COLORS: Record<string, string> = {
  'Round of 32':   'bg-blue-900/30 text-blue-300 border-blue-800',
  'Round of 16':   'bg-purple-900/30 text-purple-300 border-purple-800',
  'Quarter-final': 'bg-amber-900/30 text-amber-300 border-amber-800',
  'Semi-final':    'bg-orange-900/30 text-orange-300 border-orange-800',
  '3rd Place':     'bg-gray-800 text-gray-300 border-gray-700',
  'Final':         'bg-yellow-900/40 text-yellow-300 border-yellow-700',
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm} ET`
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

// Group matches by stage label
const GROUP_LABELS = ['Group A','Group B','Group C','Group D','Group E','Group F','Group G','Group H','Group I','Group J','Group K','Group L']

export default async function MatchesPage() {
  let liveMatches: import('@/lib/fotmob').FotMobMatch[] = []
  try {
    const { matches } = await getLiveScores()
    liveMatches = matches
  } catch {
    // silently fail
  }

  const cityMap = Object.fromEntries(CITIES.map((c) => [c.slug, c]))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Match Schedule</h1>
        <p className="text-gray-400 mt-2">All 104 matches · June 11 – July 19, 2026</p>
        <p className="text-gray-600 text-xs mt-1">All times Eastern (ET)</p>
      </div>

      {/* Live scores strip */}
      {liveMatches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
            <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Live Now</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {liveMatches
              .filter((m) => m.status.started && !m.status.finished)
              .map((match) => (
                <div key={match.id} className="bg-green-900/20 border border-green-700/40 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-white font-medium">{match.home.name}</span>
                  <span className="text-white font-bold text-lg px-3">
                    {match.home.score ?? 0} – {match.away.score ?? 0}
                  </span>
                  <span className="text-white font-medium">{match.away.name}</span>
                  {match.status.liveTime && (
                    <span className="text-green-400 text-sm font-bold ml-2">{match.status.liveTime.short}′</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Group Stage */}
      <div className="space-y-6 mb-10">
        <h2 className="text-xl font-bold text-white">Group Stage <span className="text-gray-500 font-normal text-base ml-2">June 11–27</span></h2>
        {GROUP_LABELS.map((groupLabel) => {
          const matches = GROUP_MATCHES.filter((m) => m.stage === groupLabel)
          return (
            <div key={groupLabel} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="bg-gray-800/80 px-5 py-3">
                <span className="text-white font-semibold text-sm">{groupLabel}</span>
              </div>
              <div className="divide-y divide-gray-800/60">
                {matches.map((match) => {
                  const city = cityMap[match.city]
                  return (
                    <div key={match.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-800/30 transition-colors">
                      <div className="w-28 shrink-0">
                        <p className="text-gray-400 text-xs">{formatDate(match.date)}</p>
                        <p className="text-gray-600 text-xs">{formatTime(match.time)}</p>
                      </div>
                      <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
                        <span className="text-white text-sm font-medium text-right flex-1 truncate">{match.home}</span>
                        <span className="text-gray-600 text-xs px-1.5 py-0.5 bg-gray-800 rounded shrink-0">vs</span>
                        <span className="text-white text-sm font-medium text-left flex-1 truncate">{match.away}</span>
                      </div>
                      <div className="w-36 shrink-0 text-right hidden sm:block">
                        {city ? (
                          <Link href={`/${match.city}/watch-parties`} className="text-yellow-400 hover:text-yellow-300 text-xs transition-colors">
                            {city.flag} {city.name} →
                          </Link>
                        ) : (
                          <span className="text-gray-600 text-xs">{match.stadium}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Knockout Stage */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Knockout Stage <span className="text-gray-500 font-normal text-base ml-2">June 28 – July 19</span></h2>
        {(['Round of 32', 'Round of 16', 'Quarter-final', 'Semi-final', '3rd Place', 'Final'] as const).map((stage) => {
          const matches = KNOCKOUT_MATCHES.filter((m) => m.stage === stage)
          const colorClass = STAGE_COLORS[stage] ?? 'bg-gray-800 text-gray-300 border-gray-700'
          const dateRange: Record<string, string> = {
            'Round of 32':   'June 28 – July 3',
            'Round of 16':   'July 4–7',
            'Quarter-final': 'July 9–11',
            'Semi-final':    'July 14–15',
            '3rd Place':     'July 18',
            'Final':         'July 19 · MetLife Stadium, New York',
          }
          return (
            <div key={stage} className={`rounded-2xl border overflow-hidden ${colorClass}`}>
              <div className="bg-black/20 px-5 py-3 flex items-center justify-between">
                <span className="font-semibold text-sm">{stage}</span>
                <span className="text-xs opacity-70">{dateRange[stage]}</span>
              </div>
              <div className="divide-y divide-white/5">
                {matches.map((match) => {
                  const city = cityMap[match.city]
                  return (
                    <div key={match.id} className="px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors">
                      <div className="w-28 shrink-0">
                        <p className="text-xs opacity-80">{formatDate(match.date)}</p>
                        <p className="text-xs opacity-50">{formatTime(match.time)}</p>
                      </div>
                      <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-right flex-1 truncate opacity-90">{match.home}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-black/20 rounded shrink-0 opacity-60">vs</span>
                        <span className="text-sm font-medium text-left flex-1 truncate opacity-90">{match.away}</span>
                      </div>
                      <div className="w-36 shrink-0 text-right hidden sm:block">
                        {city ? (
                          <Link href={`/${match.city}/watch-parties`} className="text-xs opacity-70 hover:opacity-100 transition-opacity">
                            {city.flag} {city.name} →
                          </Link>
                        ) : (
                          <span className="text-xs opacity-50">{match.stadium}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
