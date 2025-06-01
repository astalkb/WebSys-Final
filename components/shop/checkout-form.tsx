"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrder, updateOrderStatus } from "@/lib/actions/order"
import { OrderStatus } from "@prisma/client"

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  expiryDate: z.string().min(5, "Expiry date is required"),
  cvv: z.string().min(3, "CVV must be 3 digits"),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsProcessing(true)
      setError(null)

      // Create order with PENDING status
      const order = await createOrder(
        total,
        items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode
        },
        {
          cardNumber: data.cardNumber,
          expiryDate: data.expiryDate,
          cvv: data.cvv
        }
      )

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update order status to PAID
      await updateOrderStatus(order.id, OrderStatus.PAID)

      // Clear the cart
      await clearCart()

      // Redirect to thank you page with order ID
      router.push(`/thank-you?orderId=${order.id}`)
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register("address")}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...register("city")}
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            {...register("postalCode")}
          />
          {errors.postalCode && (
            <p className="text-sm text-red-500">{errors.postalCode.message}</p>
          )}
        </div>
      </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          {...register("cardNumber")}
        />
        {errors.cardNumber && (
          <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
        )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
          <Input
            id="expiryDate"
            {...register("expiryDate")}
          />
          {errors.expiryDate && (
            <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
          )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            maxLength={3}
            {...register("cvv")}
          />
          {errors.cvv && (
            <p className="text-sm text-red-500">{errors.cvv.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : `Pay ₱${total.toFixed(2)}`}
      </Button>
    </form>
  )
} 