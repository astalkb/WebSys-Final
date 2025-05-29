import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategorySection } from "@/components/home/category-section"

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
    </main>
  )
}
