"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: any
  category: {
    name: string
  }
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState<number | ''>(1)
  const [quantityError, setQuantityError] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch product")
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        toast.error("Error loading product")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!product || quantity === '') return

    try {
      await addItem(product.id, quantity)
    } catch (error) {
      toast.error("Failed to add to cart")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    )
  }

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500">{product.category.name}</p>
          </div>
          <p className="text-2xl font-semibold">₱{product.price.toFixed(2)}</p>
          <p className="text-gray-600">{product.description}</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : parseInt(e.target.value)
                  if (value === '' || (!isNaN(value) && value > 0)) {
                    setQuantity(value === '' ? '' : value)
                    setQuantityError(null)
                  } else {
                    setQuantityError('Please enter a positive number')
                  }
                }}
                className={`w-20 px-2 py-1 border rounded ${quantityError ? 'border-red-500' : ''}`}
              />
              {quantityError && (
                <p className="text-sm text-red-500 mt-1">{quantityError}</p>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || quantityError !== null || quantity === ''}
              className="w-full"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} items in stock`
              : "Out of stock"}
          </div>
        </div>
      </div>
    </div>
  )
} 