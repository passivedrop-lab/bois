'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

function ReceiptContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''
  const amount = searchParams.get('amount') || ''
  const { user } = useAuth()

  console.log('ReceiptContent rendered:', { orderId, amount, userId: user?.id })

  const [file, setFile] = useState<File | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!file || !orderId) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('orderId', orderId)
      formData.append('customerEmail', user?.email || 'admin@tsarstvo')

      const response = await fetch('/api/receipts/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du reçu')
      }

      setShowSuccess(true)
      setTimeout(() => {
        router.push('/profile/orders')
      }, 3000)
    } catch (err) {
      setError('Erreur lors du téléversement. Veuillez réessayer.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  if (!orderId) {
    return (
      <div className="py-20 text-center">
        <p>Commande non spécifiée. Veuillez retourner à <Link href="/profile/orders" className="text-fire-600 underline">vos commandes</Link>.</p>
      </div>
    )
  }

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-wood-900 mb-2">Загрузите ваш чек</h1>
        <p className="text-wood-600 mb-12">Последний этап для валидации вашего заказа #{orderId}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!showSuccess ? (
              <>
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-wood-900 mb-6">Загрузите ваше подтверждение о платеже</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={20} />
                      Что загружать?
                    </h3>
                    <ul className="text-blue-900 text-sm space-y-2 list-disc list-inside">
                      <li>Нснимок экрана квитанции банковского перевода</li>
                      <li>Либо PDF квитанции сообщенных вашем банком</li>
                      <li>На квитанции должны быть четко: сумма, получатель, дата и час</li>
                    </ul>
                  </div>

                  <div className="border-2 border-dashed border-fire-300 rounded-lg p-12 text-center bg-fire-50 mb-6 cursor-pointer hover:bg-fire-100 transition"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const files = e.dataTransfer.files
                      if (files.length > 0) {
                        setFile(files[0])
                      }
                    }}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload size={48} className="mx-auto mb-4 text-fire-600" />
                    <p className="text-lg font-semibold text-wood-900 mb-2">
                      Перетащите файл сюда или нажмите для выбора
                    </p>
                    <p className="text-sm text-wood-600">
                      Поддерживаемые форматы: PNG, JPG, PDF (Макс. 10 МБ)
                    </p>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {file && (
                    <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6 flex items-center gap-3">
                      <CheckCircle size={24} className="text-green-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-green-900">Выбранный файл:</p>
                        <p className="text-sm text-green-800">{file.name}</p>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-green-700 hover:text-green-900 font-semibold"
                      >
                        Изменить
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!file || uploading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${file && !uploading
                      ? 'bg-fire-600 text-white hover:bg-fire-700 cursor-pointer'
                      : 'bg-wood-200 text-wood-400 cursor-not-allowed'
                      }`}
                  >
                    <CheckCircle size={20} />
                    {uploading ? 'Загрузка...' : 'Подтвердить заказ'}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 rounded-full p-4">
                    <CheckCircle size={64} className="text-green-600" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-green-900 mb-4">Загрузка успешна!</h2>

                <p className="text-green-800 text-lg mb-8">
                  Ваш чек успешно загружен. Мы проверим ваш платеж в ближайшее время.
                </p>

                <p className="text-wood-600 text-sm mb-6">
                  Перенаправление в историю заказов через 3 секунды...
                </p>

                <Link
                  href="/profile/orders"
                  className="inline-block bg-fire-600 text-white px-8 py-3 rounded-lg hover:bg-fire-700 transition font-semibold"
                >
                  Мои заказы
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-lg font-bold text-wood-900 mb-6">Детали заказа</h3>

              <div className="space-y-4 pb-6 border-b border-wood-200">
                <div>
                  <p className="text-sm text-wood-600">Оплаченная сумма</p>
                  <p className="text-2xl font-bold text-fire-600">
                    {amount && !isNaN(parseInt(amount))
                      ? `${parseInt(amount).toLocaleString('ru-RU')} ₽`
                      : '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-wood-600">Статус</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <p className="font-semibold text-yellow-700">Ожидает подтверждения</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReceiptContent />
    </Suspense>
  )
}
