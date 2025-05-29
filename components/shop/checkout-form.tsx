import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder } from "@/lib/actions/order";
import { Cart } from "@/lib/types";

interface CheckoutFormProps {
  cart: Cart;
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  return (
    <form action={createOrder} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Shipping Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" name="postalCode" required />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Information</h2>
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input id="cardNumber" name="cardNumber" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" name="cvv" required />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Place Order
      </Button>
    </form>
  );
} 