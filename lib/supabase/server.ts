import {cookies} from "next/headers";
import {createServerClient} from "@supabase/ssr";

export function createSupabaseServer() {
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
          const store = cookies()
          cookiesToSet.forEach(({name, value, options}) => {
            store.set(name, value, options as any)
          })
        },
      },
    }
  )
}
