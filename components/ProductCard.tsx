'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Heart, ShoppingCart, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Product } from '@/lib/data/products'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const cartStore = useCartStore()
    const favoritesStore = useFavoritesStore()

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation()
        await cartStore.addItem({
            id: product.id,
            name: product.name,
            price: product.price,
        })
        toast.success('Добавлено в корзину')
    }

    const handleToggleFavorite = async (e: React.MouseEvent) => {
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



    return (
        <div className="card group h-full flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-wood-100">
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[4/3] bg-wood-50">
                <Link href={`/products/${product.id}`} className="block w-full h-full cursor-pointer">
                    {product.vedette && (
                        <div className="absolute top-3 left-3 z-10">
                            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <Star size={12} fill="currentColor" />
                                Хит
                            </span>
                        </div>
                    )}
                    <div className="w-full h-full flex items-center justify-center relative">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition duration-500"
                        />
                        {/* Overlay Gradient on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                    </div>
                </Link>

                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition shadow-sm text-wood-600 hover:text-red-500 group-actions"
                    aria-label="Добавить в избранное"
                >
                    <Heart
                        size={18}
                        className={favoritesStore.isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Reviews */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={`${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-wood-500 font-medium">({product.reviews})</span>
                </div>

                {/* Title */}
                <Link href={`/products/${product.id}`} className="block group-hover:text-fire-600 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug line-clamp-2 min-h-[3.5rem]" title={product.name}>
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-end justify-between mb-4">
                    <div className="flex flex-col">
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through mb-0.5">
                                {product.originalPrice.toLocaleString('ru-RU')} ₽
                            </span>
                        )}
                        <div className="flex items-baseline gap-1">
                            {product.variants && product.variants.length > 0 && (
                                <span className="text-xs text-wood-500 font-medium mr-1 italic">от</span>
                            )}
                            <span className="text-2xl font-bold text-fire-600">
                                {product.price.toLocaleString('ru-RU')} ₽
                            </span>
                            {product.unit && (
                                <span className="text-xs text-wood-500">/ {product.unit}</span>
                            )}
                        </div>
                    </div>
                    {product.originalPrice && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md mb-1">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                    )}
                </div>

                {/* Description Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1.5 text-sm font-medium text-wood-600 hover:text-wood-800 transition-colors mb-4 w-fit select-none"
                >
                    {isExpanded ? (
                        <>
                            Скрыть характеристики
                            <ChevronUp size={16} />
                        </>
                    ) : (
                        <>
                            <Info size={16} />
                            Характеристики
                            <ChevronDown size={16} />
                        </>
                    )}
                </button>

                {/* Collapsible Description */}
                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.div
                            key="description"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden mb-4"
                        >
                            <div className="bg-wood-50 rounded-lg p-3 text-sm text-wood-700 whitespace-pre-wrap leading-relaxed border border-wood-100">
                                {product.description}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Button */}
                <div className="mt-auto">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-fire-600 hover:bg-fire-700 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <ShoppingCart size={18} />
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    )
}
