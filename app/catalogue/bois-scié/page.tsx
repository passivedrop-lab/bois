import ProductList from '@/components/ProductList'

export default function CategoryPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-4">Пиломатериалы</h1>
        <p className="text-wood-600 mb-8">Доска обрезная, брусок и погонаж высокого качества.</p>
        <ProductList categoryName="Bois scié" />
      </div>
    </div>
  )
}
