'use client'

import { useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type Props = { initialService: 'walk' | 'transport' }

export default function ScheduleClient({ initialService }: Props) {
  const [service, setService] = useState<'walk' | 'transport'>(initialService)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dog_names: '',
    date: '',
    time: '',
    duration_minutes: 30 as number | string,
    pickup_address: '',
    dropoff_address: '',
    notes: '',
  })
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const calcom = process.env.NEXT_PUBLIC_CALCOM_EMBED_URL
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_EMBED_URL

  const embedUrl = useMemo(() => {
    if (calcom) {
      const sep = calcom.includes('?') ? '&' : '?'
      return `${calcom}${sep}source=site`
    }
    if (calendly) return calendly
    return null
  }, [calcom, calendly])

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    if (name === 'service') setService(value as 'walk' | 'transport')
    else setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
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
        pickup_address: service === 'transport' ? form.pickup_address || null : null,
        dropoff_address: service === 'transport' ? form.dropoff_address || null : null,
        notes: form.notes || null,
        status: 'pending',
      },
    ])
    if (error) setStatus({ ok: false, msg: error.message })
    else {
      setStatus({ ok: true, msg: 'Request received! We will confirm by email/text shortly.' })
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
      })
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Schedule {service === 'walk' ? 'a Walk' : 'Transport'}</h1>

      <div className="flex gap-3">
        <button
          onClick={() => setService('walk')}
          className={`px-4 py-2 rounded ${service === 'walk' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
        >
          Walk
        </button>
        <button
          onClick={() => setService('transport')}
          className={`px-4 py-2 rounded ${service === 'transport' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
        >
          Transport
        </button>
      </div>

      {embedUrl ? (
        <div className="w-full">
          <iframe
            src={embedUrl}
            title="Scheduling"
            className="w-full h-[900px] border rounded-xl bg-white"
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

          <button type="submit" className="px-4 py-2 rounded bg-primary-600 text-white">Submit Request</button>
          {status && <p className={`text-sm mt-2 ${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</p>}
        </form>
      )}

      <div className="flex gap-3 pt-4">
        <a href="tel:+16104514099" className="btn-secondary">Call</a>
        <a href="sms:+16104514099" className="btn-secondary">Text</a>
        <a href="mailto:austinmck17@gmail.com" className="btn-secondary">Email</a>
      </div>
    </div>
  )
}

