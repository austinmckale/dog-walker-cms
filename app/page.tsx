import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { PawPrint, MapPin, Clock, Shield, Users, FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <PawPrint className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Berks County Dog Walking Services
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              GPS-tracked walks with detailed reports. Your dog's safety and happiness 
              are our top priorities. 🐕
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
              <Link href="/walk-plans" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                View Walk Plans
              </Link>
              <Link href="/dogs" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-primary-600">
                Manage Dogs
              </Link>
              <Link href="/book" className="btn-primary bg-primary-700 text-white hover:bg-primary-800">
                Book Transport
              </Link>
              <Link href="/walks/new" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-primary-600">
                Request a Walk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Pawsome Walks?
            </h2>
            <p className="text-xl text-gray-600">
              Professional, reliable, and transparent dog walking services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GPS Tracking</h3>
              <p className="text-gray-600">
                Real-time GPS tracking ensures you know exactly where your dog is during their walk.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Duration</h3>
              <p className="text-gray-600">
                Choose from 15-minute quick walks to 1-hour adventure walks based on your dog's needs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Reports</h3>
              <p className="text-gray-600">
                Get comprehensive reports including duration, route, photos, and notes after each walk.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Insured & Bonded</h3>
              <p className="text-gray-600">
                Your dog's safety is protected with comprehensive insurance coverage.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Experienced Team</h3>
              <p className="text-gray-600">
                Our walkers are trained in dog behavior and first aid for your peace of mind.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <PawPrint className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Care</h3>
              <p className="text-gray-600">
                Each dog gets personalized attention and care based on their individual needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse our walk plans and find the perfect option for your furry friend.
          </p>
          <Link href="/walk-plans" className="btn-primary">
            View Walk Plans
          </Link>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+1484444XXXX'}`}
              className="btn-secondary"
              rel="noopener noreferrer"
            >
              Call
            </a>
            <a
              href={`sms:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+1484444XXXX'}`}
              className="btn-secondary"
              rel="noopener noreferrer"
            >
              Text
            </a>
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'hello@berksbestfriend.com'}`}
              className="btn-secondary"
              rel="noopener noreferrer"
            >
              Email
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 