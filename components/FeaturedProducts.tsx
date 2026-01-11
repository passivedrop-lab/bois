"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/data/products'
import ProductCard from './ProductCard'

export default function FeaturedProducts() {
  const products = PRODUCTS.filter(p => p.vedette)

  if (products.length === 0) return null

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-wood-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Популярные товары</h2>
          <p className="section-subtitle text-base sm:text-lg md:text-xl px-4">
            Выберите лучшее для вашего дома из нашего каталога
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center px-4">
          <Link href="/catalogue" className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-block">
            Смотреть все товары
          </Link>
        </div>
      </div>
    </section>
  )
}
