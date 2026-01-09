'use client'

import { useState } from 'react'
import { ShoppingCart, Star, Heart, Filter } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  badge?: string
  category?: string
}

const allProducts: Product[] = [
  // Дрова
  { id: '1', name: 'Палета дров дубовых 30 см (5 м3)', price: 22550, rating: 4.8, reviews: 124, badge: 'Хит продаж', category: 'firewood' },
  { id: '2', name: 'Палета дров 25 см (4 м3) в упаковке', price: 21500, rating: 4.9, reviews: 89, category: 'firewood' },
  { id: '3', name: 'Палета дров 30 см (4 м3) в упаковке', price: 19900, rating: 4.7, reviews: 156, category: 'firewood' },
  { id: '4', name: 'Оптовая партия 10 палет дров (готово к использованию)', price: 16000, rating: 4.9, reviews: 203, badge: 'Популярное', category: 'firewood' },
  { id: '5', name: 'Дрова навалом Опт 20 м³', price: 17800, rating: 4.6, reviews: 78, category: 'firewood' },
  { id: '6', name: 'Дрова навалом Опт 50 см (15 м3)', price: 18000, rating: 4.5, reviews: 92, category: 'firewood' },
  { id: '7', name: 'Дрова 50 см в упаковке (Партия 10 палет)', price: 19900, rating: 4.8, reviews: 145, category: 'firewood' },
  { id: '8', name: 'Брикеты из дуба (Партия 50 упаковок)', price: 17750, rating: 4.9, reviews: 167, category: 'firewood' },

  // Пеллеты
  { id: '9', name: 'Пеллеты премиум ENERBIO (Партия 5 палет)', price: 19750, originalPrice: 22500, rating: 4.8, reviews: 145, badge: 'Скидка', category: 'pellets' },
  { id: '10', name: 'Пеллеты премиум Crépito® (Партия 5 палет)', price: 22450, rating: 4.9, reviews: 203, category: 'pellets' },
  { id: '11', name: 'Пеллеты WOODAY (Партия 5 палет)', price: 21750, rating: 4.7, reviews: 178, category: 'pellets' },
  { id: '12', name: 'Пеллеты премиум (Партия 5 палет)', price: 18000, rating: 4.6, reviews: 134, category: 'pellets' },
  { id: '13', name: 'Пеллеты VAN ROJE (Партия 5 палет)', price: 20950, rating: 4.8, reviews: 156, category: 'pellets' },
  { id: '14', name: 'Пеллеты ПИРЕНЕИ (Партия 5 палет)', price: 21500, rating: 4.9, reviews: 189, category: 'pellets' },

  // Печи
  { id: '15', name: 'Печь INTERSTOVES HUGO 9 (Black Edition)', price: 42000, originalPrice: 46130, rating: 4.8, reviews: 67, badge: 'Скидка', category: 'stoves' },
  { id: '16', name: 'Печь панорамная двойная FIREMATIC Ottawa Premium', price: 64050, originalPrice: 108500, rating: 4.9, reviews: 45, badge: 'Скидка', category: 'stoves' },
  { id: '17', name: 'Печь панорамная 3 стороны FIREMATIC Calgary PRO', price: 61600, originalPrice: 111300, rating: 4.9, reviews: 52, badge: 'Скидка', category: 'stoves' },
  { id: '18', name: 'Печь Stovia Italia Danna 6кВт - WiFi Smart', price: 45960, rating: 4.7, reviews: 89, category: 'stoves' },
  { id: '19', name: 'Печь INTERSTOVES GT High-Power | 15 кВт', price: 41960, rating: 4.8, reviews: 76, category: 'stoves' },
  { id: '20', name: 'Каминная топка Ecofire Confort Elite 12 кВт', price: 63600, rating: 4.8, reviews: 93, category: 'stoves' },
  { id: '21', name: 'Печь-камин Nordica Isotta Plus Ultra 8 кВт', price: 49960, rating: 4.9, reviews: 78, badge: 'Хит продаж', category: 'stoves' },

  // Котлы
  { id: '22', name: 'Котел Protherm Бобер 40 DLO 35 кВт Premium', price: 137800, originalPrice: 150000, rating: 4.8, reviews: 45, badge: 'Скидка', category: 'boilers' },
  { id: '23', name: 'Котел ZOTA Optima 20 Industrial 20 кВт', price: 91800, rating: 4.7, reviews: 67, category: 'boilers' },
  { id: '24', name: 'Котел Буржуй-К Т-40 Premium 40 кВт', price: 249800, rating: 4.9, reviews: 34, badge: 'Премиум', category: 'boilers' },
  { id: '25', name: 'Котел НМК Магнум КДГ-20 ТЭ Professional 20 кВт', price: 105800, rating: 4.6, reviews: 89, category: 'boilers' },
  { id: '26', name: 'Котел ZOTA Optima 30 Performance 30 кВт', price: 109800, rating: 4.8, reviews: 56, category: 'boilers' },
  { id: '27', name: 'Котел Protherm Бобер 50 DLO Max 48 кВт', price: 157800, rating: 4.9, reviews: 42, category: 'boilers' },

  // Аксессуары
  { id: '28', name: 'Набор термостатов для котлов (5 шт)', price: 16000, rating: 4.7, reviews: 145, category: 'accessories' },
  { id: '29', name: 'Комплект колосниковых решеток (8 шт, 30x25 см)', price: 15120, rating: 4.6, reviews: 98, category: 'accessories' },
  { id: '30', name: 'Комплект подставок под дрова (4 шт, металл)', price: 18000, rating: 4.8, reviews: 167, badge: 'Популярное', category: 'accessories' },
  { id: '31', name: 'Партия кочерёг для камина (10 шт, 120 см)', price: 15000, rating: 4.5, reviews: 234, category: 'accessories' },
  { id: '32', name: 'Партия щипцов для дров (13 шт, 65 см)', price: 15600, rating: 4.6, reviews: 189, category: 'accessories' },
  { id: '33', name: 'Партия вёдер для золы (20 шт, 12 л)', price: 17800, rating: 4.7, reviews: 278, category: 'accessories' },
  { id: '34', name: 'Комплект защитных экранов (3 шт, 100x70 см)', price: 26700, rating: 4.8, reviews: 112, category: 'accessories' },
  { id: '35', name: 'Набор датчиков температуры для котлов (8 шт)', price: 16800, rating: 4.5, reviews: 156, category: 'accessories' },
  { id: '36', name: 'Система дымохода (5 метров, сталь 115 мм)', price: 16000, rating: 4.7, reviews: 203, category: 'accessories' },
  { id: '37', name: 'Партия наборов инструментов для камина (5 комплектов)', price: 16000, rating: 4.9, reviews: 145, badge: 'Комплект', category: 'accessories' },
];

interface ProductsGridProps {
  category?: string
}

export default function ProductsGrid({ category }: ProductsGridProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const cartStore = useCartStore()
  const favoritesStore = useFavoritesStore()

  const handleAddToCart = async (product: Product) => {
    await cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    })
    toast.success('Добавлено в корзину')
  }

  const handleToggleFavorite = async (product: Product) => {
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

  const filteredProducts = category
    ? allProducts.filter(p => p.category === category)
    : allProducts

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return b.reviews - a.reviews
    }
  })

  return (
    <div>
      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 text-wood-700 hover:text-fire-600 transition px-4 py-2 sm:py-2.5 border border-wood-200 rounded-lg hover:bg-wood-50 sm:border-0 sm:px-0"
        >
          <Filter size={18} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Фильтры</span>
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-wood-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fire-500 bg-white"
        >
          <option value="popular">Популярные</option>
          <option value="price-low">Цена: по возрастанию</option>
          <option value="price-high">Цена: по убыванию</option>
          <option value="rating">По рейтингу</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="card group">
            <div className="relative overflow-hidden bg-wood-100">
              {product.badge && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <span className="bg-fire-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                    {product.badge}
                  </span>
                </div>
              )}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                <button
                  onClick={() => handleToggleFavorite(product)}
                  className="p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full transition"
                  aria-label="Добавить в избранное"
                >
                  <Heart
                    size={16}
                    className={`sm:w-5 sm:h-5 ${favoritesStore.isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-wood-600'}`}
                  />
                </button>
              </div>
              <div className="aspect-square flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-wood-200 to-wood-300 flex items-center justify-center">
                  <span className="text-wood-400 text-3xl sm:text-4xl">🪵</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={`sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating) ? 'text-fire-500 fill-fire-500' : 'text-wood-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-wood-600">({product.reviews} отзывов)</span>
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
        ))}
      </div>
    </div>
  )
}
