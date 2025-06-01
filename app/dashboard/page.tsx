import { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserOrders } from "@/lib/actions/order"
import { OrderList } from "@/components/dashboard/order-list"

export const metadata: Metadata = {
  title: "Dashboard | ModernShop",
  description: "View your orders and account information",
}

export default async function DashboardPage() {
  const orders = await getUserOrders()
  const totalOrders = orders.length
  const activeOrders = orders.filter(order => order.status === "PROCESSING").length
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Dashboard"
        text="View your orders and account information"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Your order history
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Your total purchases
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              View and manage your orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderList orders={orders} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
} 