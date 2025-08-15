create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  service_type text check (service_type in ('walk','transport')) not null,
  name text,
  email text,
  phone text,
  dog_names text,
  date date not null,
  time time not null,
  duration_minutes int,
  pickup_address text,
  dropoff_address text,
  notes text,
  status text default 'pending'
);

alter table booking_requests enable row level security;

do $$ begin
  create policy "allow insert for anon" on booking_requests
  for insert to anon
  with check (true);
exception when duplicate_object then null; end $$;

