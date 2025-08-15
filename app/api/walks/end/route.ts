import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServer } from "@/lib/supabase/server";

const schema = z.object({
  walkId: z.string().uuid(),
  durationS: z.number().int().nonnegative(),
  distanceM: z.number().nonnegative()
});

export async function POST(req: Request) {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Bad payload" }, { status: 400 });

  const { error } = await supabase
    .from("walks")
    .update({
      ended_at: new Date().toISOString(),
      total_duration_s: parsed.data.durationS,
      total_distance_m: parsed.data.distanceM
    })
    .eq("id", parsed.data.walkId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
