"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

// Mock data - in real app, this would come from your database
const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 124,
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 89,
    category: "Wearables",
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 256,
    category: "Clothing",
  },
  {
    id: 4,
    name: "Professional Camera Lens",
    price: 599.99,
    originalPrice: 799.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 67,
    category: "Photography",
  },
]

export function FeaturedProducts() {
  const [products, setProducts] = useState(featuredProducts)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products at special prices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/product/${product.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
