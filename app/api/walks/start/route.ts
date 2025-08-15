import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { client, dogByIdQuery } from "@/lib/sanity";
import { z } from "zod";

const schema = z.object({ dogId: z.string().min(1).nullable().optional() })

export async function POST(req: Request) {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let dogId: string | null = null
  try {
    const body = await req.json().catch(() => ({}))
    const parsed = schema.safeParse(body)
    if (parsed.success && parsed.data.dogId) dogId = parsed.data.dogId
  } catch {}

  // If a dogId is provided, verify ownership in Sanity (ownerEmail must match the logged-in user's email)
  if (dogId) {
    try {
      const dog = await client.fetch(dogByIdQuery, { id: dogId })
      if (!dog) return NextResponse.json({ error: "Dog not found" }, { status: 404 })
      if (dog.ownerEmail && dog.ownerEmail !== user.email) {
        return NextResponse.json({ error: "Forbidden for this dog" }, { status: 403 })
      }
    } catch (e) {
      // If Sanity lookup fails, deny to prevent cross-account access
      return NextResponse.json({ error: "Dog verification failed" }, { status: 400 })
    }
  }

  // Try insert with dog_id if provided; if column doesn't exist, fallback to insert without it
  let data: any = null
  let error: any = null
  if (dogId) {
    const res = await supabase.from("walks").insert({ user_id: user.id, dog_id: dogId }).select("id").single()
    data = res.data; error = res.error
    if (error && (error.message?.includes('column') && error.message?.includes('dog_id'))) {
      const res2 = await supabase.from("walks").insert({ user_id: user.id }).select("id").single()
      data = res2.data; error = res2.error
    }
  } else {
    const res = await supabase.from("walks").insert({ user_id: user.id }).select("id").single()
    data = res.data; error = res.error
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ walkId: data.id });
}
