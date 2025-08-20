import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token, remember } = await request.json()
    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 })
    }
    const supabase = getSupabaseServer({ cookieOptions: { lifetime: remember ? 60 * 60 * 24 * 30 : undefined } })
    const { error } = await supabase.auth.setSession({ access_token, refresh_token })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Bad request' }, { status: 400 })
  }
}

