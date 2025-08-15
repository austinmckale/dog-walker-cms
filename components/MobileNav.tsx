"use client"

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Home, Map, Users, User, Calendar} from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function MobileNav() {
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => mounted && setIsAuthed(!!data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setIsAuthed(!!session?.user))
    return () => sub.subscription.unsubscribe()
  }, [])

  const items = [
    {name: 'Home', href: '/', icon: Home, show: true},
    {name: 'Schedule', href: '/schedule', icon: Calendar, show: true},
    {name: 'Clients', href: '/dogs', icon: Users, show: isAuthed},
    {name: 'Sign In', href: '/signin', icon: User, show: !isAuthed},
  ] as const

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow md:hidden">
      <ul className="flex justify-around" role="menubar">
        {items.filter(i => i.show).map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.name} className="flex-1" role="none">
              <Link
                href={item.href}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

