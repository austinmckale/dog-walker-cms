import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServer } from "@/lib/supabase/server";

const schema = z.object({
  walkId: z.string().uuid(),
  points: z.array(z.object({
    ts: z.string().datetime(),
    lat: z.number(),
    lng: z.number(),
    accuracy: z.number().nullish(),
    speed: z.number().nullish(),
    heading: z.number().nullish(),
  })).min(1),
});

export async function POST(req: Request) {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Bad payload" }, { status: 400 });

  const rows = parsed.data.points.map(p => ({ ...p, walk_id: parsed.data.walkId, user_id: user.id }));
  const { error } = await supabase.from("walk_points").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
