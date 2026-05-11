'use client'

import { useEffect, useState } from 'react'

const KICKOFF = new Date('2026-06-11T20:00:00-06:00') // Mexico City opener, June 11 20:00 CT

function getTimeLeft() {
  const now = new Date()
  const diff = KICKOFF.getTime() - now.getTime()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft())
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) {
    return (
      <div className="text-center">
        <p className="text-yellow-400 font-bold text-lg">The tournament has started! ⚽</p>
      </div>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-3 min-w-[44px] sm:min-w-[64px]">
            <span className="text-xl sm:text-3xl font-bold text-white tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs mt-1 font-medium">{label}</p>
        </div>
      ))}
    </div>
  )
}
