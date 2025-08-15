import { Suspense } from 'react'
import Navigation from '@/components/Navigation'
import ScheduleClient from './ScheduleClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = { searchParams?: { service?: 'walk' | 'transport' | string } }

export default function Page({ searchParams }: PageProps) {
  const initialService = searchParams?.service === 'transport' ? 'transport' : 'walk'
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Suspense fallback={<div>Loading…</div>}>
          <ScheduleClient initialService={initialService} />
        </Suspense>
      </main>
    </div>
  )
}
