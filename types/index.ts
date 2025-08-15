export interface WalkPlan {
  _id: string
  title: string
  slug: string
  price: number
  duration: number // in minutes
  description: string
  features?: string[]
  isActive: boolean
  sortOrder: number
  image?: any
}

export interface Dog {
  _id: string
  name: string
  breed: string
  age?: number
  weight?: number
  ownerName: string
  ownerEmail: string
  ownerPhone?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalInfo?: string
  behaviorNotes?: string
  preferredWalkTime?: 'morning' | 'afternoon' | 'evening' | 'flexible'
  image?: any
  isActive: boolean
  notes?: string
}

export interface WalkReport {
  _id: string
  dog: {
    _ref: string
    _type: 'reference'
  }
  walkPlan: {
    _ref: string
    _type: 'reference'
  }
  walker: string
  date: string
  checkInTime: string
  checkOutTime?: string
  actualDuration?: number // in minutes
  distance?: number // in miles
  route?: {
    coordinates: Array<{
      lat: number
      lng: number
      timestamp: string
    }>
  }
  photos?: Array<{
    _key: string
    asset: any
    caption?: string
    timestamp?: string
  }>
  weather?: {
    temperature?: number
    conditions?: string
    humidity?: number
  }
  behavior?: {
    energy?: 'very-low' | 'low' | 'normal' | 'high' | 'very-high'
    mood?: 'anxious' | 'calm' | 'excited' | 'playful' | 'tired'
    socialization?: 'good-dogs' | 'good-people' | 'reactive-dogs' | 'reactive-people' | 'neutral'
  }
  notes?: string
  incidents?: string
  recommendations?: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  isReported: boolean
}

export interface Service {
  _id: string
  title: string
  description: string
  price: number
  duration?: number
  category: 'walk' | 'visit' | 'training' | 'other'
}

export interface Client {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  isActive: boolean
  notes?: string
} 