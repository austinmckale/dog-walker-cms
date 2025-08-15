Prompt for Codex/Cursor

You’re in a Next.js 14 (App Router) + Supabase project. Implement a scheduling system and wire the UI:

Scheduling approach (choose + implement)

Recommendation: Use a dual-mode scheduler:

External embed (zero backend): support Cal.com or Calendly via iframe.

Works immediately if env vars are present.

In-house fallback (Supabase): simple request form that inserts a “booking request” into Supabase when no external embed URL is set.

We will implement both and auto-select based on env vars:

NEXT_PUBLIC_CALCOM_EMBED_URL (e.g., https://cal.com/yourname/dog-walk?embed=1)

NEXT_PUBLIC_CALENDLY_EMBED_URL (e.g., https://calendly.com/yourname/dog-walk)

If neither is set, show the in-house request form.

Tasks
1) Remove “Manage Dogs” from the home page hero

Find the hero/buttons on the home page (likely app/page.tsx or a Hero.tsx component).

Delete the “Manage Dogs” button.

Change “Request a Walk” to link /schedule?service=walk.

Change “Book Transport” to link /schedule?service=transport.

2) Create a /schedule page (dual-mode)

Create app/schedule/page.tsx as a client component:

Read service from useSearchParams() and store as state ('walk' | 'transport'), default to 'walk'.

If process.env.NEXT_PUBLIC_CALCOM_EMBED_URL is present, render an iframe pointing to that URL. If a service param exists, append &service=walk/transport when meaningful (or ignore if your Cal.com page handles services internally).

Else if NEXT_PUBLIC_CALENDLY_EMBED_URL is present, render an iframe to that URL (Calendly inline).

Else render an in-house request form with fields:

Service Type (walk/transport) – preselect from query param

Name, Email, Phone

Dog name(s)

Preferred Date, Time, Duration (minutes)

Pickup Address (transport), Dropoff Address (transport) — hide for walk if not needed

Notes (textarea)

Submit button

On submit, insert into Supabase table booking_requests (see step 3). Show success and clear form.

Code (create the page):

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SchedulePage() {
  const params = useSearchParams();
  const supabase = createClientComponentClient();
  const initialService = (params.get('service') === 'transport' ? 'transport' : 'walk') as 'walk' | 'transport';
  const [service, setService] = useState<'walk' | 'transport'>(initialService);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dog_names: '',
    date: '',
    time: '',
    duration_minutes: 30,
    pickup_address: '',
    dropoff_address: '',
    notes: '',
  });
  const [status, setStatus] = useState<{ok:boolean; msg:string} | null>(null);

  const calcom = process.env.NEXT_PUBLIC_CALCOM_EMBED_URL;
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_EMBED_URL;

  const embedUrl = useMemo(() => {
    if (calcom) {
      // Optionally pass service as query to your Cal.com booking page if supported
      const sep = calcom.includes('?') ? '&' : '?';
      return `${calcom}${sep}source=site`;
    }
    if (calendly) {
      return calendly;
    }
    return null;
  }, [calcom, calendly]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'service') setService(value as 'walk' | 'transport');
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const { error } = await supabase.from('booking_requests').insert([{
      service_type: service,
      name: form.name || null,
      email: form.email || null,
      phone: form.phone || null,
      dog_names: form.dog_names || null,
      date: form.date,
      time: form.time,
      duration_minutes: Number(form.duration_minutes) || 30,
      pickup_address: service === 'transport' ? (form.pickup_address || null) : null,
      dropoff_address: service === 'transport' ? (form.dropoff_address || null) : null,
      notes: form.notes || null,
      status: 'pending'
    }]);
    if (error) setStatus({ ok:false, msg: error.message });
    else {
      setStatus({ ok:true, msg: 'Request received! We will confirm by email/text shortly.' });
      setForm({ name:'', email:'', phone:'', dog_names:'', date:'', time:'', duration_minutes:30, pickup_address:'', dropoff_address:'', notes:'' });
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Schedule {service === 'walk' ? 'a Walk' : 'Transport'}</h1>

      <div className="flex gap-3">
        <button onClick={() => setService('walk')} className={`px-4 py-2 rounded ${service === 'walk' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Walk</button>
        <button onClick={() => setService('transport')} className={`px-4 py-2 rounded ${service === 'transport' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Transport</button>
      </div>

      {embedUrl ? (
        <div className="w-full">
          <iframe
            src={embedUrl}
            title="Scheduling"
            className="w-full h-[900px] border rounded-xl"
            allow="camera; microphone; payment; geolocation"
          />
          <p className="mt-2 text-sm text-gray-600">Having trouble? Use the contact buttons below or submit the request form.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
          <div>
            <label className="block text-sm font-medium">Service</label>
            <select name="service" value={service} onChange={onChange} className="mt-1 w-full rounded border p-2">
              <option value="walk">Dog Walk</option>
              <option value="transport">Transport</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full rounded border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" name="email" value={form.email} onChange={onChange} className="mt-1 w-full rounded border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} className="mt-1 w-full rounded border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Dog name(s)</label>
              <input name="dog_names" value={form.dog_names} onChange={onChange} className="mt-1 w-full rounded border p-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input type="date" name="date" value={form.date} onChange={onChange} className="mt-1 w-full rounded border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Time</label>
              <input type="time" name="time" value={form.time} onChange={onChange} className="mt-1 w-full rounded border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Duration (min)</label>
              <input type="number" name="duration_minutes" value={form.duration_minutes} onChange={onChange} className="mt-1 w-full rounded border p-2" min={15} step={15} />
            </div>
          </div>

          {service === 'transport' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Pickup Address</label>
                <input name="pickup_address" value={form.pickup_address} onChange={onChange} className="mt-1 w-full rounded border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Dropoff Address</label>
                <input name="dropoff_address" value={form.dropoff_address} onChange={onChange} className="mt-1 w-full rounded border p-2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea name="notes" value={form.notes} onChange={onChange} className="mt-1 w-full rounded border p-2" rows={4} />
          </div>

          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Submit Request</button>
          {status && <p className={`text-sm mt-2 ${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</p>}
        </form>
      )}

      {/* Contact buttons */}
      <div className="flex gap-3 pt-4">
        <a href="tel:+16104514099" className="px-4 py-2 rounded bg-gray-200">Call</a>
        <a href="sms:+16104514099" className="px-4 py-2 rounded bg-gray-200">Text</a>
        <a href="mailto:austinmck17@gmail.com" className="px-4 py-2 rounded bg-gray-200">Email</a>
      </div>
    </div>
  );
}

3) Supabase table & RLS (for in-house fallback)

Create a migration or run in SQL editor:

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

-- Allow anonymous INSERTs (public request form)
create policy "allow insert for anon" on booking_requests
for insert to anon
with check (true);

4) Update home hero buttons

On the home page, remove the “Manage Dogs” button.

Ensure:

Request a Walk → href="/schedule?service=walk"

Book Transport → href="/schedule?service=transport"

5) (Optional) Add /schedule to the top nav

If there is a nav link that previously pointed elsewhere for scheduling, point it to /schedule. Keep it visible for everyone (no auth needed).

6) Test checklist

Home page has no “Manage Dogs” button.

“Request a Walk” and “Book Transport” both go to /schedule with the correct preselected service.

If NEXT_PUBLIC_CALCOM_EMBED_URL or NEXT_PUBLIC_CALENDLY_EMBED_URL is set, the iframe renders. Otherwise, the Supabase request form renders and submits into booking_requests.

Contact buttons open dialer, SMS, and mail client.

7) Env vars (add to Vercel → Project → Env)

(Optional) NEXT_PUBLIC_CALCOM_EMBED_URL

(Optional) NEXT_PUBLIC_CALENDLY_EMBED_URL

Commit message
feat(schedule): remove Manage Dogs from home; add /schedule dual-mode (Cal/Calendly embed or Supabase fallback); wire Request a Walk & Book Transport; add contact buttons