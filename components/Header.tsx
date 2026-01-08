'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, User, Phone, Search, Heart, LogOut } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useCartStore } from '@/lib/store/cartStore'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const cartCount = useCartStore((state) => state.getItemCount())
  const pathname = usePathname()

  const menuItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'Services', href: '/services' },
    { name: 'Livraison', href: '/livraison' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Contacts', href: '/contacts' },
  ]

  const categories = [
    { name: 'Bois de construction', href: '/catalogue/bois-de-construction' },
    { name: 'Bois scié', href: '/catalogue/bois-scié' },
    { name: 'Bois de chauffage', href: '/catalogue/bois-de-chauffage' },
    { name: 'Bois sauna', href: '/catalogue/bois-sauna' },
    { name: 'Bois décoratif', href: '/catalogue/bois-decoratif' },
    { name: 'Panneaux', href: '/catalogue/panneaux' },
    { name: 'Bois extérieur', href: '/catalogue/bois-exterieur' },
    { name: 'Bois brut / industriel', href: '/catalogue/bois-brut-industriel' },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-wood-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="tel:+79991234567" className="flex items-center gap-1.5 sm:gap-2 hover:text-fire-400 transition whitespace-nowrap">
                <Phone size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">+7 (999) 123-45-67</span>
              </a>
              <span className="hidden sm:inline">Доставка по всей России</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {user ? (
                <Link href="/profile" className="flex items-center gap-1.5 sm:gap-2 hover:text-fire-400 transition whitespace-nowrap">
                  <User size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline text-xs sm:text-sm">Мой профиль</span>
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-1.5 sm:gap-2 hover:text-fire-400 transition whitespace-nowrap">
                  <User size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Вход / Регистрация</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
            <div className="bg-fire-600 text-white p-2 sm:p-3 rounded-lg flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold">TS</span>
            </div>
            <div className="min-w-0 hidden xs:block">
              <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-wood-900 truncate">TSARSTVODereva</h1>
              <p className="text-xs text-wood-600 hidden sm:block">Качество и надежность</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-wood-700 hover:text-fire-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
            <button className="p-1.5 sm:p-2 hover:bg-wood-100 rounded-lg transition" aria-label="Поиск">
              <Search size={18} className="sm:w-6 sm:h-6 text-wood-700" />
            </button>
            <Link
              href="/favorites"
              className="relative p-1.5 sm:p-2 hover:bg-wood-100 rounded-lg transition"
              aria-label="Избранное"
            >
              <Heart size={18} className="sm:w-6 sm:h-6 text-wood-700" />
            </Link>
            <Link
              href="/cart"
              className="relative p-1.5 sm:p-2 hover:bg-wood-100 rounded-lg transition"
              aria-label="Корзина"
            >
              <ShoppingCart size={18} className="sm:w-6 sm:h-6 text-wood-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-fire-600 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            {user && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1.5 sm:p-2 hover:bg-wood-100 rounded-lg transition"
                  aria-label="Мой профиль"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-wood-100 overflow-hidden z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 hover:bg-wood-50 transition text-wood-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Мой профиль
                    </Link>
                    <Link
                      href="/profile/orders"
                      className="block px-4 py-3 hover:bg-wood-50 transition text-wood-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Мои заказы
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-wood-50 transition text-wood-700 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-wood-100 rounded-lg transition"
              aria-label="Меню"
            >
              {isMenuOpen ? (
                <X size={20} className="sm:w-6 sm:h-6 text-wood-700" />
              ) : (
                <Menu size={20} className="sm:w-6 sm:h-6 text-wood-700" />
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:flex items-center justify-between gap-4 lg:gap-6 mt-3 sm:mt-4 pb-2 border-b border-wood-200 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="text-[10px] lg:text-xs uppercase tracking-wider font-bold text-wood-600 hover:text-fire-600 transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-wood-200">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-wood-700 hover:text-fire-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-wood-200 mt-2">
              <p className="text-sm font-semibold text-wood-900 mb-2">Категории:</p>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="block py-2 text-sm text-wood-600 hover:text-fire-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
