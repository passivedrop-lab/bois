import ProductList from '@/components/ProductList'
import CategoryHero from '@/components/CategoryHero'

export default function CategoryPage() {
  return (
    <div className="pb-12">
      <CategoryHero
        title="Древесина для сауны"
        subtitle="Вагонка, пологи и отделочные материалы для вашей бани."
        icon="🧖"
      />
      <div className="container mx-auto px-4">
        <ProductList categoryName="Древесина для сауны" />
      </div>
    </div>
  )
}
