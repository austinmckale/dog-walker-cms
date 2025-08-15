Prompt for Codex/Cursor

We have a Next.js 14 (App Router) + Supabase app. /pets works locally but throws a server-side error on Vercel. Likely causes: missing Supabase env vars in Vercel, or static prerender on an auth page (cookies) in production.

Do the following changes:
1) Add strict env validation (server & client)

Create lib/env.ts:

// lib/env.ts
const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

export function getEnv() {
  const env: Record<string, string> = {};
  for (const k of required) {
    const v = process.env[k];
    if (!v) {
      // Throw a clear error (will show in Vercel function logs)
      throw new Error(`[ENV MISSING] Set ${k} in Vercel → Project → Settings → Environment Variables`);
    }
    env[k] = v;
  }
  return env as { NEXT_PUBLIC_SUPABASE_URL: string; NEXT_PUBLIC_SUPABASE_ANON_KEY: string };
}


Create .env.example at repo root:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

2) Centralize Supabase clients

Create lib/supabase/server.ts and lib/supabase/client.ts:

// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase"; // if you don’t have types, remove <Database>
import { getEnv } from "@/lib/env";

export function getSupabaseServer() {
  // Ensure env exists; throws helpful error in prod if missing
  getEnv();
  return createServerComponentClient<Database>({ cookies });
}

// lib/supabase/client.ts
"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { getEnv } from "@/lib/env";

export function getSupabaseClient() {
  getEnv(); // validates NEXT_PUBLIC_* at runtime
  return createClientComponentClient<Database>();
}


(If you don’t have types/supabase.ts, remove the <Database> generics.)

3) Force dynamic rendering on auth-gated pages

Edit both app/pets/page.tsx and app/pets/[id]/page.tsx:

At the top of each file add:

export const dynamic = "force-dynamic";
export const revalidate = 0;


Replace direct imports of createServerComponentClient with the helper:

import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";

export default async function PetsPage() {
  const supabase = getSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: petsData, error } = await supabase
    .from("pets")
    .select("id,name,photo_url,created_at,species,breed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[/pets] Supabase error:", error);
    throw error; // will show in Vercel logs with stack
  }

  const pets = petsData ?? [];
  // …render as before
}


Do the same pattern in app/pets/[id]/page.tsx (guard pet, coalesce arrays, log errors).

4) Add an error boundary for nicer messages (optional but helpful)

Create app/pets/error.tsx:

"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  console.error("[/pets] Error boundary:", error);
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-gray-600">Please try again in a moment.</p>
      <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white" onClick={reset}>
        Retry
      </button>
    </div>
  );
}

5) Quick health check route (debug only; you can remove later)

Create app/api/health/route.ts:

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data: pets, error } = await supabase.from("pets").select("id").limit(1);
    return NextResponse.json({ ok: !error, error: error?.message ?? null, petsRowsSeen: pets?.length ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}

Vercel configuration (manual steps)

Set env vars (Production, Preview, Development):

NEXT_PUBLIC_SUPABASE_URL = https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = <anon key>


(From Supabase → Project Settings → API)

Redeploy after saving env vars.

Check function logs if it still errors: Vercel → Deployments → select latest → “Functions” tab.
You should see our clear messages (e.g., [ENV MISSING] or [/pets] Supabase error: …).

Acceptance criteria

/pets and /pets/[id] load on Vercel when logged in (no generic “Application error” page).

If env vars are missing, deploy logs show [ENV MISSING] … pointing to which key.

/api/health returns { ok: true } (or a readable JSON error) instead of a 500.

Local dev still works.