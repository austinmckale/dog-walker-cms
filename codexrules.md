A) Database (Supabase) – minimal MVP

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

B) Routes & auth guard

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

C) /pets (index): list + add pet

Create app/pets/page.tsx:

Server load: fetch current user’s pets ordered by created_at desc.

Render cards: photo, name, species/breed, last report summary (if available). Each card links to /pets/[id].

“Add Pet” button → client modal/form to create a pet. Upload photo to pet-media bucket at path /${user.id}/pets/${uuid}.jpg and save the photo_url in pets.

Implement a simple client component components/pets/AddPetModal.tsx that:

Lets user enter name, species, breed, notes, and choose a photo.

On submit:

upload file with createClientComponentClient().storage.from('pet-media').upload(path, file),

insert into pets with owner_id = user.id and photo_url set to public URL,

refresh the page (router.refresh()).

D) /pets/[id] (detail): profile + reports (merged “Reports”)

Create app/pets/[id]/page.tsx:

Server load: fetch the pet (ensure it belongs to the user via RLS) and the latest 10 visit_reports.

UI layout with tabs or sections:

Profile: photo, name, species/breed, notes, basic fields.

Reports: list of reports with date, duration, distance, potty1/2, notes, photo thumbnails.

New Report form (client): fields happened_at, duration_minutes, distance_m, potty1, potty2, notes, optional photo upload → insert row into visit_reports and refresh.

Use Supabase Storage again for report photo uploads to /${user.id}/reports/${reportId}.jpg.

E) Nav & redirects

Update the top nav to use Pets (not Dogs) and only show it when signed in.

Remove the old Reports nav item.

Add a redirect in next.config.js from /dogs and /reports → /pets.

async function redirects() {
  return [
    { source: '/dogs', destination: '/pets', permanent: false },
    { source: '/reports', destination: '/pets', permanent: false },
  ];
}
module.exports = { redirects };

F) Components (outline)

Create minimal, styled components with Tailwind:

components/pets/PetCard.tsx – displays a pet’s photo/name + last report chip.

components/pets/AddPetModal.tsx – client modal for adding a pet (with photo upload).

components/reports/NewReport.tsx – client form to add a visit report (with optional photo).

G) Storage public URL helper

Add a small util lib/storage.ts:

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getPublicUrl = (path: string) => {
  const supabase = createClientComponentClient();
  return supabase.storage.from('pet-media').getPublicUrl(path).data.publicUrl;
};

H) Acceptance criteria

Visiting /pets while logged out → redirected to /sign-in.

/pets shows a grid of my pets and an Add Pet button; adding a pet uploads the photo and saves it.

/pets/[id] shows profile + Reports list and a New Report form that inserts a row and refreshes.

Top nav shows Pets only when signed in; Reports removed; /dogs and /reports redirect to /pets.

All data is isolated per user via RLS.

Make minimal, clean UI—no heavy styling needed beyond simple Tailwind classes. Keep code split into small components.