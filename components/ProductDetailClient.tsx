'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, Heart, ShoppingCart, Check, Truck, Shield } from 'lucide-react'
import { Product } from '@/lib/data/products'
import { useCartStore } from '@/lib/store/cartStore'
import { useFavoritesStore } from '@/lib/store/favoritesStore'
import toast from 'react-hot-toast'

interface ProductDetailClientProps {
    product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const router = useRouter()
    const cartStore = useCartStore()
    const favoritesStore = useFavoritesStore()

    // State for multi-variant quantities
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({})

    // Calculator States
    const [showCalculator, setShowCalculator] = useState(false)
    const [calculatorSurface, setCalculatorSurface] = useState('')
    const [suggestions, setSuggestions] = useState<{ [key: string]: number }>({})

    // Helper to update quantity for a specific variant
    const updateQuantity = (variantId: string, value: number) => {
        setQuantities(prev => {
            if (value <= 0) {
                const { [variantId]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [variantId]: value }
        })
    }

    const parseDimensions = (label: string) => {
        // Matches HxWxL (e.g., 50x150x6000)
        const match = label.match(/(\d+)[xх](\d+)[xх](\d+)/)
        if (match) {
            return {
                thickness: parseInt(match[1]),
                width: parseInt(match[2]),
                length: parseInt(match[3])
            }
        }
        return null
    }

    const applyCalculator = () => {
        const surface = parseFloat(calculatorSurface.replace(',', '.'))
        if (!surface || isNaN(surface) || !product.variants) return

        const newSuggestions: { [key: string]: number } = {}

        product.variants.forEach(variant => {
            const dims = parseDimensions(variant.label)
            if (dims) {
                // Calculation for area coverage (use Width x Length)
                // Width is usually the middle dimension or second dimension in the label (e.g., 50x150x6000)
                // However, in the catalog, some dimensions like 100x100x3000 are used.
                // We'll use the second and third dimensions for area calculation if it's "plank-like"
                // or the first and third depending on the context. 
                // Let's stick to the assumption that coverage is Width (dims.width) * Length (dims.length)
                const pieceArea = (dims.width * dims.length) / 1000000
                if (pieceArea > 0) {
                    const count = Math.ceil(surface / pieceArea)
                    newSuggestions[variant.id] = count
                }
            }
        })

        setSuggestions(newSuggestions)
        setShowCalculator(false)
        toast.success(`Расчет для ${surface} м² выполнен. Рекомендации добавлены.`)
    }

    const getVariantDetails = (variantLabel: string, qty: number) => {
        const dims = parseDimensions(variantLabel)
        if (!dims) return { volume: 0, area: 0 }

        const volume = (dims.thickness * dims.width * dims.length * qty) / 1000000000
        const area = (dims.width * dims.length * qty) / 1000000
        return { volume, area }
    }

    // Calculate total price of selected items
    const totalPrice = (product.variants && product.variants.length > 0)
        ? product.variants.reduce((sum, variant) => {
            const qty = quantities[variant.id] || 0
            if (qty <= 0) return sum

            if (product.unit === 'м³') {
                const { volume } = getVariantDetails(variant.label, qty)
                return sum + (variant.price * volume)
            }

            return sum + (variant.price * qty)
        }, 0)
        : (product.price * (quantities['default'] || 1))

    // Count total items selected
    const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0)

    // Calculate total volume/area for display
    const totals = product.variants?.reduce((acc, variant) => {
        const qty = quantities[variant.id] || 0
        if (qty <= 0) return acc
        const { volume, area } = getVariantDetails(variant.label, qty)
        return {
            volume: acc.volume + volume,
            area: acc.area + area
        }
    }, { volume: 0, area: 0 }) || { volume: 0, area: 0 }

    const handleAddToCart = () => {
        if (product.variants && product.variants.length > 0) {
            let added = false
            Object.entries(quantities).forEach(([variantId, qty]) => {
                const variant = product.variants!.find(v => v.id === variantId)
                if (variant && qty > 0) {
                    let finalPrice = variant.price
                    let displayName = `${product.name} (${variant.label})`

                    if (product.unit === 'м³') {
                        const { volume } = getVariantDetails(variant.label, 1) // Volume of 1 piece
                        finalPrice = variant.price * volume
                        displayName = `${product.name} (${variant.label}) — ${volume.toFixed(3)} м³/шт`
                    }

                    cartStore.addItem({
                        id: `${product.id}-${variant.id}`,
                        name: displayName,
                        price: finalPrice,
                        quantity: qty,
                        variantLabel: variant.label,
                        image: product.image
                    })
                    added = true
                }
            })
            if (added) {
                toast.success('Товары добавлены в корзину')
                setQuantities({}) // Reset after adding
                setSuggestions({})
            } else {
                toast.error('Выберите количество хотя бы для одного варианта')
            }
        } else {
            // No variants logic
            cartStore.addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantities['default'] || 1,
                image: product.image
            })
            toast.success('Добавлено в корзину')
        }
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
                    {/* Left: Image Gallery */}
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

                        {/* Variants Selection & Calculator */}
                        {product.variants && product.variants.length > 0 ? (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4 bg-wood-50 p-3 rounded-lg border border-wood-100">
                                    <h3 className="text-sm font-bold text-wood-900 uppercase tracking-wider flex items-center gap-2">
                                        <Shield size={16} className="text-fire-600" />
                                        Выберите размеры
                                    </h3>
                                    <button
                                        onClick={() => setShowCalculator(!showCalculator)}
                                        className="text-sm bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md flex items-center gap-2 font-medium transition shadow-sm"
                                    >
                                        <Truck size={16} />
                                        Калькулятор (м²)
                                    </button>
                                </div>

                                {/* Calculator Input */}
                                {showCalculator && (
                                    <div className="mb-6 bg-blue-50 p-5 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 shadow-sm">
                                        <label className="block text-sm font-bold text-blue-900 mb-2">
                                            Введите площадь (м²):
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={calculatorSurface}
                                                onChange={(e) => setCalculatorSurface(e.target.value)}
                                                placeholder="Например: 50"
                                                className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                            />
                                            <button
                                                onClick={applyCalculator}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold transition shadow-md"
                                            >
                                                Рассчитать
                                            </button>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                                            <Check size={12} />
                                            Мы подскажем нужное количество для каждого варианта
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {product.variants.map((v) => {
                                        const suggestion = suggestions[v.id]
                                        const currentQty = quantities[v.id] || 0
                                        const isSelected = currentQty > 0

                                        return (
                                            <div
                                                key={v.id}
                                                className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-fire-600 bg-fire-50/30' : 'border-wood-100 bg-white hover:border-wood-200'
                                                    }`}
                                            >
                                                <div className="mb-3 sm:mb-0">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-bold text-lg text-wood-900">{v.label}</span>
                                                        <span className="text-fire-600 font-bold">{v.price.toLocaleString('ru-RU')} ₽</span>
                                                    </div>
                                                    {v.originalPrice && (
                                                        <span className="text-xs text-wood-400 line-through">
                                                            {v.originalPrice.toLocaleString('ru-RU')} ₽
                                                        </span>
                                                    )}

                                                    {/* Suggestion Badge & Action */}
                                                    {suggestion && suggestion > 0 && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                                                                Нужно: {suggestion} шт
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(v.id, suggestion)}
                                                                className="text-xs text-blue-600 hover:text-blue-800 font-bold underline decoration-dotted"
                                                            >
                                                                Выбрать
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center bg-white border border-wood-200 rounded-lg shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(v.id, currentQty - 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-wood-500 hover:bg-wood-50 hover:text-wood-900 transition"
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={currentQty > 0 ? currentQty : ''}
                                                            placeholder="0"
                                                            onChange={(e) => updateQuantity(v.id, parseInt(e.target.value) || 0)}
                                                            className="w-12 text-center font-bold text-wood-900 focus:outline-none placeholder-wood-300"
                                                        />
                                                        <button
                                                            onClick={() => updateQuantity(v.id, currentQty + 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-wood-500 hover:bg-wood-50 hover:text-wood-900 transition"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            // Fallback for Products without Variants
                            <div className="mb-8 p-6 bg-wood-50 rounded-xl border border-wood-100">
                                <div className="flex flex-col mb-4">
                                    <span className="text-4xl font-bold text-fire-600">
                                        {(product.price * (quantities['default'] || 1)).toLocaleString('ru-RU')} ₽
                                    </span>
                                    {(quantities['default'] || 1) > 1 && (
                                        <span className="text-sm text-wood-500">
                                            ({product.price.toLocaleString('ru-RU')} ₽ / {product.unit || 'шт.'})
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-white border border-wood-300 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity('default', (quantities['default'] || 1) - 1)}
                                            className="px-4 py-2 hover:bg-wood-50"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-bold">
                                            {quantities['default'] || 1}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity('default', (quantities['default'] || 1) + 1)}
                                            className="px-4 py-2 hover:bg-wood-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Total Sticky Bar */}
                        <div className="bg-wood-900 text-white p-6 rounded-xl shadow-lg sticky bottom-4 sm:bottom-8 z-20 border border-wood-700">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <p className="text-wood-300 text-sm mb-1">Итого к оплате:</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold">
                                            {totalPrice.toLocaleString('ru-RU')} ₽
                                        </span>
                                        <div className="flex flex-col text-wood-400 text-xs">
                                            <span>({totalItems} шт.)</span>
                                            {totals.volume > 0 && <span>{totals.volume.toFixed(3)} м³</span>}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={totalItems === 0}
                                    className={`w-full sm:w-auto px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${totalItems > 0
                                        ? 'bg-fire-600 hover:bg-fire-500 text-white shadow-fire-900/50 shadow-lg cursor-pointer transform hover:-translate-y-0.5'
                                        : 'bg-wood-700 text-wood-500 cursor-not-allowed'
                                        }`}
                                >
                                    <ShoppingCart size={20} />
                                    {totalItems > 0 ? 'В корзину' : 'Выберите товар'}
                                </button>
                            </div>
                        </div>

                        {/* Description & Features */}
                        <div className="mt-12 prose prose-wood max-w-none">
                            <h3 className="text-xl font-bold text-wood-900 mb-4 border-b border-wood-200 pb-2">
                                Описание и характеристики
                            </h3>
                            <div className="bg-white text-wood-700 leading-relaxed whitespace-pre-wrap font-sans text-base">
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
                                    <p className="text-xs text-wood-500">Отправка в течение 5-10 дней</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-wood-900 text-sm">Гарантия качества</h4>
                                    <p className="text-xs text-wood-500">Сертифицированная древесина</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
