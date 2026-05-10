import Link from 'next/link'
import Image from 'next/image'
import { HOST_CITIES } from '@/lib/cities'

export default function Footer() {
  const usaCities = HOST_CITIES.filter((c) => c.country === 'USA')
  const canadaCities = HOST_CITIES.filter((c) => c.country === 'Canada')
  const mexicoCities = HOST_CITIES.filter((c) => c.country === 'Mexico')

  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image
                src="/fanforged-icon.png"
                alt="FanForged"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="text-white font-bold text-lg">
                Fan<span className="text-yellow-400">Forged</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your ultimate guide to the 2026 soccer tournament — city guides, watch parties, and fan hubs across North America.
            </p>
          </div>

          {/* USA */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">🇺🇸 USA Host Cities</h3>
            <ul className="space-y-2">
              {usaCities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Canada & Mexico */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">🇨🇦 Canada Host Cities</h3>
            <ul className="space-y-2 mb-6">
              {canadaCities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-white font-semibold text-sm mb-3">🇲🇽 Mexico Host Cities</h3>
            <ul className="space-y-2">
              {mexicoCities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/matches" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Match Schedule
                </Link>
              </li>
              <li>
                <Link href="/watch-parties" className="text-gray-400 hover:text-white text-sm transition-colors">
                  All Watch Parties
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Fan Guides Blog
                </Link>
              </li>
              <li>
                <Link href="/list-your-venue" className="text-gray-400 hover:text-white text-sm transition-colors">
                  List Your Venue
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 space-y-2">
          <p className="text-gray-500 text-sm">
            © 2026 FanForged
          </p>
          <p className="text-gray-600 text-xs max-w-2xl">
            This site is independent and is not affiliated with, endorsed by, or connected to FIFA, the tournament organizers, or any official competition body. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  )
}
