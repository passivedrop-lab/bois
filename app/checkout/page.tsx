'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ShoppingCart, Loader } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    instructions: ''
  })

  // Mock cart total for now (should come from cart context)
  const cartTotal = 50000
  const shippingCost = 5000
  const grandTotal = cartTotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        toast.error('Veuillez vous connecter pour commander')
        router.push('/login?next=/checkout')
        return
      }

      // Create Order in Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          delivery_address: `${formData.address}, ${formData.postalCode} ${formData.city}`,
          total_price: grandTotal,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      // Trigger Email Notification (Order Confirmation)
      await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'confirmation',
          email: formData.email,
          orderId: data.id,
          orderTotal: grandTotal,
          customerName: `${formData.firstName} ${formData.lastName}`
        })
      })

      // Send Admin Notification
      await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin_notification',
          email: 'admin@tsarstvodereva.ru', // Replace with real admin email
          orderId: data.id,
          orderTotal: grandTotal,
          customerName: `${formData.firstName} ${formData.lastName}`
        })
      })

      router.push(`/checkout/payment?orderId=${data.id}&amount=${grandTotal}`)
    } catch (error: any) {
      console.error('Order creation error:', error)
      toast.error('Erreur lors de la création de la commande')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Оформить заказ</h1>
        <p className="text-wood-600 mb-12">Завершите покупку в нескольких простых шагах</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Informations personnelles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-wood-900 mb-4">1. Личная информация</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    type="text"
                    required
                    placeholder="Имя"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                  <input
                    name="lastName"
                    type="text"
                    required
                    placeholder="Фамилия"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </div>
            </div>

            {/* Section 2: Informations de livraison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-wood-900 mb-4">2. Информация о доставке</h2>
              <div className="space-y-4">
                <input
                  name="address"
                  type="text"
                  required
                  placeholder="Полный адрес"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="city"
                    type="text"
                    required
                    placeholder="Город"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                  <input
                    name="postalCode"
                    type="text"
                    required
                    placeholder="Почтовый код"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
                <textarea
                  name="instructions"
                  placeholder="Особые инструкции (по желанию)"
                  rows={3}
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                ></textarea>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Link
                href="/cart"
                className="px-6 py-3 border-2 border-wood-300 text-wood-900 rounded-lg hover:bg-wood-50 transition font-semibold"
              >
                Назад к корзине
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-fire-600 text-white rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader className="animate-spin" /> : 'Перейти к оплате'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </div>

          {/* Sidebar - Карзина */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-lg font-bold text-wood-900 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} className="text-fire-600" />
                Ваша корзина
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-wood-200">
                <div className="flex justify-between text-sm">
                  <span className="text-wood-700">Основной материал</span>
                  <span className="font-semibold">{cartTotal.toLocaleString()}₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wood-700">Доставка</span>
                  <span className="font-semibold">{shippingCost.toLocaleString()}₽</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-wood-900 mb-6">
                <span>Итого:</span>
                <span className="text-xl text-fire-600">{grandTotal.toLocaleString()}₽</span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-900">
                ✓ Бесплатная доставка для заказов свыше 100,000₽
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
