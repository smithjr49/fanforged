# FanForged City Guide Expansion Spec

FanForged city guides should compete on practical travel depth, not copied copy. Use this as the template for every host city and high-value fan hub.

## Positioning

- Brand as an independent 2026 soccer travel and watch-party guide.
- Avoid official-sounding claims unless citing an official external source.
- Use "host region", "fan hub", "match day", "tournament", and "watch parties" as the default language.
- New York should display as New York / New Jersey.
- Montreal should remain a fan hub, not a host city.

## Required Sections

Each full guide should support:

- Hero summary
- Quick facts
- Weather and packing
- Airports and arrival
- Match schedule summary
- Stadium and match-day transport
- Fan hubs and public viewing areas
- Where to stay by neighborhood
- Affiliate hotel cards and booking links
- Sports bars and watch spots
- Local soccer culture
- Tourist hits and local favorites
- Food and nightlife areas
- Local resources and transit apps
- Walkability and bike notes
- Pickup soccer
- Outdoors and day trips
- Safety and match-day tips

## Affiliate Rules

- Keep affiliate URLs in `data/cities/*.json`.
- Use `rel="sponsored nofollow noopener noreferrer"` for affiliate links.
- Open affiliate links in a new tab.
- Keep the disclosure near hotels:
  "Some travel links may earn us a small commission at no extra cost to you."
- Do not create fake affiliate accounts or fake recommendations.

## JSON Fields

The renderer supports these optional top-level fields:

- `quick_facts`
- `weather`
- `airports`
- `match_schedule`
- `stadium_transport`
- `fan_hubs`
- `neighborhoods`
- `booking_links`
- `soccer_culture`
- `things_to_do`
- `food_nightlife`
- `local_resources`
- `walk_bike`
- `pickup_soccer`
- `outdoors_day_trips`
- `safety_tips`

Existing compact fields remain supported:

- `hero`
- `stadium`
- `hotels`
- `bars`
- `transport`
- `fan_zones`

## Priority Rollout

Expand in this order:

1. New York / New Jersey
2. Miami
3. Los Angeles
4. Toronto
5. Vancouver
6. Mexico City
7. Dallas
8. Atlanta
9. Seattle
10. Philadelphia
11. Boston
12. San Francisco Bay Area
13. Houston
14. Kansas City
15. Guadalajara
16. Monterrey
17. Montreal as a fan hub

## Quality Bar

A complete guide should help a fan answer:

- Where should I stay?
- Which airport should I use?
- How do I get to the stadium?
- What can go wrong on match day?
- Where can I watch if I do not have tickets?
- Which neighborhoods fit my trip style?
- What can I do between matches?
- How do I book hotels through FanForged affiliate links?

