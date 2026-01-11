import ProductList from '@/components/ProductList'
import CategoryHero from '@/components/CategoryHero'

export default function CategoryPage() {
  return (
    <div className="pb-12">
      <CategoryHero
        title="Дерево для наружных работ"
        subtitle="Террасная доска и фасадные решения для благоустройства."
        icon="🌲"
      />
      <div className="container mx-auto px-4">
        <ProductList categoryName="Дерево для наружных работ" />
      </div>
    </div>
  )
}
