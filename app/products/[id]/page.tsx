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

    const [qty, setQty] = useState(1)

    const product = PRODUCTS.find(p => p.id === id)

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-wood-900 mb-4">Produit introuvable</h1>
                <Link href="/catalogue" className="text-fire-600 hover:underline">
                    Retour au catalogue
                </Link>
            </div>
        )
    }

    const handleAddToCart = () => {
        cartStore.addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: qty
        })
        toast.success(`Ajouté au panier (${qty})`)
    }

    const handleToggleFavorite = () => {
        favoritesStore.toggleFavorite({
            id: product.id,
            name: product.name,
            price: product.price,
        })
        toast.success(
            favoritesStore.isFavorite(product.id)
                ? 'Retiré des favoris'
                : 'Ajouté aux favoris'
        )
    }

    const isFavorite = favoritesStore.isFavorite(product.id)
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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
                    Retour
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
                                        <span className="ml-1 text-wood-500">({product.reviews} avis)</span>
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

                        {/* Price */}
                        <div className="bg-wood-50/50 p-6 rounded-xl border border-wood-100 mb-8">
                            <div className="flex items-end gap-4 mb-4">
                                <span className="text-4xl font-bold text-fire-600">
                                    {product.price.toLocaleString('ru-RU')} ₽
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-xl text-wood-400 line-through mb-1">
                                            {product.originalPrice.toLocaleString('ru-RU')} ₽
                                        </span>
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-sm font-bold mb-2">
                                            -{discount}%
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="text-green-700 flex items-center gap-2 font-medium mb-6">
                                <Check size={18} />
                                En stock, prêt à être expédié
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
                                    Ajouter au panier
                                </button>
                            </div>
                        </div>

                        {/* Description & Features */}
                        <div className="prose prose-wood max-w-none">
                            <h3 className="text-xl font-bold text-wood-900 mb-4 border-b border-wood-200 pb-2">
                                Description & Caractéristiques
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
                                    <h4 className="font-bold text-wood-900 text-sm">Livraison Rapide</h4>
                                    <p className="text-xs text-wood-500">Expédition sous 24-48h</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-wood-900 text-sm">Qualité Garantie</h4>
                                    <p className="text-xs text-wood-500">Bois certifié et contrôlé</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
