import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import NewVisitorBanner from '@/components/NewVisitorBanner'
import { getSupabaseServer } from '@/lib/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pawsome Walks - Professional Dog Walking Services',
  description: 'Professional dog walking services with customizable walk plans, GPS tracking, and detailed reports.',
  keywords: 'dog walking, pet care, dog services, walk plans, GPS tracking',
  authors: [{ name: 'Pawsome Walks' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar initialAuthed={!!user} />
        <main className="min-h-screen bg-gray-50 pt-16">
          {!user && <NewVisitorBanner />}
          {children}
        </main>
      </body>
    </html>
  )
}
