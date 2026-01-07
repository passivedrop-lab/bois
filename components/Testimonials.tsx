'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Иван Петров',
    location: 'Москва',
    rating: 5,
    text: 'Отличное качество дров! Заказываю уже третий год подряд. Всегда сухие, хорошо колотые. Доставка быстрая, персонал вежливый.',
    image: '/api/placeholder/100/100',
  },
  {
    name: 'Мария Сидорова',
    location: 'Санкт-Петербург',
    rating: 5,
    text: 'Очень довольна покупкой пеллет. Топят отлично, зольность минимальная. Рекомендую всем!',
    image: '/api/placeholder/100/100',
  },
  {
    name: 'Алексей Козлов',
    location: 'Казань',
    rating: 5,
    text: 'Купил печь через этот сайт. Установили быстро, все объяснили. Теперь дом всегда теплый. Спасибо!',
    image: '/api/placeholder/100/100',
  },
]

export default function Testimonials() {
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
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Отзывы клиентов</h2>
          <p className="section-subtitle text-base sm:text-lg md:text-xl px-4">
            Что говорят о нас наши довольные клиенты
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card p-5 sm:p-6 relative"
            >
              <Quote className="absolute top-3 right-3 sm:top-4 sm:right-4 text-fire-200" size={32} />
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="sm:w-4.5 sm:h-4.5 text-fire-500 fill-fire-500"
                  />
                ))}
              </div>
              <p className="text-sm sm:text-base text-wood-700 mb-4 sm:mb-6 relative z-10 leading-relaxed">{testimonial.text}</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-fire-400 to-fire-600 flex items-center justify-center text-white text-sm sm:text-base font-bold flex-shrink-0">
                  {testimonial.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm sm:text-base text-wood-900 truncate">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-wood-600 truncate">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

