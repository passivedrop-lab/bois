'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TreePine, Package, Flame, Wrench, Truck } from 'lucide-react'

const categories = [
  {
    name: 'Строительный лес',
    description: 'Брус, бревно и конструкционные материалы',
    href: '/products/construction',
    icon: TreePine,
    color: 'from-wood-700 to-wood-900',
  },
  {
    name: 'Пиломатериалы',
    description: 'Доска обрезная, брусок и погонаж',
    href: '/products/sawn',
    icon: Package,
    color: 'from-orange-700 to-orange-900',
  },
  {
    name: 'Дрова и Биотопливо',
    description: 'Колотые дрова, пеллеты и брикеты',
    href: '/products/firewood',
    icon: Flame,
    color: 'from-fire-600 to-fire-800',
  },
  {
    name: 'Для бани и сауны',
    description: 'Вагонка, пологи и отделочные материалы',
    href: '/products/sauna',
    icon: Wrench,
    color: 'from-amber-600 to-amber-800',
  },
  {
    name: 'Декоративная отделка',
    description: 'Планкен, имитация бруса и декор',
    href: '/products/decorative',
    icon: TreePine,
    color: 'from-stone-600 to-stone-800',
  },
  {
    name: 'Панели и щиты',
    description: 'Мебельные щиты, фанера и плиты',
    href: '/products/panels',
    icon: Package,
    color: 'from-brown-600 to-brown-800',
  },
  {
    name: 'Экстерьерные системы',
    description: 'Террасная доска и фасадные решения',
    href: '/products/exterior',
    icon: Truck,
    color: 'from-emerald-700 to-emerald-900',
  },
  {
    name: 'Техническое дерево',
    description: 'Брус для опалубки и промышленные заготовки',
    href: '/products/industrial',
    icon: Wrench,
    color: 'from-slate-700 to-slate-900',
  },
]

export default function Categories() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Наши категории</h2>
          <p className="section-subtitle text-base sm:text-lg md:text-xl px-4">
            Широкий ассортимент продукции для отопления вашего дома
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={category.href}>
                  <div className="card group cursor-pointer h-full">
                    <div className={`bg-gradient-to-br ${category.color} p-6 sm:p-8 text-white relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
                      <Icon size={40} className="sm:w-12 sm:h-12 relative z-10 mb-3 sm:mb-4" />
                      <h3 className="text-xl sm:text-2xl font-bold relative z-10 mb-2">{category.name}</h3>
                      <p className="text-sm sm:text-base text-white/90 relative z-10">{category.description}</p>
                      <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mb-12 sm:-mb-16"></div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="text-sm sm:text-base text-fire-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                        Смотреть товары
                        <span className="text-lg sm:text-xl">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

