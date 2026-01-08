'use client'

import Link from 'next/link'
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Mon Profil</h1>
        <p className="text-wood-600 mb-12">Gérez votre compte et vos commandes</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil Info */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-wood-900 mb-6 flex items-center gap-2">
              <User className="text-fire-600" />
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-wood-600">Nom</label>
                <p className="text-lg text-wood-900">Prénom Nom</p>
              </div>
              <div>
                <label className="text-sm font-medium text-wood-600">Email</label>
                <p className="text-lg text-wood-900">email@exemple.com</p>
              </div>
              <div>
                <label className="text-sm font-medium text-wood-600">Téléphone</label>
                <p className="text-lg text-wood-900">+7 (999) 123-45-67</p>
              </div>
            </div>
          </div>
          
          {/* Menu Lateral */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-xl font-bold text-wood-900 mb-4">Menu</h3>
            <nav className="space-y-2">
              <Link 
                href="/profile/orders"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-wood-100 transition text-wood-700"
              >
                <ShoppingBag size={18} />
                <span>Mes Commandes</span>
              </Link>
              <Link 
                href="/favorites"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-wood-100 transition text-wood-700"
              >
                <Heart size={18} />
                <span>Favoris</span>
              </Link>
              <Link 
                href="/profile/settings"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-wood-100 transition text-wood-700"
              >
                <Settings size={18} />
                <span>Paramètres</span>
              </Link>
              <button 
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-red-100 transition text-red-600 font-semibold"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
