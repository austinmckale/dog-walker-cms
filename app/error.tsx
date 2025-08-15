"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error('[app/error] Global error:', error)
  return (
    <html>
      <body>
        <div className="mx-auto max-w-xl p-6">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-gray-600">Please try again or refresh the page.</p>
          <div className="mt-4 flex gap-3">
            <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={reset}>Retry</button>
            <button className="rounded border px-4 py-2" onClick={() => window.location.reload()}>Refresh</button>
          </div>
        </div>
      </body>
    </html>
  )
}

