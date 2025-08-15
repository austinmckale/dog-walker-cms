import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServer()
    const { data: pets, error } = await supabase.from('pets').select('id').limit(1)
    return NextResponse.json({ ok: !error, error: error?.message ?? null, petsRowsSeen: pets?.length ?? 0 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 })
  }
}

