'use client'

import { useCustomOrderStore } from '@/lib/store/customOrderStore'
import { WOOD_TYPES } from '@/lib/types/customOrder'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Image from 'next/image'

export default function WoodTypeSelector() {
    const { woodType, setWoodType } = useCustomOrderStore()

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-wood-900">
                Тип древесины <span className="text-fire-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WOOD_TYPES.map((wood) => (
                    <motion.button
                        key={wood.id}
                        onClick={() => setWoodType(wood)}
                        className={`relative p-4 rounded-xl border-2 transition-all text-left ${woodType?.id === wood.id
                            ? 'border-fire-500 bg-fire-50'
                            : 'border-wood-200 hover:border-wood-300 bg-white'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {/* Превью изображения */}
                        <div className="flex items-start gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={wood.image}
                                    alt={wood.nameRu}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-wood-900">{wood.nameRu}</h3>
                                    </div>

                                    {woodType?.id === wood.id && (
                                        <div className="flex-shrink-0 w-5 h-5 bg-fire-500 rounded-full flex items-center justify-center">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm font-bold text-fire-600 mt-2">
                                    {wood.pricePerM3.toLocaleString('ru-RU')} ₽/м³
                                </p>

                                {/* Свойства */}
                                <div className="flex gap-2 mt-2 text-xs text-wood-600">
                                    <span title="Долговечность">💪 {wood.properties.durability}/5</span>
                                    <span title="Влагостойкость">💧 {wood.properties.moisture_resistance}/5</span>
                                </div>
                            </div>
                        </div>

                        {/* Описание при выборе */}
                        {woodType?.id === wood.id && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-xs text-wood-600 mt-3 pt-3 border-t border-wood-200"
                            >
                                {wood.description}
                            </motion.p>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
