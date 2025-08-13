import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { client, urlFor } from '@/lib/sanity'

type DogLite = {
  _id: string
  name: string
  breed?: string
  image?: any
  ownerEmail?: string
}

export default async function DogsPage() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    // Server component redirect to signin
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Dog Profiles</h1>
          <p className="text-gray-600">Please <a href="/signin" className="text-primary-600 underline">sign in</a> to view your dogs.</p>
        </main>
      </div>
    )
  }

  const dogs = await client.fetch<DogLite[]>(
    `*[_type == "dog" && isActive == true && ownerEmail == $email] | order(name asc){ _id, name, breed, image, ownerEmail }`,
    { email: user.email }
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dogs</h1>
          <p className="text-gray-600">Only dogs associated with your account are shown.</p>
        </div>

        {dogs.length === 0 ? (
          <div className="card max-w-xl mx-auto text-center">
            <p className="text-gray-700">No dogs found for {user.email}.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <li key={dog._id} className="card space-y-3">
                {dog.image ? (
                  <Image
                    src={urlFor(dog.image).width(600).height(360).fit('crop').url()}
                    alt={dog.name}
                    width={600}
                    height={360}
                    className="w-full h-40 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">No photo</div>
                )}
                <div>
                  <div className="text-lg font-semibold">{dog.name}</div>
                  {dog.breed && <div className="text-sm text-gray-600">{dog.breed}</div>}
                </div>
                <div className="flex gap-2">
                  <Link href={`/dogs/${dog._id}`} className="btn-secondary flex-1 text-center">View</Link>
                  <Link href={`/dogs/${dog._id}/walks/live`} className="btn-primary flex-1 text-center">Start Walk</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
