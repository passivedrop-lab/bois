import ProductList from '@/components/ProductList'

export default function CategoryPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-4">Декоративная отделка</h1>
        <p className="text-wood-600 mb-8">Планкен, имитация бруса и декор для интерьера и экстерьера.</p>
        <ProductList categoryName="Bois décoratif" />
      </div>
    </div>
  )
}
