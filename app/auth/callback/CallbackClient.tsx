'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function CallbackClient() {
  const params = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState<string>('Completing sign-in…')

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const code = params.get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          try {
            const remember = params.get('remember') === '1'
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
                remember,
              }),
            })
          } catch {}
          router.replace('/')
        } else {
          setMessage('Could not complete sign-in. Try again.')
        }
      } catch (e: any) {
        if (!cancelled) setMessage(e?.message || 'Authentication failed.')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [params, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Signing you in…</h1>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <a href="/" className="btn-secondary inline-block">
          Go to home
        </a>
      </div>
    </div>
  )
}

