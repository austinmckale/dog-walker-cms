import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MobileNav from '@/components/MobileNav'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
          {children}
          <MobileNav />
        </div>
      </body>
    </html>
  )
} 