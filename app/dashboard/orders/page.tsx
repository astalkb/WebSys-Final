import { getUserOrders } from "@/lib/actions/order";
import { OrderList } from "@/components/dashboard/order-list";

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <OrderList orders={orders} />
    </div>
  );
} 