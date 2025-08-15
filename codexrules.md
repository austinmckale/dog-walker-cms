We’re in a Next.js 14 (App Router) + Supabase repo. Apply these changes.

1) Stop uploading/committing .next (warning cleanup)

Ensure .next is ignored and never uploaded with Vercel.

a) Update .gitignore (create if missing)

.next
node_modules
.vercel
.env*
dist
out


b) If .next was accidentally tracked before, untrack it

git rm -r --cached .next || true


c) Add a .vercelignore file (extra safety when deploying from local or CI artifacts):

.next
node_modules
*.log


Commit these changes.

2) Fix /schedule build error: useSearchParams() + prerender

We’ll remove useSearchParams() (so no Suspense warning) and control rendering so Vercel doesn’t try to statically export a page that needs runtime params.

a) Refactor /schedule page into Server + Client pair

Create/modify app/schedule/page.tsx (Server Component):

// app/schedule/page.tsx
import { Suspense } from 'react';
import ScheduleClient from './ScheduleClient';

export const dynamic = 'force-dynamic';   // opt-out of static export for this page
export const revalidate = 0;              // ensure runtime render

type PageProps = {
  searchParams?: { service?: 'walk' | 'transport' | string };
};

export default function Page({ searchParams }: PageProps) {
  const initialService =
    searchParams?.service === 'transport' ? 'transport' : 'walk';

  return (
    <Suspense fallback={<div>Loading…</div>}>
      <ScheduleClient initialService={initialService} />
    </Suspense>
  );
}


Create/modify app/schedule/ScheduleClient.tsx (Client Component)
➡️ Do not use useSearchParams() anymore. Accept initialService via props.

'use client';

import { useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Props = { initialService: 'walk' | 'transport' };

export default function ScheduleClient({ initialService }: Props) {
  const supabase = createClientComponentClient();
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
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(
    null
  );

  const calcom = process.env.NEXT_PUBLIC_CALCOM_EMBED_URL;
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_EMBED_URL;

  const embedUrl = useMemo(() => {
    if (calcom) {
      const sep = calcom.includes('?') ? '&' : '?';
      return `${calcom}${sep}source=site`;
    }
    if (calendly) return calendly;
    return null;
  }, [calcom, calendly]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'service') setService(value as 'walk' | 'transport');
    else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const { error } = await supabase.from('booking_requests').insert([
      {
        service_type: service,
        name: form.name || null,
        email: form.email || null,
        phone: form.phone || null,
        dog_names: form.dog_names || null,
        date: form.date,
        time: form.time,
        duration_minutes: Number(form.duration_minutes) || 30,
        pickup_address:
          service === 'transport' ? form.pickup_address || null : null,
        dropoff_address:
          service === 'transport' ? form.dropoff_address || null : null,
        notes: form.notes || null,
        status: 'pending',
      },
    ]);
    if (error) setStatus({ ok: false, msg: error.message });
    else {
      setStatus({
        ok: true,
        msg: 'Request received! We will confirm by email/text shortly.',
      });
      setForm({
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
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Schedule {service === 'walk' ? 'a Walk' : 'Transport'}
      </h1>

      <div className="flex gap-3">
        <button
          onClick={() => setService('walk')}
          className={`px-4 py-2 rounded ${service === 'walk' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Walk
        </button>
        <button
          onClick={() => setService('transport')}
          className={`px-4 py-2 rounded ${service === 'transport' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Transport
        </button>
      </div>

      {embedUrl ? (
        <div className="w-full">
          <iframe
            src={embedUrl}
            title="Scheduling"
            className="w-full h-[900px] border rounded-xl"
            allow="camera; microphone; payment; geolocation"
          />
          <p className="mt-2 text-sm text-gray-600">
            Having trouble? Use the contact buttons below or submit the request form.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
          <div>
            <label className="block text-sm font-medium">Service</label>
            <select
              name="service"
              value={service}
              onChange={onChange}
              className="mt-1 w-full rounded border p-2"
            >
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
          {status && (
            <p className={`text-sm mt-2 ${status.ok ? 'text-green-600' : 'text-red-600'}`}>
              {status.msg}
            </p>
          )}
        </form>
      )}

      <div className="flex gap-3 pt-4">
        <a href="tel:+16104514099" className="px-4 py-2 rounded bg-gray-200">Call</a>
        <a href="sms:+16104514099" className="px-4 py-2 rounded bg-gray-200">Text</a>
        <a href="mailto:austinmck17@gmail.com" className="px-4 py-2 rounded bg-gray-200">Email</a>
      </div>
    </div>
  );
}


Notes

Removing useSearchParams() avoids the Suspense warning entirely.

dynamic = 'force-dynamic' and revalidate = 0 ensure Vercel won’t try to statically export /schedule.

3) Acceptance criteria

Vercel build no longer fails with the useSearchParams() / prerender error on /schedule.

The warning about .next persists only as an info message; .next is not tracked nor uploaded (verify git ls-files .next returns nothing).

/schedule?service=walk and /schedule?service=transport both load and preselect the right tab.

Form submissions insert into booking_requests as before.