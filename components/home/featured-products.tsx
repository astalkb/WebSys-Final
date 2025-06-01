"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProducts(data)
      } catch (error: any) {
        setError(error)
        console.error("Error fetching featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div className="text-center">Loading featured products...</div>
  if (error) return <div className="text-center text-red-500">Error loading featured products.</div>
  if (products.length === 0) return <div className="text-center">No featured products found.</div>

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
          {products.map((product: any) => {
            // Handle images as Json type
            let imageUrl = "/placeholder.png"
            const images = product.images
            
            if (images) {
              try {
                // Try to parse if it's a JSON string
                const parsedImages = typeof images === 'string' ? JSON.parse(images) : images
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  imageUrl = parsedImages[0]
                } else if (typeof parsedImages === 'string') {
                  imageUrl = parsedImages
                }
              } catch (e) {
                // If parsing fails, try to use the images directly
                if (Array.isArray(images) && images.length > 0) {
                  imageUrl = images[0]
                } else if (typeof images === 'string') {
                  imageUrl = images
                }
              }
            }

            return (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {product.category?.name || "Unknown Category"}
                    </Badge>
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">${product.price}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/product/${product.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
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
