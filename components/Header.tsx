'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingCart, User, Phone, Search, Heart, LogOut } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useCartStore } from '@/lib/store/cartStore'
import { PRODUCTS } from '@/lib/data/products'
import { CATEGORIES } from '@/lib/data/categories'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const cartCount = useCartStore((state) => state.getItemCount())
  const pathname = usePathname()



  const menuItems = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/katalog' },
    { name: 'Услуги', href: '/uslugi' },
    { name: 'Доставка', href: '/dostavka' },
    { name: 'О нас', href: '/o-nas' },
    { name: 'Контакты', href: '/kontakty' },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-wood-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="tel:+78175421835" className="flex items-center gap-1.5 sm:gap-2 hover:text-fire-400 transition whitespace-nowrap">
                <Phone size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">+7 (81754) 2-18-35</span>
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
                <Link href="/vhod" className="flex items-center gap-1.5 sm:gap-2 hover:text-fire-400 transition whitespace-nowrap">
                  <User size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Вход / Регистрация</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="bg-white py-3 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
            <div className="bg-fire-600 text-white p-2 sm:p-3 rounded-lg flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold">TS</span>
            </div>
            <div className="min-w-0 hidden xs:block">
              <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-wood-900 truncate">TsarstvoDereva</h1>
              <p className="text-xs text-wood-600 hidden sm:block">Качество и надежность</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative font-medium transition-colors ${isActive ? 'text-fire-600' : 'text-wood-700 hover:text-fire-600'}`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeMenuItem"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-fire-600"
                      initial={false}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
            <button className="p-1.5 sm:p-2 hover:bg-wood-100 rounded-lg transition" aria-label="Поиск">
              <Search size={18} className="sm:w-6 sm:h-6 text-wood-700" />
            </button>
            <Link
              href="/izbrannoe"
              className="relative p-1.5 sm:p-2 hover:bg-wood-100 rounded-lg transition"
              aria-label="Избранное"
            >
              <Heart size={18} className="sm:w-6 sm:h-6 text-wood-700" />
            </Link>
            <Link
              href="/korzina"
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
      </nav>

      {/* Categories Navigation */}
      <div className="bg-wood-50/50 backdrop-blur-md border-b border-wood-100 py-3 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((category) => {
              const decodedPathname = decodeURIComponent(pathname)
              let isActive = decodedPathname === category.href || decodedPathname.startsWith(category.href + '/')

              // Check if we are on a product page belonging to this category
              if (!isActive && pathname.startsWith('/products/')) {
                const productId = pathname.split('/').pop()
                const product = PRODUCTS.find(p => p.id === productId)
                if (product && product.category === category.name) {
                  isActive = true
                }
              }

              return (
                <Link
                  key={category.href}
                  href={category.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${isActive
                    ? 'text-white'
                    : 'text-wood-600 hover:text-fire-600 hover:bg-wood-100'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-fire-600 to-fire-700 rounded-full shadow-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category.name}</span>
                </Link>
              )
            })}
          </div>
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
              {CATEGORIES.map((category) => {
                const decodedPathname = decodeURIComponent(pathname)
                const isActive = decodedPathname === category.href || decodedPathname.startsWith(category.href + '/')
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className={`block py-2 text-sm transition-colors ${isActive ? 'text-fire-600 font-bold' : 'text-wood-600 hover:text-fire-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
