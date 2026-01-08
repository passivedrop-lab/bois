'use client'

import Link from 'next/link'
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Мой Профиль</h1>
        <p className="text-wood-600 mb-12">Управляйте вашим аккаунтом и заказами</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil Info */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-wood-900 mb-6 flex items-center gap-2">
              <User className="text-fire-600" />
              Личная информация
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-wood-600">Имя</label>
                <p className="text-lg text-wood-900">Ivan Petrov</p>
              </div>
              <div>
                <label className="text-sm font-medium text-wood-600">Email</label>
                <p className="text-lg text-wood-900">email@example.com</p>
              </div>
              <div>
                <label className="text-sm font-medium text-wood-600">Телефон</label>
                <p className="text-lg text-wood-900">+7 (999) 123-45-67</p>
              </div>
            </div>
          </div>
          
          {/* Menu Lateral */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-xl font-bold text-wood-900 mb-4">Меню</h3>
            <nav className="space-y-2">
              <Link 
                href="/profile/orders"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-wood-100 transition text-wood-700"
              >
                <ShoppingBag size={18} />
                <span>Мои Наказы</span>
              </Link>
              <Link 
                href="/favorites"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-wood-100 transition text-wood-700"
              >
                <Heart size={18} />
                <span>Избранное</span>
              </Link>
              <Link 
                href="/profile/settings"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-wood-100 transition text-wood-700"
              >
                <Settings size={18} />
                <span>Настройки</span>
              </Link>
              <button 
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-red-100 transition text-red-600 font-semibold"
              >
                <LogOut size={18} />
                <span>Выход</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
