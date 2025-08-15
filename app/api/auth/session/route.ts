import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { access_token, refresh_token, remember } = await req.json();
    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
    }
    const LONG_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
    const supabase = createSupabaseServer({ cookieOptions: remember ? { maxAge: LONG_MAX_AGE } : undefined });
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Bad request" }, { status: 400 });
  }
}
