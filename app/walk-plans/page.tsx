import { WalkPlan } from '@/types'
import WalkPlanCard from '@/components/WalkPlanCard'
import Navigation from '@/components/Navigation'
import { MapPin, Clock, DollarSign } from 'lucide-react'

// Mock data for demonstration
const mockWalkPlans: WalkPlan[] = [
  {
    _id: '1',
    title: 'Quick Walk',
    slug: 'quick-walk',
    price: 15,
    duration: 15,
    description: 'Perfect for busy schedules. A quick 15-minute walk to get your dog moving and relieve themselves.',
    features: ['GPS Tracking', 'Photo Report', 'Basic Notes'],
    isActive: true,
    sortOrder: 1,
  },
  {
    _id: '2',
    title: 'Standard Walk',
    slug: 'standard-walk',
    price: 25,
    duration: 30,
    description: 'Our most popular option. A 30-minute walk with plenty of exercise and exploration time.',
    features: ['GPS Tracking', 'Photo Report', 'Detailed Notes', 'Route Map'],
    isActive: true,
    sortOrder: 2,
  },
  {
    _id: '3',
    title: 'Adventure Walk',
    slug: 'adventure-walk',
    price: 35,
    duration: 60,
    description: 'Extended walk perfect for high-energy dogs. Includes extra playtime and training exercises.',
    features: ['GPS Tracking', 'Photo Report', 'Detailed Notes', 'Route Map', 'Training Tips'],
    isActive: true,
    sortOrder: 3,
  },
]

export default function WalkPlansPage() {
  const walkPlans = mockWalkPlans

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
            Choose from our variety of walk plans designed to meet your dog's needs. 
            All walks include GPS tracking and detailed reports.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 text-center">
            <MapPin className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{walkPlans.length}</div>
            <div className="text-gray-600">Available Plans</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <Clock className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {walkPlans.reduce((total, plan) => total + plan.duration, 0)} min
            </div>
            <div className="text-gray-600">Total Walk Time</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <DollarSign className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              ${walkPlans.reduce((total, plan) => total + plan.price, 0)}
            </div>
            <div className="text-gray-600">Total Value</div>
          </div>
        </div>

        {/* Walk Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {walkPlans.map((walkPlan) => (
            <WalkPlanCard 
              key={walkPlan._id} 
              walkPlan={walkPlan}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Walk Plan?
            </h2>
            <p className="text-gray-600 mb-6">
              Contact us to create a personalized walk plan for your dog's specific needs.
            </p>
            <button className="btn-primary">
              Contact Us
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 