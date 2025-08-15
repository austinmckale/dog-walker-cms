import Navigation from '@/components/Navigation'
import NewReport from '@/components/reports/NewReport'
import Image from 'next/image'
import { createSupabaseServer } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
type VisitReport = {
  id: string
  happened_at: string
  duration_minutes: number | null
  distance_m: number | null
  potty1: boolean | null
  potty2: boolean | null
  notes: string | null
  photo_url: string | null
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const petId = params.id
  const { data: pet, error: petErr } = await supabase
    .from('pets')
    .select('id,name,species,breed,notes,photo_url,created_at')
    .eq('id', petId)
    .single()
  if (petErr) {
    console.error('[/pets/[id]] Supabase error (pet):', petErr)
  }
  if (petErr || !pet) notFound()

  const { data: reportsData, error: reportsError } = await supabase
    .from('visit_reports')
    .select('id,happened_at,duration_minutes,distance_m,potty1,potty2,notes,photo_url')
    .eq('pet_id', pet.id)
    .order('happened_at', { ascending: false })
    .returns<VisitReport[]>()
  if (reportsError) {
    console.error('[/pets/[id]] Supabase error (reports):', reportsError)
  }
  const reports: VisitReport[] = reportsData ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="bg-white rounded-lg p-6 border">
          <div className="flex gap-6">
            {pet.photo_url ? (
              <Image src={pet.photo_url} alt={pet.name} width={200} height={200} className="w-40 h-40 object-cover rounded-md" />
            ) : (
              <div className="w-40 h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">No photo</div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-gray-600">{[pet.species, pet.breed].filter(Boolean).join(' · ')}</p>
              {pet.notes && <p className="mt-3 text-gray-700 whitespace-pre-wrap">{pet.notes}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">New Report</h2>
          <NewReport petId={pet.id} />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Reports</h2>
          {reports.length === 0 ? (
            <p className="text-gray-600">No reports yet.</p>
          ) : (
            <ul className="space-y-3">
              {reports.map((r) => (
                <li key={r.id} className="bg-white rounded-md p-4 border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {r.happened_at ? new Date(r.happened_at).toLocaleString() : '—'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {(r.duration_minutes ?? 0)} min · {((r.distance_m ?? 0) / 1000).toFixed(2)} km
                      {(r.potty1 || r.potty2)
                        ? ` · ${[r.potty1 && 'P1', r.potty2 && 'P2']
                            .filter(Boolean)
                            .join('/')}`
                        : ''}
                    </div>
                  </div>
                  {r.notes && <p className="mt-2 text-gray-700">{r.notes}</p>}
                  {r.photo_url && (
                    <div className="mt-3">
                      <Image src={r.photo_url} alt="report photo" width={600} height={400} className="w-full max-w-md rounded" />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
