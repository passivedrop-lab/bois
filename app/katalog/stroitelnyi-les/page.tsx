import ProductList from '@/components/ProductList'
import CategoryHero from '@/components/CategoryHero'

export default function CategoryPage() {
  return (
    <div className="pb-12">
      <CategoryHero
        title="Строительная древесина"
        subtitle="Надежные материалы для вашего дома"
        icon="🏗️"
      />
      <div className="container mx-auto px-4">
        <ProductList categoryName="Строительная древесина" />
      </div>
    </div>
  )
}
