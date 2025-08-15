-- Create walks and walk_points tables if they don't exist

-- Enable pgcrypto for gen_random_uuid if not already
create extension if not exists pgcrypto;

-- walks: stores a single walk session summary
create table if not exists public.walks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  dog_id text null,
  created_at timestamptz not null default now(),
  ended_at timestamptz null,
  total_distance_m double precision null,
  total_duration_s integer null
);

-- walk_points: stores GPS samples for a walk
create table if not exists public.walk_points (
  id bigserial primary key,
  walk_id uuid not null references public.walks(id) on delete cascade,
  user_id uuid not null,
  ts timestamptz not null,
  lat double precision not null,
  lng double precision not null,
  accuracy double precision null,
  speed double precision null,
  heading double precision null
);

-- Helpful indexes
create index if not exists idx_walks_user_created_at on public.walks (user_id, created_at desc);
create index if not exists idx_walks_user_dog_created_at on public.walks (user_id, dog_id, created_at desc);
create index if not exists idx_points_walk_ts on public.walk_points (walk_id, ts);
create index if not exists idx_points_user_ts on public.walk_points (user_id, ts);

