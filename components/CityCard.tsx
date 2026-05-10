import Link from 'next/link'
import type { CityMeta } from '@/lib/cities'

type Props = {
  city: CityMeta
  partyCount?: number
}

export default function CityCard({ city, partyCount }: Props) {
  return (
    <Link href={`/${city.slug}`} className="group block">
      <div className={`relative bg-gradient-to-br ${city.heroColor} rounded-2xl p-6 h-48 overflow-hidden transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/30`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_70%_80%,white_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute -right-3 -bottom-3 text-8xl opacity-[0.12] select-none pointer-events-none rotate-12">⚽</div>

        <div className="relative z-10 flex flex-col justify-between h-full">
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
