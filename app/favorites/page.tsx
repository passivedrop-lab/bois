'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const favorites = []

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Mes Favoris</h1>
        <p className="text-wood-600 mb-12">Produits que vous avez sauvegardés</p>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                <div className="bg-wood-100 h-48 flex items-center justify-center">
                  <span className="text-wood-400 text-sm">Image produit</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-wood-900 mb-2">Produit</h3>
                  <p className="text-fire-600 font-bold mb-4">1,000₽</p>
                  <button className="w-full bg-fire-600 text-white py-2 rounded hover:bg-fire-700 transition text-sm font-semibold">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Heart className="mx-auto text-wood-300 mb-4" size={48} />
            <p className="text-wood-600 mb-6">Vous n'avez pas encore de favoris</p>
            <Link href="/catalogue" className="inline-block bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition">
              Découvrir le catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
