-- Adds a dog_id column to link walks to a specific dog (Sanity _id as text)
-- and useful indexes for common queries.

-- 1) Add dog_id column if it does not exist
do $$ begin
  alter table public.walks add column if not exists dog_id text;
exception
  when duplicate_column then null;
end $$;

-- 2) Composite index for querying a user's walks by dog, ordered by created_at
-- Note: created_at should exist on public.walks; if not, remove it from the index or add it first.
create index if not exists walks_user_dog_created_at_idx
  on public.walks (user_id, dog_id, created_at desc);

-- 3) Simple index on dog_id for general lookups
create index if not exists walks_dog_id_idx
  on public.walks (dog_id);

