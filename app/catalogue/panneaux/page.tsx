import ProductList from '@/components/ProductList'
import CategoryHero from '@/components/CategoryHero'

export default function CategoryPage() {
  return (
    <div className="pb-12">
      <CategoryHero
        title="Панели и щиты"
        subtitle="Мебельные щиты, фанера и плиты различных размеров."
        icon="📦"
      />
      <div className="container mx-auto px-4">
        <ProductList categoryName="Panneaux et voiles" />
      </div>
    </div>
  )
}
