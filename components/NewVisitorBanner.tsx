"use client"
import { usePathname } from 'next/navigation'

export default function NewVisitorBanner() {
  const pathname = usePathname()
  if (pathname === '/meet-greet') return null
  return (
    <div className="relative bg-blue-50 border-b border-blue-200 text-blue-900 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 text-center">
        New here? Start with a free <a href="/meet-greet" className="font-medium underline">Meet &amp; Greet</a>.
      </div>
    </div>
  )
}
