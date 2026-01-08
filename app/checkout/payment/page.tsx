'use client'

import Link from 'next/link'
import { ArrowRight, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function PaymentPage() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Осуществите ваш перевод</h1>
        <p className="text-wood-600 mb-12">Используйте приведенные ниже данные для быстрого перевода</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coordonnées bancaires */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-8 border-2 border-blue-300 mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Координаты для быстрого перевода</h2>
              
              <div className="space-y-5 bg-white rounded-lg p-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-wood-600 mb-2">Получатель</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="TsarstvoDereva LLC"
                      readOnly
                      className="flex-1 px-4 py-2 bg-wood-50 border border-wood-200 rounded-lg text-wood-900 font-semibold"
                    />
                    <button
                      onClick={() => copyToClipboard('TsarstvoDereva LLC')}
                      className="p-2 hover:bg-wood-100 rounded-lg transition"
                      title="Копировать"
                    >
                      <Copy size={18} className="text-fire-600" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wood-600 mb-2">Расчётный счёт</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="RU12 0456 1234 5678 9012 3456"
                      readOnly
                      className="flex-1 px-4 py-2 bg-wood-50 border border-wood-200 rounded-lg text-wood-900 font-semibold font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard('RU12 0456 1234 5678 9012 3456')}
                      className="p-2 hover:bg-wood-100 rounded-lg transition"
                      title="Копировать"
                    >
                      <Copy size={18} className="text-fire-600" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wood-600 mb-2">Корреспондентский</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="SBERRU33"
                      readOnly
                      className="flex-1 px-4 py-2 bg-wood-50 border border-wood-200 rounded-lg text-wood-900 font-semibold font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard('SBERRU33')}
                      className="p-2 hover:bg-wood-100 rounded-lg transition"
                      title="Копировать"
                    >
                      <Copy size={18} className="text-fire-600" />
                    </button>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-wood-600 mb-2">Сумма к переводу</label>
                  <p className="text-3xl font-bold text-orange-600">50,000 RUB</p>
                  <p className="text-sm text-orange-700 mt-2">
                    ⚠️ Убедитесь, что сумма соответствует точно, чтобы ваш перевод был правильно связан с нашим заказом.
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-wood-900 mb-4">Этапы перевода:</h3>
                <ol className="list-decimal list-inside space-y-3 text-wood-700">
                  <li>Откройте свое банковское приложение или веб-платформу</li>
                  <li>Выберите "Осуществить перевод" или "Быстрый платеж"</li>
                  <li>Выберите координаты (расчётный счёт и корреспондентский)</li>
                  <li>Подтвердите сумму: <strong>50,000 RUB</strong></li>
                  <li>Осуществите автентификацию (код OTP, пальцевая сяним и т.д.)</li>
                  <li>Сохраните или скачайте ничего подтверждения</li>
                </ol>
              </div>
            </div>

            {/* Предупреждение */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded mb-8">
              <h3 className="font-bold text-yellow-900 mb-2">⚠️ Важно</h3>
              <p className="text-yellow-800 text-sm mb-4">
                После осуществления перевода, вы будете перенаправлены на страницу загружения. 
                <strong> Вы ДОЛЖНЫ загрузить квитанцию или снимок экрана перевода</strong> для того, чтобы ваш заказ был валидирован.
              </p>
              <p className="text-yellow-800 text-sm">
                Без подтверждения платежа, мы не можем обработать ваш заказ. Сохраните рекорд трансакции!
              </p>
            </div>
          </div>

          {/* Объем */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-lg font-bold text-wood-900 mb-4">Объем</h3>
              
              <div className="space-y-3 pb-6 border-b border-wood-200">
                <div className="flex justify-between">
                  <span className="text-wood-700">Продукты</span>
                  <span className="font-semibold">45,000₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-wood-700">Доставка</span>
                  <span className="font-semibold">5,000₽</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-wood-900 mb-8 pt-4">
                <span>Итого:</span>
                <span className="text-2xl text-fire-600">50,000₽</span>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-900">
                    Ваш заказ будет подтвержден сразу после получения ничего платежа.
                  </p>
                </div>
              </div>

              <Link
                href="/checkout/receipt"
                className="w-full bg-fire-600 text-white py-3 rounded-lg hover:bg-fire-700 transition font-semibold flex items-center justify-center gap-2 mb-3"
              >
                Перевод осуществлен
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/checkout"
                className="w-full border-2 border-wood-300 text-wood-900 py-3 rounded-lg hover:bg-wood-50 transition font-semibold text-center"
              >
                Назад
              </Link>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-900">
                  💡 <strong>Повет:</strong> Снимите снимок с экрана квитанции при продолжении, вы это нужны на следующем этапе.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
