'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribe:', email)
    setEmail('')
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-fire-600 to-fire-800 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4">
              <Mail size={40} className="sm:w-12 sm:h-12" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 sm:mb-4 px-4">
            Подпишитесь на рассылку
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-fire-100 mb-6 sm:mb-8 px-4">
            Получайте специальные предложения и новости о наших продуктах
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto px-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш email"
              required
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-wood-900 placeholder-wood-500 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-white text-fire-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-fire-50 transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Send size={18} className="sm:w-5 sm:h-5" />
              Подписаться
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

