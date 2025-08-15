import { WalkPlan } from '@/types'
import WalkPlanCard from '@/components/WalkPlanCard'
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
          {walkPlans.map((walkPlan) => (
            <WalkPlanCard key={walkPlan._id} walkPlan={walkPlan} />
          ))}
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
