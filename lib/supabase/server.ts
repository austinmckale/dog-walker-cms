import {cookies} from "next/headers";
import {createServerClient} from "@supabase/ssr";
import {getEnv} from '@/lib/env'

export function createSupabaseServer(opts?: { cookieOptions?: Record<string, any> }) {
  // Validate env early; throws with clear message in logs
  getEnv()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const store = cookies()
          return store.getAll().map((c) => ({name: c.name, value: c.value}))
        },
        setAll(cookiesToSet) {
          // Only attempt cookie writes when explicitly configured (e.g., in route handlers)
          if (opts?.cookieOptions) {
            try {
              const store = cookies()
              cookiesToSet.forEach(({name, value, options}) => {
                store.set(name, value, options as any)
              })
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('[supabase] Cookie write was blocked')
            }
          }
        },
      },
      ...(opts?.cookieOptions ? { cookieOptions: opts.cookieOptions } : {}),
    }
  )
}

// Alias matching codex rules naming (non-breaking)
export function getSupabaseServer(opts?: { cookieOptions?: Record<string, any> }) {
  return createSupabaseServer(opts)
}
