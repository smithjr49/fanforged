import Link from 'next/link'

type Props = {
  icon: string
  title: string
  description: string
  href: string
  cta?: string
  external?: boolean
  highlight?: boolean
}

export default function TravelServiceCard({
  icon,
  title,
  description,
  href,
  cta = 'Explore →',
  external = false,
  highlight = false,
}: Props) {
  const className = `group block rounded-xl border ${
    highlight
      ? 'border-yellow-400/40 bg-yellow-400/5 hover:border-yellow-400/70'
      : 'border-gray-800 bg-gray-900 hover:border-gray-600'
  } p-4 transition-all`

  const content = (
    <>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm ${highlight ? 'text-yellow-400' : 'text-white'} mb-0.5`}>
            {title}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
        </div>
      </div>
      <div className={`mt-3 text-xs font-semibold ${highlight ? 'text-yellow-400' : 'text-gray-400'} group-hover:text-white transition-colors`}>
        {cta}
      </div>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  )
}
