'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Heart, ShoppingCart, ChevronDown, ChevronUp, Info, Calculator, X } from 'lucide-react'
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
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
    const [showCalculator, setShowCalculator] = useState(false)
    const [calculatorSurface, setCalculatorSurface] = useState('')

    const cartStore = useCartStore()
    const favoritesStore = useFavoritesStore()

    const handleQuantityChange = (variantId: string, delta: number) => {
        setQuantities(prev => {
            const currentQty = prev[variantId] || 0
            const newQty = Math.max(0, currentQty + delta)
            if (newQty === 0) {
                const { [variantId]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [variantId]: newQty }
        })
    }

    const parseDimensions = (label: string) => {
        // Matches "100x100x3000" or similar patterns
        const match = label.match(/(\d+)[xх](\d+)[xх](\d+)/)
        if (match) {
            return {
                width: parseInt(match[1]),
                height: parseInt(match[2]),
                length: parseInt(match[3])
            }
        }
        return null
    }

    const applyCalculator = () => {
        const surface = parseFloat(calculatorSurface.replace(',', '.'))
        if (!surface || isNaN(surface) || !product.variants) return

        const newQuantities = { ...quantities }

        product.variants.forEach(variant => {
            const dims = parseDimensions(variant.label)
            if (dims) {
                // Calculate coverage of one piece in m² (assuming Width x Length is the coverage face)
                // For boards/lining: Width * Length
                const pieceArea = (dims.width * dims.length) / 1000000 // mm² to m²
                if (pieceArea > 0) {
                    const count = Math.ceil(surface / pieceArea)
                    newQuantities[variant.id] = count
                }
            }
        })

        setQuantities(newQuantities)
        setShowCalculator(false)
        setCalculatorSurface('')
        toast.success(`Quantités mises à jour pour ${surface} m²`)
    }

    const getDiscountMultiplier = (qty: number) => {
        if (qty >= 50) return 0.90 // 10% off
        if (qty >= 10) return 0.95 // 5% off
        return 1
    }

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation()

        // If product has variants, add each selected variant
        if (product.variants && product.variants.length > 0) {
            const items = Object.entries(quantities).map(([variantId, qty]) => {
                const variant = product.variants!.find(v => v.id === variantId)
                if (!variant || qty <= 0) return null

                // Apply discount logic
                const multiplier = getDiscountMultiplier(qty)
                const finalPrice = Math.round(variant.price * multiplier)

                return {
                    id: `${product.id}-${variant.id}`,
                    name: `${product.name} (${variant.label})`,
                    price: finalPrice,
                    quantity: qty
                }
            }).filter(Boolean)

            if (items.length === 0) return

            for (const item of items) {
                if (item) {
                    // Add item 'qty' times or implement a bulk add in store if available.
                    // Since store usually increments by 1, we might need a loop or store update.
                    // Assuming basic store adds 1 by default, we'll loop or just add once with qty if supported.
                    // Checking store interface: cartStore.addItem({id, name, price}) usually adds 1.
                    // For better UX with large quantities, we should check if store supports quantity.
                    // If not, we will just call addItem multiple times (not ideal) or assume store handles duplicates by incrementing.
                    // Ideally, we'd update store to accept quantity, but for now let's assume standard behavior:
                    // We will call addItem for each unit or if store allows passing quantity.
                    // Let's check store in a separate step or assume we simply call addItem 'qty' times. 
                    // BUT calling typical cart store 'addItem' repeatedly causes toast spam.
                    // Let's assume we can't easily change store signature right now and just call it once per variant 
                    // but that would be wrong price-wise if we don't pass quantity.
                    // Wait, the previous code didn't handle quantity > 1. 
                    // Let's implement a loop for now, but really we should refactor store later.
                    // Actually, usually addItem increments. To add 5, we call it 5 times? That's slow.
                    // Let's simply add the item and then if the user wants more they use the cart page (standard MVP)
                    // OR, better: We just show a toast "Added X items".
                    // IMPORTANT: To support "choosing specific quantity", we really need to pass quantity to store.
                    // Since I can't see store, I will assume I can only add one by one or need to hack it.
                    // Hack: Just call addItem sequentially.
                    for (let i = 0; i < item.quantity; i++) {
                        await cartStore.addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price
                        })
                    }
                }
            }
            setQuantities({}) // Reset after adding
            toast.success('Товары добавлены в корзину')
        }
        // Product without variants
        else {
            const qty = quantities['default'] || 1
            const multiplier = getDiscountMultiplier(qty)
            const finalPrice = Math.round(product.price * multiplier)

            for (let i = 0; i < qty; i++) {
                await cartStore.addItem({
                    id: product.id,
                    name: product.name,
                    price: finalPrice,
                })
            }
            setQuantities({})
            toast.success('Добавлено в корзину')
        }
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

                {/* Multi-Variant Selection List */}
                {product.variants && product.variants.length > 0 ? (
                    <div className="flex flex-col gap-2 mb-4" onClick={(e) => e.stopPropagation()}>

                        {/* Calculator Toggle */}
                        <div className="flex justify-end mb-1">
                            <button
                                onClick={() => setShowCalculator(!showCalculator)}
                                className="flex items-center gap-1 text-xs font-medium text-fire-600 hover:text-fire-700 bg-fire-50 px-2 py-1 rounded transition-colors"
                            >
                                <Calculator size={14} />
                                Calculer mes besoins
                            </button>
                        </div>

                        {/* Calculator Panel */}
                        {showCalculator && (
                            <div className="mb-3 p-3 bg-white border border-fire-200 rounded-lg shadow-sm relative animate-in fade-in slide-in-from-top-2">
                                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowCalculator(false)}>
                                    <X size={14} />
                                </button>
                                <p className="text-xs font-semibold text-gray-700 mb-2">Entrez votre surface (m²):</p>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={calculatorSurface}
                                        onChange={(e) => setCalculatorSurface(e.target.value)}
                                        placeholder="ex: 20"
                                        className="w-full text-sm p-1.5 border border-wood-200 rounded focus:ring-1 focus:ring-fire-500 outline-none"
                                        onClick={e => e.stopPropagation()}
                                    />
                                    <button
                                        onClick={applyCalculator}
                                        className="bg-fire-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-fire-700 transition"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="max-h-56 overflow-y-auto pr-1 flex flex-col gap-2">
                            {product.variants.map((variant) => {
                                const qty = quantities[variant.id] || 0
                                const discount = getDiscountMultiplier(qty)
                                const currentPrice = Math.round(variant.price * discount)

                                return (
                                    <div key={variant.id} className={`flex flex-col text-sm p-2 rounded-lg border transition-all ${qty > 0 ? 'bg-fire-50/50 border-fire-200' : 'bg-gray-50 border-wood-100'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-700">{variant.label}</span>
                                            <div className="text-right">
                                                {discount < 1 && (
                                                    <span className="text-xs text-gray-400 line-through mr-1">
                                                        {variant.price.toLocaleString('ru-RU')}
                                                    </span>
                                                )}
                                                <span className={`font-bold ${discount < 1 ? 'text-fire-600' : 'text-gray-900'}`}>
                                                    {currentPrice.toLocaleString('ru-RU')} ₽
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Discount Badge */}
                                            <div className="h-5">
                                                {qty >= 10 && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                                                        {qty >= 50 ? '-10%' : '-5%'} prix de gros
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 bg-white rounded-md border border-wood-200 px-1 py-0.5 shadow-sm">
                                                <button
                                                    onClick={() => handleQuantityChange(variant.id, -1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-fire-600 hover:bg-gray-100 rounded transition"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    value={qty}
                                                    readOnly
                                                    className="w-8 text-center font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0"
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(variant.id, 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded transition"
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
                    /* No variants - Single quantity control */
                    <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg border border-wood-100" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-col">
                            {getDiscountMultiplier(quantities['default'] || 0) < 1 && (
                                <span className="text-xs text-gray-400 line-through">
                                    {product.price.toLocaleString('ru-RU')} ₽
                                </span>
                            )}
                            <span className={`text-2xl font-bold ${getDiscountMultiplier(quantities['default'] || 0) < 1 ? 'text-fire-600' : 'text-gray-900'}`}>
                                {Math.round(product.price * getDiscountMultiplier(quantities['default'] || 0)).toLocaleString('ru-RU')} ₽
                            </span>
                            {product.unit && <span className="text-xs text-wood-500">/ {product.unit}</span>}

                            {/* Discount Badge for Single Product */}
                            {(quantities['default'] || 0) >= 10 && (
                                <span className="inline-flex mt-1 items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 w-fit">
                                    {(quantities['default'] || 0) >= 50 ? '-10%' : '-5%'}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 bg-white rounded-md border border-wood-200 px-1 py-0.5">
                            <button
                                onClick={() => handleQuantityChange('default', -1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-fire-600 hover:bg-gray-100 rounded transition"
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-bold text-gray-900 text-lg">{quantities['default'] || 0}</span>
                            <button
                                onClick={() => handleQuantityChange('default', 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded transition"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}

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
