import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import { PawPrint, MapPin, Clock, Shield, Users, FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* WAVE-CUT HERO */}
      <section className="relative isolate min-h-[68vh] sm:min-h-[76vh] overflow-hidden">
        {/* Background photo */}
        <Image
          src="/hero-dog.jpg"
          alt="Golden retriever in a creek carrying a stick"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />

        {/* Contrast overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/20" />

        {/* Floating glass card */}
        <div className="relative z-10 mx-auto max-w-5xl px-4">
          <div className="mt-20 sm:mt-28 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl p-6 sm:p-10 text-center text-white">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Berks County Dog Walking Services
            </h1>
            <p className="mt-4 text-lg sm:text-xl opacity-95">
              GPS-tracked walks with detailed reports. Your dog’s safety and happiness are our top priorities.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/walk-plans"
                className="rounded-lg bg-white/95 text-gray-900 px-5 py-2.5 font-medium shadow hover:bg-white"
              >
                View Walk Plans
              </Link>
              <Link
                href="/schedule?service=transport"
                className="rounded-lg bg-blue-600/90 px-5 py-2.5 font-medium shadow hover:bg-blue-700"
              >
                Book Transport
              </Link>
              <Link
                href="/schedule?service=walk"
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium shadow hover:bg-blue-700"
              >
                Request a Walk
              </Link>
            </div>
          </div>
        </div>

        {/* Wave separator to next section */}
        <svg
          className="absolute bottom-[-1px] left-0 right-0 z-10"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="white"
            d="M0,64L60,74.7C120,85,240,107,360,106.7C480,107,600,85,720,69.3C840,53,960,43,1080,58.7C1200,75,1320,117,1380,138.7L1440,160L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
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
                Choose from 15-minute quick walks to 1-hour adventure walks based on your dog&apos;s needs.
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
                Your dog&apos;s safety is protected with comprehensive insurance coverage.
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
            <a href="tel:+16104514099" className="btn-secondary">Call</a>
            <a href="sms:+16104514099" className="btn-secondary">Text</a>
            <a href="mailto:austinmck17@gmail.com" className="btn-secondary">Email</a>
          </div>
        </div>
      </section>
    </div>
  )
} 
