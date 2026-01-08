'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wood-900 via-wood-800 to-fire-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Свяжитесь с нами
            </h1>
            <p className="text-xl md:text-2xl text-wood-200">
              Мы всегда рады помочь и ответить на ваши вопросы
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-premium p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-wood-900 mb-2">Телефон</h3>
                  <a href="tel:+79991234567" className="text-wood-600 hover:text-fire-600 transition">
                    +7 (999) 123-45-67
                  </a>
                  <p className="text-sm text-wood-500 mt-1">Пн-Пт: 9:00 - 20:00</p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-wood-900 mb-2">Email</h3>
                  <a href="mailto:info@drovapremium.ru" className="text-wood-600 hover:text-fire-600 transition">
                    info@drovapremium.ru
                  </a>
                  <p className="text-sm text-wood-500 mt-1">Ответим в течение 24 часов</p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-wood-900 mb-2">Адрес</h3>
                  <p className="text-wood-600">
                    г. Москва, ул. Примерная, д. 123
                  </p>
                  <p className="text-sm text-wood-500 mt-1">Офис и склад</p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-fire-500 to-fire-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-wood-900 mb-2">Режим работы</h3>
                  <p className="text-wood-600">
                    Понедельник - Пятница: 9:00 - 20:00
                  </p>
                  <p className="text-wood-600">
                    Суббота: 10:00 - 18:00
                  </p>
                  <p className="text-wood-600">
                    Воскресенье: Выходной
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card-premium p-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-wood-900 mb-6">
                Отправьте нам сообщение
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-wood-700 mb-2">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="input-elegant"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-wood-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="input-elegant"
                      placeholder="ivan@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-wood-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-elegant"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-wood-700 mb-2">
                    Тема *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="input-elegant"
                  >
                    <option value="">Выберите тему</option>
                    <option value="order">Вопрос по заказу</option>
                    <option value="product">Вопрос о товаре</option>
                    <option value="delivery">Доставка</option>
                    <option value="payment">Оплата</option>
                    <option value="wholesale">Оптовая закупка</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-wood-700 mb-2">
                    Сообщение *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="input-elegant resize-none"
                    placeholder="Опишите ваш вопрос или пожелание..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  {loading ? 'Отправка...' : 'Отправить сообщение'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
