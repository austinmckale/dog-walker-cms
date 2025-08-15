import { WalkPlan } from '@/types'
import WalkPlanCard from '@/components/WalkPlanCard'

// By default, leave Stripe price IDs undefined so the UI uses Payment Links fallback out of the box.
const PRICES: {
  ONE_30?: string
  ONE_45?: string
  SUB_30: Record<'2' | '3' | '5', string | undefined>
  SUB_45: Record<'2' | '3' | '5', string | undefined>
} = {
  // One-time prices (Stripe) — fill with your real price IDs to enable Checkout Sessions
  ONE_30: undefined,
  ONE_45: undefined,
  // Subscriptions (Stripe)
  SUB_30: { '2': undefined, '3': undefined, '5': undefined },
  SUB_45: { '2': undefined, '3': undefined, '5': undefined },
}

// Optional: Payment Link fallback URLs (if using Payment Links)
const LINKS: {
  ONE_30?: string
  ONE_45?: string
  SUB_30: Record<'2' | '3' | '5', string | undefined>
  SUB_45: Record<'2' | '3' | '5', string | undefined>
} = {
  ONE_30: 'https://buy.stripe.com/your_link_30',
  ONE_45: 'https://buy.stripe.com/your_link_45',
  SUB_30: { '2': 'https://buy.stripe.com/your_link_s30_2', '3': 'https://buy.stripe.com/your_link_s30_3', '5': 'https://buy.stripe.com/your_link_s30_5' },
  SUB_45: { '2': 'https://buy.stripe.com/your_link_s45_2', '3': 'https://buy.stripe.com/your_link_s45_3', '5': 'https://buy.stripe.com/your_link_s45_5' },
}
import Navigation from '@/components/Navigation'

// Actual walk offerings
const walkPlans: WalkPlan[] = [
  {
    _id: '30',
    title: '30-Minute Walk',
    slug: '30-minute-walk',
    price: 30,
    duration: 30,
    description:
      'A half-hour neighborhood stroll with plenty of sniffing, exercise, and a photo report.',
    features: ['GPS Tracking', 'Photo Report', 'Detailed Notes'],
    isActive: true,
    sortOrder: 1,
  },
  {
    _id: '45',
    title: '45-Minute Walk',
    slug: '45-minute-walk',
    price: 40,
    duration: 45,
    description: 'Extra time for high‑energy pups who need a longer adventure.',
    features: ['GPS Tracking', 'Photo Report', 'Detailed Notes'],
    isActive: true,
    sortOrder: 2,
  },
]

export default function WalkPlansPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Walk Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our variety of walk plans designed to meet your dog&apos;s needs.
          </p>
          <p className="mt-2 text-gray-700">GPS tracking & photo update: Included</p>
        </div>

        {/* Walk Plans Grid */}
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {walkPlans.map((walkPlan) => {
            const is30 = walkPlan.duration === 30
            return (
              <WalkPlanCard
                key={walkPlan._id}
                walkPlan={walkPlan}
                oneTimePriceId={is30 ? PRICES.ONE_30 : PRICES.ONE_45}
                oneTimePaymentLink={is30 ? LINKS.ONE_30 : LINKS.ONE_45}
                subPriceMap={is30 ? PRICES.SUB_30 : PRICES.SUB_45}
                subLinkMap={is30 ? LINKS.SUB_30 : LINKS.SUB_45}
              />
            )
          })}
          </div>
        </div>

        {/* Subscription Packages – 30-Minute Walks */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Subscription Packages – 30-Minute Walks
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Walks per Week
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Regular Price
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Subscription Price
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Price per Walk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">2 walks</td>
                  <td className="px-4 py-2">$60</td>
                  <td className="px-4 py-2 font-semibold">$55</td>
                  <td className="px-4 py-2">$27.50</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3 walks</td>
                  <td className="px-4 py-2">$90</td>
                  <td className="px-4 py-2 font-semibold">$78</td>
                  <td className="px-4 py-2">$26.00</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">5 walks</td>
                  <td className="px-4 py-2">$150</td>
                  <td className="px-4 py-2 font-semibold">$125</td>
                  <td className="px-4 py-2">$25.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Subscription Packages – 45-Minute Walks */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Subscription Packages – 45-Minute Walks
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Walks per Week
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Regular Price
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Subscription Price
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Price per Walk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">2 walks</td>
                  <td className="px-4 py-2">$80</td>
                  <td className="px-4 py-2 font-semibold">$72</td>
                  <td className="px-4 py-2">$36.00</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3 walks</td>
                  <td className="px-4 py-2">$120</td>
                  <td className="px-4 py-2 font-semibold">$105</td>
                  <td className="px-4 py-2">$35.00</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">5 walks</td>
                  <td className="px-4 py-2">$200</td>
                  <td className="px-4 py-2 font-semibold">$175</td>
                  <td className="px-4 py-2">$35.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Walk Plan?
            </h2>
            <p className="text-gray-600 mb-6">
              Contact us to create a personalized walk plan for your dog&apos;s specific needs.
            </p>
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'hello@berksbestfriend.com'}`}
              className="btn-primary"
              rel="noopener noreferrer"
            >
              Email Us
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
