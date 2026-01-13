'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Search, Star } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  promoPrice?: number
  description: string
  vedette?: boolean
}

export default function AdminProducts() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Необработанная строительная древесина',
      category: 'Строительная древесина',
      price: 15000,
      promoPrice: 12000,
      description: 'Качественная древесина для строительства',
      vedette: false,
    },
    {
      id: '2',
      name: 'Полубревно',
      category: 'Пиломатериалы',
      price: 8500,
      description: 'Качественное полубревно',
      vedette: false,
    },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingAll, setDeletingAll] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    const hasSecretAccess = document.cookie.includes('admin_secret_access=true')
    if (!hasSecretAccess) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
        // Load products via server API (returns signed URLs for private images)
        ; (async () => {
          try {
            const res = await fetch('/api/admin/products')
            const json = await res.json()
            if (res.ok && json.products) setProducts(json.products)
          } catch (err) {
            console.error('Ошибка при загрузке товаров:', err)
          } finally {
            setLoading(false)
          }
        })()
    }
  }, [router])

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      ; (async () => {
        try {
          const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
          })
          const json = await res.json()
          if (!res.ok) throw new Error(json.error || 'Ошибка при удалении')
          setProducts(products.filter((p) => p.id !== id))
        } catch (err) {
          console.error('Ошибка при удалении товара:', err)
          alert('Ошибка при удалении')
        }
      })()
    }
  }

  const toggleVedette = (id: string) => {
    ; (async () => {
      try {
        const prod = products.find((p) => p.id === id)
        if (!prod) return
        const newVedette = !prod.vedette
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, vedette: newVedette }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Ошибка обновления')
        setProducts(
          products.map((p) => (p.id === id ? { ...p, vedette: newVedette } : p))
        )
      } catch (err) {
        console.error('Ошибка изменения статуса избранного:', err)
        alert('Ошибка при обновлении')
      }
    })()
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return null
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-wood-100">
      <div className="bg-white border-b border-wood-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-wood-100 rounded-lg transition"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-wood-900">Управление товарами</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-fire-600 text-white px-4 py-2 rounded-lg hover:bg-fire-700 transition font-semibold"
          >
            <Plus size={20} />
            Добавить товар
          </Link>
        </div>

        <div className="flex justify-end items-center gap-3 mb-4">
          <button
            onClick={async () => {
              if (!confirm('Вы уверены? Это удалит ВСЕ товары (операция необратима).')) return
              const token = prompt('Введите ADMIN_DELETE_TOKEN для подтверждения удаления:')
              if (!token) return alert('Токен не введён')
              setDeletingAll(true)
              try {
                const res = await fetch('/api/admin/products/delete-all', {
                  method: 'POST',
                  headers: { 'x-admin-delete-token': token },
                })
                const json = await res.json()
                if (!res.ok) throw new Error(json.error || 'Ошибка при удалении')
                setProducts([])
                alert(json.message || 'Все товары были удалены')
              } catch (err) {
                console.error('Ошибка при глобальном удалении:', err)
                alert('Ошибка при удалении')
              } finally {
                setDeletingAll(false)
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            disabled={deletingAll}
          >
            {deletingAll ? 'Удаление...' : 'Удалить все товары'}
          </button>
          <button
            onClick={async () => {
              if (selectedIds.length === 0) return alert('Товары не выбраны')
              if (!confirm(`Вы уверены, что хотите удалить ${selectedIds.length} выбранных товаров?`)) return
              setDeletingAll(true)
              try {
                const res = await fetch('/api/admin/products/delete-multiple', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ids: selectedIds }),
                })
                const json = await res.json()
                if (!res.ok) throw new Error(json.error || 'Ошибка при удалении')
                setProducts(products.filter((p) => !selectedIds.includes(p.id)))
                setSelectedIds([])
                alert(json.message || 'Выделенные товары удалены')
              } catch (err) {
                console.error('Ошибка при множественном удалении:', err)
                alert('Ошибка при удалении')
              } finally {
                setDeletingAll(false)
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
            disabled={deletingAll}
          >
            {deletingAll ? 'Удаление...' : 'Удалить выбранные'}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-wood-400" size={20} />
          <input
            type="text"
            placeholder="Поиск товара..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600"
          />
        </div>
      </div>

      <div className="p-6">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-wood-600 mb-4">Товары не найдены</p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition"
            >
              Создать первый товар
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`rounded-lg shadow p-6 flex items-center justify-between hover:shadow-lg transition ${product.vedette ? 'bg-amber-50 border-2 border-amber-400' : 'bg-white'
                  }`}
              >
                <div className="pr-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => {
                      setSelectedIds((prev) =>
                        prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
                      )
                    }}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-wood-900 text-lg">{product.name}</h3>
                    {product.vedette && (
                      <span className="bg-amber-400 text-amber-900 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Star size={14} fill="currentColor" />
                        Избранное
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-wood-600 mb-2">{product.category}</p>
                  <p className="text-sm text-wood-700 line-clamp-2">{product.description}</p>
                  <div className="mt-2 flex gap-4">
                    <span className="text-lg font-bold text-fire-600">{product.price}₽</span>
                    {product.promoPrice && (
                      <span className="text-lg font-bold text-green-600 line-through opacity-70">
                        {product.promoPrice}₽
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleVedette(product.id)}
                    className={`p-2 rounded-lg transition ${product.vedette
                      ? 'bg-amber-100 hover:bg-amber-200'
                      : 'hover:bg-gray-100'
                      }`}
                    title={product.vedette ? 'Удалить из избранного' : 'Добавить в избранное'}
                  >
                    <Star
                      size={20}
                      className={product.vedette ? 'text-amber-600 fill-amber-600' : 'text-gray-400'}
                    />
                  </button>
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="p-2 hover:bg-blue-100 rounded-lg transition"
                    title="Редактировать"
                  >
                    <Edit2 size={20} className="text-blue-600" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition"
                    title="Удалить"
                  >
                    <Trash2 size={20} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
