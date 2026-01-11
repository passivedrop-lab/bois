import ProductList from '@/components/ProductList'
import CategoryHero from '@/components/CategoryHero'

export default function CategoryPage() {
  return (
    <div className="pb-12">
      <CategoryHero
        title="Техническое дерево"
        subtitle="Брус для опалубки и промышленные заготовки для производства."
        icon="⚙️"
      />
      <div className="container mx-auto px-4">
        <ProductList categoryName="Bois brut/industriel" />
      </div>
    </div>
  )
}
