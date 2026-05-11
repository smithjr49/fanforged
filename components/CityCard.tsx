import Link from 'next/link'
import type { CityMeta } from '@/lib/cities'

type Props = {
  city: CityMeta
  partyCount?: number
}

export default function CityCard({ city, partyCount }: Props) {
  const href = city.kind === 'fan_hub' ? `/cities/${city.slug}` : `/${city.slug}`
  return (
    <Link href={href} className="group block">
      {/* Mobile: compact list-style row. Desktop: taller card. */}
      <div className={`relative bg-gradient-to-br ${city.heroColor} rounded-xl overflow-hidden transition-all duration-200 group-hover:shadow-lg group-hover:shadow-black/30
        h-[88px] sm:h-44
        px-4 py-3 sm:p-6`}>
        {/* Background pattern — desktop only */}
        <div className="hidden sm:block absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_70%_80%,white_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="hidden sm:block absolute -right-3 -bottom-3 text-8xl opacity-[0.12] select-none pointer-events-none rotate-12">⚽</div>

        {/* Mobile layout: single row */}
        <div className="relative z-10 flex items-center gap-3 sm:hidden h-full">
          <span className="text-2xl shrink-0">{city.flag}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-white font-bold text-sm leading-tight truncate">{city.name}</h3>
              {city.kind === 'fan_hub' && (
                <span className="bg-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0">
                  Hub
                </span>
              )}
            </div>
            <p className="text-white/55 text-xs mt-0.5 truncate">{city.stadium ?? city.country}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {partyCount !== undefined && partyCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                {partyCount}
              </span>
            )}
            <span className="text-white/50 text-xs">→</span>
          </div>
        </div>

        {/* Desktop layout: tall card */}
        <div className="hidden sm:flex relative z-10 flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-3xl">{city.flag}</span>
              {city.kind === 'fan_hub' && (
                <span className="bg-white/20 text-white/80 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Fan Hub
                </span>
              )}
              {partyCount !== undefined && partyCount > 0 && (
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {partyCount} parties
                </span>
              )}
            </div>
            <h3 className="text-white font-bold text-lg leading-tight mt-2">{city.name}</h3>
            {city.stadium && (
              <p className="text-white/65 text-xs mt-1 truncate">{city.stadium}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-xs font-medium">{city.country}</span>
            <span className="text-white/70 text-xs group-hover:text-white transition-colors font-medium">
              View guide →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
