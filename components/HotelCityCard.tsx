import Link from 'next/link'
import type { CityMeta } from '@/lib/cities'

type Props = {
  city: CityMeta
  hotelCount?: number
  topArea?: string
}

export default function HotelCityCard({ city, hotelCount, topArea }: Props) {
  return (
    <Link
      href={`/hotels/${city.slug}`}
      className="group block rounded-xl border border-gray-800 bg-gray-900 hover:border-yellow-400/40 transition-all overflow-hidden"
    >
      {/* Color strip */}
      <div className={`h-1.5 bg-gradient-to-r ${city.heroColor}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{city.flag}</span>
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-yellow-400 transition-colors">
                {city.name}
              </h3>
              <p className="text-gray-500 text-[11px]">{city.country}</p>
            </div>
          </div>
          {hotelCount !== undefined && (
            <span className="text-gray-600 text-[10px] shrink-0 mt-0.5">
              {hotelCount} picks
            </span>
          )}
        </div>
        {city.stadium && (
          <p className="text-gray-600 text-[11px] truncate mb-1">📍 {city.stadium}</p>
        )}
        {topArea && (
          <p className="text-gray-500 text-[11px]">Best area: <span className="text-gray-400">{topArea}</span></p>
        )}
        <div className="mt-3 text-yellow-400/70 group-hover:text-yellow-400 text-xs font-semibold transition-colors">
          View hotel areas →
        </div>
      </div>
    </Link>
  )
}
