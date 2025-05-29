import { Metadata } from "next"
import { CartContent } from "@/components/cart/cart-content"
import { ProtectedRoute } from "@/components/protected-route"

export const metadata: Metadata = {
  title: "Cart | ModernShop",
  description: "View your shopping cart",
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  )
}
