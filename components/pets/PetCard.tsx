'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function PetCard({ pet }: { pet: { id: string; name: string; species?: string | null; breed?: string | null; photo_url?: string | null } }) {
  return (
    <Link href={`/pets/${pet.id}`} className="card space-y-3 block">
      {pet.photo_url ? (
        <Image src={pet.photo_url} alt={pet.name} width={600} height={360} className="w-full h-40 object-cover rounded-md" />
      ) : (
        <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">No photo</div>
      )}
      <div>
        <div className="text-lg font-semibold">{pet.name}</div>
        <div className="text-sm text-gray-600">{[pet.species, pet.breed].filter(Boolean).join(' · ')}</div>
      </div>
    </Link>
  )
}

