import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { client, dogByIdQuery, urlFor } from '@/lib/sanity'
import { redirect } from 'next/navigation'

export default async function DogDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const dog = await client.fetch(dogByIdQuery, { id })
  if (!dog || (dog.ownerEmail && dog.ownerEmail !== user.email)) redirect('/dogs')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
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
            <h1 className="text-3xl font-bold text-gray-900">{dog?.name || 'Dog Profile'}</h1>
            <p className="text-gray-600 text-sm">ID: <span className="font-mono">{id}</span></p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href={`/dogs/${id}/walks/live`} className="btn-primary text-center">Start Live Walk</Link>
          <Link href={`/dogs/${id}/walks`} className="btn-secondary text-center">View Walk History</Link>
        </div>
      </main>
    </div>
  )
}
