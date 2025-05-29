"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function CartContent() {
  const { items, total, removeItem, updateQuantity, isLoading } = useCart()

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
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-20"
                    />
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
                  <p className="font-medium">₱{(item.product.price * item.quantity).toFixed(2)}</p>
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
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link href="/checkout" className="w-full">
              <Button className="w-full mt-6">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 