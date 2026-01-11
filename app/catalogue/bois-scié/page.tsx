import ProductList from '@/components/ProductList'
import CategoryHero from '@/components/CategoryHero'

export default function CategoryPage() {
  return (
    <div className="pb-12">
      <CategoryHero
        title="Пиломатериалы"
        subtitle="Доска обрезная, брусок и погонаж высокого качества."
        icon="🪵"
      />
      <div className="container mx-auto px-4">
        <ProductList categoryName="Bois scié" />
      </div>
    </div>
  )
}
