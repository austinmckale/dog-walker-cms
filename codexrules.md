Prompt for Codex/Cursor

You’re working in a Next.js 14 (App Router) + Supabase project. Implement the Pets MVP plus the UI tweaks and scheduling page.

0) Pre-flight

Ensure deps exist: next, react, react-dom, @supabase/auth-helpers-nextjs, @supabase/supabase-js, tailwindcss (if styling), and types if using TS.

Env vars are set for both local and Vercel:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

(Optional for scheduling) NEXT_PUBLIC_CALCOM_EMBED_URL or NEXT_PUBLIC_CALENDLY_EMBED_URL

1) Nav + Home hero updates

In the top nav: rename “Dogs” → “Pets”, remove “Reports”, and show Pets only when signed in (via Supabase auth on the client; listen for auth state).

Add a server guard on /pets pages (see section B).

On the home hero, remove “Manage Dogs”. Set:

Request a Walk → href="/schedule?service=walk"

Book Transport → href="/schedule?service=transport"

Make the Call / Text / Email buttons tappable:

<a href="tel:+16104514099">Call</a>
<a href="sms:+16104514099">Text</a>
<a href="mailto:austinmck17@gmail.com">Email</a>


Center the Walk Plans grid/cards (use Tailwind mx-auto max-w-6xl and either grid place-items-center or flex justify-center).

2) Scheduling page (/schedule)

Create app/schedule/page.tsx (client component) with dual-mode logic:

If NEXT_PUBLIC_CALCOM_EMBED_URL or NEXT_PUBLIC_CALENDLY_EMBED_URL is set → render an iframe to that URL (900px height).

Else show a fallback request form (name/email/phone/pet names/date/time/duration + transport pickup/dropoff if service=transport) and insert into booking_requests (create table if not present). Show success message.

(If you already created this earlier, leave as-is.)

3) A) Database (Supabase) – minimal MVP ✅ ADD EXACTLY THIS FILE

Create two tables and a public storage bucket. Provide a SQL file supabase/migrations/2025xxxx_pets.sql with:

-- PETS
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text default 'dog',
  breed text,
  sex text,
  weight_kg numeric,
  dob date,
  notes text,
  photo_url text,
  created_at timestamptz default now()
);
alter table public.pets enable row level security;

-- Only the owner can CRUD their pets
create policy "pets_select_owner" on public.pets
  for select using (auth.uid() = owner_id);
create policy "pets_insert_owner" on public.pets
  for insert with check (auth.uid() = owner_id);
create policy "pets_update_owner" on public.pets
  for update using (auth.uid() = owner_id);
create policy "pets_delete_owner" on public.pets
  for delete using (auth.uid() = owner_id);

-- VISIT REPORTS (walks/check-ins) – simple fields for MVP
create table if not exists public.visit_reports (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  happened_at timestamptz not null default now(),
  duration_minutes int,
  distance_m int,
  potty1 boolean,
  potty2 boolean,
  notes text,
  photo_url text
);
alter table public.visit_reports enable row level security;

-- Owner can read/insert reports for their pets
create policy "reports_select_owner" on public.visit_reports
  for select using (
    exists (select 1 from public.pets p where p.id = pet_id and p.owner_id = auth.uid())
  );
create policy "reports_insert_owner" on public.visit_reports
  for insert with check (
    exists (select 1 from public.pets p where p.id = pet_id and p.owner_id = auth.uid())
  );

-- Storage bucket for pet photos (public for MVP; tighten later)
-- Run this only once; ignore error if bucket exists.
select storage.create_bucket('pet-media', public => true);

3b) Storage policies (allow uploads by signed-in users; per-user folders)

Add to the same migration (after bucket creation):

-- Public read of files in 'pet-media'
do $$ begin
  if not exists (select 1 from pg_policies where polname = 'read pet-media') then
    create policy "read pet-media" on storage.objects
    for select using (bucket_id = 'pet-media');
  end if;
end $$;

-- Authenticated users can upload into their own top-level folder: "<uid>/..."
do $$ begin
  if not exists (select 1 from pg_policies where polname = 'upload own files pet-media') then
    create policy "upload own files pet-media" on storage.objects
    for insert to authenticated
    with check (
      bucket_id = 'pet-media'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
end $$;

-- Authenticated users can update/delete their own files
do $$ begin
  if not exists (select 1 from pg_policies where polname = 'modify own files pet-media') then
    create policy "modify own files pet-media" on storage.objects
    for update, delete to authenticated
    using (
      bucket_id = 'pet-media'
      and (storage.foldername(name))[1] = auth.uid()::text
    )
    with check (
      bucket_id = 'pet-media'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
end $$;


Result: both clients and walker (any logged-in user) can upload to their folder (<uid>/pets/... or <uid>/reports/...) and everyone can read images publicly via URL.

4) B) Routes & auth guard

Rename /dogs to /pets: app/pets/page.tsx (index) and app/pets/[id]/page.tsx (detail).

Add a server guard to redirect unauthenticated users to /sign-in on both pages:

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const requireUser = async () => {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');
  return { supabase, user };
};


Use await requireUser() at the top of each server page.

5) C) /pets (index): list + add pet

Create app/pets/page.tsx:

Server load: fetch current user’s pets ordered by created_at desc.

Render cards: photo, name, species/breed, last report summary (if available). Each card links to /pets/[id].

“Add Pet” button → client modal components/pets/AddPetModal.tsx:

Fields: name, species, breed, notes, file input.

On submit:

Upload file to pet-media at /${user.id}/pets/${cryptoUUID}-${filename}.

Get public URL.

Insert into pets with owner_id = user.id and photo_url set to public URL.

router.refresh().

6) D) /pets/[id] (detail): profile + reports

Create app/pets/[id]/page.tsx:

Server load: fetch the pet (RLS enforces ownership) and latest 10 visit_reports.

Layout sections:

Profile: photo, name, species/breed, notes, basic fields; allow owner to update photo (upload to /${user.id}/pets/...).

Reports: list of reports (date, duration, distance, potty1/2, notes, photo thumbnail).

New Report (client component components/reports/NewReport.tsx): fields happened_at, duration_minutes, distance_m, potty1, potty2, notes, optional file input. Upload to /${user.id}/reports/${cryptoUUID}-${filename} (for the current logged-in user), save photo_url in visit_reports, insert row, refresh.

7) E) Nav & redirects

Update top nav label to Pets (not Dogs) and only render it for signed-in users (client-side auth).

Remove the old Reports nav item.

Add redirects in next.config.js:

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/dogs', destination: '/pets', permanent: false },
      { source: '/reports', destination: '/pets', permanent: false },
    ];
  },
};
module.exports = nextConfig;

8) F) Components

Create minimal Tailwind components:

components/pets/PetCard.tsx – photo, name, species/breed, last report chip.

components/pets/AddPetModal.tsx – modal + form + file upload.

components/reports/NewReport.tsx – form with optional photo upload.

9) G) Storage public URL helper

Add lib/storage.ts:

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getPublicUrl = (path: string) => {
  const supabase = createClientComponentClient();
  return supabase.storage.from('pet-media').getPublicUrl(path).data.publicUrl;
};

10) H) Acceptance criteria

Visiting /pets while logged out → redirected to /sign-in.

/pets shows a grid of my pets and an Add Pet button; adding a pet uploads the photo and saves it.

/pets/[id] shows Profile + Reports and a New Report form that inserts a row and refreshes.

Top nav shows Pets only when signed in; Reports removed; /dogs and /reports redirect to /pets.

Contact buttons are tappable; Walk Plans are visually centered; Request a Walk and Book Transport go to /schedule with correct query param.

File uploads work for any signed-in user into their folder; images are publicly viewable via stored photo_url.

Commit message:

feat(pets): add Pets MVP (schema, RLS, storage); pages /pets and /pets/[id]; nav gating + redirects; clickable contact buttons; centered Walk Plans; /schedule page