Prompt for Codex/Cursor

You’re in a Next.js 14 (App Router) + Supabase repo. Apply the following changes.

A) Fix EBADENGINE from @sanity/ui@3.0.6

Preferred fix: move the project to Node 22 (matches @sanity/ui@3.x engine).

Edit package.json:

If an engines field exists, replace it. Otherwise add it.

{
  "engines": { "node": "22.x" }
}


Add/update .nvmrc (optional, for local dev):

22


Ensure Vercel → Project → Settings → Node.js Version is 22.x (this is a manual step; add a README note).

Keep the Install Command as:

npm ci --legacy-peer-deps


(Make sure you are not omitting dev deps.)

Fallback (only if you must stay on Node 20):

Downgrade to a Node-20-compatible Sanity UI:

npm i @sanity/ui@^2 -S


Add .npmrc to avoid strict engine failures:

engine-strict=false


Update any imports if v3-only APIs were used (v2 is mostly compatible for standard components).

Also confirm .gitignore includes:

.next

B) Fix TypeScript: “reports is possibly 'null'”

In app/pets/[id]/page.tsx, make the Supabase result a guaranteed array before rendering.

Patch the file:

// add a helpful type (optional)
type VisitReport = {
  id: string;
  happened_at: string;
  duration_minutes: number | null;
  distance_m: number | null;
  potty1: boolean | null;
  potty2: boolean | null;
  notes: string | null;
  photo_url: string | null;
};

// after you’ve fetched `pet`, fetch reports like this:
const { data: reportsData, error: reportsError } = await supabase
  .from('visit_reports')
  .select(
    'id,happened_at,duration_minutes,distance_m,potty1,potty2,notes,photo_url'
  )
  .eq('pet_id', pet.id)
  .order('happened_at', { ascending: false })
  .returns<VisitReport[]>();

// ALWAYS use a real array:
const reports: VisitReport[] = reportsData ?? [];


Update the JSX render guard:

<section className="space-y-4">
  <h2 className="text-2xl font-semibold">Reports</h2>
  {reports.length === 0 ? (
    <p className="text-gray-600">No reports yet.</p>
  ) : (
    <ul className="space-y-3">
      {reports.map(r => (
        <li key={r.id} className="rounded border p-3">
          <div className="text-sm">{new Date(r.happened_at).toLocaleString()}</div>
          <div className="text-sm">
            {(r.duration_minutes ?? 0)} min · {((r.distance_m ?? 0) / 1000).toFixed(2)} km
          </div>
          {r.photo_url && <img src={r.photo_url} alt="Report photo" className="mt-2 rounded" />}
          {r.notes && <p className="mt-1">{r.notes}</p>}
        </li>
      ))}
    </ul>
  )}
</section>


(Optional) Guard for missing pet:

import { notFound } from 'next/navigation';
if (!pet) notFound();

C) README note (add a short section)

Append to README.md:

## Deploy / Runtime
- Node: 22.x (package.json "engines" and Vercel setting)
- Install Command: `npm ci --legacy-peer-deps`
- Do not commit `.next/`

## Sanity note
@sanity/ui@3 requires Node 22+. If we must stay on Node 20, pin @sanity/ui@^2 and add `.npmrc` with `engine-strict=false`.

D) Acceptance criteria

Vercel build installs without EBADENGINE failure (on Node 22) or, if staying on Node 20, no install failure and app runs with @sanity/ui@^2.

Next.js build no longer fails on reports.length (null-safe rendering).

The site deploys successfully.

Make these edits, run npm run build locally, then push changes.