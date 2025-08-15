import Navigation from '@/components/Navigation'
import PetCard from '@/components/pets/PetCard'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddPetModal from '@/components/pets/AddPetModal'

export const dynamic = 'force-dynamic'

export default async function PetsPage() {
  const supabase = createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: pets = [] } = await supabase
    .from('pets')
    .select('id,name,species,breed,photo_url,created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Pets</h1>
            <p className="text-gray-600">Manage your pets and visit reports.</p>
          </div>
          <AddPetModal />
        </div>

        {pets.length === 0 ? (
          <div className="card max-w-xl mx-auto text-center">
            <p className="text-gray-700">No pets yet.</p>
            <div className="mt-4">
              <AddPetModal />
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet: any) => (
              <li key={pet.id}>
                <PetCard pet={pet} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
