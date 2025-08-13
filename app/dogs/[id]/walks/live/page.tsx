import Image from 'next/image'
import Navigation from '@/components/Navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { client, dogByIdQuery, urlFor } from '@/lib/sanity'
import DogLiveWalkClient from '@/components/DogLiveWalkClient'
import { redirect } from 'next/navigation'

export default async function DogLiveWalkPage({ params }: { params: { id: string } }) {
  const dogId = params.id
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  const dog = await client.fetch(dogByIdQuery, { id: dogId })
  if (!dog || (dog.ownerEmail && dog.ownerEmail !== user.email)) redirect('/dogs')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <header className="space-y-3">
          {dog?.image ? (
            <Image
              src={urlFor(dog.image).width(1000).height(420).fit('crop').url()}
              alt={dog.name}
              width={1000}
              height={420}
              className="w-full h-56 object-cover rounded-lg"
            />
          ) : null}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Live Walk — {dog?.name}</h1>
          </div>
        </header>

        <DogLiveWalkClient dogId={dogId} />
      </main>
    </div>
  )
}

