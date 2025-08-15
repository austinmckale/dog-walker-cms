"use client"
import { useMemo, useState } from 'react'
import CheckoutButton from './CheckoutButton'

export default function SubscriptionPicker({
  variant,
  priceMap,
  linkMap,
  className = '',
}: {
  variant: '30' | '45'
  priceMap: Record<'2' | '3' | '5', string | undefined>
  linkMap?: Record<'2' | '3' | '5', string | undefined>
  className?: string
}) {
  const [freq, setFreq] = useState<'2' | '3' | '5'>('2')

  const priceId = useMemo(() => priceMap[freq], [priceMap, freq])
  const paymentLink = useMemo(() => linkMap?.[freq], [linkMap, freq])

  return (
    <div className={`mt-4 flex items-center gap-3 ${className}`}>
      <select
        value={freq}
        onChange={(e) => setFreq(e.target.value as '2' | '3' | '5')}
        className="rounded border px-3 py-2"
        aria-label={`${variant}-minute subscription frequency`}
      >
        <option value="2">2 walks/week</option>
        <option value="3">3 walks/week</option>
        <option value="5">5 walks/week</option>
      </select>

      <CheckoutButton
        label="Subscribe"
        priceId={priceId}
        paymentLink={paymentLink}
        mode="subscription"
        durationMinutes={variant === '30' ? 30 : 45}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      />
    </div>
  )
}

