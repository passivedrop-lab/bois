'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const categories = [
  { name: 'Bois de construction', href: '/catalogue/bois-de-construction', icon: '🏗️' },
  { name: 'Bois scié', href: '/catalogue/bois-scié', icon: '🪵' },
  { name: 'Bois de chauffage', href: '/catalogue/bois-de-chauffage', icon: '🔥' },
  { name: 'Bois sauna', href: '/catalogue/bois-sauna', icon: '🧖' },
  { name: 'Bois décoratif', href: '/catalogue/bois-decoratif', icon: '✨' },
  { name: 'Panneaux', href: '/catalogue/panneaux', icon: '📦' },
  { name: 'Bois extérieur', href: '/catalogue/bois-exterieur', icon: '🌲' },
  { name: 'Bois brut / industriel', href: '/catalogue/bois-brut-industriel', icon: '⚙️' },
]

export default function CataloguePage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Catalogue</h1>
        <p className="text-wood-600 mb-8">Découvrez notre large gamme de produits en bois de qualité</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="bg-white border border-wood-200 rounded-lg p-6 hover:shadow-lg hover:border-fire-400 transition-all"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-semibold text-wood-900 mb-2">{category.name}</h3>
              <div className="flex items-center text-fire-600 group-hover:text-fire-700">
                <span className="text-sm">Voir plus</span>
                <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
