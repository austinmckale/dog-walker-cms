"use client"
import { useState } from 'react'

export default function CheckoutButton({
  label,
  priceId,
  mode = 'payment',
  durationMinutes,
  paymentLink, // optional fallback URL
  className = '',
}: {
  label: string
  priceId?: string
  mode?: 'payment' | 'subscription'
  durationMinutes?: 30 | 45
  paymentLink?: string
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const useLinks = process.env.NEXT_PUBLIC_USE_PAYMENT_LINKS === 'true'

  async function go() {
    setLoading(true)

    if (useLinks || !priceId) {
      if (!paymentLink) {
        alert('Payment link not configured.')
        setLoading(false)
        return
      }
      window.location.href = paymentLink
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        mode,
        metadata: { duration: durationMinutes?.toString() },
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.url) window.location.href = data.url
    else alert(data.error ?? 'Could not start checkout')
  }

  return (
    <button onClick={go} disabled={loading} className={`${className} ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
      {loading ? 'Redirecting…' : label}
    </button>
  )
}

