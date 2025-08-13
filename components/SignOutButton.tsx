"use client"
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  async function onSignOut() {
    await supabase.auth.signOut()
    router.replace('/')
  }
  return (
    <button onClick={onSignOut} className="btn-secondary">
      Sign out
    </button>
  )
}

