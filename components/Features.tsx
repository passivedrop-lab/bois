'use client'

import { motion } from 'framer-motion'
import { Award, Truck, HeadphonesIcon, Shield } from 'lucide-react'

const features = [
  {
    icon: Award,
    title: 'Лучшее качество',
    description: 'Наши дрова проходят строгий контроль качества',
  },
  {
    icon: Truck,
    title: 'Быстрая доставка',
    description: 'Доставка в течение 48 часов по всей России',
  },
  {
    icon: HeadphonesIcon,
    title: 'Поддержка 24/7',
    description: 'Свяжитесь с нами в любое время суток',
  },
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: '100% гарантия на всю нашу продукцию',
  },
]

export default function Features() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-wood-900 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 sm:mb-4 px-4">
            Почему выбирают нас
          </h2>
          <p className="text-base sm:text-lg text-wood-300 max-w-2xl mx-auto px-4">
            Мы заботимся о вашем комфорте и предлагаем только лучшее
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center px-4"
              >
                <div className="bg-fire-600/20 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Icon size={32} className="sm:w-10 sm:h-10 text-fire-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-wood-300">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

