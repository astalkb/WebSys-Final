"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function CartContent() {
  const { items, total, removeItem, updateQuantity, isLoading } = useCart()
  const [quantityErrors, setQuantityErrors] = useState<{ [key: string]: string | null }>({})
  const [quantities, setQuantities] = useState<{ [key: string]: number | '' }>({})
  const router = useRouter()

  // Calculate total based on local quantities
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = quantities[item.id]
      const itemQuantity = typeof quantity === 'number' ? quantity : 0
      return sum + (item.product.price * itemQuantity)
    }, 0)
  }

  const getItemQuantity = (itemId: string) => {
    const quantity = quantities[itemId]
    return typeof quantity === 'number' ? quantity : 0
  }

  const handleQuantityChange = (itemId: string, value: string) => {
    const numValue = value === '' ? '' : parseInt(value)
    if (value === '' || (typeof numValue === 'number' && !isNaN(numValue) && numValue > 0)) {
      setQuantities(prev => ({ ...prev, [itemId]: numValue }))
      setQuantityErrors(prev => ({ ...prev, [itemId]: null }))
    } else {
      setQuantityErrors(prev => ({ ...prev, [itemId]: 'Please enter a positive number' }))
    }
  }

  const handleQuantityBlur = (itemId: string) => {
    const quantity = quantities[itemId]
    if (typeof quantity === 'number' && quantity > 0) {
      updateQuantity(itemId, quantity)
    }
  }

  const hasErrors = Object.values(quantityErrors).some(error => error !== null)

  // Initialize quantities when items change
  useEffect(() => {
    const initialQuantities = items.reduce((acc, item) => ({
      ...acc,
      [item.id]: item.quantity
    }), {})
    setQuantities(initialQuantities)
  }, [items])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        <div className="text-center">Loading cart...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        <div className="text-center">
          <p className="mb-4">Your cart is empty</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => {
            // Handle images as Json type
            let imageUrl = "/placeholder.png"
            const images = item.product.images
            
            if (images) {
              if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string') {
                imageUrl = images[0]
              } else if (typeof images === 'string') {
                imageUrl = images
              }
            }

            return (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                <div className="relative w-24 h-24">
                  <Image
                    src={imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">₱{item.product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      min="1"
                      value={quantities[item.id] ?? item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      onBlur={() => handleQuantityBlur(item.id)}
                      className={`w-20 ${quantityErrors[item.id] ? 'border-red-500' : ''}`}
                    />
                    {quantityErrors[item.id] && (
                      <p className="text-sm text-red-500">{quantityErrors[item.id]}</p>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱{(item.product.price * getItemQuantity(item.id)).toFixed(2)}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₱{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₱{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              disabled={hasErrors}
              onClick={() => {
                // Update all quantities before proceeding to checkout
                items.forEach(item => {
                  const quantity = quantities[item.id]
                  if (typeof quantity === 'number' && quantity > 0) {
                    updateQuantity(item.id, quantity)
                  }
                })
                router.push('/checkout')
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 