import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03', // Use today's date or your preferred version
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // Only needed if you want to update content
})

// Image builder for Sanity images
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ queries
export const walkPlansQuery = `
  *[_type == "walkPlan" && isActive == true] | order(sortOrder asc) {
    _id,
    title,
    slug,
    price,
    duration,
    description,
    features,
    image,
    isActive,
    sortOrder
  }
`

export const walkPlanByIdQuery = `
  *[_type == "walkPlan" && _id == $id][0] {
    _id,
    title,
    slug,
    price,
    duration,
    description,
    features,
    image,
    isActive,
    sortOrder
  }
`

export const dogsQuery = `
  *[_type == "dog" && isActive == true] | order(name asc) {
    _id,
    name,
    breed,
    age,
    weight,
    ownerName,
    ownerEmail,
    ownerPhone,
    address,
    emergencyContact,
    medicalInfo,
    behaviorNotes,
    preferredWalkTime,
    image,
    isActive,
    notes
  }
`

export const dogByIdQuery = `
  *[_type == "dog" && _id == $id][0] {
    _id,
    name,
    breed,
    age,
    weight,
    ownerName,
    ownerEmail,
    ownerPhone,
    address,
    emergencyContact,
    medicalInfo,
    behaviorNotes,
    preferredWalkTime,
    image,
    isActive,
    notes
  }
`

export const walkReportsQuery = `
  *[_type == "walkReport"] | order(date desc) {
    _id,
    dog->{
      _id,
      name,
      breed,
      image
    },
    walkPlan->{
      _id,
      title,
      duration
    },
    walker,
    date,
    checkInTime,
    checkOutTime,
    actualDuration,
    distance,
    route,
    photos,
    weather,
    behavior,
    notes,
    incidents,
    recommendations,
    status,
    isReported
  }
`

export const walkReportsByDogQuery = `
  *[_type == "walkReport" && dog._ref == $dogId] | order(date desc) {
    _id,
    walkPlan->{
      _id,
      title,
      duration
    },
    walker,
    date,
    checkInTime,
    checkOutTime,
    actualDuration,
    distance,
    route,
    photos,
    weather,
    behavior,
    notes,
    incidents,
    recommendations,
    status,
    isReported
  }
` 