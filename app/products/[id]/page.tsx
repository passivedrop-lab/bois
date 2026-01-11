'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, Heart, ShoppingCart, Check, Truck, Shield } from 'lucide-react'
import { PRODUCTS } from '@/lib/data/products'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'

export default function ProductPage() {
    const params = useParams()
    const router = useRouter()
    const { id } = params
    const cartStore = useCartStore()
    const favoritesStore = useFavoritesStore()

    const product = PRODUCTS.find(p => p.id === id)

    const [qty, setQty] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null)

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-wood-900 mb-4">Товар не найден</h1>
                <Link href="/catalogue" className="text-fire-600 hover:underline">
                    Вернуться в каталог
                </Link>
            </div>
        )
    }

    const currentPrice = selectedVariant ? selectedVariant.price : product.price
    const currentOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice

    const handleAddToCart = () => {
        cartStore.addItem({
            id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
            name: product.name,
            price: currentPrice,
            quantity: qty,
            variantLabel: selectedVariant?.label,
            image: product.image
        })
        toast.success(`Добавлено в корзину (${qty})`)
    }

    const handleToggleFavorite = () => {
        favoritesStore.toggleFavorite({
            id: product.id,
            name: product.name,
            price: product.price,
        })
        toast.success(
            favoritesStore.isFavorite(product.id)
                ? 'Удалено из избранного'
                : 'Добавлено в избранное'
        )
    }

    const isFavorite = favoritesStore.isFavorite(product.id)
    const discount = currentOriginalPrice
        ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
        : 0

    return (
        <div className="bg-white min-h-screen py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Breadcrumb / Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-wood-600 hover:text-fire-600 transition mb-8 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Назад
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left: Image Gallery (Single for now) */}
                    <div className="space-y-6">
                        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-wood-50 rounded-2xl overflow-hidden border border-wood-100 shadow-sm">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {product.vedette && (
                                <div className="absolute top-4 left-4">
                                    <span className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1.5">
                                        <Star size={14} fill="currentColor" />
                                        Хит продаж
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Thumbnails could go here */}
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-wood-900 mb-2 leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="bg-wood-100 text-wood-700 px-3 py-1 rounded-full font-medium">
                                        {product.category}
                                    </span>
                                    <div className="flex items-center text-amber-500">
                                        <Star size={16} fill="currentColor" />
                                        <span className="ml-1 font-bold text-wood-900">{product.rating}</span>
                                        <span className="ml-1 text-wood-500">({product.reviews} отзывов)</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleFavorite}
                                className={`p-3 rounded-full transition shadow-sm border ${isFavorite
                                    ? 'bg-red-50 border-red-200 text-red-500'
                                    : 'bg-white border-wood-200 text-wood-400 hover:text-red-500 hover:border-red-200'}`}
                            >
                                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Variants Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-wood-900 uppercase tracking-wider mb-4">
                                    Выберите параметры (Размер / Количество):
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${selectedVariant?.id === v.id
                                                ? 'border-fire-600 bg-fire-50 text-fire-900'
                                                : 'border-wood-100 bg-white hover:border-wood-300'
                                                }`}
                                        >
                                            <span className="font-bold">{v.label}</span>
                                            <span className="text-sm opacity-80">{v.price.toLocaleString('ru-RU')} ₽</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price */}
                        <div className="bg-wood-50/50 p-6 rounded-xl border border-wood-100 mb-8">
                            <div className="flex items-end gap-4 mb-4">
                                <span className="text-4xl font-bold text-fire-600">
                                    {currentPrice.toLocaleString('ru-RU')} ₽
                                </span>
                                {product.unit && (
                                    <span className="text-xl text-wood-500 mb-1">/ {product.unit}</span>
                                )}
                                {currentOriginalPrice && (
                                    <>
                                        <span className="text-xl text-wood-400 line-through mb-1">
                                            {currentOriginalPrice.toLocaleString('ru-RU')} ₽
                                        </span>
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-sm font-bold mb-2">
                                            -{discount}%
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="text-green-700 flex items-center gap-2 font-medium mb-6">
                                <Check size={18} />
                                В наличии, готово к отправке
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center border border-wood-300 rounded-lg bg-white w-fit">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="px-4 py-3 hover:bg-wood-50 text-wood-600 transition"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-semibold text-lg">{qty}</span>
                                    <button
                                        onClick={() => setQty(qty + 1)}
                                        className="px-4 py-3 hover:bg-wood-50 text-wood-600 transition"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-fire-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-fire-700 transition shadow-lg shadow-fire-200 flex items-center justify-center gap-2 text-lg transform active:scale-[0.98]"
                                >
                                    <ShoppingCart size={22} />
                                    В корзину
                                </button>
                            </div>
                        </div>

                        {/* Description & Features */}
                        <div className="prose prose-wood max-w-none">
                            <h3 className="text-xl font-bold text-wood-900 mb-4 border-b border-wood-200 pb-2">
                                Описание и характеристики
                            </h3>
                            <div className="bg-white text-wood-700 leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </div>
                        </div>

                        {/* Features Grid (Icons) */}
                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-wood-200">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-wood-900 text-sm">Быстрая доставка</h4>
                                    <p className="text-xs text-wood-500">Отправка в течение 24-48 часов</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-wood-900 text-sm">Гарантия качества</h4>
                                    <p className="text-xs text-wood-500">Сертифицированная и проверенная древесина</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
