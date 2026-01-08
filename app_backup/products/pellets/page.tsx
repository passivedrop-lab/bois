import ProductsGrid from '@/components/ProductsGrid'
import { Package, Leaf, Award, Truck } from 'lucide-react'

export default function PelletsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-white to-wood-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wood-900 via-wood-800 to-fire-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-fire-500/20 backdrop-blur-sm rounded-full p-4 mb-6">
              <Package size={48} className="text-fire-400" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Пеллеты и гранулы
            </h1>
            <p className="text-xl md:text-2xl text-wood-200">
              Экологичные пеллеты премиум класса для эффективного отопления
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="card-premium p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="text-white" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-wood-900 mb-2">Экологичность</h3>
            <p className="text-wood-600 text-sm">100% натуральное сырье</p>
          </div>
          <div className="card-premium p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-white" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-wood-900 mb-2">Премиум качество</h3>
            <p className="text-wood-600 text-sm">Соответствие стандартам ENplus</p>
          </div>
          <div className="card-premium p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-white" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-wood-900 mb-2">Удобство хранения</h3>
            <p className="text-wood-600 text-sm">Компактная упаковка</p>
          </div>
          <div className="card-premium p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-fire-500 to-fire-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="text-white" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-wood-900 mb-2">Быстрая доставка</h3>
            <p className="text-wood-600 text-sm">Доставка по всей России</p>
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wood-900 mb-8 text-center">
            Наши пеллеты
          </h2>
          <ProductsGrid category="pellets" />
        </div>
      </section>
    </div>
  )
}
