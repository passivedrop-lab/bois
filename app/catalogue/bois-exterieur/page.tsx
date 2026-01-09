import ProductList from '@/components/ProductList'

export default function CategoryPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-4">Экстерьерные системы</h1>
        <p className="text-wood-600 mb-8">Террасная доска и фасадные решения для благоустройства.</p>
        <ProductList categoryName="Bois d'extérieur" />
      </div>
    </div>
  )
}
