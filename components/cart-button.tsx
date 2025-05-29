"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function CartButton() {
  const { items } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const handleClick = () => {
    if (!user) {
      router.push('/login')
    } else {
      router.push('/cart')
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={handleClick}
    >
      <ShoppingCart className="h-5 w-5" />
      {items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {items.length}
        </span>
      )}
    </Button>
  )
} 