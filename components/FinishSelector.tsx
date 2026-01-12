'use client'

import { useCustomOrderStore } from '@/lib/store/customOrderStore'
import { FINISHES, OPTIONS } from '@/lib/types/customOrder'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function FinishSelector() {
    const { finish, setFinish, options, toggleOption } = useCustomOrderStore()

    return (
        <div className="space-y-6">
            {/* Finitions */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-wood-900">
                    Отделка <span className="text-fire-500">*</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FINISHES.map((finishOption) => (
                        <motion.button
                            key={finishOption.id}
                            onClick={() => setFinish(finishOption.id)}
                            className={`relative px-4 py-3 rounded-lg border-2 transition-all text-left ${finish === finishOption.id
                                    ? 'border-fire-500 bg-fire-50'
                                    : 'border-wood-200 hover:border-wood-300 bg-white'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-wood-900">
                                        {finishOption.nameRu}
                                    </p>
                                    <p className="text-xs text-wood-600 mt-0.5">
                                        {finishOption.name}
                                    </p>
                                    {finishOption.priceMultiplier > 0 && (
                                        <p className="text-xs text-fire-600 mt-1">
                                            +{(finishOption.priceMultiplier * 100).toFixed(0)}%
                                        </p>
                                    )}
                                </div>

                                {finish === finishOption.id && (
                                    <div className="flex-shrink-0 w-5 h-5 bg-fire-500 rounded-full flex items-center justify-center">
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Options supplémentaires */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-wood-900">
                    Дополнительные опции
                </label>

                <div className="space-y-2">
                    {OPTIONS.map((option) => (
                        <motion.label
                            key={option.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${options.includes(option.id)
                                    ? 'border-fire-500 bg-fire-50'
                                    : 'border-wood-200 hover:border-wood-300 bg-white'
                                }`}
                            whileHover={{ scale: 1.01 }}
                        >
                            <input
                                type="checkbox"
                                checked={options.includes(option.id)}
                                onChange={() => toggleOption(option.id)}
                                className="mt-0.5 w-5 h-5 text-fire-500 border-wood-300 rounded focus:ring-fire-500"
                            />

                            <div className="flex-1">
                                <p className="font-medium text-sm text-wood-900">
                                    {option.nameRu}
                                </p>
                                <p className="text-xs text-wood-600">{option.name}</p>
                            </div>

                            <p className="text-sm font-semibold text-fire-600">
                                +{option.price.toLocaleString('ru-RU')} ₽/м³
                            </p>
                        </motion.label>
                    ))}
                </div>
            </div>
        </div>
    )
}
