import ProductList from '@/components/ProductList'

export default function CategoryPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-4">Панели и щиты</h1>
        <p className="text-wood-600 mb-8">Мебельные щиты, фанера и плиты различных размеров.</p>
        <ProductList categoryName="Panneaux et voiles" />
      </div>
    </div>
  )
}
