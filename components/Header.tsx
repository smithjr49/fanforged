'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/fanforged-icon.png"
              alt="FanForged"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              priority
            />
            <span className="text-white font-bold text-lg tracking-tight">
              Fan<span className="text-yellow-400">Forged</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/matches" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Matches
            </Link>
            <Link href="/watch-parties" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Watch Parties
            </Link>
            <Link href="/#cities" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              City Guides
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Blog
            </Link>
            <Link
              href="/list-your-venue"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              List Your Venue
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-3">
            <Link href="/matches" className="block text-gray-300 hover:text-white text-sm font-medium py-2">
              Matches
            </Link>
            <Link href="/watch-parties" className="block text-gray-300 hover:text-white text-sm font-medium py-2">
              Watch Parties
            </Link>
            <Link href="/#cities" className="block text-gray-300 hover:text-white text-sm font-medium py-2">
              City Guides
            </Link>
            <Link href="/blog" className="block text-gray-300 hover:text-white text-sm font-medium py-2">
              Blog
            </Link>
            <Link
              href="/list-your-venue"
              className="block bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg text-center transition-colors"
            >
              List Your Venue
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
