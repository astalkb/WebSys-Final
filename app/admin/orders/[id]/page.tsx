"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
}

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) throw new Error("Order not found");
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      toast.error("Error fetching order");
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success("Order status updated successfully");
        setOrder({ ...order, status });
      } else {
        toast.error("Error updating order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Orders
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
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-medium">₱{order.total.toFixed(2)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">{order.user.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{order.user.email}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
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
                  ${(item.price * item.quantity).toFixed(2)}
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