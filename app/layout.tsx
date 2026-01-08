import type { Metadata } from 'next'
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Accueil - Bois',
  description: 'Site simplifié'
}

function Header() {
  return (
    <header>
      <div className="container">
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Accueil</a>
          <a href="/catalogue">Catalogue</a>
          <a href="/services">Services</a>
          <a href="/livraison">Livraison</a>
          <a href="/a-propos">À propos</a>
          <a href="/contacts">Contacts</a>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer>
      <div className="container">© {new Date().getFullYear()} Bois</div>
    </footer>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
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

