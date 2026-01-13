'use client'

import { useCustomOrderStore } from '@/lib/store/customOrderStore'
import { useCartStore } from '@/lib/store/cartStore'
import { FINISHES, OPTIONS } from '@/lib/types/customOrder'
import { motion } from 'framer-motion'
import { ShoppingCart, FileText, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'


export default function QuoteDisplay() {
    const {
        woodType,
        dimensions,
        finish,
        options,
        quantity,
        setQuantity,
        calculatePrice,
        isValid,
        reset
    } = useCustomOrderStore()

    const { addItem } = useCartStore()

    const pricing = calculatePrice()
    const finishData = FINISHES.find(f => f.id === finish)

    const handleAddToCart = async () => {
        if (!isValid()) {
            toast.error('Пожалуйста, выберите тип древесины и укажите размеры')
            return
        }

        if (!woodType) return

        // Создать описание для заказа
        const customName = `${woodType.nameRu} на заказ (${dimensions.height}×${dimensions.width}×${dimensions.length} мм)`

        // Создать детали варианта
        const variantDetails = [
            `Отделка: ${finishData?.nameRu || 'Необработанный'}`,
            options.length > 0 ? `Опции: ${options.map(o => OPTIONS.find(opt => opt.id === o)?.nameRu).join(', ')}` : null,
            `Объем: ${pricing.volume.toFixed(4)} м³`
        ].filter(Boolean).join(' • ')

        try {
            await addItem({
                id: `custom-${Date.now()}`, // ID unique pour chaque commande sur mesure
                name: customName,
                price: pricing.total / quantity, // Prix unitaire
                image: woodType.image,
                variantLabel: variantDetails,
                quantity: quantity
            })

            toast.success('Добавлено в корзину!')
            reset() // Сбросить конфигуратор
        } catch (error) {
            toast.error('Ошибка при добавлении в корзину')
            console.error(error)
        }
    }

    if (!woodType) {
        return (
            <div className="sticky top-24 p-6 bg-gradient-to-br from-wood-50 to-fire-50 rounded-2xl border-2 border-dashed border-wood-300">
                <p className="text-center text-wood-600">
                    Выберите тип древесины, чтобы увидеть расчет стоимости
                </p>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-24 space-y-4"
        >
            {/* Карточка расчета */}
            <div className="p-6 bg-white rounded-2xl shadow-xl border border-wood-200">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="text-fire-500" size={24} />
                    <h3 className="text-xl font-bold text-wood-900">Расчет стоимости</h3>
                </div>

                {/* Резюме */}
                <div className="space-y-3 mb-6 pb-6 border-b border-wood-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-wood-600">Древесина:</span>
                        <span className="font-medium text-wood-900">{woodType.nameRu}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-wood-600">Размеры:</span>
                        <span className="font-medium text-wood-900">
                            {dimensions.height}×{dimensions.width}×{dimensions.length} мм
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-wood-600">Объем:</span>
                        <span className="font-medium text-fire-600">{pricing.volume.toFixed(4)} м³</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-wood-600">Отделка:</span>
                        <span className="font-medium text-wood-900">{finishData?.nameRu}</span>
                    </div>

                    {options.length > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-wood-600">Опции:</span>
                            <span className="font-medium text-wood-900">{options.length}</span>
                        </div>
                    )}
                </div>

                {/* Детализация цен */}
                <div className="space-y-2 mb-6 pb-6 border-b border-wood-200">
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-wood-600">Базовая стоимость:</span>
                            <span className="font-medium">{pricing.basePrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="flex justify-between text-xs text-wood-500 pl-4">
                            <span>{woodType.pricePerM3.toLocaleString('ru-RU')} ₽/м³ × {pricing.volume.toFixed(4)} м³</span>
                        </div>
                    </div>

                    {pricing.finishCost > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-wood-600">
                                Отделка ({finishData?.nameRu}):
                            </span>
                            <span className="font-medium text-fire-600">+{pricing.finishCost.toLocaleString('ru-RU')} ₽</span>
                        </div>
                    )}

                    {/* Afficher chaque option individuellement */}
                    {options.length > 0 && (
                        <div className="space-y-1.5 pl-2 border-l-2 border-fire-200">
                            <div className="text-xs font-semibold text-wood-700 mb-1">Дополнительные опции:</div>
                            {options.map((optionId) => {
                                const option = OPTIONS.find(o => o.id === optionId)
                                if (!option) return null
                                const optionCost = option.price * pricing.volume
                                return (
                                    <div key={optionId} className="flex justify-between text-sm">
                                        <span className="text-wood-600 text-xs">• {option.nameRu}</span>
                                        <span className="font-medium text-fire-600 text-xs">
                                            +{optionCost.toLocaleString('ru-RU')} ₽
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div className="flex justify-between text-sm pt-2 border-t border-wood-100">
                        <span className="text-wood-600">Надбавка за индивидуальный заказ (25%):</span>
                        <span className="font-medium text-fire-600">+{pricing.customMarkup.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>

                {/* Quantité */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-wood-900 mb-2">
                        Количество
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setQuantity(quantity - 1)}
                            disabled={quantity <= 1}
                            className="p-2 rounded-lg border border-wood-300 hover:bg-wood-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Minus size={18} />
                        </button>

                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="flex-1 text-center px-4 py-2 border border-wood-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500 outline-none"
                        />

                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-2 rounded-lg border border-wood-300 hover:bg-wood-50 transition"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* Prix total */}
                <div className="p-4 bg-gradient-to-r from-fire-500 to-fire-600 rounded-xl mb-4">
                    <p className="text-sm text-fire-100 mb-1">Итоговая стоимость</p>
                    <p className="text-3xl font-bold text-white">
                        {pricing.total.toLocaleString('ru-RU')} ₽
                    </p>
                    {quantity > 1 && (
                        <p className="text-xs text-fire-100 mt-1">
                            {(pricing.total / quantity).toLocaleString('ru-RU')} ₽ × {quantity} шт
                        </p>
                    )}
                </div>

                {/* Кнопка добавления в корзину */}
                <button
                    onClick={handleAddToCart}
                    disabled={!isValid()}
                    className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingCart size={20} />
                    Добавить в корзину
                </button>
            </div>

            {/* Информационное примечание */}
            <div className="p-4 bg-wood-50 rounded-lg border border-wood-200">
                <p className="text-xs text-wood-600 leading-relaxed">
                    💡 <strong>Примечание:</strong> Все индивидуальные заказы проходят проверку нашими специалистами.
                    Мы свяжемся с вами для уточнения деталей перед началом производства.
                </p>
            </div>
        </motion.div>
    )
}
