import Hero from '@/components/Hero'
import CustomOrderCTA from '@/components/CustomOrderCTA'
import Features from '@/components/Features'
import Categories from '@/components/Categories'
import FeaturedProducts from '@/components/FeaturedProducts'
import Newsletter from '@/components/Newsletter'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CustomOrderCTA />
      <Features />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
    </>
  )
}
