"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  sku: string
  stock: number
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"
  lastUpdated: string
}

export function InventoryManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast.error("Error fetching products")
    }
  }

  const handleUpdateStock = async () => {
    if (!selectedProduct || quantity < 0) {
      toast.error("Please select a product and enter a valid quantity")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/products/${selectedProduct}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: quantity }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update stock")
      }
      
      toast.success("Stock updated successfully")
      setIsAddDialogOpen(false)
      setSelectedProduct("")
      setQuantity(0)
      fetchProducts()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error updating stock")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return <Badge variant="default">In Stock</Badge>
      case "LOW_STOCK":
        return <Badge variant="secondary">Low Stock</Badge>
      case "OUT_OF_STOCK":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              Manage your product inventory
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Update Stock</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Stock</DialogTitle>
                <DialogDescription>
                  Update product inventory levels
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="product">Product</Label>
                  <Select
                    value={selectedProduct}
                    onValueChange={setSelectedProduct}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      setQuantity(value === "" ? 0 : parseInt(value) || 0);
                    }}
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStock} disabled={loading}>
                  {loading ? "Updating..." : "Update Stock"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell>{new Date(product.lastUpdated).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product.id)
                      setQuantity(product.stock)
                      setIsAddDialogOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 