import ProductList from '@/components/ProductList'
import CategoryHero from '@/components/CategoryHero'

export default function CategoryPage() {
  return (
    <div className="pb-12">
      <CategoryHero
        title="Строительный лес"
        subtitle="Брус, бревно и конструкционные материалы для вашего строительства."
        icon="🏗️"
      />
      <div className="container mx-auto px-4">
        <ProductList categoryName="Bois de construction" />
      </div>
    </div>
  )
}
