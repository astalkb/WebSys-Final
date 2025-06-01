import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order, OrderStatus } from "@prisma/client";
import Link from "next/link";

interface OrderListProps {
  orders: (Order & {
    items: {
      product: {
        name: string;
        price: number;
      };
      quantity: number;
      price: number;
    }[];
  })[];
}

export function OrderList({ orders }: OrderListProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "bg-green-500";
      case OrderStatus.PROCESSING:
        return "bg-yellow-500";
      case OrderStatus.CANCELLED:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="processing">Processing</TabsTrigger>
        <TabsTrigger value="delivered">Delivered</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Order {order.id}</h3>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge
                className={`${getStatusColor(order.status)} text-white`}
              >
                {order.status}
              </Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₱{item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
              <div className="font-semibold">
                Total: ₱{order.total.toFixed(2)}
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
                </Button>
                {order.status === OrderStatus.DELIVERED && (
                  <Button variant="outline" size="sm">
                    Track Package
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="processing">
        {orders
          .filter((order) => order.status === OrderStatus.PROCESSING)
          .map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Order {order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(order.status)} text-white`}
                >
                  {order.status}
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₱{item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4">
                <div className="font-semibold">
                  Total: ₱{order.total.toFixed(2)}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </TabsContent>

      <TabsContent value="delivered">
        {orders
          .filter((order) => order.status === OrderStatus.DELIVERED)
          .map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Order {order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(order.status)} text-white`}
                >
                  {order.status}
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₱{item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4">
                <div className="font-semibold">
                  Total: ₱{order.total.toFixed(2)}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Track Package
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </TabsContent>
    </Tabs>
  );
} 