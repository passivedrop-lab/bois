import ProductList from '@/components/ProductList'

export default function CategoryPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-900 mb-4">Дрова и Биотопливо</h1>
        <p className="text-wood-600 mb-8">Колотые дрова, пеллеты и брикеты для уюта в вашем доме.</p>
        <ProductList categoryName="Drova et Biotoplivо" />
      </div>
    </div>
  )
}
