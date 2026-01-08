import type { Metadata } from 'next'
import '../app/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'
import Toaster from '@/components/Toaster'

export const metadata: Metadata = {
  title: 'TsarstvoDereva - Качественный лес и пиломатериалы',
  description: 'TsarstvoDereva — премиальные пиломатериалы: бревна, доска, брус, дрова, панели. Бесплатная доставка по России. Качество гарантировано.',
  keywords: 'TsarstvoDereva, бревно, доска, брус, пиломатериалы, дрова, бревна, древесина, лес',
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

