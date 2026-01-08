import ProductsGrid from '@/components/ProductsGrid'
import Link from 'next/link'
import { TreePine, Package, Flame, Wrench, Truck } from 'lucide-react'

const categories = [
  {
    name: 'Дрова для отопления',
    description: 'Высококачественные дрова различных пород дерева',
    href: '/products/firewood',
    icon: TreePine,
    color: 'from-fire-500 to-fire-700',
  },
  {
    name: 'Пеллеты и гранулы',
    description: 'Экологичные пеллеты премиум класса',
    href: '/products/pellets',
    icon: Package,
    color: 'from-wood-500 to-wood-700',
  },
  {
    name: 'Печи и камины',
    description: 'Современные печи и камины для дома',
    href: '/products/stoves',
    icon: Flame,
    color: 'from-fire-600 to-fire-800',
  },
  {
    name: 'Котлы',
    description: 'Эффективные котлы на твердом топливе',
    href: '/products/boilers',
    icon: Wrench,
    color: 'from-wood-600 to-wood-800',
  },
  {
    name: 'Аксессуары',
    description: 'Все необходимое для отопления',
    href: '/products/accessories',
    icon: Truck,
    color: 'from-fire-500 to-wood-600',
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wood-900 via-wood-800 to-fire-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Каталог товаров
            </h1>
            <p className="text-xl md:text-2xl text-wood-200">
              Премиальные материалы для отопления вашего дома
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-8 text-center">
          Категории товаров
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={category.href}
                className="card-premium p-8 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-wood-900 mb-3">{category.name}</h3>
                <p className="text-wood-600">{category.description}</p>
                <div className="mt-4 text-fire-600 font-medium group-hover:translate-x-2 transition-transform">
                  Смотреть товары →
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* All Products */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-8 text-center">
          Все товары
        </h2>
        <ProductsGrid />
      </section>
    </div>
  )
}
