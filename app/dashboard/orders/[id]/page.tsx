import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderStatus } from "@prisma/client";
import { getOrderById } from "@/lib/actions/order";
import { notFound } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Orders</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="font-medium">{order.id}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{formatDate(order.createdAt)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="font-medium">{order.status}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-medium">₱{order.total.toFixed(2)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div>
                  <div className="font-medium">{item.product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </div>
                </div>
                <div className="font-medium">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 font-semibold">
              <div>Total</div>
              <div className="font-medium">₱{order.total.toFixed(2)}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 