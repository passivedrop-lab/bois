'use client'

import Image from 'next/image'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import toast from 'react-hot-toast'
import { PRODUCTS } from '@/lib/data/products'

interface ProductListProps {
    categoryName: string
}

export default function ProductList({ categoryName }: ProductListProps) {
    const products = PRODUCTS.filter(p => p.category === categoryName)
    const cartStore = useCartStore()
    const favoritesStore = useFavoritesStore()

    const handleAddToCart = async (product: any) => {
        await cartStore.addItem({
            id: product.id,
            name: product.name,
            price: product.price,
        })
        toast.success('Добавлено в корзину')
    }

    const handleToggleFavorite = async (product: any) => {
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


    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-lg text-wood-600">В этом разделе пока нет товаров.</p>
                <p className="text-sm text-wood-500 mt-2">Загляните позже!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="opacity-100"
                >
                    <div className="card group h-full flex flex-col">
                        {/* Image */}
                        <div className="relative overflow-hidden bg-wood-100 aspect-square">
                            {product.vedette && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Star size={14} fill="white" />
                                        Хит
                                    </span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => handleToggleFavorite(product)}
                                    className="p-2 bg-white/90 hover:bg-white rounded-full transition shadow-sm"
                                >
                                    <Heart
                                        size={20}
                                        className={favoritesStore.isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-wood-600'}
                                    />
                                </button>
                            </div>
                            <div className="w-full h-full flex items-center justify-center">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={600}
                                    height={600}
                                    className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={` ${i < Math.floor(product.rating) ? 'text-fire-500 fill-fire-500' : 'text-wood-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-wood-600">({product.reviews})</span>
                            </div>

                            <h3 className="text-lg font-semibold text-wood-900 mb-2 line-clamp-2">
                                {product.name}
                            </h3>

                            <div className="mt-auto pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        {product.originalPrice ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-wood-400 line-through text-sm">
                                                    {product.originalPrice.toLocaleString('ru-RU')} ₽
                                                </span>
                                                <span className="text-xl font-bold text-fire-600">
                                                    {product.price.toLocaleString('ru-RU')} ₽
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xl font-bold text-wood-900">
                                                {product.price.toLocaleString('ru-RU')} ₽
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full btn-primary flex items-center justify-center gap-2 py-2"
                                >
                                    <ShoppingCart size={18} />
                                    В корзину
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
