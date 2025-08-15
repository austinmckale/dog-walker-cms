import { supabase } from '@/lib/supabase/client'

export function getPublicUrl(path: string) {
  return supabase.storage.from('pet-media').getPublicUrl(path).data.publicUrl
}

