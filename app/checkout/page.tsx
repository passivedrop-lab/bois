'use client'

import Link from 'next/link'
import { ArrowRight, ShoppingCart } from 'lucide-react'

export default function CheckoutPage() {
  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Оформить заказ</h1>
        <p className="text-wood-600 mb-12">Завершите покупку в нескольких простых шагах</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Informations personnelles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-wood-900 mb-4">1. Личная информация</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Имя"
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                  <input
                    type="text"
                    placeholder="Фамилия"
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
              </form>
            </div>

            {/* Section 2: Informations de livraison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-wood-900 mb-4">2. Информация о доставке</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Полный адрес"
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Город"
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                  <input
                    type="text"
                    placeholder="Почтовый код"
                    className="px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                  />
                </div>
                <textarea
                  placeholder="Особые инструкции (по желанию)"
                  rows={3}
                  className="w-full px-4 py-2 border border-wood-200 rounded-lg focus:outline-none focus:border-fire-600"
                ></textarea>
              </form>
            </div>

            {/* Объем заказа */}
            <div className="bg-wood-50 rounded-lg p-6 border border-wood-200">
              <h2 className="text-xl font-bold text-wood-900 mb-4">3. Объем заказа</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-wood-700">
                  <span>Основной материал (древесина 10м³)</span>
                  <span>45,000₽</span>
                </div>
                <div className="flex justify-between text-wood-700">
                  <span>Выраз доставки</span>
                  <span>5,000₽</span>
                </div>
                <div className="border-t border-wood-300 pt-3 flex justify-between font-bold text-wood-900">
                  <span>Итого</span>
                  <span>50,000₽</span>
                </div>
              </div>
            </div>

            {/* Оплата */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-fire-200">
              <h2 className="text-xl font-bold text-wood-900 mb-4">4. Информация об оплате</h2>
              <p className="text-wood-700 mb-6">
                <strong>Мы принимаем только быстрые банковские переводы.</strong>
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">Банковские реквизиты для перевода:</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Получатель:</strong> TsarstvoDereva LLC</p>
                  <p><strong>МР (расчётный счёт):</strong> RU12 0456 1234 5678 9012 3456</p>
                  <p><strong>Кор (корреспондентский):</strong> SBERRU33</p>
                  <p><strong>Сумма:</strong> 50,000 RUB</p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-900 text-sm">
                  ⚠️ <strong>Важно:</strong> После осуществления банковского перевода требуется загрузить скриншот или реквита в следующим шаге. 
                  Мы валидируем вашу платёжную прооф только у убедимости нормальности трансакции.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Link
                href="/cart"
                className="px-6 py-3 border-2 border-wood-300 text-wood-900 rounded-lg hover:bg-wood-50 transition font-semibold"
              >
                Назад к карзине
              </Link>
              <Link
                href="/checkout/payment"
                className="flex-1 px-6 py-3 bg-fire-600 text-white rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2"
              >
                Пополнить к оплате
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Sidebar - Карзина */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-lg font-bold text-wood-900 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} className="text-fire-600" />
                Ваш карзина
              </h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-wood-200">
                <div className="flex justify-between text-sm">
                  <span className="text-wood-700">Основной материал</span>
                  <span className="font-semibold">45,000₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wood-700">Доставка</span>
                  <span className="font-semibold">5,000₽</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-wood-900 mb-6">
                <span>Итого:</span>
                <span className="text-xl text-fire-600">50,000₽</span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-900">
                ✓ Бесплатная доставка для заказов свыше 100,000₽
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
