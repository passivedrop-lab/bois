"use client"

import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import toast from 'react-hot-toast'

const products = [
  {
    id: 1,
    name: 'Дрова дубовые 30 см - 3,1 стера',
    price: 4510,
    originalPrice: null,
    image: '/images-product/dub-30-3.1.jpg',
    rating: 4.8,
    reviews: 124,
    badge: 'Хит продаж',
  },
  {
    id: 2,
    name: 'Дрова 25 см - 2,60 стера в упаковке',
    price: 4300,
    originalPrice: null,
    image: '/images-product/drova-25-2.6.jpg',
    rating: 4.9,
    reviews: 89,
    badge: null,
  },
  {
    id: 3,
    name: 'Дрова 30 см - 2,24 стера в упаковке',
    price: 3980,
    originalPrice: null,
    image: '/images-product/drova-30-2.24.jpg',
    rating: 4.7,
    reviews: 156,
    badge: null,
  },
  {
    id: 4,
    name: 'Палета 1 стер дров - готово к использованию',
    price: 1600,
    originalPrice: null,
    image: '/images-product/paleta-1-ster.jpg',
    rating: 4.9,
    reviews: 203,
    badge: 'Популярное',
  },
  {
    id: 5,
    name: 'Дрова навалом 1м³',
    price: 890,
    originalPrice: null,
    image: '/images-product/drova-navalom-1m3.jpg',
    rating: 4.6,
    reviews: 78,
    badge: null,
  },
  {
    id: 6,
    name: 'Пеллеты премиум ENERBIO - 66 мешков 990кг',
    price: 3950,
    originalPrice: 4500,
    image: '/images-product/pellets-enerbio-990kg.jpg',
    rating: 4.8,
    reviews: 145,
    badge: 'Скидка',
  },
]

export default function FeaturedProducts() {
  const cartStore = useCartStore()
  const favoritesStore = useFavoritesStore()

  const handleAddToCart = async (product: typeof products[0]) => {
    await cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    })
    toast.success('Добавлено в корзину')
  }

  const handleToggleFavorite = async (product: typeof products[0]) => {
    const wasFavorite = favoritesStore.isFavorite(product.id)
    await favoritesStore.toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
    })
    toast.success(
      !wasFavorite ? 'Добавлено в избранное' : 'Удалено из избранного'
    )
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-wood-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Популярные товары</h2>
          <p className="section-subtitle text-base sm:text-lg md:text-xl px-4">
            Выберите лучшее для вашего дома из нашего каталога
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="card group">
                {/* Image */}
                <div className="relative overflow-hidden bg-wood-100">
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-fire-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {product.badge}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => handleToggleFavorite(product)}
                      className="p-2 bg-white/90 hover:bg-white rounded-full transition"
                    >
                      <Heart
                        size={20}
                        className={favoritesStore.isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-wood-600'}
                      />
                    </button>
                  </div>
                  <div className="aspect-square flex items-center justify-center bg-wood-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={600}
                      height={600}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover w-full h-full"
                      priority={index === 0}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition"></div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={`sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating) ? 'text-fire-500 fill-fire-500' : 'text-wood-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-wood-600">({product.reviews})</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-wood-900 mb-2 sm:mb-3 line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div>
                      {product.originalPrice ? (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="text-wood-400 line-through text-xs sm:text-sm">
                            {product.originalPrice.toLocaleString('ru-RU')} ₽
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-fire-600">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl sm:text-2xl font-bold text-wood-900">
                          {product.price.toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
                  >
                    <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                    В корзину
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center px-4">
          <Link href="/products" className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-block">
            Смотреть все товары
          </Link>
        </div>
      </div>
    </section>
  )
}

