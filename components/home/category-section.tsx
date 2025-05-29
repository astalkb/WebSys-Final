import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 156,
  },
  {
    id: 2,
    name: "Clothing",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 89,
  },
  {
    id: 3,
    name: "Home & Garden",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 234,
  },
  {
    id: 4,
    name: "Sports",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 67,
  },
  {
    id: 5,
    name: "Books",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 123,
  },
  {
    id: 6,
    name: "Beauty",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 78,
  },
]

export function CategorySection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our wide selection of products across different categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.name.toLowerCase()}`}>
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.productCount} products</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
