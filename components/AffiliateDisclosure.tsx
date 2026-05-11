type Props = {
  className?: string
  compact?: boolean
}

export default function AffiliateDisclosure({ className = '', compact = false }: Props) {
  if (compact) {
    return (
      <p className={`text-gray-600 text-[10px] ${className}`}>
        ℹ️ FanForged may earn a commission when you book through links on this page, at no extra cost to you.
      </p>
    )
  }
  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 flex items-start gap-2.5 ${className}`}>
      <span className="text-gray-500 text-sm mt-0.5 shrink-0">ℹ️</span>
      <p className="text-gray-500 text-xs leading-relaxed">
        <span className="text-gray-400 font-medium">Affiliate disclosure: </span>
        FanForged may earn a small commission when you book through links on this page, at no extra cost to you.
        We only link to reputable travel providers. Our editorial recommendations are independent of commercial relationships.
      </p>
    </div>
  )
}
