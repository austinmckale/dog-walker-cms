"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PawPrint, MapPin, Users, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import SignOutButton from './SignOutButton'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Pawsome Walks</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavItems pathname={pathname} />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavItems({ pathname }: { pathname: string }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setIsAuthed(!!data.user)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthed(!!session?.user)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const LinkItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        {children}
      </Link>
    )
  }

  return (
    <>
      <LinkItem href="/">
        <PawPrint className="h-4 w-4" />
        <span>Home</span>
      </LinkItem>
      <LinkItem href="/walk-plans">
        <MapPin className="h-4 w-4" />
        <span>Walk Plans</span>
      </LinkItem>
      <LinkItem href="/schedule">
        <MapPin className="h-4 w-4" />
        <span>Schedule</span>
      </LinkItem>
      {isAuthed && (
        <LinkItem href="/pets">
          <Users className="h-4 w-4" />
          <span>Pets</span>
        </LinkItem>
      )}
      {!isAuthed ? (
        <LinkItem href="/signin">
          <User className="h-4 w-4" />
          <span>Sign In</span>
        </LinkItem>
      ) : (
        <SignOutButton />
      )}
    </>
  )
}
