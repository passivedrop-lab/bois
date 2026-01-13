import ProductList from '@/components/ProductList'
import CategoryHero from '@/components/CategoryHero'

export default function CategoryPage() {
  return (
    <div className="pb-12">
      <CategoryHero
        title="Декоративная отделка"
        subtitle="Планкен, имитация бруса и декор для интерьера и экстерьера."
        icon="✨"
      />
      <div className="container mx-auto px-4">
        <ProductList categoryName="Декоративная древесина" />
      </div>
    </div>
  )
}
