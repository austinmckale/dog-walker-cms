import Navigation from '@/components/Navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function formatDate(d: Date) {
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

export default async function ProfilePage() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="card">
          <h1 className="text-2xl font-semibold mb-4">Profile</h1>
          <dl className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <dt className="text-gray-500">User ID</dt>
              <dd className="font-mono">{user.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd>{user.email}</dd>
            </div>
            {user.user_metadata?.full_name && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Name</dt>
                <dd>{user.user_metadata.full_name}</dd>
              </div>
            )}
            {user.app_metadata?.provider && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Provider</dt>
                <dd className="capitalize">{user.app_metadata.provider}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd>{formatDate(new Date(user.created_at))}</dd>
            </div>
          </dl>
      <div className="mt-6">
        {/* Client sign-out button */}
        <SignOutButton />
      </div>
      </div>
      </main>
    </div>
  )
}

import SignOutButton from '@/components/SignOutButton'
