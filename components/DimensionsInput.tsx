'use client'

import { useCustomOrderStore } from '@/lib/store/customOrderStore'
import { motion } from 'framer-motion'
import { Ruler } from 'lucide-react'

export default function DimensionsInput() {
    const { dimensions, setDimensions, calculateVolume } = useCustomOrderStore()

    const handleChange = (field: 'height' | 'width' | 'length', value: string) => {
        const numValue = parseInt(value) || 0
        setDimensions({ [field]: numValue })
    }

    const volume = calculateVolume()

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-wood-900">
                Размеры (мм) <span className="text-fire-500">*</span>
            </label>

            <div className="grid grid-cols-3 gap-3">
                {/* Hauteur */}
                <div>
                    <label className="block text-xs text-wood-600 mb-1">Высота</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="10"
                            max="500"
                            value={dimensions.height}
                            onChange={(e) => handleChange('height', e.target.value)}
                            className="w-full px-3 py-2 border border-wood-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500 outline-none"
                            placeholder="100"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-wood-400">
                            мм
                        </span>
                    </div>
                </div>

                {/* Largeur */}
                <div>
                    <label className="block text-xs text-wood-600 mb-1">Ширина</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="10"
                            max="500"
                            value={dimensions.width}
                            onChange={(e) => handleChange('width', e.target.value)}
                            className="w-full px-3 py-2 border border-wood-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500 outline-none"
                            placeholder="100"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-wood-400">
                            мм
                        </span>
                    </div>
                </div>

                {/* Longueur */}
                <div>
                    <label className="block text-xs text-wood-600 mb-1">Длина</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="100"
                            max="6000"
                            value={dimensions.length}
                            onChange={(e) => handleChange('length', e.target.value)}
                            className="w-full px-3 py-2 border border-wood-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500 outline-none"
                            placeholder="3000"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-wood-400">
                            мм
                        </span>
                    </div>
                </div>
            </div>

            {/* Presets rapides */}
            <div className="flex flex-wrap gap-2">
                <span className="text-xs text-wood-600">Стандартные размеры:</span>
                <button
                    onClick={() => setDimensions({ height: 100, width: 100, length: 3000 })}
                    className="text-xs px-2 py-1 bg-wood-100 hover:bg-wood-200 rounded transition"
                >
                    100×100×3000
                </button>
                <button
                    onClick={() => setDimensions({ height: 150, width: 150, length: 6000 })}
                    className="text-xs px-2 py-1 bg-wood-100 hover:bg-wood-200 rounded transition"
                >
                    150×150×6000
                </button>
                <button
                    onClick={() => setDimensions({ height: 50, width: 200, length: 6000 })}
                    className="text-xs px-2 py-1 bg-wood-100 hover:bg-wood-200 rounded transition"
                >
                    50×200×6000
                </button>
            </div>

            {/* Visualisation du volume */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-3 bg-gradient-to-r from-fire-50 to-wood-50 rounded-lg border border-fire-200"
            >
                <Ruler className="text-fire-500" size={20} />
                <div>
                    <p className="text-sm font-medium text-wood-900">
                        Объем: <span className="text-fire-600">{volume.toFixed(4)} м³</span>
                    </p>
                    <p className="text-xs text-wood-600">
                        {dimensions.height} × {dimensions.width} × {dimensions.length} мм
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
