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
      name: 'Bois de construction brut',
      category: 'Bois de construction',
      price: 15000,
      promoPrice: 12000,
      description: 'Bois de qualité pour construction',
      vedette: false,
    },
    {
      id: '2',
      name: 'Demi-rondin',
      category: 'Bois scié',
      price: 8500,
      description: 'Demi-rondin de qualité',
      vedette: false,
    },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      setLoading(false)
    }
  }, [router])

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const toggleVedette = (id: string) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, vedette: !p.vedette } : p
      )
    )
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
            <h1 className="text-3xl font-bold text-wood-900">Gestion des produits</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-fire-600 text-white px-4 py-2 rounded-lg hover:bg-fire-700 transition font-semibold"
          >
            <Plus size={20} />
            Ajouter un produit
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-wood-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600"
          />
        </div>
      </div>

      <div className="p-6">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-wood-600 mb-4">Aucun produit trouvé</p>
            <Link
              href="/admin/products/new"
              className="inline-block bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition"
            >
              Créer le premier produit
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`rounded-lg shadow p-6 flex items-center justify-between hover:shadow-lg transition ${
                  product.vedette ? 'bg-amber-50 border-2 border-amber-400' : 'bg-white'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-wood-900 text-lg">{product.name}</h3>
                    {product.vedette && (
                      <span className="bg-amber-400 text-amber-900 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Star size={14} fill="currentColor" />
                        Vedette
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
                    className={`p-2 rounded-lg transition ${
                      product.vedette
                        ? 'bg-amber-100 hover:bg-amber-200'
                        : 'hover:bg-gray-100'
                    }`}
                    title={product.vedette ? 'Retirer de vedette' : 'Marquer comme vedette'}
                  >
                    <Star
                      size={20}
                      className={product.vedette ? 'text-amber-600 fill-amber-600' : 'text-gray-400'}
                    />
                  </button>
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="p-2 hover:bg-blue-100 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit2 size={20} className="text-blue-600" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition"
                    title="Supprimer"
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
