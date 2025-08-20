"use client"
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import SignOutButton from '@/components/SignOutButton'

export default function Navbar({ initialAuthed = false }: { initialAuthed?: boolean }) {
  const [open, setOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState(initialAuthed)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current) return
      if (open && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [open])

  // Auth state for showing/hiding nav items
  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setIsAuthed(!!data.user)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthed(!!session?.user)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Pawsome Walks</Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/walk-plans" className="hover:underline">Walk Plans</Link>
          <Link href="/schedule" className="hover:underline">Schedule</Link>
          {isAuthed ? (
            <>
              <Link href="/pets" className="hover:underline">Pets</Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/signin" className="hover:underline">Sign In</Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation()
            setOpen((v) => !v)
          }}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border"
        >
          <span className="sr-only">Menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
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
              <Link onClick={() => setOpen(false)} href="/walk-plans" className="hover:underline">Walk Plans</Link>
              <Link onClick={() => setOpen(false)} href="/schedule" className="hover:underline">Schedule</Link>
              <Link onClick={() => setOpen(false)} href="/meet-greet" className="rounded-md bg-blue-600 text-white px-3 py-2 text-center">Book Free Meet &amp; Greet</Link>
              {isAuthed ? (
                <>
                  <Link onClick={() => setOpen(false)} href="/pets" className="text-center hover:underline">Pets</Link>
                  <button onClick={() => { setOpen(false); supabase.auth.signOut() }} className="btn-secondary">Sign out</button>
                </>
              ) : (
                <Link onClick={() => setOpen(false)} href="/signin" className="text-center hover:underline">Sign In</Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
