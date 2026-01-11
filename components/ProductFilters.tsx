'use client'

import { useState, useEffect, useMemo } from 'react'
import { Product } from '@/lib/data/products'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

interface ProductFiltersProps {
    products: Product[]
    onFilterChange: (filters: FilterState) => void
    className?: string
}

export interface FilterState {
    lengths: string[]
    sections: string[]
}

export default function ProductFilters({ products, onFilterChange, className = '' }: ProductFiltersProps) {
    const [selectedLengths, setSelectedLengths] = useState<string[]>([])
    const [selectedSections, setSelectedSections] = useState<string[]>([])

    // Collapsible sections state
    const [openSections, setOpenSections] = useState({
        length: true,
        section: true,
    })

    const toggleSection = (key: 'length' | 'section') => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
    }

    // Extract available options from products dynamically
    const options = useMemo(() => {
        const lengths = new Set<string>()
        const sections = new Set<string>()

        products.forEach(product => {
            if (product.variants) {
                product.variants.forEach(variant => {
                    // Parse typical dimensions: "Width x Height x Length mm" or similar
                    // Matches: "100x100x3000"
                    const match = variant.label.match(/(\d+)[xх](\d+)[xх](\d+)/)
                    if (match) {
                        const [_, w, h, l] = match
                        lengths.add(l)
                        sections.add(`${w}x${h}`)
                    }
                    // Handle case like "25x100x6000" where first two are section
                })
            }
        })

        // Sort numerically
        return {
            lengths: Array.from(lengths).sort((a, b) => parseInt(a) - parseInt(b)),
            sections: Array.from(sections).sort((a, b) => {
                const [w1] = a.split('x').map(Number)
                const [w2] = b.split('x').map(Number)
                return w1 - w2
            })
        }
    }, [products])

    // Update parent when selections change
    useEffect(() => {
        onFilterChange({
            lengths: selectedLengths,
            sections: selectedSections
        })
    }, [selectedLengths, selectedSections, onFilterChange])

    const handleLengthChange = (len: string) => {
        setSelectedLengths(prev =>
            prev.includes(len) ? prev.filter(l => l !== len) : [...prev, len]
        )
    }

    const handleSectionChange = (sec: string) => {
        setSelectedSections(prev =>
            prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]
        )
    }

    const clearFilters = () => {
        setSelectedLengths([])
        setSelectedSections([])
    }

    const hasFilters = selectedLengths.length > 0 || selectedSections.length > 0

    if (options.lengths.length === 0 && options.sections.length === 0) {
        return null // No dimensions to filter
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-wood-100 p-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Фильтры</h3>
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                        <X size={12} />
                        Сбросить
                    </button>
                )}
            </div>

            {/* Length Filter */}
            {options.lengths.length > 0 && (
                <div className="mb-4 border-b border-wood-100 pb-4">
                    <button
                        onClick={() => toggleSection('length')}
                        className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
                    >
                        Длина (мм)
                        {openSections.length ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {openSections.length && (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                            {options.lengths.map(len => (
                                <label key={len} className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedLengths.includes(len)}
                                            onChange={() => handleLengthChange(len)}
                                            className="peer h-4 w-4 rounded border-gray-300 text-fire-600 focus:ring-fire-500 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                        {len} мм
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Section Filter */}
            {options.sections.length > 0 && (
                <div>
                    <button
                        onClick={() => toggleSection('section')}
                        className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
                    >
                        Сечение (мм)
                        {openSections.section ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {openSections.section && (
                        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                            {options.sections.map(sec => (
                                <label key={sec} className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedSections.includes(sec)}
                                            onChange={() => handleSectionChange(sec)}
                                            className="peer h-4 w-4 rounded border-gray-300 text-fire-600 focus:ring-fire-500 cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                        {sec} мм
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
