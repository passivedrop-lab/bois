'use client'

import { PRODUCTS } from '@/lib/data/products'
import ProductCard from './ProductCard'

interface ProductListProps {
    categoryName: string
}

export default function ProductList({ categoryName }: ProductListProps) {
    const products = PRODUCTS.filter(p => p.category === categoryName)

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-lg text-wood-600">В этом разделе пока нет товаров.</p>
                <p className="text-sm text-wood-500 mt-2">Загляните позже!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <div key={product.id} className="h-full">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    )
}
