"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number
}

export function AddToCartButton({ productId, productName, price }: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleClick = async () => {
    await addItem(productId, 1)
  }

  return (
    <Button onClick={handleClick} className="w-full">
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
} 