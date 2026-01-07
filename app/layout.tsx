import type { Metadata } from 'next'
import '../app/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'
import Toaster from '@/components/Toaster'

export const metadata: Metadata = {
  title: 'TSARSTVODereva - Качественные дрова для отопления',
  description: 'TSARSTVODereva — премиальные дрова, пеллеты и печи. Доставка по всей России. Качество гарантировано.',
  keywords: 'TSARSTVODereva, дрова, пеллеты, печи, камины, топливо',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

