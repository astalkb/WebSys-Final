"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Product } from "@prisma/client"

interface ProductGridProps {
  filters: {
    category: string
    priceRange: number[]
    rating: number
    inStock: boolean
  }
  sortBy: string
}

export function ProductGrid({ filters, sortBy }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter((product) => product.categoryId === filters.category)
    }

    if (filters.inStock) {
      filtered = filtered.filter((product) => product.stock > 0)
    }

    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        // Featured - keep original order
        break
    }

    setProducts(filtered)
  }, [filters, sortBy])

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId, 1)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  if (isLoading) {
    return <div>Loading products...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">Showing {products.length} products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          // Handle images as Json type
          let imageUrl = "/placeholder.png"
          const images = product.images
          
          if (images) {
            if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string') {
              imageUrl = images[0]
            } else if (typeof images === 'string') {
              imageUrl = images
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
                {product.stock === 0 && <Badge className="absolute top-2 right-2 bg-gray-500">Out of Stock</Badge>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">
                  <Link href={`/product/${product.id}`} className="hover:text-primary">
                    {product.name}
                  </Link>
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-bold text-primary">₱{product.price}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 space-x-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/product/${product.id}`}>View Details</Link>
              </Button>
              <Button onClick={() => handleAddToCart(product.id)} disabled={product.stock === 0} className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
