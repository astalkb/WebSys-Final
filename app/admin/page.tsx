import { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryManagement } from "@/components/admin/category-management"
import { UserManagement } from "@/components/admin/user-management"
import { InventoryManagement } from "@/components/admin/inventory-management"
import ProductsPage from "@/app/admin/products/page"
import { getAllOrders } from "@/lib/actions/order"
import { getAllProducts } from "@/lib/actions/product"
import { getAllUsers } from "@/lib/actions/user"

export const metadata: Metadata = {
  title: "Admin Dashboard | ModernShop",
  description: "Manage your store",
}

export default async function AdminDashboardPage() {
  const [orders, products, users] = await Promise.all([
    getAllOrders(),
    getAllProducts(),
    getAllUsers()
  ])

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const activeUsers = users.filter(user => user.role === "USER").length
  const totalSales = orders.length
  const activeProducts = products.filter(product => product.stock > 0).length

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Admin Dashboard"
        text="Manage your store and view analytics"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total revenue from all orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Total registered customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Total number of orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products in stock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="space-y-4">
            <ProductsPage />
          </TabsContent>
          <TabsContent value="categories" className="space-y-4">
            <CategoryManagement />
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
          <TabsContent value="inventory" className="space-y-4">
            <InventoryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
} 