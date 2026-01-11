'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

const categories = [
  'Строительная древесина',
  'Пиломатериалы',
  'Дрова и биотопливо',
  'Древесина для сауны',
  'Декоративная древесина',
  'Панели и плиты',
  'Дерево для наружных работ',
  'Техническая / индустриальная древесина',
]

export default function NewProductPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    price: '',
    promoPrice: '',
    description: '',
    image: null as File | null,
    vedette: false,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  useEffect(() => {
    const hasSecretAccess = document.cookie.includes('admin_secret_access=true')
    if (!hasSecretAccess) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      setLoading(false)
    }
  }, [router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите корректное изображение')
        return
      }
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Изображение должно быть меньше 5 МБ')
        return
      }
      setFormData({ ...formData, image: file })

      // Créer une prévisualisation
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null })
    setImagePreview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitMessage(null)

    if (!formData.image) {
      setError('Пожалуйста, выберите изображение')
      return
    }

    ; (async () => {
      setLoading(true)
      try {
        const form = new FormData()
        form.append('name', formData.name)
        form.append('category', formData.category)
        form.append('price', String(formData.price))
        if (formData.promoPrice) form.append('promoPrice', String(formData.promoPrice))
        form.append('description', formData.description)
        form.append('vedette', String(formData.vedette))
        if (formData.image) form.append('image', formData.image)

        const res = await fetch('/api/admin/products', {
          method: 'POST',
          body: form,
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Ошибка при создании')
        }

        setSubmitMessage('Товар успешно добавлен!')
        setTimeout(() => router.push('/admin/products'), 1500)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Неизвестная ошибка'
        console.error('Ошибка при создании товара:', err)
        setError(`Ошибка при создании товара: ${errorMsg}`)
      } finally {
        setLoading(false)
      }
    })()
  }

  if (loading) return null
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-wood-100">
      <div className="bg-white border-b border-wood-200 p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-wood-100 rounded-lg transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-wood-900">Добавить товар</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow max-w-2xl">
          {/* Сообщения об ошибках и успехе */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-t-lg">
              <p className="font-semibold">Ошибка:</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
          {submitMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-t-lg">
              <p className="font-semibold">Успешно:</p>
              <p className="text-sm mt-1">{submitMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Image du produit */}
            <div>
              <label className="block text-sm font-bold text-wood-900 mb-2">
                Изображение товара *
              </label>

              {!imagePreview ? (
                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-wood-300 rounded-lg p-8 cursor-pointer hover:border-fire-500 hover:bg-fire-50 transition">
                  <Upload size={32} className="text-wood-600 mb-2" />
                  <span className="text-wood-900 font-semibold">Нажмите для выбора изображения</span>
                  <span className="text-wood-600 text-sm mt-1">PNG, JPG, WebP (макс. 5 МБ)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Предпросмотр"
                      className="max-w-sm rounded-lg border border-wood-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <label className="block">
                    <span className="inline-flex items-center gap-2 bg-wood-100 hover:bg-wood-200 text-wood-900 px-4 py-2 rounded-lg cursor-pointer transition font-semibold">
                      <Upload size={18} />
                      Изменить изображение
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-bold text-wood-900 mb-2">
                Название товара *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600"
                placeholder="пр: Строительное дерево сырье"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-bold text-wood-900 mb-2">
                Категория *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Prix */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-wood-900 mb-2">
                  Цена (РУБ) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600"
                  placeholder="15000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-wood-900 mb-2">
                  Цена со скидкой (необязательно)
                </label>
                <input
                  type="number"
                  value={formData.promoPrice}
                  onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600"
                  placeholder="12000"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-wood-900 mb-2">
                Описание *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600"
                placeholder="Подробно опишите товар..."
              />
            </div>

            {/* Vedette */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="vedette"
                checked={formData.vedette}
                onChange={(e) => setFormData({ ...formData, vedette: e.target.checked })}
                className="w-4 h-4 text-amber-600 border-wood-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="vedette" className="ml-3 text-sm font-medium text-wood-900">
                Показать этот товар на главной странице как избранный ⭐
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-wood-200">
              <button
                type="submit"
                className="flex items-center gap-2 bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition font-semibold"
              >
                <Save size={20} />
                Создать товар
              </button>
              <Link
                href="/admin/products"
                className="px-6 py-2 border border-wood-300 rounded-lg hover:bg-wood-50 transition font-semibold"
              >
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
