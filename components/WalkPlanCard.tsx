'use client'

import { WalkPlan } from '@/types'
import { Clock, DollarSign, MapPin } from 'lucide-react'

interface WalkPlanCardProps {
  walkPlan: WalkPlan
  onClick?: () => void
}

export default function WalkPlanCard({ walkPlan, onClick }: WalkPlanCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}`
    }
    return `${hours} hr ${remainingMinutes} min`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div 
      className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {walkPlan.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {walkPlan.description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(walkPlan.duration)}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>GPS Tracked</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {formatPrice(walkPlan.price)}
          </div>
          <div className="text-xs text-gray-500">per walk</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full btn-primary">
          Book This Plan
        </button>
      </div>
    </div>
  )
} 