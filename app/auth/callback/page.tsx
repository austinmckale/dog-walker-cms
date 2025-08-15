import { Suspense } from 'react'
import CallbackClient from './CallbackClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <CallbackClient />
    </Suspense>
  )
}
