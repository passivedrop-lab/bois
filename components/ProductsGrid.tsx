'use client'

import { useState, useMemo } from 'react'
import { ShoppingCart, Star, Heart, Filter, X } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import { PRODUCTS, Product } from '@/lib/data/products'
import ProductFilters, { FilterState } from './ProductFilters'

interface ProductsGridProps {
  category?: string
}

export default function ProductsGrid({ category }: ProductsGridProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const [activeFilters, setActiveFilters] = useState<FilterState>({ lengths: [], sections: [] })

  const cartStore = useCartStore()
  const favoritesStore = useFavoritesStore()

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault() // prevent navigating if inside a link
    await cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    })
    toast.success('Добавлено в корзину')
  }

  const handleToggleFavorite = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
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

  // 1. Filter by Category
  const categoryProducts = useMemo(() => {
    return category
      ? PRODUCTS.filter(p => p.category === category)
      : PRODUCTS
  }, [category])

  // 2. Filter by Dimensions (Advanced)
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(product => {
      // If no filters active, show all
      if (activeFilters.lengths.length === 0 && activeFilters.sections.length === 0) return true

      // If product has no variants, it doesn't match dimensional filters unless we implement logic for base product dims
      // For now, only filter by variants if they exist
      if (!product.variants || product.variants.length === 0) return false

      const hasMatchingVariant = product.variants.some(variant => {
        const match = variant.label.match(/(\d+)[xх](\d+)[xх](\d+)/)
        if (!match) return false

        const [_, w, h, l] = match
        const section = `${w}x${h}`
        const length = l

        const matchesLength = activeFilters.lengths.length === 0 || activeFilters.lengths.includes(length)
        const matchesSection = activeFilters.sections.length === 0 || activeFilters.sections.includes(section)

        return matchesLength && matchesSection
      })

      return hasMatchingVariant
    })
  }, [categoryProducts, activeFilters])

  // 3. Sort
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
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
  }, [filteredProducts, sortBy])

  return (
    <div>
      {/* Mobile Filter Toggle & Sort Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-wood-100 p-3 mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 text-wood-700 bg-wood-50 hover:bg-wood-100 transition px-4 py-2 rounded-lg font-medium"
        >
          <Filter size={18} />
          Фильтры
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-gray-500 hidden sm:inline">Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-wood-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-fire-500 bg-white"
          >
            <option value="popular">Популярные</option>
            <option value="price-low">Цена: по возрастанию</option>
            <option value="price-high">Цена: по убыванию</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters
            products={categoryProducts}
            onFilterChange={setActiveFilters}
          />
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="relative w-80 bg-white h-full shadow-xl p-4 overflow-y-auto animate-in slide-in-from-left">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Фильтры</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <ProductFilters
                products={categoryProducts}
                onFilterChange={setActiveFilters}
                className="border-0 shadow-none p-0"
              />
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 bg-fire-600 text-white py-3 rounded-lg font-bold"
              >
                Показать ({filteredProducts.length})
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-lg text-gray-500">Нет товаров, соответствующих выбранным фильтрам.</p>
              <button
                onClick={() => setActiveFilters({ lengths: [], sections: [] })}
                className="mt-2 text-fire-600 font-medium hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product, index) => (
                <div key={product.id} className="card group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-wood-100 overflow-hidden">
                  <div className="relative aspect-[4/3] bg-wood-50 overflow-hidden">
                    <Link href={`/products/${product.id}`} className="block w-full h-full">
                      {product.vedette && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
                            ХИТ
                          </span>
                        </div>
                      )}
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 4}
                      />
                      {/* Quick Favorite Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, product)}
                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full text-wood-400 hover:text-red-500 transition shadow-sm z-20"
                      >
                        <Heart
                          size={18}
                          className={favoritesStore.isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}
                        />
                      </button>
                    </Link>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-300" : ""} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    <Link href={`/products/${product.id}`} className="block mb-2">
                      <h3 className="font-bold text-gray-900 leading-tight group-hover:text-fire-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-3 border-t border-wood-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.originalPrice.toLocaleString('ru-RU')} ₽
                          </span>
                        )}
                        <span className={`text-lg font-bold ${product.originalPrice ? 'text-fire-600' : 'text-gray-900'}`}>
                          {product.price.toLocaleString('ru-RU')} ₽
                        </span>
                        {product.unit && <span className="text-xs text-gray-500">/ {product.unit}</span>}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-wood-900 hover:bg-fire-600 text-white p-2.5 rounded-lg transition-colors shadow-sm"
                        title="В корзину"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
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
