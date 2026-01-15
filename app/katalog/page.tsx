'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { CATEGORIES } from '@/lib/data/categories'

export default function CataloguePage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Каталог</h1>
        <p className="text-wood-600 mb-8">Откройте для себя широкий ассортимент качественной древесины</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="bg-white border border-wood-200 rounded-lg p-6 hover:shadow-lg hover:border-fire-400 transition-all"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-semibold text-wood-900 mb-2">{category.name}</h3>
              <div className="flex items-center text-fire-600 group-hover:text-fire-700">
                <span className="text-sm">Подробнее</span>
                <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
