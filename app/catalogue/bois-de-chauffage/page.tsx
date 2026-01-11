import ProductList from '@/components/ProductList'
import CategoryHero from '@/components/CategoryHero'

export default function CategoryPage() {
  return (
    <div className="pb-12">
      <CategoryHero
        title="Дрова и биотопливо"
        subtitle="Колотые дрова, пеллеты и брикеты для уюта в вашем доме."
        icon="🔥"
      />
      <div className="container mx-auto px-4">
        <ProductList categoryName="Дрова и биотопливо" />
      </div>
    </div>
  )
}
