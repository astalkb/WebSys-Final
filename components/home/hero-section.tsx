import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to ModernShop</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/shop">Shop Now</Link>
          </Button>
          <Button
            size="lg"
            asChild
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
