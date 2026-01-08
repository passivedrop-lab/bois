'use client'

import Link from 'next/link'
import { ArrowLeft, Lock, Bell } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <Link 
          href="/profile" 
          className="inline-flex items-center gap-2 text-fire-600 hover:text-fire-700 mb-6"
        >
          <ArrowLeft size={18} />
          Retour au profil
        </Link>
        
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Paramètres</h1>
        <p className="text-wood-600 mb-8">Gérez vos préférences et paramètres de sécurité</p>
        
        <div className="max-w-2xl space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-wood-900 mb-4 flex items-center gap-2">
              <Lock className="text-fire-600" size={24} />
              Changer le mot de passe
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-wood-900 mb-2">Mot de passe actuel</label>
                <input 
                  type="password"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wood-900 mb-2">Nouveau mot de passe</label>
                <input 
                  type="password"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wood-900 mb-2">Confirmer le mot de passe</label>
                <input 
                  type="password"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </div>
              <button 
                type="submit"
                className="bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition font-semibold"
              >
                Mettre à jour
              </button>
            </form>
          </div>
          
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-wood-900 mb-4 flex items-center gap-2">
              <Bell className="text-fire-600" size={24} />
              Notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-wood-700">Recevoir les notifications par email</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-wood-700">Notifications de commande</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-wood-700">Offres spéciales et promotions</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
