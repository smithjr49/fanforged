import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug, markdownToHtml } from '@/lib/blog'
import { getCityBySlug } from '@/lib/cities'
import NewsletterSignup from '@/components/NewsletterSignup'
import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://fanforged.fans'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: { canonical: `${BASE}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      siteName: 'FanForged',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const related = allPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3)

  const relatedCity = post.city ? getCityBySlug(post.city) : null

  const htmlContent = markdownToHtml(post.content)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'FanForged', url: BASE },
    url: `${BASE}/blog/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-8 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
        <span>›</span>
        <span className="text-gray-300 truncate max-w-[200px]">{post.title}</span>
      </nav>

      <article>
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS['Travel']}`}>
              {post.category}
            </span>
            <span className="text-gray-500 text-xs">{formatDate(post.date)}</span>
            <span className="text-gray-500 text-xs">· {post.readingTime} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">{post.description}</p>
        </header>

        {/* If post is related to a specific city, show a city CTA */}
        {relatedCity && (
          <div className={`bg-gradient-to-br ${relatedCity.heroColor} rounded-2xl p-5 mb-8 flex items-center justify-between gap-4`}>
            <div>
              <span className="text-2xl mr-2">{relatedCity.flag}</span>
              <span className="text-white font-semibold">{relatedCity.name} City Guide</span>
              <p className="text-white/70 text-sm mt-1">Hotels, stadium transit, bars, and fan hubs</p>
            </div>
            <Link
              href={`/${relatedCity.slug}`}
              className="shrink-0 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors border border-white/20"
            >
              View guide →
            </Link>
          </div>
        )}

        {/* Article body */}
        <div
          className="prose-wc"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      {/* Newsletter */}
      <div className="mt-12">
        <NewsletterSignup compact />
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-800">
          <h2 className="text-lg font-bold text-white mb-6">More {post.category} guides</h2>
          <div className="space-y-4">
            {related.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group flex items-start justify-between gap-4 bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors"
              >
                <div>
                  <p className="text-white font-medium group-hover:text-yellow-400 transition-colors text-sm leading-snug">
                    {rp.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{rp.readingTime} min read</p>
                </div>
                <span className="text-yellow-400 text-sm shrink-0">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to blog */}
      <div className="mt-10">
        <Link href="/blog" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          ← All articles
        </Link>
      </div>
    </div>
    </>
  )
}
