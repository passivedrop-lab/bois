'use client'

import { useEffect } from 'react'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/components/AuthProvider'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function FavoritesPage() {
  const favoritesStore = useFavoritesStore()
  const cartStore = useCartStore()
  const { user } = useAuth()
  const favorites = favoritesStore.items
  const syncWithSupabase = favoritesStore.syncWithSupabase
  const loadFromSupabase = favoritesStore.loadFromSupabase

  // Sync favorites with Supabase when user logs in
  useEffect(() => {
    if (user?.id) {
      // First load from Supabase
      loadFromSupabase(user.id).then(() => {
        // Then sync (merge if needed)
        syncWithSupabase(user.id)
      })
    }
  }, [user?.id, syncWithSupabase, loadFromSupabase])

  const handleRemoveFavorite = async (id: number) => {
    await favoritesStore.removeFavorite(id)
    toast.success('Удалено из избранного')
  }

  const handleAddToCart = async (item: typeof favorites[0]) => {
    await cartStore.addItem(item)
    toast.success('Добавлено в корзину')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-wood-900 mb-8">
            Избранное
          </h1>

          {favorites.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <Heart size={64} className="text-wood-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-wood-900 mb-2">
                Ваш список избранного пуст
              </h2>
              <p className="text-wood-600 mb-6">
                Добавьте товары в избранное, чтобы вернуться к ним позже
              </p>
              <Link href="/products" className="btn-primary inline-block">
                Перейти к каталогу
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => (
                <div key={item.id} className="card-premium group">
                  <div className="relative overflow-hidden bg-wood-100">
                    <div className="aspect-square flex items-center justify-center">
                      <span className="text-wood-400 text-4xl">🪵</span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleRemoveFavorite(item.id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full transition"
                      >
                        <Trash2 size={20} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-wood-900 mb-3 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-fire-600">
                        {item.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      В корзину
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
