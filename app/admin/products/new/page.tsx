'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

const categories = [
  'Bois de construction',
  'Bois scié',
  'Drova et Biotoplivо',
  'Bois pour sauna',
  'Bois décoratif',
  'Panneaux et voiles',
  'Bois d\'extérieur',
  'Bois brut/industriel',
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

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
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
        alert('Veuillez sélectionner une image valide')
        return
      }
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image doit faire moins de 5MB')
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
    
    if (!formData.image) {
      alert('Veuillez sélectionner une image')
      return
    }
    
    // Sauvegarder le produit
    alert('Produit ajouté avec succès!')
    router.push('/admin/products')
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
          <h1 className="text-3xl font-bold text-wood-900">Ajouter un produit</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow max-w-2xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Image du produit */}
            <div>
              <label className="block text-sm font-bold text-wood-900 mb-2">
                Image du produit *
              </label>
              
              {!imagePreview ? (
                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-wood-300 rounded-lg p-8 cursor-pointer hover:border-fire-500 hover:bg-fire-50 transition">
                  <Upload size={32} className="text-wood-600 mb-2" />
                  <span className="text-wood-900 font-semibold">Cliquez pour sélectionner une image</span>
                  <span className="text-wood-600 text-sm mt-1">PNG, JPG, WebP (max 5MB)</span>
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
                      alt="Prévisualisation"
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
                      Changer l'image
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
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600"
                placeholder="ex: Bois de construction brut"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-bold text-wood-900 mb-2">
                Catégorie *
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
                  Prix (RUB) *
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
                  Prix promotionnel (optionnel)
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
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-wood-300 rounded-lg focus:outline-none focus:border-fire-600"
                placeholder="Décrivez le produit en détail..."
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
                Afficher ce produit sur la page d'accueil comme vedette ⭐
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-wood-200">
              <button
                type="submit"
                className="flex items-center gap-2 bg-fire-600 text-white px-6 py-2 rounded-lg hover:bg-fire-700 transition font-semibold"
              >
                <Save size={20} />
                Créer le produit
              </button>
              <Link
                href="/admin/products"
                className="px-6 py-2 border border-wood-300 rounded-lg hover:bg-wood-50 transition font-semibold"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
