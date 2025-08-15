import Image from 'next/image'
import Navigation from '@/components/Navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { client, dogByIdQuery, urlFor } from '@/lib/sanity'
import { redirect } from 'next/navigation'

function fmtDuration(s?: number | null) {
  if (!s || s <= 0) return '—'
  const m = Math.floor(s/60), sec = s%60
  return `${m}m ${sec}s`
}

function fmtDistance(m?: number | null) {
  if (!m || m <= 0) return '—'
  return `${(m/1000).toFixed(2)} km`
}

export default async function DogWalkHistoryPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  const dog = await client.fetch(dogByIdQuery, { id: params.id })
  if (!dog || (dog.ownerEmail && dog.ownerEmail !== user.email)) redirect('/dogs')

  const { data, error } = await supabase
    .from('walks')
    .select('id, created_at, ended_at, total_distance_m, total_duration_s, dog_id')
    .eq('user_id', user.id)
    .eq('dog_id', params.id)
    .order('created_at', { ascending: false })

  const walks = data || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <header className="space-y-3 mb-4">
          {dog?.image ? (
            <Image
              src={urlFor(dog.image).width(1000).height(420).fit('crop').url()}
              alt={dog.name}
              width={1000}
              height={420}
              className="w-full h-56 object-cover rounded-lg"
            />
          ) : null}
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl font-semibold">{dog?.name || 'Walk History'}</h1>
            <span className="text-xs text-gray-500">Dog ID: <span className="font-mono">{params.id}</span></span>
          </div>
        </header>
        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4">
            {error.message}
          </div>
        )}
        {walks.length === 0 ? (
          <div className="card">No walks recorded yet.</div>
        ) : (
          <ul className="space-y-3">
            {walks.map((w) => (
              <li key={w.id} className="card flex items-center justify-between">
                <div>
                  <div className="font-medium">{new Date(w.created_at!).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Duration: {fmtDuration(w.total_duration_s)} · Distance: {fmtDistance(w.total_distance_m)}</div>
                </div>
                <div className="text-xs text-gray-500">{w.ended_at ? 'Completed' : 'In progress'}</div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
