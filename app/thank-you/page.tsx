import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  if (!searchParams.orderId) {
    redirect("/shop");
  }

  const order = await getOrderById(searchParams.orderId);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the order you're looking for.
        </p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-muted-foreground mb-8">
        Your order has been successfully placed. Order ID: {order.id}
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/dashboard">View Order</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
} 