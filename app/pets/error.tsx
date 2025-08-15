"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  console.error('[/pets] Error boundary:', error)
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-gray-600">Please try again in a moment.</p>
      <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white" onClick={reset}>
        Retry
      </button>
    </div>
  )
}

