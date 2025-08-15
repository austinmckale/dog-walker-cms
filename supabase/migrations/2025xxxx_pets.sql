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

