"use client"
import { useState } from 'react'

export default function MeetGreetPage() {
  const [state, setState] = useState({ name: '', email: '', phone: '', dog: '', notes: '' })

  const mailto =
    `mailto:austinmck17@gmail.com?subject=Meet%20%26%20Greet%20Request&body=` +
    encodeURIComponent(
      `Name: ${state.name}\nEmail: ${state.email}\nPhone: ${state.phone}\nDog(s): ${state.dog}\nNotes: ${state.notes}`,
    )

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Book a Free Meet &amp; Greet</h1>
      <p className="text-sm text-gray-600 mb-6">
        We meet you and your pup first to learn routines and ensure a great fit. After approval, you’ll be able to schedule walks.
      </p>

      <form className="grid gap-4">
        <input className="input" placeholder="Your name" value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} />
        <input className="input" placeholder="Email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} />
        <input className="input" placeholder="Phone" value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value })} />
        <input className="input" placeholder="Dog name(s) & breed" value={state.dog} onChange={(e) => setState({ ...state, dog: e.target.value })} />
        <textarea className="input min-h-[120px]" placeholder="Anything we should know?" value={state.notes} onChange={(e) => setState({ ...state, notes: e.target.value })} />
        <div className="flex gap-3">
          <a href={mailto} className="btn-primary">Email Request</a>
          <a
            href="sms:+16105872374?&body=Hi%20—%20I%E2%80%99d%20like%20to%20book%20a%20meet%20%26%20greet."
            className="btn-outline"
          >
            Text Us
          </a>
        </div>
      </form>
    </section>
  )
}

