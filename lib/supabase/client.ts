import { createClient } from "@supabase/supabase-js";
import { getEnv } from '@/lib/env'

// Validate env on module load to surface clear error messages
getEnv()

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
)

// Helper function matching codex rules naming
export function getSupabaseClient() {
  getEnv()
  return supabase
}
