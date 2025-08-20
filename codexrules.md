Codex Prompt

You are a senior Next.js + Tailwind engineer. Update an existing Next.js App Router project for “Pawsome Walks”. The site currently has: Home, Walk Plans (pricing), Schedule, Sign In. It looks OK on desktop but is clunky on mobile. The business requires a meet & greet before any booking/subscription.

Goals

Fix mobile navigation button (hamburger) so it opens a menu reliably on small screens.

Replace e-commerce style CTAs with an industry-standard Meet & Greet first flow.

Make scheduling mobile-first: convert the long form into a short stepper (Service → Date/Time → Owner/Dog → Confirm).

Keep Supabase auth intact; do not add new tables. Contact actions can send an email via mailto: and/or post to an existing webhook endpoint if present.

Implementation
A) Responsive Navigation (bug fix)

Create components/Navbar.tsx and use a simple, accessible pattern (no external libs). Ensure the toggle is clickable on mobile (no overlay blocking clicks, correct z-index). Add a focus trap and ESC to close.

// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close if clicking outside panel
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (open && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Pawsome Walks</Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-6">
          <Link href="/walk-plans">Walk Plans</Link>
          <Link href="/schedule">Schedule</Link>
          <Link href="/sign-in" className="rounded-md border px-3 py-1.5">Sign In</Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border"
        >
          <span className="sr-only">Menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="fixed top-14 right-0 left-0 mx-4 rounded-xl border bg-white p-4 z-50 md:hidden"
          >
            <div className="flex flex-col gap-3">
              <Link onClick={() => setOpen(false)} href="/walk-plans">Walk Plans</Link>
              <Link onClick={() => setOpen(false)} href="/schedule">Schedule</Link>
              <Link onClick={() => setOpen(false)} href="/meet-greet" className="rounded-md bg-blue-600 text-white px-3 py-2 text-center">Book Free Meet &amp; Greet</Link>
              <Link onClick={() => setOpen(false)} href="/sign-in" className="rounded-md border px-3 py-2 text-center">Sign In</Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}


Mount this in your root layout and add top padding so content isn’t hidden:

// app/layout.tsx
import Navbar from "@/components/Navbar";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}


This fixes the “nav button doesn’t work on mobile” by providing a real button, stopping event propagation, ensuring a visible overlay with correct z-index, and avoiding hidden elements with pointer-events:none.

B) Meet & Greet–First flow

Create a new page at /meet-greet with a short form and clear copy.

Replace “Book This Plan / Subscribe” on Walk Plans with “Start with a Free Meet & Greet”.

Add a note under each plan: “All new clients begin with a complimentary meet & greet before scheduling walks.”

New page

// app/meet-greet/page.tsx
"use client";
import { useState } from "react";

export default function MeetGreetPage() {
  const [state, setState] = useState({ name: "", email: "", phone: "", dog: "", notes: "" });

  const mailto = `mailto:austinmck17@gmail.com?subject=Meet%20%26%20Greet%20Request&body=` +
    encodeURIComponent(
      `Name: ${state.name}\nEmail: ${state.email}\nPhone: ${state.phone}\nDog(s): ${state.dog}\nNotes: ${state.notes}`
    );

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Book a Free Meet &amp; Greet</h1>
      <p className="text-sm text-gray-600 mb-6">
        We meet you and your pup first to learn routines and ensure a great fit. After approval, you’ll be able to schedule walks.
      </p>

      <form className="grid gap-4">
        <input className="input" placeholder="Your name" value={state.name} onChange={e=>setState({...state, name:e.target.value})}/>
        <input className="input" placeholder="Email" value={state.email} onChange={e=>setState({...state, email:e.target.value})}/>
        <input className="input" placeholder="Phone" value={state.phone} onChange={e=>setState({...state, phone:e.target.value})}/>
        <input className="input" placeholder="Dog name(s) & breed" value={state.dog} onChange={e=>setState({...state, dog:e.target.value})}/>
        <textarea className="input min-h-[120px]" placeholder="Anything we should know?" value={state.notes} onChange={e=>setState({...state, notes:e.target.value})}/>
        <div className="flex gap-3">
          <a href={mailto} className="btn-primary">Email Request</a>
          <a href="sms:+16105872374?&body=Hi%20—%20I%E2%80%99d%20like%20to%20book%20a%20meet%20%26%20greet." className="btn-outline">Text Us</a>
        </div>
      </form>
    </section>
  );
}


Add simple Tailwind component classes:

// styles (globals.css or as utilities)
.input { @apply w-full rounded-md border px-3 py-2; }
.btn-primary { @apply inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white; }
.btn-outline { @apply inline-flex items-center justify-center rounded-md border px-4 py-2; }


Update Walk Plans CTAs

Replace “Book This Plan” buttons with: href="/meet-greet" and label “Start with Free Meet & Greet”.

Replace “Subscribe” dropdown/button with a single small text link: “Subscription available after meet & greet”.

Under each plan card, add: “Includes GPS tracking & photo updates. New clients start with a meet & greet.”

C) Mobile Stepper for Schedule page

Convert /schedule into a 3-step mobile-first form: Service → Date/Time → Owner & Dog → Confirm. Buttons are large, touch-friendly. Default durations auto-fill for walk types.

// app/schedule/page.tsx
"use client";
import { useState } from "react";

type Service = "30-min Walk" | "45-min Walk" | "Transport";
export default function SchedulePage() {
  const [step, setStep] = useState<1|2|3|4>(1);
  const [service, setService] = useState<Service>("30-min Walk");
  const [duration, setDuration] = useState(30);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name:"", email:"", phone:"", dog:"", notes:"" });

  const next = ()=> setStep((s)=> (s<4 ? (s+1) as any : s));
  const back = ()=> setStep((s)=> (s>1 ? (s-1) as any : s));

  const onPick = (s: Service) => {
    setService(s);
    setDuration(s === "45-min Walk" ? 45 : s === "30-min Walk" ? 30 : 0);
    next();
  };

  const mailto = `mailto:austinmck17@gmail.com?subject=Walk%20Request&body=` + encodeURIComponent(
    `Service: ${service}\nDuration: ${duration} min\nDate: ${date}\nTime: ${time}\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nDog(s): ${form.dog}\nNotes: ${form.notes}`
  );

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Request a Walk</h1>
      <p className="text-sm text-gray-600 mb-6">New here? Please <a className="underline" href="/meet-greet">book a Meet &amp; Greet first</a>.</p>

      {/* Step indicator */}
      <div className="mb-4 text-sm text-gray-500">Step {step} of 4</div>

      {step===1 && (
        <div className="grid gap-3">
          <button className="card" onClick={()=>onPick("30-min Walk")}>30-Minute Walk</button>
          <button className="card" onClick={()=>onPick("45-min Walk")}>45-Minute Walk</button>
          <button className="card" onClick={()=>onPick("Transport")}>Pet Transport</button>
        </div>
      )}

      {step===2 && (
        <div className="grid gap-3">
          <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)} />
          {duration>0 && (
            <select className="input" value={duration} onChange={e=>setDuration(+e.target.value)}>
              <option value={duration}>{duration} minutes</option>
              <option value={duration===30?45:30}>{duration===30?45:30} minutes</option>
            </select>
          )}
          <div className="flex gap-3">
            <button className="btn-outline" onClick={back}>Back</button>
            <button className="btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step===3 && (
        <div className="grid gap-3">
          <input className="input" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <input className="input" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
          <input className="input" placeholder="Dog name(s)" value={form.dog} onChange={e=>setForm({...form,dog:e.target.value})}/>
          <textarea className="input min-h-[100px]" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
          <div className="flex gap-3">
            <button className="btn-outline" onClick={back}>Back</button>
            <button className="btn-primary" onClick={next}>Review</button>
          </div>
        </div>
      )}

      {step===4 && (
        <div className="space-y-4">
          <div className="rounded-md border p-4 text-sm">
            <div><b>Service:</b> {service} {duration ? `(${duration} min)` : ""}</div>
            <div><b>Date/Time:</b> {date} {time}</div>
            <div><b>Name:</b> {form.name}</div>
            <div><b>Dog(s):</b> {form.dog}</div>
            <div><b>Notes:</b> {form.notes || "—"}</div>
          </div>
          <div className="flex gap-3">
            <button className="btn-outline" onClick={back}>Back</button>
            <a href={mailto} className="btn-primary">Send Request</a>
          </div>
        </div>
      )}
    </section>
  );
}


Add a small card utility:

/* globals.css */
.card { @apply w-full rounded-xl border px-4 py-4 text-left; }

D) Update Walk Plans page UI text

Card button label: “Start with Free Meet & Greet” → link to /meet-greet.

Remove “Subscribe” buttons. Under the price tables add a muted note:

“Subscriptions are available after your meet & greet. Prices shown reflect per-walk equivalent.”

Acceptance Criteria

On mobile, tapping the hamburger opens a menu every time; no dead zones; overlay dims background; ESC and outside click close it.

All pricing CTAs route to /meet-greet. No “Book/Subscribe” actions appear for new visitors.

The Schedule page renders a 4-step flow; fields are large and tappable; duration auto-fills by service; “Send Request” opens a prepared email.

Header is sticky; content isn’t hidden under it.

Lighthouse mobile tap targets pass.

Make these edits and refactor with TypeScript + Tailwind only. Do not add new DB tables. Keep code concise and production-ready.