'use client'

import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import { useCartStore } from '@/lib/store/cartStore'
import { useState } from 'react'

export default function FavoritesPage() {
  const { items: favorites, removeFavorite } = useFavoritesStore()
  const { addItem } = useCartStore()
  const [addedToCart, setAddedToCart] = useState<number | null>(null)

  const handleAddToCart = async (item: any) => {
    await addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    })
    setAddedToCart(item.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Mes Favoris</h1>
        <p className="text-wood-600 mb-12">Produits que vous avez sauvegardés</p>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                {item.image ? (
                  <div className="h-48 bg-wood-100 overflow-hidden flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="bg-wood-100 h-48 flex items-center justify-center">
                    <span className="text-wood-400 text-sm">Image produit</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-wood-900 mb-2">{item.name}</h3>
                  <p className="text-fire-600 font-bold mb-4">{item.price}₽</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className={`flex-1 py-2 rounded transition text-sm font-semibold flex items-center justify-center gap-2 ${
                        addedToCart === item.id 
                          ? 'bg-green-600 text-white' 
                          : 'bg-fire-600 text-white hover:bg-fire-700'
                      }`}
                    >
                      <ShoppingCart size={16} />
                      {addedToCart === item.id ? 'Ajouté!' : 'Ajouter'}
                    </button>
                    <button 
                      onClick={() => removeFavorite(item.id)}
                      className="p-2 hover:bg-red-100 rounded transition"
                      title="Supprimer des favoris"
                    >
                      <Heart size={18} className="text-red-600 fill-red-600" />
                    </button>
                  </div>
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
