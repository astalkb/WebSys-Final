import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  // This would normally fetch from your API
  const order = {
    id: "ORD-001",
    date: "2024-03-15",
    total: 559.98,
    estimatedDelivery: "2024-03-20",
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your order has been successfully placed and is being processed.
        </p>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date:</span>
              <span className="font-medium">{order.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-medium">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery:</span>
              <span className="font-medium">{order.estimatedDelivery}</span>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            We've sent a confirmation email with your order details. You can also
            track your order status in your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard/orders">View Order Status</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 