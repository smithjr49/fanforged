import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import NewsletterSignup from '@/components/NewsletterSignup'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://fanforged.fans'

export const metadata: Metadata = {
  title: 'World Cup 2026 Travel Blog — Fan Guides, City Tips & Tournament News',
  description:
    'In-depth fan guides for the 2026 World Cup — stadium transit guides, city rankings, budget travel tips, packing lists, and the best bars and fan hubs in every host city.',
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: 'World Cup 2026 Travel Blog',
    description: 'Fan guides, city tips, and tournament advice for the 2026 World Cup.',
    url: `${BASE}/blog`,
    type: 'website',
    siteName: 'FanForged',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Travel Planning': 'bg-blue-900/40 text-blue-300',
  'Bars & Watch Parties': 'bg-amber-900/40 text-amber-300',
  'Stadium & Transit': 'bg-purple-900/40 text-purple-300',
  'Fan Experience': 'bg-teal-900/40 text-teal-300',
  'Travel': 'bg-gray-800 text-gray-300',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-8 flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span>›</span>
        <span className="text-gray-300">Blog</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">World Cup 2026 Fan Guides</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Deep-dive guides for fans traveling to the 2026 World Cup — stadium transit, city rankings, budget tips, bars, and fan hubs across the USA, Canada, and Mexico.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet — check back soon.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS['Travel']}`}>
                  {post.category}
                </span>
                <span className="text-gray-600 text-xs">{formatDate(post.date)}</span>
                <span className="text-gray-600 text-xs">· {post.readingTime} min read</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors mb-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </Link>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-600 text-xs">{post.author}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-16">
        <NewsletterSignup />
      </div>
    </div>
  )
}
