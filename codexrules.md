Codex/Cursor Prompt — Add Stripe payments + subscription picker to Walk Plans

We’re in a Next.js 14 (App Router) repo. Implement payments for the two walk plans with Stripe and add a subscription dropdown (2/3/5 walks per week) under each plan.

Requirements

Support two modes:

Payment Links (zero-code fallback): if we set USE_PAYMENT_LINKS=true or no Stripe secret is present, buttons should go straight to the provided Payment Link URLs.

Stripe Checkout Sessions (preferred): create a Checkout Session via API and redirect.

One-time buttons: “Book This Plan” ($30 for 30-min, $40 for 45-min).

Subscription dropdown (2/3/5 walks per week) + “Subscribe” button for each plan.

After successful checkout, redirect to /schedule?paid=1&service=walk&duration=<30|45>.

Keep the current page layout/styles; only add button wiring + dropdown UI.

0) Install & env

Add dep:

npm i stripe


Env (local .env.local and Vercel):

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUCCESS_URL=https://<your-domain>/schedule?paid=1
NEXT_PUBLIC_CANCEL_URL=https://<your-domain>/walk-plans
USE_PAYMENT_LINKS=false

1) API route – app/api/checkout/route.ts

Create a Checkout Session for one-time or subscription:

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const canUseStripe = !!process.env.STRIPE_SECRET_KEY && process.env.USE_PAYMENT_LINKS !== 'true';

const stripe = canUseStripe
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
  : null;

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe disabled (using Payment Links).' }, { status: 400 });
    }
    const { priceId, mode = 'payment', metadata } = await req.json();

    if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });

    const successBase = process.env.NEXT_PUBLIC_SUCCESS_URL ?? 'http://localhost:3000/schedule?paid=1';
    const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL ?? 'http://localhost:3000/walk-plans';

    const duration = metadata?.duration ? `&duration=${metadata.duration}` : '';

    const session = await stripe.checkout.sessions.create({
      mode, // 'payment' | 'subscription'
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      success_url: `${successBase}${duration}`,
      cancel_url: cancelUrl,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error('Stripe checkout error:', e);
    return NextResponse.json({ error: e.message ?? 'Checkout failed' }, { status: 500 });
  }
}

2) Client helpers – components/CheckoutButton.tsx + components/SubscriptionPicker.tsx
// components/CheckoutButton.tsx
'use client';
import { useState } from 'react';

export default function CheckoutButton({
  label,
  priceId,
  mode = 'payment',
  durationMinutes,
  paymentLink, // optional fallback URL
  className = '',
}: {
  label: string;
  priceId?: string;
  mode?: 'payment' | 'subscription';
  durationMinutes?: 30 | 45;
  paymentLink?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const useLinks = process.env.NEXT_PUBLIC_USE_PAYMENT_LINKS === 'true';

  async function go() {
    setLoading(true);

    // Fallback: use Payment Link URL when configured
    if (useLinks || !priceId) {
      if (!paymentLink) {
        alert('Payment link not configured.');
        setLoading(false);
        return;
      }
      window.location.href = paymentLink;
      return;
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        mode,
        metadata: { duration: durationMinutes?.toString() },
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
    else alert(data.error ?? 'Could not start checkout');
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      {loading ? 'Redirecting…' : label}
    </button>
  );
}

// components/SubscriptionPicker.tsx
'use client';
import { useMemo, useState } from 'react';
import CheckoutButton from './CheckoutButton';

export default function SubscriptionPicker({
  variant, // '30' | '45'
  priceMap,
  linkMap,
}: {
  variant: '30' | '45';
  priceMap: Record<'2' | '3' | '5', string | undefined>;  // Stripe price IDs
  linkMap?: Record<'2' | '3' | '5', string | undefined>;   // Payment Link URLs (optional)
}) {
  const [freq, setFreq] = useState<'2' | '3' | '5'>('2');

  const priceId = useMemo(() => priceMap[freq], [priceMap, freq]);
  const paymentLink = useMemo(() => linkMap?.[freq], [linkMap, freq]);

  return (
    <div className="mt-4 flex items-center gap-3">
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
  );
}

3) Wire it on the Walk Plans page – app/walk-plans/page.tsx

Add your actual Stripe Price IDs (or Payment Link URLs) in the constants below.

import CheckoutButton from '@/components/CheckoutButton';
import SubscriptionPicker from '@/components/SubscriptionPicker';

const PRICES = {
  // One-time prices (Stripe)
  ONE_30: 'price_30_onetime_REPLACE',
  ONE_45: 'price_45_onetime_REPLACE',
  // Subscriptions (Stripe)
  SUB_30: { '2': 'price_30_wk2_REPLACE', '3': 'price_30_wk3_REPLACE', '5': 'price_30_wk5_REPLACE' },
  SUB_45: { '2': 'price_45_wk2_REPLACE', '3': 'price_45_wk3_REPLACE', '5': 'price_45_wk5_REPLACE' },
} as const;

// Optional: Payment Link fallback URLs (if using Payment Links)
const LINKS = {
  ONE_30: 'https://buy.stripe.com/your_link_30',
  ONE_45: 'https://buy.stripe.com/your_link_45',
  SUB_30: { '2': 'https://buy.stripe.com/your_link_s30_2', '3': 'https://buy.stripe.com/your_link_s30_3', '5': 'https://buy.stripe.com/your_link_s30_5' },
  SUB_45: { '2': 'https://buy.stripe.com/your_link_s45_2', '3': 'https://buy.stripe.com/your_link_s45_3', '5': 'https://buy.stripe.com/your_link_s45_5' },
} as const;

export default function WalkPlansPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ... your existing layout/content ... */}

      {/* 30-minute card button(s) */}
      <CheckoutButton
        label="Book This Plan"
        priceId={PRICES.ONE_30}
        paymentLink={LINKS.ONE_30}
        mode="payment"
        durationMinutes={30}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      />
      <SubscriptionPicker
        variant="30"
        priceMap={PRICES.SUB_30}
        linkMap={LINKS.SUB_30}
      />

      {/* 45-minute card button(s) */}
      <CheckoutButton
        label="Book This Plan"
        priceId={PRICES.ONE_45}
        paymentLink={LINKS.ONE_45}
        mode="payment"
        durationMinutes={45}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      />
      <SubscriptionPicker
        variant="45"
        priceMap={PRICES.SUB_45}
        linkMap={LINKS.SUB_45}
      />
    </div>
  );
}

4) Optional success helper

Create app/schedule/page.tsx to read ?paid=1&duration=30 and preselect the walk duration (you likely already have this page).

Acceptance

“Book This Plan” buttons redirect to Stripe (one-time).

A dropdown below each card selects 2/3/5 walks/week and the Subscribe button goes to Stripe.

Works in Checkout mode when STRIPE_SECRET_KEY is present, otherwise uses Payment Links when USE_PAYMENT_LINKS=true.

Success returns users to /schedule?paid=1&duration=<30|45>.

Commit message

feat(payments): Stripe checkout + subscription picker for Walk Plans, Payment Links fallback