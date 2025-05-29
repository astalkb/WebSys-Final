import { CheckoutForm } from "@/components/shop/checkout-form";
import { getCart } from "@/lib/actions/cart";
import { redirect } from "next/navigation";
import { CartItem, Product } from "@prisma/client";

type CartItemWithProduct = CartItem & {
  product: Product;
};

type CartWithItems = {
  items: CartItemWithProduct[];
};

export default async function CheckoutPage() {
  const cart = await getCart() as CartWithItems | null;
  
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  // Calculate total from cart items
  const total = cart.items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CheckoutForm cart={cart} />
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product.name} x {item.quantity}</span>
                <span>₱{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 