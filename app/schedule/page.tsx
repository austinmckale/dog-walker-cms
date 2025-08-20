"use client"
import { useState } from 'react'

type Service = '30-min Walk' | '45-min Walk' | 'Transport'
function TimeDropdown({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        className="input flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value ? (value === 'ASAP' ? 'As soon as possible' : options.find((o) => o.value === value)?.label || 'Select a time') : 'Select a time'}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow">
          <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
            <li>
              <button
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${value === 'ASAP' ? 'bg-gray-50 font-medium' : ''}`}
                onClick={() => {
                  onChange('ASAP')
                  setOpen(false)
                }}
              >
                As soon as possible
              </button>
            </li>
            {options.map((t) => (
              <li key={t.value}>
                <button
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${value === t.value ? 'bg-gray-50 font-medium' : ''}`}
                  onClick={() => {
                    onChange(t.value)
                    setOpen(false)
                  }}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
export default function SchedulePage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [service, setService] = useState<Service>('30-min Walk')
  const [duration, setDuration] = useState(30)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', dog: '', notes: '' })
  const timeOptions = (() => {
    const opts: { value: string; label: string }[] = []
    for (let h = 6; h <= 21; h++) {
      for (const m of [0, 30]) {
        if (h === 21 && m === 30) break
        const hh = h.toString().padStart(2, '0')
        const mm = m.toString().padStart(2, '0')
        const value = `${hh}:${mm}`
        const ampm = h < 12 ? 'AM' : 'PM'
        const hr12 = ((h + 11) % 12) + 1
        const label = `${hr12}:${mm} ${ampm}`
        opts.push({ value, label })
      }
    }
    return opts
  })()

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as any) : s))
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as any) : s))

  const onPick = (s: Service) => {
    setService(s)
    setDuration(s === '45-min Walk' ? 45 : s === '30-min Walk' ? 30 : 0)
    next()
  }

  const mailto =
    `mailto:austinmck17@gmail.com?subject=Walk%20Request&body=` +
    encodeURIComponent(
      `Service: ${service}\nDuration: ${duration} min\nDate: ${date}\nTime: ${time}\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nDog(s): ${form.dog}\nNotes: ${form.notes}`,
    )

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Request a Walk</h1>
      <p className="text-sm text-gray-600 mb-6">
        New here? Please <a className="underline" href="/meet-greet">book a Meet &amp; Greet first</a>.
      </p>

      <div className="mb-4 text-sm text-gray-500">Step {step} of 4</div>

      {step === 1 && (
        <div className="grid gap-3">
          <button className="card" onClick={() => onPick('30-min Walk')}>
            30-Minute Walk
          </button>
          <button className="card" onClick={() => onPick('45-min Walk')}>
            45-Minute Walk
          </button>
          <button className="card" onClick={() => onPick('Transport')}>
            Pet Transport
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-3">
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <TimeDropdown value={time} onChange={setTime} options={timeOptions} />
          {duration > 0 && (
            <select className="input" value={duration} onChange={(e) => setDuration(+e.target.value)}>
              <option value={duration}>{duration} minutes</option>
              <option value={duration === 30 ? 45 : 30}>{duration === 30 ? 45 : 30} minutes</option>
            </select>
          )}
          <p className="text-xs text-gray-600">Select a time in 30-minute intervals. We will contact you to confirm before finalizing your schedule.</p>
          <div className="flex gap-3">
            <button className="btn-outline" onClick={back}>
              Back
            </button>
            <button className="btn-primary" onClick={next}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-3">
          <input className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Dog name(s)" value={form.dog} onChange={(e) => setForm({ ...form, dog: e.target.value })} />
          <textarea className="input min-h-[100px]" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-3">
            <button className="btn-outline" onClick={back}>
              Back
            </button>
            <button className="btn-primary" onClick={next}>
              Review
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="rounded-md border p-4 text-sm">
            <div>
              <b>Service:</b> {service} {duration ? `(${duration} min)` : ''}
            </div>
            <div>
              <b>Date/Time:</b> {date} {time}
            </div>
            <div>
              <b>Name:</b> {form.name}
            </div>
            <div>
              <b>Dog(s):</b> {form.dog}
            </div>
            <div>
              <b>Notes:</b> {form.notes || '—'}
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-outline" onClick={back}>
              Back
            </button>
            <a href={mailto} className="btn-primary">
              Send Request
            </a>
          </div>
          <p className="text-xs text-gray-600">Submitting this request does not confirm a booking. We will contact you to confirm before finalizing your schedule.</p>
        </div>
      )}
    </section>
  )
}
